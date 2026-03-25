# Página de Login — Documentação

**Arquivo HTML:** `html/login.html`
**Arquivo CSS:** `css/login.css`
**Script JS:** `js/login.js`

---

## Layout

Dois painéis lado a lado (flex row):

| Painel | Largura (≥768px) | Largura (mobile) | Descrição |
|--------|-----------------|------------------|-----------|
| Esquerda (formulário) | 45% | 100% | Fundo `--color-surface-lowest` (#FFF), formulário centralizado |
| Direita (visual) | 55% | oculto | Foto `hospital.png` com overlay, citação decorativa |

O painel direito é `display: none` em mobile e se torna `display: block` no breakpoint `min-width: 768px`.

---

## Estrutura HTML

```
.login-main                   ← flex container, min-height: 100vh - navbar
  ├── section.login-form-section
  │     └── .login-form-inner (max-width: 380px, margin: auto)
  │           ├── .login-brand
  │           │     ├── .login-brand-icon (ícone material)
  │           │     └── .login-brand-name ("MediTech")
  │           ├── h1.login-title
  │           ├── p.login-subtitle
  │           ├── form.login-form
  │           │     ├── #formPopup.form-popup
  │           │     ├── .login-field (e-mail)
  │           │     │     ├── .login-label-row
  │           │     │     │     ├── label.login-label
  │           │     │     │     └── a.login-forgot
  │           │     │     └── input#emailLogin.login-input
  │           │     ├── .login-field (senha)
  │           │     │     ├── label.login-label
  │           │     │     └── input#senhaLogin.login-input
  │           │     └── button#botaoLogin.login-btn
  │           └── .login-form-footer
  │                 ├── .login-secure-badge
  │                 └── p.login-register-link
  └── section.login-visual-section (aria-hidden)
        ├── img.login-visual-img
        ├── .login-visual-overlay
        └── blockquote.login-visual-quote
```

---

## IDs requeridos pelo login.js

| ID | Elemento | Descrição |
|----|----------|-----------|
| `emailLogin` | `<input type="email">` | Campo de e-mail |
| `senhaLogin` | `<input type="password">` | Campo de senha |
| `botaoLogin` | `<button type="submit">` | Botão de envio |
| `formPopup` | `<div role="alert">` | Container de feedback (erro/sucesso) |

**Importante:** Esses IDs não devem ser alterados — `login.js` os referencia diretamente.

---

## Classes CSS e seus papéis

| Classe | Papel |
|--------|-------|
| `.login-main` | Container flex principal da página |
| `.login-form-section` | Painel esquerdo (formulário) |
| `.login-form-inner` | Wrapper interno com max-width |
| `.login-brand` | Linha de logotipo (ícone + nome) |
| `.login-brand-icon` | Quadrado com ícone Material Symbols |
| `.login-title` | Título principal (h1) |
| `.login-subtitle` | Texto descritivo abaixo do título |
| `.login-field` | Wrapper de campo (label + input) |
| `.login-label-row` | Linha com label e link "esqueci senha" |
| `.login-label` | Label de campo em uppercase/Inter |
| `.login-forgot` | Link "Esqueci minha senha" |
| `.login-input` | Input estilizado (underline style) |
| `.login-btn` | Botão primário com gradiente |
| `.login-form-footer` | Rodapé do formulário |
| `.login-secure-badge` | Badge "Autenticação Segura" animado |
| `.login-register-link` | Link para página de cadastro |
| `.login-visual-section` | Painel direito (foto decorativa) |
| `.login-visual-img` | Imagem de fundo `hospital.png` |
| `.login-visual-overlay` | Gradiente sobre a imagem |
| `.login-visual-quote` | Citação decorativa no canto inferior direito |
| `.form-popup` | Popup de feedback (oculto por padrão) |
| `.form-popup.show` | Exibe o popup |
| `.form-popup.error` | Fundo vermelho claro (`#ffdad6`) |
| `.form-popup.success` | Fundo verde claro (`#e5fff5`) |

---

## Design Tokens Utilizados

| Token CSS | Valor | Onde aplicado |
|-----------|-------|---------------|
| `--color-primary` | `#565E74` | Botão, links, borda de foco de input |
| `--color-primary-dim` | `#4A5268` | Gradiente do botão (endpoint) |
| `--color-surface-lowest` | `#FFFFFF` | Fundo da seção de formulário |
| `--color-surface-high` | `#E1E9EE` | Fill padrão dos inputs |
| `--color-surface-low` | `#F0F4F7` | Fundo do painel visual direito |
| `--color-on-surface` | `#2A3439` | Brand name, texto de input |
| `--color-on-surface-variant` | `#566166` | Título, subtítulo, labels, rodapé |
| `--color-tertiary` | `#506076` | Ponto animado e label do badge seguro |
| `--color-outline-variant` | `rgba(169,180,185,0.15)` | Borda inferior do input e divisor do rodapé |
| `--color-error` | `#ba1a1a` | Texto de erro no popup |

---

## Comportamento do Input (Estilo Underline)

Os inputs de login seguem o estilo "underline" (não full-border como no cadastro):

- **Padrão:** Fill `--color-surface-high`, borda apenas na parte inferior (`border-bottom: 1.5px`)
- **Foco:** Background vira `--color-surface-lowest` (branco), borda inferior `2px solid --color-primary`
- **Border-radius:** `0.375rem 0.375rem 0 0` (cantos superiores arredondados, base reta)

---

## Comportamento do Popup de Feedback

O `#formPopup` começa com `display: none`. O `login.js` adiciona a classe `.show` + `.error` ou `.success` para exibi-lo.

Auto-dismiss acontece em 5 segundos (controlado pelo JS).

---

## Dependências Externas

- Google Fonts: `Manrope` (pesos 300–800) + `Inter` (pesos 300–600)
- Material Symbols Outlined (ícone `medical_services`)
- `navbar.js` — Web Component `<app-navbar>`
- `login.js` — Lógica de autenticação
