const baseUrl = 'http://127.0.0.1:5000/usuarios/cadastrar';
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

document.addEventListener("DOMContentLoaded", () => {
    const nome = document.getElementById("nome");  
    const sobrenome = document.getElementById("sobrenome");
    const dataNasc = document.getElementById("dataNasc");
    const genero = document.getElementById("genero");
    const telefone = document.getElementById("telefone");
    const cpf = document.getElementById("cpf");
    const email = document.getElementById("email");
    const senha = document.getElementById("senha");
    const botaoCadastrarUser = document.getElementById("botaoCadastrarUser");

    if (botaoCadastrarUser) {
        botaoCadastrarUser.addEventListener("click", async (e) => {
            e.preventDefault();
            limparPopup();

            const sucesso = await register(
                nome.value.trim(),
                sobrenome.value.trim(),
                dataNasc.value.trim(),
                genero.value.trim(),
                telefone.value.trim(),
                cpf.value.trim(),
                email.value.trim(),
                senha.value.trim()
            );

            if (!sucesso) return;

            // limpar campos
            nome.value = "";
            sobrenome.value = "";
            dataNasc.value = "";
            genero.value = "";
            telefone.value = "";
            cpf.value = "";
            email.value = "";
            senha.value = "";
        });
    }
});

async function register(nome, sobrenome, data_nascimento, genero, telefone, cpf, email, senha) {
    
    const userRegistration = {
        nome,
        sobrenome,
        data_nascimento,
        genero,
        telefone,
        cpf,
        email,
        senha
    }

    try {
        const response = await fetch(baseUrl, {
            method: "POST",
            headers,
            body: JSON.stringify(userRegistration)
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Usuário cadastrado:", data);
            sessionStorage.setItem("emailCadastro", email);
            sessionStorage.setItem("senhaCadastro", senha);
            window.location.href = "login.html";
            return true;
        }

        const contentType = response.headers.get("content-type") || "";
        let mensagem = "Erro ao cadastrar usuario.";

        if (contentType.includes("application/json")) {
            const data = await response.json();
            mensagem = data.erro || data.message || mensagem;
        } else {
            const text = await response.text();
            if (text) mensagem = text;
        }

        if (response.status >= 400 && response.status < 500) {
            exibirPopup(mensagem, "error");
        } else {
            exibirPopup("Erro interno do servidor. Tente novamente.", "error");
        }

        console.error("Erro do servidor:", response.status, mensagem);
        return false;
    } catch (error) {
        exibirPopup("Nao foi possivel conectar ao servidor. Verifique sua conexao e tente novamente.", "error");
        console.error("Erro de rede no cadastro:", error);
        return false;
    }
}
