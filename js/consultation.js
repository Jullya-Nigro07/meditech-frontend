let medicosCarregados = [];
let medicoSelecionado = null;
let dadosDisponibilidade = [];

document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("token")) {
        window.location.replace("login.html");
        return;
    }

    fetchEspecialidades();
    fetchMedicos();
    renderEstadoInicial();

    document.getElementById("btnBuscar").addEventListener("click", aplicarFiltros);
    document.getElementById("fecharModal").addEventListener("click", fecharModal);
    document.getElementById("modalAgendamento").addEventListener("click", (e) => {
        if (e.target === e.currentTarget) fecharModal();
    });

    document.getElementById("formConsulta").addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!medicoSelecionado) return;

        const data_agendada = document.getElementById("dataConsulta").value.trim();
        const hora          = document.getElementById("horario").value;

        if (!data_agendada) {
            exibirPopup("Selecione uma data.", "error");
            return;
        }
        if (!hora || hora === "Selecione um horário") {
            exibirPopup("Selecione um horário.", "error");
            return;
        }

        await criarConsulta(medicoSelecionado.id, medicoSelecionado.especialidade_id, data_agendada, hora);
    });

    flatpickr("#filtroData", {
        minDate: "today",
        dateFormat: "Y-m-d",
        allowInput: false,
    });

});

/* ── Especialidades ── */
async function fetchEspecialidades() {
    const token  = localStorage.getItem("token");
    const select = document.getElementById("filtroEspecialidade");
    try {
        const r = await fetch("http://127.0.0.1:5000/especialidades", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!r.ok) return;
        const especialidades = await r.json();
        especialidades.forEach(esp => {
            const opt = document.createElement("option");
            opt.value = esp.id;
            opt.textContent = esp.nome;
            select.appendChild(opt);
        });
    } catch { /* mantém apenas "Todas" */ }
}

/* ── Busca médicos na API ── */
async function fetchMedicos() {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch("http://127.0.0.1:5000/usuarios?tipo=medico", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            renderErro("Erro ao carregar médicos.");
            return;
        }

        const medicos = await response.json();

        // Enriquece cada médico com a primeira especialidade cadastrada
        await Promise.all(medicos.map(async (medico) => {
            try {
                const r = await fetch(`http://127.0.0.1:5000/especialidades/medico/${medico.id}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (r.ok) {
                    const especialidades = await r.json();
                    if (especialidades.length > 0) {
                        medico.especialidade    = especialidades[0].nome;
                        medico.especialidade_id = especialidades[0].id;
                    }
                }
            } catch { /* ignora erros individuais */ }
        }));

        medicosCarregados = medicos;
    } catch {
        renderErro("Não foi possível conectar ao servidor.");
    }
}

/* ── Filtros ── */
async function aplicarFiltros() {
    const espId   = document.getElementById("filtroEspecialidade").value;
    const periodo = document.getElementById("filtroPeriodo").value;
    const data    = document.getElementById("filtroData").value;

    if (!espId || !periodo || !data) {
        exibirToastFiltros("Selecione especialidade, período e data para buscar.");
        return;
    }

    await buscarDisponivel(parseInt(espId), data, periodo);
}

async function buscarDisponivel(especialidade_id, data, periodo) {
    const token  = localStorage.getItem("token");
    const params = new URLSearchParams({ especialidade_id, data, periodo });
    try {
        const r = await fetch(`http://127.0.0.1:5000/horarios-disponiveis/disponivel?${params}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!r.ok) {
            renderErro("Erro ao buscar disponibilidade.");
            return;
        }
        const dados = await r.json();
        processarDisponibilidade(dados);
    } catch {
        renderErro("Não foi possível conectar ao servidor.");
    }
}

function processarDisponibilidade(dados) {
    dadosDisponibilidade = Array.isArray(dados) ? dados : [];
    if (!Array.isArray(dados) || dados.length === 0) {
        renderMedicos([]);
        atualizarBadge(0);
        return;
    }

    // Mapeia medico_id ou id contra os médicos já carregados
    const primeiro = dados[0];
    const idField  = primeiro?.medico_id !== undefined ? "medico_id"
                   : primeiro?.id         !== undefined ? "id"
                   : null;

    if (idField) {
        const ids      = new Set(dados.map(d => d[idField]));
        const filtrados = medicosCarregados.filter(m => ids.has(m.id));
        renderMedicos(filtrados);
        atualizarBadge(filtrados.length);
        return;
    }

    renderMedicos([]);
    atualizarBadge(0);
}

/* ── Render ── */
function renderMedicos(medicos) {
    const container = document.getElementById("listaMedicos");
    container.innerHTML = "";

    if (!medicos || medicos.length === 0) {
        container.innerHTML = `
            <div class="medicos-vazio">
                <span class="material-symbols-outlined">search_off</span>
                Nenhum especialista encontrado para os filtros selecionados.
            </div>`;
        return;
    }

    medicos.forEach(medico => container.appendChild(criarCardMedico(medico)));
}

function renderErro(msg) {
    document.getElementById("listaMedicos").innerHTML = `
        <div class="medicos-vazio">
            <span class="material-symbols-outlined">error</span>
            ${msg}
        </div>`;
    document.getElementById("contagemEspecialistas").textContent = "–";
}

function atualizarBadge(total) {
    const sufixo = total !== 1 ? "is" : "l";
    document.getElementById("contagemEspecialistas").textContent =
        `${total} Especialista${total !== 1 ? "s" : ""} Disponíve${sufixo}`;
}

function renderEstadoInicial() {
    document.getElementById("listaMedicos").innerHTML = `
        <div class="medicos-vazio">
            <span class="material-symbols-outlined">tune</span>
            Selecione uma especialidade, período e data para buscar especialistas disponíveis.
        </div>`;
    document.getElementById("contagemEspecialistas").textContent = "Selecione os filtros para buscar";
}

let toastFiltrosTimer;
function exibirToastFiltros(mensagem) {
    const toast = document.getElementById("toastFiltros");
    if (!toast) return;
    toast.textContent = mensagem;
    toast.classList.add("show");
    if (toastFiltrosTimer) clearTimeout(toastFiltrosTimer);
    toastFiltrosTimer = setTimeout(() => toast.classList.remove("show"), 5000);
}

function criarCardMedico(medico) {
    const nome         = medico.nome      || "";
    const sobrenome    = medico.sobrenome  || "";
    const nomeCompleto = `${nome} ${sobrenome}`.trim();
    const especialidade = medico.especialidade || "Especialista";
    const iniciais      = ((nome[0] || "") + (sobrenome[0] || "")).toUpperCase();

    const card = document.createElement("div");
    card.className = "medico-card";
    card.innerHTML = `
        <div class="medico-avatar">${iniciais}</div>
        <div class="medico-info">
            <div class="medico-nome">${nomeCompleto}</div>
            <div class="medico-especialidade">
                <span class="material-symbols-outlined">medical_services</span>
                ${especialidade}
            </div>
            <span class="medico-badge">Disponível</span>
        </div>
        <button class="btn-agendar" type="button">Agendar Agora</button>`;

    card.querySelector(".btn-agendar").addEventListener("click", () => abrirModal(medico));
    return card;
}

/* ── Modal ── */
function abrirModal(medico) {
    medicoSelecionado = medico;

    const nome         = `${medico.nome || ""} ${medico.sobrenome || ""}`.trim();
    const especialidade = medico.especialidade || "Especialista";
    const iniciais      = ((medico.nome || "")[0] + (medico.sobrenome || "")[0]).toUpperCase();

    document.getElementById("modalMedicoInfo").innerHTML = `
        <div class="modal-avatar">${iniciais}</div>
        <div>
            <div class="modal-medico-nome">${nome}</div>
            <div class="modal-medico-esp">${especialidade}</div>
        </div>`;

    const dataInput = document.getElementById("dataConsulta");
    dataInput.value = document.getElementById("filtroData").value;
    dataInput.classList.add("campo-bloqueado");
    document.getElementById("horario").innerHTML = '<option disabled selected>Carregando horários...</option>';

    const popup = document.getElementById("formPopup");
    popup.classList.remove("show", "error", "success");

    document.getElementById("modalAgendamento").classList.remove("hidden");
    carregarHorariosModal(medico);
}

function fecharModal() {
    document.getElementById("modalAgendamento").classList.add("hidden");
    document.getElementById("dataConsulta").classList.remove("campo-bloqueado");
    medicoSelecionado = null;
}

/* ── Horários via disponibilidade ── */
function carregarHorariosModal(medico) {
    const select = document.getElementById("horario");
    const entrada = dadosDisponibilidade.find(d => {
        const idField = d.medico_id !== undefined ? "medico_id" : "id";
        return d[idField] === medico.id;
    });

    select.innerHTML = '<option disabled selected>Selecione um horário</option>';

    if (!entrada || !Array.isArray(entrada.horarios) || entrada.horarios.length === 0) {
        select.innerHTML = '<option disabled selected>Sem horários disponíveis para esta data</option>';
        return;
    }

    entrada.horarios.forEach(h => {
        const opt = document.createElement("option");
        opt.value = h;
        opt.textContent = h;
        select.appendChild(opt);
    });
}

/* ── Feedback ── */
let popupTimer;
function exibirPopup(mensagem, tipo = "error") {
    const popup = document.getElementById("formPopup");
    if (!popup) return;
    popup.textContent = mensagem;
    popup.classList.remove("error", "success", "show");
    popup.classList.add(tipo, "show");
    if (popupTimer) clearTimeout(popupTimer);
    popupTimer = setTimeout(() => popup.classList.remove("show"), 5000);
}

/* ── Criar consulta ── */
async function criarConsulta(medico_id, especialidade_id, data_agendada, hora) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch("http://127.0.0.1:5000/consultas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ medico_id, especialidade_id, data_agendada, hora })
        });

        const result = await response.json();

        if (response.ok) {
            exibirPopup("Consulta agendada com sucesso!", "success");
            setTimeout(async () => {
                fecharModal();
                await aplicarFiltros();
            }, 1600);
        } else {
            exibirPopup(result.erro || "Erro ao agendar consulta.", "error");
        }
    } catch {
        exibirPopup("Não foi possível conectar ao servidor.", "error");
    }
}
