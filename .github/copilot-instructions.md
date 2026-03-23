# MediTech Frontend — Instruções para o GitHub Copilot

## Visão geral do projeto

Frontend estático de uma plataforma de agendamento de consultas médicas, desenvolvido como projeto acadêmico.
Stack: HTML5, CSS3, JavaScript vanilla (sem frameworks). Nenhuma etapa de build/bundler.

**Integrantes:**
- Humberto Filho (RA 2402662)
- Anderson (RA 2403321)
- Jullya Nigro (RA 2402577)
- Melissa Ferreira (RA 2403008)

---

## Estrutura de arquivos

```
meditech-frontend/
├── .github/
│   └── copilot-instructions.md   ← este arquivo
├── .vscode/
│   ├── tasks.json                ← tasks para servidor local
│   └── extensions.json
├── css/
│   ├── base.css                  ← reset/variáveis globais
│   ├── header.css                ← navbar / header
│   ├── home.css                  ← página inicial (index.html)
│   ├── login.css                 ← página de login
│   ├── register.css              ← página de cadastro
│   ├── coonsultation.css         ← página de consultas (grafia intencional, não alterar)
│   └── about.css                 ← página sobre nós
├── html/
│   ├── index.html                ← home — exibe boxLogado ou boxGuest conforme token
│   ├── login.html                ← formulário de login
│   ├── register.html             ← formulário de cadastro
│   ├── consultation.html         ← agendamento + listagem de consultas
│   └── about.html                ← institucional
├── js/
│   ├── navbar.js                 ← Web Component <app-navbar>
│   ├── login.js                  ← lógica de autenticação
│   ├── register.js               ← lógica de cadastro
│   ├── consultation.js           ← agendar e listar consultas
│   └── especialidade_medico.js   ← mapa estático especialidade → médicos → horários
└── png/
    ├── logo-meditech.png
    ├── login.png
    └── hospital.png
```

> **IMPORTANTE:** o arquivo `css/coonsultation.css` tem dois "o" propositalmente — os HTMLs apontam para esse nome exato. Não renomear.

---

## Como rodar localmente

Os HTMLs usam caminhos absolutos (ex.: `/css/home.css`, `/js/navbar.js`), **obrigatório** servir da raiz:

```powershell
# Opção 1 — Python
py -m http.server 5500

# Opção 2 — Node
npx --yes serve . -l 5500
```

Acesse: `http://127.0.0.1:5500/html/index.html`

As tasks VS Code `Serve (Python 5500)` e `Serve (Node serve 5500)` já estão configuradas em `.vscode/tasks.json`.

---

## Integração com a API (backend)

Base URL: `http://127.0.0.1:5000`

| Método | Endpoint                  | Uso                        |
|--------|---------------------------|----------------------------|
| POST   | `/usuarios/cadastrar`     | Cadastrar novo usuário     |
| POST   | `/usuarios/login`         | Autenticar, retorna JWT    |
| POST   | `/consultas`              | Criar nova consulta        |
| GET    | `/consultas`              | Listar consultas do usuário|

### Payload de cadastro (`/usuarios/cadastrar`)
```json
{
  "nome": "string",
  "sobrenome": "string",
  "data_nascimento": "YYYY-MM-DD",
  "genero": "feminino|masculino|prefiro_nao_informar|outro",
  "telefone": "string",
  "cpf": "string",
  "email": "string",
  "senha": "string"
}
```

### Payload de login (`/usuarios/login`)
```json
{ "email": "string", "senha": "string" }
```
Resposta esperada: `{ "access_token": "..." }` (também aceita `token` ou `jwt`).

### Payload de consulta (`/consultas`)
```json
{ "especialidade": "string", "medico": "string", "data": "YYYY-MM-DD", "horario": "HH:MM" }
```
Header obrigatório: `Authorization: Bearer <token>`

---

## Autenticação e estado

- **Token JWT** salvo em `localStorage` com chave `"token"`.
- **Dados do usuário** salvos em `localStorage` com chave `"user"` (JSON `{ nome, email, tipo, token }`).
- As claims do JWT são extraídas via `decodeJwtClaims()` em `login.js` (atob do payload base64).
- Campos aceitos no JWT: `nome`/`name`, `email`, `tipo`/`role`.
- `consultation.html` redireciona para `login.html` se não houver token.
- Após cadastro bem-sucedido, `emailCadastro` e `senhaCadastro` ficam em `sessionStorage` para preencher o formulário de login automaticamente.

---

## Navbar (`js/navbar.js`)

Web Component customizado `<app-navbar>` — registrado com `customElements.define`.

Comportamento dinâmico com base no `localStorage`:
- **Sem token:** exibe Home | Sobre nós | Login | Cadastrar-se
- **Com token:** exibe Home | Sobre nós | Minhas consultas | Sair
- "Sair" limpa `localStorage` e redireciona para `index.html`.

---

## Especialidades e médicos (`js/especialidade_medico.js`)

Objeto estático `especialidadeMedicos`:
```
especialidade → { nomeMedico → [horários disponíveis] }
```

Especialidades disponíveis: Clínico Geral, Cardiologista, Dermatologista, Ginecologista, Oftalmologista, Pediatra, Ortopedista, Neurologista, Endocrinologista, Psiquiatra, Dentista.

O `select#medico` e `select#horario` em `consultation.html` são populados dinamicamente conforme a especialidade selecionada.

---

## Padrões de código

- JavaScript vanilla, sem TypeScript, sem build.
- Feedback ao usuário via `exibirPopup(mensagem, tipo)` — tipo `"error"` ou `"success"` — com auto-dismiss em 5 s.
- `fetch` com `async/await`; erros de rede capturados com `try/catch`.
- Datas formatadas como `YYYY-MM-DD` (input type date + flatpickr).
- Flatpickr carregado via CDN (`cdn.jsdelivr.net/npm/flatpickr`).
- IDs dos elementos HTML seguem camelCase: `emailLogin`, `senhaLogin`, `botaoLogin`, `formPopup`, `nomeUsuario`, etc.

---

## Convenções de estilo CSS

- `base.css` contém variáveis CSS e reset global.
- Cada página tem seu CSS dedicado importado no `<head>` junto com `base.css` e `header.css`.
- Classes principais de layout: `.main`, `.wrapper`, `.container`, `.forms`.
- Feedback de formulário: `.form-popup.error` e `.form-popup.success` com classe `.show` para visibilidade.

---

## Fluxo principal do usuário

1. Acessa `index.html` → vê `boxGuest` (sem token) ou `boxLogado` (com token).
2. Cadastro em `register.html` → redireciona para `login.html` com credenciais pré-preenchidas.
3. Login em `login.html` → salva token/user no `localStorage` → redireciona para `index.html`.
4. Agendamento em `consultation.html` → seleciona especialidade → médico → data → horário → agenda.
5. Listagem de consultas já agendadas exibida à direita do formulário em `consultation.html`.
6. Logout via navbar → limpa `localStorage` → volta para `index.html`.
