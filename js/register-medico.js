const baseUrl = 'http://127.0.0.1:5000/usuarios/medico';
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
    // Feedback visual ao selecionar arquivos
    const uploadCro = document.getElementById("uploadCro");
    const uploadCurriculo = document.getElementById("uploadCurriculo");
    const nomeCro = document.getElementById("nomeCro");
    const nomeCurriculo = document.getElementById("nomeCurriculo");
    const labelCro = document.getElementById("labelUploadCro");
    const labelCurriculo = document.getElementById("labelUploadCurriculo");

    if (uploadCro) {
        uploadCro.addEventListener("change", () => {
            const file = uploadCro.files[0];
            if (file) {
                nomeCro.textContent = file.name;
                nomeCro.classList.add("visible");
                labelCro.classList.add("has-file");
            } else {
                nomeCro.classList.remove("visible");
                labelCro.classList.remove("has-file");
            }
        });
    }

    if (uploadCurriculo) {
        uploadCurriculo.addEventListener("change", () => {
            const file = uploadCurriculo.files[0];
            if (file) {
                nomeCurriculo.textContent = file.name;
                nomeCurriculo.classList.add("visible");
                labelCurriculo.classList.add("has-file");
            } else {
                nomeCurriculo.classList.remove("visible");
                labelCurriculo.classList.remove("has-file");
            }
        });
    }

    // Submissão do formulário
    const botao = document.getElementById("botaoCadastrarMedico");

    if (botao) {
        botao.addEventListener("click", async (e) => {
            e.preventDefault();
            limparPopup();

            const nome = document.getElementById("nome");
            const sobrenome = document.getElementById("sobrenome");
            const dataNasc = document.getElementById("dataNasc");
            const genero = document.getElementById("genero");
            const email = document.getElementById("email");
            const cpf = document.getElementById("cpf");
            const telefone = document.getElementById("telefone");
            const senha = document.getElementById("senha");

            const sucesso = await registerMedico(
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

            nome.value = "";
            sobrenome.value = "";
            dataNasc.value = "";
            genero.value = "";
            email.value = "";
            cpf.value = "";
            telefone.value = "";
            senha.value = "";
        });
    }
});

async function registerMedico(nome, sobrenome, data_nascimento, genero, telefone, cpf, email, senha) {
    const payload = {
        nome,
        sobrenome,
        data_nascimento,
        genero,
        telefone,
        cpf,
        email,
        senha
    };

    try {
        const response = await fetch(baseUrl, {
            method: "POST",
            headers,
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            exibirPopup("Cadastro enviado com sucesso! Aguarde a validação da equipe MediTech.", "success");
            setTimeout(() => {
                sessionStorage.setItem("emailCadastro", email);
                sessionStorage.setItem("senhaCadastro", senha);
                window.location.href = "/html/login.html";
            }, 2500);
            return true;
        }

        const contentType = response.headers.get("content-type") || "";
        let mensagem = "Erro ao enviar cadastro.";

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
        exibirPopup("Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.", "error");
        console.error("Erro de rede:", error);
        return false;
    }
}
