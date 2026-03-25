# Página de Cadastro — Documentação

**Arquivo HTML:** `html/register.html`
**Arquivo CSS:** `css/register.css`
**Script JS:** `js/register.js`

---

## Layout

Dois painéis lado a lado (flex row):

| Painel | Largura (≥768px) | Largura (mobile) | Descrição |
|--------|-----------------|------------------|-----------|
| Esquerda (formulário) | 45% | 100% | Fundo `--color-surface` (#F7F9FB), formulário com scroll |
| Direita (visual escuro) | 55% | oculto | Fundo escuro `#191c1d` com foto, overlay, headline e card flutuante |

O painel direito é `display: none` em mobile e se torna `display: block` no breakpoint `min-width: 768px`.

**Diferença chave do Login:** O painel direito usa fundo escuro (`#191c1d`) com overlay em gradiente do rodapé, criando um efeito dramático. Não é um token de superfície — é uma escolha decorativa intencional.

---

## Estrutura HTML

```
.register-main                ← flex container, min-height: 100vh - navbar
  ├── section.register-form-section
  │     └── .register-form-inner (max-width: 420px, margin: auto)
  │           ├── .register-brand
  │           │     ├── .register-brand-icon
  │           │     └── .register-brand-name ("MediTech")
  │           ├── h1.register-title
  │           ├── p.register-subtitle
  │           ├── form.register-form
  │           │     ├── #formPopup.form-popup
  │           │     ├── .register-grid-2 (Nome / Sobrenome)
  │           │     ├── .register-grid-2 (Data Nasc. / Gênero)
  │           │     ├── .register-field (E-mail)
  │           │     ├── .register-grid-2 (CPF / Telefone)
  │           │     ├── .register-field (Senha)
  │           │     └── button#botaoCadastrarUser.register-btn
  │           └── .register-form-footer
  │                 └── p.register-login-link
  └── section.register-visual-section (aria-hidden)
        ├── img.register-visual-img
        ├── .register-visual-overlay
        ├── .register-visual-content
        │     ├── .register-visual-eyebrow
        │     │     ├── span.eyebrow-line
        │     │     └── span.eyebrow-text
        │     ├── h2.register-visual-headline
        │     └── .register-pulse-badge
        │           ├── span.register-pulse-dot
        │           └── span.register-pulse-label
        └── .register-security-card (card flutuante decorativo)
              ├── span.register-security-icon
              ├── p.register-security-title
              └── p.register-security-desc
```

---

## IDs requeridos pelo register.js

| ID | Elemento | Descrição |
|----|----------|-----------|
| `nome` | `<input type="text">` | Primeiro nome |
| `sobrenome` | `<input type="text">` | Sobrenome |
| `dataNasc` | `<input type="date">` | Data de nascimento (Flatpickr) |
| `genero` | `<select>` | Seletor de gênero |
| `email` | `<input type="email">` | E-mail |
| `cpf` | `<input type="text">` | CPF formatado |
| `telefone` | `<input type="tel">` | Telefone |
| `senha` | `<input type="password">` | Senha |
| `botaoCadastrarUser` | `<button type="submit">` | Botão de envio |
| `formPopup` | `<div role="alert">` | Container de feedback |

**Importante:** Esses IDs não devem ser alterados — `register.js` os referencia diretamente.

---

## Grid de dois campos (`.register-grid-2`)

Campos pareados usam CSS Grid `1fr 1fr`:

```css
.register-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}
```

Pares de campos:
1. Nome + Sobrenome
2. Data de Nascimento + Gênero
3. CPF + Telefone

---

## Classes CSS e seus papéis

| Classe | Papel |
|--------|-------|
| `.register-main` | Container flex principal |
| `.register-form-section` | Painel esquerdo (formulário) |
| `.register-form-inner` | Wrapper interno com max-width |
| `.register-brand` | Linha de logotipo |
| `.register-brand-icon` | Quadrado com ícone Material |
| `.register-title` | Título principal (h1) |
| `.register-subtitle` | Texto descritivo |
| `.register-form` | Formulário flex column |
| `.register-grid-2` | Grid de dois campos lado a lado |
| `.register-field` | Wrapper de campo (label + input) |
| `.register-label` | Label uppercase/Inter |
| `.register-input` | Input estilizado (full-rounded) |
| `.register-select` | Select com seta SVG customizada |
| `.register-btn` | Botão primário com gradiente |
| `.register-form-footer` | Rodapé com link para login |
| `.register-login-link` | Link para `login.html` |
| `.register-visual-section` | Painel direito escuro |
| `.register-visual-img` | Foto `hospital.png` com blend luminosity |
| `.register-visual-overlay` | Gradiente de baixo para cima |
| `.register-visual-content` | Container do conteúdo narrativo |
| `.register-visual-eyebrow` | Linha + label "Inovação Clínica" |
| `.eyebrow-line` | Linha decorativa horizontal |
| `.eyebrow-text` | Texto uppercase decorativo |
| `.register-visual-headline` | Headline em Manrope peso 300 |
| `.register-pulse-badge` | Badge "ao vivo" com blur |
| `.register-pulse-dot` | Ponto animado com pulse-ring |
| `.register-pulse-label` | Texto do badge |
| `.register-security-card` | Card flutuante rotacionado 3° |
| `.form-popup` | Popup de feedback |
| `.form-popup.show` | Exibe o popup |
| `.form-popup.error` | Fundo vermelho claro |
| `.form-popup.success` | Fundo verde claro |

---

## Design Tokens Utilizados

| Token CSS | Valor | Onde aplicado |
|-----------|-------|---------------|
| `--color-primary` | `#565E74` | Botão, links |
| `--color-primary-dim` | `#4A5268` | Gradiente do botão (endpoint) |
| `--color-surface` | `#F7F9FB` | Fundo da seção de formulário |
| `--color-surface-high` | `#E1E9EE` | Fill padrão dos inputs |
| `--color-surface-lowest` | `#FFFFFF` | Fill dos inputs em foco |
| `--color-on-surface` | `#2A3439` | Brand name, título, texto de input |
| `--color-on-surface-variant` | `#566166` | Subtítulo, labels, rodapé |
| `--color-tertiary` | `#506076` | Ponto pulse do badge |
| `--color-error` | `#ba1a1a` | Texto de erro no popup |

**Nota:** O painel visual escuro (`#191c1d`) é hardcoded intencionalmente — é uma escolha criativa, não um token de superfície.

---

## Comportamento do Input (Estilo Full-Rounded)

Os inputs de cadastro usam estilo diferente do login — full border-radius:

- **Padrão:** Fill `--color-surface-high`, `border-radius: 0.5rem`, sem borda
- **Foco:** Background vira `--color-surface-lowest`, `box-shadow: 0 0 0 2px rgba(86, 94, 116, 0.3)` (bloom)
- **Sem borda inferior** (diferente do login)

---

## Flatpickr — Inicialização

O `#dataNasc` é um `<input type="date">` que usa Flatpickr como date picker. A inicialização ocorre no final do `<body>`:

```html
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
<script>
    flatpickr("#dataNasc", {
        dateFormat: "Y-m-d",
        allowInput: false
    });
</script>
```

**Importante:** O script de inicialização deve vir *após* o elemento `#dataNasc` no DOM e *após* o CDN do Flatpickr.

---

## Painel Visual Escuro — Elementos

O painel direito é puramente decorativo (`aria-hidden="true"`):

1. **Foto** `hospital.png` com `opacity: 0.35` e `mix-blend-mode: luminosity`
2. **Overlay gradiente** da base (88% opaco) até o topo (transparente)
3. **Headline narrativa** com fonte Manrope peso 300 em branco
4. **Badge pulse** — "Monitoramento de Dados em Tempo Real Ativo" com ponto animado (`--color-tertiary`)
5. **Card flutuante** "Segurança de Dados" com `backdrop-filter: blur(20px)` e `transform: rotate(3deg)`

---

## Fluxo pós-cadastro

Após cadastro bem-sucedido, `register.js`:
1. Salva e-mail e senha em `sessionStorage` (chaves `emailCadastro` e `senhaCadastro`)
2. Redireciona para `login.html`
3. `login.js` lê esses valores para preencher o formulário automaticamente

---

## Dependências Externas

- Google Fonts: `Manrope` + `Inter`
- Material Symbols Outlined (ícones `medical_services` e `verified_user`)
- Flatpickr via CDN (`https://cdn.jsdelivr.net/npm/flatpickr`)
- `navbar.js` — Web Component `<app-navbar>`
- `register.js` — Lógica de cadastro
