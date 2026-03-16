const baseUrl = 'http://127.0.0.1:5000';
const headers = { 'Content-Type': 'application/json' };

document.addEventListener("DOMContentLoaded", () => {
    const nomeUsuario = document.getElementById("nomeUsuario");
    const userJson = localStorage.getItem("user");
    if (userJson && nomeUsuario) {
        const user = JSON.parse(userJson);
        nomeUsuario.innerText = user.nome;
    }

    const emailLogin = document.getElementById("emailLogin");
    const senhaLogin = document.getElementById("senhaLogin");
    if (emailLogin && senhaLogin) {
        const emailSalvo = sessionStorage.getItem("emailCadastro");
        const senhaSalva = sessionStorage.getItem("senhaCadastro")
        if (emailSalvo && senhaSalva) {
            emailLogin.value = emailSalvo;
            senhaLogin.value = senhaSalva;
        }
    }
    if (document.getElementById("lista-consultas")) {
        carregarConsultas();
    }


    const botaoLogin = document.getElementById("botaoLogin")

    if (botaoLogin) {
        botaoLogin.addEventListener("click", async (e) => {
            e.preventDefault();

            await login(
                emailLogin.value.trim(),
                senhaLogin.value.trim()
            );

            emailLogin.value = "";
            senhaLogin.value = "";
        });
    }

});

async function login(email, senha) {
    const userLogin = {
        email,
        senha
    };

    const response = await fetch(baseUrl + '/usuarios/login', {
        method: "POST",
        headers,
        body: JSON.stringify(userLogin)
    });

    const data = await response.json();

    if (response.ok) {

        // salvar token
        localStorage.setItem("token", data.access_token);

        // salvar usuário
        localStorage.setItem("user", JSON.stringify({
            id: data.id,
            nome: data.nome,
            sobrenome: data.sobrenome,
            token: data.access_token
        }));

        // limpar dados do cadastro automático
        sessionStorage.removeItem("emailCadastro");
        sessionStorage.removeItem("senhaCadastro");
        console.log("Usuário logado:", data);
        window.location.href = "consultation.html";

    } else {
        console.error("Erro de login:", data);
        alert(data.erro || "Email ou senha inválidos");
    }
}
