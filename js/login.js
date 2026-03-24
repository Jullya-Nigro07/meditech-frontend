const headers = { 'Content-Type': 'application/json' };
let popupTimer;

function exibirPopup(mensagem, tipo = "error") {
    const popup = document.getElementById("formPopup");
    if (!popup) return;

    popup.textContent = mensagem;
    popup.classList.remove("error", "success", "show");
    popup.classList.add(tipo, "show");

    if (popupTimer) clearTimeout(popupTimer);
    popupTimer = setTimeout(() => {
        popup.classList.remove("show");
    }, 5000);
}

function limparPopup() {
    const popup = document.getElementById("formPopup");
    if (!popup) return;

    popup.classList.remove("show");
    popup.textContent = "";
    if (popupTimer) clearTimeout(popupTimer);
}

function decodeJwtClaims(token) {
    try {
        const payload = token.split(".")[1];
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(base64));
    } catch {
        return null;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const nomeUsuario = document.getElementById("nomeUsuario");
    const userJson = localStorage.getItem("user");
    if (userJson && nomeUsuario) {
        try {
            const user = JSON.parse(userJson);
            nomeUsuario.innerText = user.nome;
        } catch {
            localStorage.removeItem("user");
        }
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
    const botaoLogin = document.getElementById("botaoLogin")

    if (botaoLogin) {
        botaoLogin.addEventListener("click", async (e) => {
            e.preventDefault();
            limparPopup();

            await login(
                emailLogin.value.trim(),
                senhaLogin.value.trim()
            );
        });
    }

});

async function login(email, senha) {
    const userLogin = {
        email,
        senha
    };

    const response = await fetch('http://127.0.0.1:5000/usuarios/login', {
        method: "POST",
        headers,
        body: JSON.stringify(userLogin)
    });

    try {
        const data = await response.json();

        if (response.ok) {
        const token = data.access_token || data.token || data.jwt;

        if (!token) {
            exibirPopup("Login efetuado, mas nenhum token JWT foi retornado pela API.", "error");
            return;
        }

        const claims = decodeJwtClaims(token);
        if (!claims) {
            exibirPopup("Nao foi possivel ler os dados do token. Tente novamente.", "error");
            return;
        }

        // salvar token
        localStorage.setItem("token", token);

        // salvar usuário a partir das claims
        localStorage.setItem("user", JSON.stringify({
            nome: claims.nome || claims.name || "",
            email: claims.email || "",
            tipo: claims.tipo || claims.role || "",
            token
        }));

        // limpar dados do cadastro automático
        sessionStorage.removeItem("emailCadastro");
        sessionStorage.removeItem("senhaCadastro");
        console.log("Usuário logado:", data);
        window.location.href = "index.html";
        return true;

    } else {
        console.error("Erro de login:", data);
        const mensagem = data.erro || "Email ou senha inválidos";
        exibirPopup(mensagem, "error");
        return false;
    }
    } catch (error) {
        exibirPopup("Nao foi possivel conectar ao servidor. Verifique sua conexao e tente novamente.", "error");
        console.error("Erro de rede no login:", error);
        return false;
    }
}
