let medicosCarregados = [];
let medicoSelecionado = null;

document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("token")) {
        window.location.replace("login.html");
        return;
    }

    fetchEspecialidades();
    fetchMedicos();

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

    flatpickr("#dataConsulta", {
        minDate: "today",
        disable: [date => date.getDay() === 0],
        dateFormat: "Y-m-d",
        allowInput: false,
        onChange: () => atualizarHorarios()
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
        renderMedicos(medicosCarregados);
        atualizarBadge(medicosCarregados.length);
    } catch {
        renderErro("Não foi possível conectar ao servidor.");
    }
}

/* ── Filtros ── */
async function aplicarFiltros() {
    const espId   = document.getElementById("filtroEspecialidade").value;
    const periodo = document.getElementById("filtroPeriodo").value;
    const data    = document.getElementById("filtroData").value;

    // Todos os 3 filtros preenchidos → consulta disponibilidade na API
    if (espId && data && periodo) {
        await buscarDisponivel(parseInt(espId), data, periodo);
        return;
    }

    // Filtro local
    let filtrados = medicosCarregados;

    if (espId) {
        filtrados = filtrados.filter(m => String(m.especialidade_id) === espId);
    }

    if (periodo) {
        filtrados = filtrados.filter(m => {
            const horarios = getHorariosDoMedico(m);
            return horarios.some(h => pertenceAoPeriodo(h, periodo));
        });
    }

    renderMedicos(filtrados);
    atualizarBadge(filtrados.length);
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

function pertenceAoPeriodo(horario, periodo) {
    const hora = parseInt(horario.split(":")[0]);
    if (periodo === "manha") return hora >= 6  && hora < 12;
    if (periodo === "tarde") return hora >= 12 && hora < 18;
    if (periodo === "noite") return hora >= 18;
    return true;
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

    document.getElementById("dataConsulta").value = "";
    document.getElementById("horario").innerHTML  = '<option disabled selected>Selecione um horário</option>';

    const popup = document.getElementById("formPopup");
    popup.classList.remove("show", "error", "success");

    document.getElementById("modalAgendamento").classList.remove("hidden");
}

function fecharModal() {
    document.getElementById("modalAgendamento").classList.add("hidden");
    medicoSelecionado = null;
}

/* ── Horários via API ── */
const HORARIOS_POR_PERIODO = {
    manha: ["08:00", "09:00", "10:00", "11:00"],
    tarde: ["13:00", "14:00", "15:00", "16:00", "17:00"],
    noite: ["18:00", "19:00", "20:00"]
};

// Retorna horários do mapa estático (usado para filtro local de período)
function getHorariosDoMedico(medico) {
    if (typeof especialidadeMedicos === "undefined") return [];

    const esp          = medico.especialidade || "";
    const nomeCompleto = `${medico.nome || ""} ${medico.sobrenome || ""}`.trim();
    const medicosEsp   = especialidadeMedicos[esp] || {};

    if (medicosEsp[nomeCompleto]) return medicosEsp[nomeCompleto];
    return [...new Set(Object.values(medicosEsp).flat())];
}

async function atualizarHorarios() {
    if (!medicoSelecionado) return;

    const data   = document.getElementById("dataConsulta").value;
    const select = document.getElementById("horario");
    select.innerHTML = '<option disabled selected>Carregando horários...</option>';

    // JS: 0=dom,1=seg...6=sáb  →  API: 0=seg...6=dom
    const jsDia     = new Date(data + "T00:00:00").getDay();
    const diaSemana = jsDia === 0 ? 6 : jsDia - 1;

    const token = localStorage.getItem("token");
    try {
        const r = await fetch(`http://127.0.0.1:5000/horarios-disponiveis/medico/${medicoSelecionado.id}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        select.innerHTML = '<option disabled selected>Selecione um horário</option>';

        if (r.ok) {
            const agendas  = await r.json();
            const periodos = agendas
                .filter(a => a.dia_semana === diaSemana)
                .map(a => a.periodo);
            const horarios = periodos.flatMap(p => HORARIOS_POR_PERIODO[p] || []);

            if (horarios.length > 0) {
                horarios.forEach(h => {
                    const opt = document.createElement("option");
                    opt.value = h;
                    opt.textContent = h;
                    select.appendChild(opt);
                });
                return;
            }
        }
    } catch { /* cai no fallback */ }

    // Fallback: horários genéricos
    ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"].forEach(h => {
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
            setTimeout(fecharModal, 1600);
        } else {
            exibirPopup(result.erro || "Erro ao agendar consulta.", "error");
        }
    } catch {
        exibirPopup("Não foi possível conectar ao servidor.", "error");
    }
}
