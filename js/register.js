const baseUrl = 'http://127.0.0.1:5000/usuarios';
const headers = { 'Content-Type': 'application/json' };

document.addEventListener("DOMContentLoaded", () => {
    const nome = document.getElementById("nome");  
    const sobrenome = document.getElementById("sobrenome");
    const data = document.getElementById("data");
    const genero = document.getElementById("genero");
    const cpf = document.getElementById("cpf");
    const email = document.getElementById("email");
    const senha = document.getElementById("senha");
    const botaoCadastrarUser = document.getElementById("botaoCadastrarUser");

    botaoCadastrarUser.addEventListener("click", async (e) => {
        e.preventDefault();

        await register(
            nome.value.trim(),
            sobrenome.value.trim(),
            data.value.trim(),
            genero.value.trim(),
            cpf.value.trim(),
            email.value.trim(),
            senha.value.trim()
        );

        // limpar campos
        nome.value = "";
        sobrenome.value = "";
        data.value = "";
        genero.value = "";
        cpf.value = "";
        email.value = "";
        senha.value = "";
    });
});

async function register(nome, sobrenome, data_nascimento, genero, cpf, email, senha) {
    const userRegistration = {
        nome,
        sobrenome,
        data_nascimento,
        genero,
        cpf,
        email,
        senha
    };

    const response = await fetch(baseUrl + '/cadastrar', {
        method: "POST",
        headers,
        body: JSON.stringify(userRegistration)
    });

    if (response.ok) {
        const data = await response.json();
        console.log("Usuário cadastrado:", data);
    } else {
        const text = await response.text();
        console.error("Erro do servidor:", response.status, text);
    }
}