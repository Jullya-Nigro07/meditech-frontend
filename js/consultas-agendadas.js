const API = "http://127.0.0.1:5000";

let todasConsultas = [];
let filtroAtivo = "todas";

document.addEventListener("DOMContentLoaded", async () => {
    if (!localStorage.getItem("token")) {
        window.location.replace("/html/login.html");
        return;
    }

    renderLoading();
    await carregarDados();
    iniciarTabs();
});

/* ── Data fetching ── */
async function carregarDados() {
    const token = localStorage.getItem("token");
    const headers = { "Authorization": `Bearer ${token}` };

    try {
        const [consultasRes, medicosRes, especialidadesRes] = await Promise.all([
            fetch(`${API}/consultas`, { headers }),
            fetch(`${API}/usuarios?tipo=medico`, { headers }),
            fetch(`${API}/especialidades`, { headers }),
        ]);

        if (!consultasRes.ok) {
            renderErro("Erro ao carregar consultas.");
            return;
        }

        const consultas      = await consultasRes.json();
        const medicos        = medicosRes.ok ? await medicosRes.json() : [];
        const especialidades = especialidadesRes.ok ? await especialidadesRes.json() : [];

        const medicosMap = {};
        medicos.forEach(m => { medicosMap[m.id] = m; });

        const espMap = {};
        especialidades.forEach(e => { espMap[e.id] = e.nome; });

        todasConsultas = consultas.map(c => ({
            ...c,
            _medico:      medicosMap[c.medico_id] || null,
            _especialidade: espMap[c.especialidade_id] || "Especialista",
        }));

        renderConsultas(filtrarConsultas());
        atualizarStats();
        document.getElementById("statsFooter").style.display = "flex";

    } catch {
        renderErro("Não foi possível conectar ao servidor.");
    }
}

/* ── Filtering ── */
function filtrarConsultas() {
    if (filtroAtivo === "proximas") {
        return todasConsultas.filter(c => !c.cancelada);
    }
    if (filtroAtivo === "canceladas") {
        return todasConsultas.filter(c => c.cancelada);
    }
    return todasConsultas;
}

/* ── Tabs ── */
function iniciarTabs() {
    const tabs = document.getElementById("filterTabs");
    tabs.addEventListener("click", (e) => {
        const btn = e.target.closest(".tab-btn");
        if (!btn) return;

        tabs.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        filtroAtivo = btn.dataset.filter;
        renderConsultas(filtrarConsultas());
    });
}

/* ── Render ── */
function renderLoading() {
    const list = document.getElementById("consultasList");
    list.innerHTML = `
        <div class="consultas-loading">
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
        </div>`;
}

function renderErro(msg) {
    document.getElementById("consultasList").innerHTML = `
        <div class="consultas-vazio">
            <span class="material-symbols-outlined">error</span>
            <p>${msg}</p>
        </div>`;
}

function renderConsultas(consultas) {
    const list = document.getElementById("consultasList");
    list.innerHTML = "";

    if (!consultas || consultas.length === 0) {
        list.innerHTML = `
            <div class="consultas-vazio">
                <span class="material-symbols-outlined">calendar_today</span>
                <p>Nenhuma consulta encontrada.</p>
                <a href="/html/consultation.html">
                    <span class="material-symbols-outlined">add</span>
                    Agendar uma consulta
                </a>
            </div>`;
        return;
    }

    consultas.forEach(c => list.appendChild(criarRow(c)));
}

function criarRow(consulta) {
    const medico  = consulta._medico;
    const nomeMed = medico ? `${medico.nome || ""} ${medico.sobrenome || ""}`.trim() : `Médico #${consulta.medico_id}`;
    const iniciais = medico
        ? ((medico.nome || "")[0] + (medico.sobrenome || "")[0]).toUpperCase()
        : "M";

    const { dataFormatada, horaFormatada } = formatarDataHora(consulta.data_agendada, consulta.hora);
    const cancelada = !!consulta.cancelada;

    const row = document.createElement("div");
    row.className = `consulta-row${cancelada ? " cancelada" : ""}`;

    row.innerHTML = `
        <div class="col-profissional-cell">
            <div class="consulta-avatar">${iniciais}</div>
            <div>
                <div class="consulta-nome">${nomeMed}</div>
                <span class="consulta-id">ID: ${consulta.id}</span>
            </div>
        </div>
        <div>
            <span class="badge-especialidade">${consulta._especialidade}</span>
        </div>
        <div>
            <div class="consulta-data-hora">${dataFormatada}</div>
            <div class="consulta-hora-sub">${horaFormatada}</div>
        </div>
        <div>
            <span class="badge-status ${cancelada ? "cancelada" : "agendada"}">
                <span class="status-dot"></span>
                ${cancelada ? "Cancelada" : "Agendada"}
            </span>
        </div>`;

    return row;
}

/* ── Stats ── */
function atualizarStats() {
    const total     = todasConsultas.length;
    const proximas  = todasConsultas.filter(c => !c.cancelada).length;
    const canceladas = todasConsultas.filter(c => c.cancelada).length;

    document.getElementById("statTotal").textContent     = total;
    document.getElementById("statProximas").textContent  = proximas;
    document.getElementById("statCanceladas").textContent = canceladas;
}

/* ── Date formatting ── */
const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function formatarDataHora(dataStr, hora) {
    try {
        const [ano, mes, dia] = dataStr.split("-").map(Number);
        const dataFormatada = `${String(dia).padStart(2, "0")} ${MESES[mes - 1]} ${ano}`;
        const horaFormatada = hora || "";
        return { dataFormatada, horaFormatada };
    } catch {
        return { dataFormatada: dataStr || "–", horaFormatada: hora || "–" };
    }
}
