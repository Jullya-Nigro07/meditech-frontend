document.addEventListener("DOMContentLoaded", () => {
    const nomeUsuario = document.getElementById("nomeUsuario");
    const navLogin = document.getElementById("nav-login");
    const formConsulta = document.getElementById("formConsulta");
    const userJson = localStorage.getItem("user");

    if (userJson) {
        const user = JSON.parse(userJson);
        nomeUsuario.innerText = user.nome;
        navLogin.innerHTML = `<a id="logout-btn">Sair</a>`;
        document.getElementById("logout-btn").addEventListener("click", logout);
    } else {
        navLogin.innerHTML = `<a href="login.html">Login</a>`;
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

async function criarConsulta(especialidade, medico, data, horario) {
    const token = localStorage.getItem("token");
    const consulta = { especialidade, medico, data, horario };

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
        alert(result.erro || "Erro ao marcar consulta");
    }
}

async function listagem() {
    const token = localStorage.getItem("token");
    if (!token) return;

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
}

function exibirConsultas(consultas) {
    const container = document.getElementById("lista-consultas");
    container.innerHTML = "";

    if (!consultas || consultas.length === 0) {
        container.innerHTML = "<p>Nenhuma consulta encontrada.</p>";
        return;
    }

    consultas.forEach(c => {
        container.innerHTML += `
            <div class="consultas-item">
                <div class="especialidade"><h3>Especialidade:</h3><p>${c.especialidade}</p></div>
                <div class="medico"><h3>Médico:</h3><p>${c.medico}</p></div>
                <div class="data"><h3>Data:</h3><p>${c.data}</p></div>
                <div class="horario"><h3>Horário:</h3><p>${c.horario}</p></div>
            </div>
        `;
    });
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "index.html";
}
