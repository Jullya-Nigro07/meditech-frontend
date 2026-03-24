document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("token")) {
        window.location.replace("login.html");
        return;
    }

    const nomeUsuario = document.getElementById("nomeUsuario");
    const formConsulta = document.getElementById("formConsulta");
    const userJson = localStorage.getItem("user");

    if (userJson) {
        try {
            const user = JSON.parse(userJson);
            nomeUsuario.innerText = user.nome;
        } catch {
            localStorage.removeItem("user");
        }
    }

    formConsulta.addEventListener("submit", async (e) => {
        e.preventDefault();

        const especialidade = document.getElementById("especialidade").value.trim();
        const medico = document.getElementById("medico").value.trim();
        const data = document.getElementById("dataConsulta").value.trim();
        const horario = document.getElementById("horario").value.trim();

        await criarConsulta(especialidade, medico, data, horario);
        formConsulta.reset();
        document.getElementById("horario").innerHTML = '<option disabled selected>Selecione um horário</option>';
    });

    if (localStorage.getItem("token")) {
        listagem();
    }
});

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

async function criarConsulta(especialidade, medico, data, horario) {
    const token = localStorage.getItem("token");
    const consulta = { especialidade, medico, data, horario };

    try {
        const response = await fetch("http://127.0.0.1:5000/consultas", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify(consulta)
        });

        const result = await response.json();
        if (response.ok) {
            console.log("Consulta marcada com sucesso!", result);
            await listagem();
        } else {
            console.error("Erro do servidor:", response.status, result);
            exibirPopup(result.erro || "Erro ao marcar consulta", "error");
        }
    } catch (error) {
        exibirPopup("Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.", "error");
        console.error("Erro de rede ao agendar consulta:", error);
    }
}

async function listagem() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const response = await fetch("http://127.0.0.1:5000/consultas", {
            method: "GET",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            const consultas = await response.json();
            exibirConsultas(consultas);
        } else {
            console.error("Erro ao buscar consultas");
        }
    } catch (error) {
        console.error("Erro de rede ao carregar consultas:", error);
    }
}

function exibirConsultas(consultas) {
    const container = document.getElementById("lista-consultas");
    container.innerHTML = "";

    if (!consultas || consultas.length === 0) {
        container.textContent = "Nenhuma consulta encontrada.";
        return;
    }

    consultas.forEach(c => {
        const card = document.createElement("div");
        card.className = "consultas-item";

        const fields = [
            { cls: "especialidade", label: "Especialidade:", value: c.especialidade },
            { cls: "medico",        label: "Médico:",         value: c.medico },
            { cls: "data",          label: "Data:",           value: c.data },
            { cls: "horario",       label: "Horário:",        value: c.horario },
        ];

        fields.forEach(({ cls, label, value }) => {
            const wrapper = document.createElement("div");
            wrapper.className = cls;

            const h3 = document.createElement("h3");
            h3.textContent = label;

            const p = document.createElement("p");
            p.textContent = value;

            wrapper.appendChild(h3);
            wrapper.appendChild(p);
            card.appendChild(wrapper);
        });

        container.appendChild(card);
    });
}

