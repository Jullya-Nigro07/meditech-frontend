# MediTech Frontend — Contexto para Claude Code

## Visão geral

Frontend estático de uma plataforma de agendamento de consultas médicas, desenvolvido como projeto acadêmico no 4º semestre de AeS.

**Stack:** HTML5, CSS3, JavaScript vanilla — sem frameworks, sem bundler, sem npm.

**Integrantes:**
- Humberto Filho (RA 2402662)
- Anderson (RA 2403321)
- Jullya Nigro (RA 2402577)
- Melissa Ferreira (RA 2403008)

---

## Como rodar

Os HTMLs usam caminhos absolutos (`/css/...`, `/js/...`), então **obrigatório** servir da raiz do projeto:

```bash
# Python
py -m http.server 5500

# Node
npx --yes serve . -l 5500
```

Acesse: `http://127.0.0.1:5500/html/index.html`

As tasks do VS Code já estão em `.vscode/tasks.json`.

---

## Estrutura de arquivos

```
meditech-frontend/
├── css/
│   ├── base.css              ← variáveis CSS + reset global
│   ├── header.css            ← navbar/header
│   ├── home.css              ← index.html
│   ├── login.css
│   ├── register.css
│   ├── coonsultation.css     ← GRAFIA INTENCIONAL (dois "o") — não renomear
│   └── about.css
├── html/
│   ├── index.html            ← home: mostra boxLogado ou boxGuest
│   ├── login.html
│   ├── register.html
│   ├── consultation.html     ← agendamento + listagem
│   └── about.html
├── js/
│   ├── navbar.js             ← Web Component <app-navbar>
│   ├── login.js              ← autenticação + decodeJwtClaims()
│   ├── register.js           ← cadastro de usuário
│   ├── consultation.js       ← agendar e listar consultas
│   └── especialidade_medico.js ← mapa estático especialidade→médico→horários
└── png/
    ├── logo-meditech.png
    ├── login.png
    └── hospital.png
```

> **ATENÇÃO:** `css/coonsultation.css` tem dois "o" propositalmente. Os HTMLs referenciam esse nome exato. Nunca renomear.

---

## API Backend

**Base URL:** `http://127.0.0.1:5000`

| Método | Endpoint              | Descrição                      |
|--------|-----------------------|--------------------------------|
| POST   | `/usuarios/cadastrar` | Cadastrar novo usuário         |
| POST   | `/usuarios/login`     | Autenticar, retorna JWT        |
| POST   | `/consultas`          | Criar nova consulta            |
| GET    | `/consultas`          | Listar consultas do usuário    |

### Payloads

**Cadastro:**
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

**Login:** `{ "email": "...", "senha": "..." }`
Resposta: `{ "access_token": "..." }` (também aceita `token` ou `jwt`).

**Consulta:** `{ "especialidade": "...", "medico": "...", "data": "YYYY-MM-DD", "horario": "HH:MM" }`
Header obrigatório: `Authorization: Bearer <token>`

---

## Autenticação e estado

- Token JWT salvo em `localStorage` com chave `"token"`.
- Dados do usuário em `localStorage["user"]` — JSON `{ nome, email, tipo, token }`.
- Claims extraídas por `decodeJwtClaims()` em `login.js` via `atob(payload)`.
- Campos aceitos no JWT: `nome`/`name`, `email`, `tipo`/`role`.
- Após cadastro: `emailCadastro` e `senhaCadastro` vão para `sessionStorage` para preencher o login automaticamente.
- `consultation.html` redireciona para `login.html` se não houver token.

---

## Web Component Navbar (`navbar.js`)

Elemento customizado `<app-navbar>` registrado via `customElements.define`.

- **Sem token:** Home | Sobre nós | Login | Cadastrar-se
- **Com token:** Home | Sobre nós | Minhas consultas | Sair
- "Sair" limpa `localStorage` e redireciona para `index.html`.

---

## Especialidades e médicos (`especialidade_medico.js`)

Objeto estático `especialidadeMedicos` com estrutura:
```
especialidade → { nomeMedico → [horários disponíveis] }
```

11 especialidades: Clínico Geral, Cardiologista, Dermatologista, Ginecologista, Oftalmologista, Pediatra, Ortopedista, Neurologista, Endocrinologista, Psiquiatra, Dentista.

`select#medico` e `select#horario` em `consultation.html` são populados dinamicamente ao mudar a especialidade selecionada.

---

## Padrões de código

- JavaScript vanilla puro — sem TypeScript, sem build.
- Feedback ao usuário via `exibirPopup(mensagem, tipo)` — tipo `"error"` ou `"success"`, auto-dismiss em 5s.
- Requisições com `fetch` + `async/await`; erros capturados com `try/catch`.
- Datas no formato `YYYY-MM-DD` (input date + Flatpickr via CDN).
- IDs dos elementos em camelCase: `emailLogin`, `senhaLogin`, `botaoLogin`, `nomeUsuario`, etc.

## Padrões de CSS

- `base.css` contém variáveis CSS e reset — sempre importado junto com `header.css` em cada página.
- Classes de layout: `.main`, `.wrapper`, `.container`, `.forms`.
- Feedback de formulário: `.form-popup` com `.error` ou `.success` + classe `.show` para visibilidade.

---

## Fluxo do usuário

1. `index.html` → `boxGuest` (sem token) ou `boxLogado` (com token)
2. `register.html` → cadastro → redireciona para `login.html` com credenciais pré-preenchidas
3. `login.html` → autentica → salva token/user no `localStorage` → redireciona para `index.html`
4. `consultation.html` → seleciona especialidade → médico → data → horário → agenda
5. Consultas agendadas listadas à direita do formulário em `consultation.html`
6. Logout pela navbar → limpa `localStorage` → volta para `index.html`

---

## Skills disponíveis

Quando o usuário pedir para criar qualquer interface, componente,
página ou UI, leia e siga as diretrizes em:
`.claude/skills/frontend-design/SKILL.md`