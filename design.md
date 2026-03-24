# MediTech — Design System

> **North Star: "The Ethereal Clinic"**
> Um design editorial de alto padrão que combina a autoridade da medicina com a leveza do luxo moderno. Nada de portais médicos genéricos e quadrados — aqui usamos profundidade tonal, assimetria intencional e "Calm Efficiency".

---

## 1. Paleta de Cores

### Tokens principais

| Token                  | Hex         | Uso                                          |
|------------------------|-------------|----------------------------------------------|
| `primary`              | `#00488d`   | Cor principal — botões, links ativos          |
| `primary_container`    | `#005fb8`   | Variante de container — gradientes de CTA     |
| `secondary`            | `#4b607c`   | Elementos secundários, ícones                 |
| `tertiary`             | `#7b3200`   | "Live" / urgente — cobre quente               |
| `tertiary_container`   | `#a04401`   | Variante de container terciário               |
| `background`           | `#f8f9fa`   | Canvas principal                              |
| `on_surface`           | `#191c1d`   | Texto — nunca usar `#000000` puro             |
| `outline`              | `#727783`   | Bordas sutis (usar com parcimônia)            |
| `outline_variant`      | `#c2c6d4`   | "Ghost border" — apenas a 15% de opacidade    |
| `error`                | `#ba1a1a`   | Erros e validações                            |

### Hierarquia de superfícies

Trate o UI como um stack físico de materiais semi-transparentes:

| Nível                       | Hex         | Uso                                              |
|-----------------------------|-------------|--------------------------------------------------|
| `surface` (base)            | `#f8f9fa`   | Canvas da página                                 |
| `surface_container_low`     | `#f3f4f5`   | Seções estruturais grandes                       |
| `surface_container`         | `#edeeef`   | Áreas de conteúdo secundário                     |
| `surface_container_high`    | `#e7e8e9`   | Navbar, sidebars persistentes                    |
| `surface_container_highest` | `#e1e3e4`   | Overlays elevados, modais                        |
| `surface_container_lowest`  | `#ffffff`   | Cards interativos — "pop" máximo sobre o fundo   |

---

## 2. Regras de Layout

### Regra do "Sem Linhas"
> **Proibido** usar bordas de 1px para separar seções.

Limites de layout são definidos **exclusivamente por mudança de cor de fundo**. Ex: uma seção `surface_container_low` encostada numa seção `surface` — a diferença de tom é a divisória.

Se for absolutamente necessário indicar uma borda por acessibilidade, usar **"Ghost Border"**: `outline_variant` (#c2c6d4) a **15% de opacidade**.

### Layering (Profundidade Tonal)
Profundidade sem sombra:
- Um card `surface_container_lowest` sobre uma seção `surface_container_low` cria elevação natural sem nenhuma sombra.
- Reservar sombras reais apenas para elementos flutuantes (FABs, modais).

### Sombras Ambiente (quando necessário)
- **Blur:** 32px–48px
- **Opacidade:** 4%–6%
- **Cor:** versão tintada de `on_surface` (#191c1d) — nunca preto puro.

### Espaçamento
- `spacingScale: 2` — use múltiplos de 2.
- Prefira mais espaço do que menos. Se parecer espaçado, adicione mais um nível.
- Assimetria intencional: compensar blocos de texto à direita de imagens grandes cria ritmo editorial.

---

## 3. Tipografia

| Papel              | Fonte      | Escala referência          |
|--------------------|------------|----------------------------|
| Display / Headlines | **Manrope** | `display-lg` ≈ 3.5rem      |
| Body / Títulos      | **Inter**   | `body-md` para dados médicos |
| Labels / UI        | **Inter**   | Tamanhos menores, alto contraste |

**Regra de contraste tipográfico:** Sempre parear um headline `display-sm` grande com `body-md`. O salto de escala cria o look de design customizado — não de template genérico.

---

## 4. Componentes

### Botões

| Tipo      | Fundo                                         | Texto                  | Borda        |
|-----------|-----------------------------------------------|------------------------|--------------|
| Primary   | Gradiente `primary` → `primary_container`     | `on_primary` (#fff)    | Nenhuma      |
| Secondary | `surface_container_high`                      | `on_secondary_container` | Nenhuma   |

- **Roundedness:** `ROUND_FOUR` — `border-radius: 0.25rem`
- **Hover:** aumentar o nível de superfície (ex: `container` → `container_low`) em vez de escurecer a cor.

### Cards & Listas

- **Proibido:** linhas divisórias entre itens.
- **Separação:** espaço vertical (spacing `8` ou `10`) ou mudança de fundo (`surface_container_low` → `surface_container_lowest`).
- **Cards de alerta/prioridade:** usar `tertiary_fixed` (#ffdbcb) para contraste quente sobre os azuis frios.

### Inputs

- **Fundo:** `surface_container_highest` com `border-radius: 0.375rem` (md).
- **Estado ativo:** fundo muda para `surface_container_lowest` + "Ghost Border" de 2px em `primary`.

### Efeito Glass / Frosted

Para elementos flutuantes ou trays persistentes:
- `backdrop-filter: blur(12px–20px)`
- Cor de fundo com **80% de opacidade** — deixar as cores do background sangrar suavemente.

### Indicadores de Status

- **"Ao vivo" / Urgente:** `tertiary` (#7b3200) — o cobre quente chama atenção sem o alarme vermelho de `error`.
- **Erros de formulário:** `error` (#ba1a1a) com `error_container` (#ffdad6) como fundo.

---

## 5. Do's & Don'ts

### ✅ Faça
- Use margens assimétricas — compensa um bloco de texto à direita de uma imagem para ritmo editorial.
- Incline-se ao espaço em branco. Sempre adicione mais um nível de spacing do que o "suficiente".
- Use `primary_fixed_dim` (#a8c8ff) para ícones — tom mais suave e integrado ao UI.
- Defina seções através de mudança de tom de superfície, não de bordas.

### ❌ Não faça
- Não use `#000000` para texto. Sempre `on_surface` (#191c1d).
- Não use divisórias de 1px. Use blocos `surface_container_low` de 8px de altura ou espaço em branco.
- Não use "azul padrão da web". Use os tokens `primary`/`secondary` específicos do sistema.
- Não escureça botões no hover — levante a superfície.

---

## 6. Referência de Variáveis CSS

---

## 7. Tela — Página Inicial (`index.html`)

### Estrutura de seções (top → bottom)

```
[ Navbar fixo (glass) ]
[ Hero — fullscreen com imagem de fundo ]
[ Trust Metrics — faixa de estatísticas ]
[ Especialidades — Bento Grid ]
  └─ [ CTA "Acessar Meus Agendamentos" ]
[ CTA Final — fundo escuro gradiente ]
[ Footer — 4 colunas ]
```

---

### Navbar

- **Posição:** `fixed top-0`, `z-50`, largura 100%.
- **Fundo:** `glass-nav` → `background: rgba(247, 249, 251, 0.8)` + `backdrop-filter: blur(24px)`.
- **Logo:** texto `MedTech`, `font-bold`, `tracking-tighter`, cor `slate-800`.
- **Links de navegação:** Manrope `text-sm tracking-tight`; ativo = `font-semibold` + `border-b-2 border-slate-600`; inativo = `text-slate-500`.
- **Ícones de ação:** `notifications`, `settings` — hover com `bg-slate-100/50`.
- **Avatar:** `w-10 h-10 rounded-full`, ring `ring-2 ring-surface-container`. Indicador de status: círculo `w-3 h-3 bg-tertiary` no canto inferior direito.

---

### Hero

- **Altura mínima:** `min-h-[870px]`, `flex items-center`.
- **Fundo:** imagem de ambiente clínico com gradiente por cima: `from-surface via-surface/60 to-transparent` (esquerda → direita), garantindo legibilidade do texto.
- **Conteúdo alinhado à esquerda** (`max-w-3xl ml-0 md:ml-10`).
- **Eyebrow label:** linha horizontal `w-12 h-[1px] bg-primary` + texto uppercase `tracking-[0.2em] text-on-surface-variant text-xs`.
- **Headline principal:**
  - Fonte: Manrope, `text-5xl md:text-7xl font-bold`, `leading-[1.1] tracking-tight`.
  - "O futuro do" em `text-on-surface`; "Cuidado Clínico." em `text-primary italic font-light`.
- **Subtítulo:** Inter `text-lg text-on-surface-variant`, `max-w-xl`, `leading-relaxed`.
- **Search bar:**
  - Fundo: `bg-surface-container-lowest`, `rounded-xl`, sombra `shadow-sm`.
  - Input com ícone `location_on` + placeholder "Localização".
  - Botão CTA: `bg-primary-gradient` (gradiente `#565e74` → `#4a5268`), `text-on-primary`, `rounded-lg`, `px-8 py-4`.

---

### Trust Metrics

- **Fundo:** `bg-surface-container-low` (faixa separadora sem borda).
- **Layout:** grid `2 cols mobile / 4 cols desktop`, `gap-12`, `py-24`.
- **Cada métrica:**
  - Número: Manrope `text-4xl font-bold text-on-surface`.
  - Sufixo (%, +, min): `text-primary text-2xl`.
  - Label: Inter `text-[0.65rem] uppercase tracking-widest text-on-surface-variant`.
- **Valores:** 98% · 12k+ · 15min · 500+

---

### Especialidades — Bento Grid

- **Fundo:** `bg-surface`, `py-32`.
- **Header da seção:** título Manrope `text-4xl font-bold` à esquerda + link "Ver Todas as Unidades" com `arrow_forward` à direita.
- **Grid:** `grid-cols-12`, `gap-6`, `h-[700px]` — layout assimétrico intencional:

| Card | Colunas | Fundo | Destaque |
|------|---------|-------|----------|
| Neurologia de Precisão | `col-span-8` | `surface-container-lowest` | Imagem à direita, grayscale → colorida no hover |
| Laboratório Cardiovascular | `col-span-4` | `tertiary-container` | Indicador "ao vivo" animado (`animate-pulse`) |
| Oncologia Avançada | `col-span-4` | `surface-container` | Ícone `primary`, link "Descobrir" |
| Cuidado Pediátrico | `col-span-8` | `surface-container-lowest` | Imagem à direita, soft + rounded |

- **Transição de imagem (Neurologia):** `grayscale opacity-50` → `grayscale-0 opacity-100` com `transition-all duration-700` no `group-hover`.
- **Indicador "Ao Vivo":** `w-2 h-2 rounded-full bg-tertiary animate-pulse` + label uppercase `tracking-widest`.

#### CTA "Acessar Meus Agendamentos"

- **Posição:** centralizado, `mt-32` abaixo do grid.
- **Estilo:** `bg-primary`, `rounded-xl`, `px-12 py-6`.
- **Texto:** Manrope `text-xl font-bold tracking-tight`.
- **Ícone esquerdo:** `calendar_month` (fill=1), `text-3xl`.
- **Ícone direito:** `arrow_forward` — move `translate-x-1` no `group-hover`.
- **Sombra:** `shadow-2xl shadow-primary/20`.
- **Micro-interação:** `hover:scale-[1.02]` / `active:scale-[0.98]`.

---

### CTA Final

- **Fundo:** `bg-primary-gradient` (`#565e74` → `#4a5268`), `rounded-3xl`.
- **Decoração:** círculo `w-96 h-96 bg-white/5 rounded-full blur-3xl` no canto superior direito.
- **Headline:** Manrope `text-4xl md:text-5xl font-bold text-white`, `leading-tight`.
- **Subtítulo:** `text-white/70 text-lg`.
- **Botões:**
  - Primário: `bg-white text-primary`, `rounded-lg`, `font-bold`.
  - Secundário: `bg-transparent border border-white/30 text-white`, hover `bg-white/10`.
- **Widget lateral (desktop):** card `w-80 h-80 bg-tertiary-container/20 backdrop-blur-xl rounded-2xl border border-white/10`. Exibe barras de progresso com `bg-tertiary` e label "Status da Rede: Operacional".

---

### Footer

- **Fundo:** `bg-slate-50`, `border-t border-slate-200`.
- **Grid:** `2 cols mobile / 4 cols desktop`, `gap-8`, `px-12 py-16`, `max-w-7xl mx-auto`.
- **Coluna 1 (Brand):** logo `text-slate-400` + tagline `text-slate-500 text-xs`.
- **Colunas 2–4:** título `font-label text-xs uppercase tracking-widest text-slate-800 font-bold` + links `text-slate-500 text-xs uppercase tracking-widest underline decoration-slate-300 underline-offset-4 opacity-80`.
- **Rodapé inferior:** copyright `text-xs uppercase tracking-widest text-slate-400` + ícones `lan` e `share`.

---

## 8. Tela — Lista de Médicos com Filtros de Destaque (`consultation.html`)

> **Conceito:** "Agende seu Especialista" — layout de busca com filtros integrados em pill e listagem de médicos em cards compactos. Foco em escaneabilidade rápida e ação direta.

### Estrutura de seções (top → bottom)

```
[ Navbar fixo (glass) ]
[ Barra de Filtros — pill centralizada ]
  └─ [ Badge de disponibilidade ]
[ Lista de Médicos — cards verticais ]
  └─ [ CTA "Ver todos os especialistas" ]
[ Footer ]
```

---

### Navbar

- Idêntica à da `index.html` — `glass-nav` com `backdrop-blur-xl`, links Painel · Análises · Pacientes · Relatórios.
- Link ativo ("Pacientes"): `font-semibold border-b-2 border-on-surface`.

---

### Barra de Filtros

- **Posição:** centralizada horizontalmente, `mt-24` abaixo do navbar fixo.
- **Forma:** pill único — `rounded-[2rem]`, `bg-surface-container-lowest`, sombra ambiente `shadow-lg` (blur 48px, 5% opacidade).
- **Três seções clicáveis** separadas por divisória `outline_variant` a 15%:

| Seção | Ícone | Label superior | Valor padrão |
|-------|-------|----------------|--------------|
| Data | `calendar_today` | "Data" | "Hoje, 24 Mai" |
| Especialidade | `local_hospital` | "Especialidade" | "Cardiologia" |
| Período | `schedule` | "Período" | "Manhã & Tarde" |

- **Botão "Buscar":** `bg-primary` → `bg-primary-container` (gradiente), `text-on-primary`, `rounded-full`, `px-8 py-4`, ícone `search` à esquerda.
- **Badge de resultado:** pílula `bg-surface-container-low` abaixo da barra — ícone `circle` pulsante `bg-primary` + texto "42 Especialistas Ativos Hoje" em Inter `text-sm font-semibold`.

---

### Lista de Médicos

- **Layout:** coluna flex (`flex-col gap-4`), `max-w-3xl mx-auto`, `py-10`.
- **Cada card:**
  - **Fundo:** `bg-surface-container-lowest`, `rounded-2xl`, `px-6 py-5`.
  - **Avatar:** `w-14 h-14 rounded-full`, foto do médico. Badge de disponibilidade sobreposto no canto: pílula `bg-primary/10 text-primary text-xs` ("Disponível") ou `bg-tertiary/10 text-tertiary` ("Em atendimento").
  - **Nome:** Manrope `text-base font-bold text-on-surface`.
  - **Especialidade:** Inter `text-sm text-on-surface-variant`, ícone `medical_services` à esquerda.
  - **Avaliação:** estrelas `text-tertiary-container` (fill) + nota `text-sm font-semibold` + "(124 avaliações)" `text-on-surface-variant`.
  - **Próximo horário:** `text-xs text-on-surface-variant` + ícone `schedule`.
  - **Botão "Agendar Agora":** `bg-primary`, `text-on-primary`, `rounded-lg`, `px-5 py-2`, alinhado à direita do card. Hover: `hover:bg-primary-container`, `hover:shadow-md`.
- **CTA final:** link "Ver todos os 240 especialistas →" centralizado, `text-primary font-semibold underline underline-offset-4`.

---

### Especialistas exibidos (dados de referência)

| Nome | Especialidade | Status |
|------|--------------|--------|
| Dra. Beatriz Santos | Cardiologista | Disponível |
| Dr. Ricardo Almeida | Neurologista | Disponível |
| Dra. Helena Costa | Pediatra | Em atendimento |
| Dr. Fernando Lima | Ortopedista | Disponível |

---

### Footer

- **Fundo:** `bg-surface-container-low`, sem borda (separação por tom).
- **Links:** Termos de Uso · Privacidade · Suporte — Inter `text-xs uppercase tracking-widest text-on-surface-variant`.
- **Copyright:** `text-xs text-outline`.

---

```css
:root {
  /* Primárias */
  --color-primary: #00488d;
  --color-primary-container: #005fb8;

  /* Secundárias */
  --color-secondary: #4b607c;
  --color-secondary-container: #c9deff;

  /* Terciárias (cobre) */
  --color-tertiary: #7b3200;
  --color-tertiary-container: #a04401;

  /* Superfícies */
  --color-background: #f8f9fa;
  --color-surface: #f8f9fa;
  --color-surface-container-lowest: #ffffff;
  --color-surface-container-low: #f3f4f5;
  --color-surface-container: #edeeef;
  --color-surface-container-high: #e7e8e9;
  --color-surface-container-highest: #e1e3e4;

  /* Texto */
  --color-on-surface: #191c1d;
  --color-on-surface-variant: #424752;
  --color-on-primary: #ffffff;

  /* Contornos */
  --color-outline: #727783;
  --color-outline-variant: #c2c6d4;

  /* Erro */
  --color-error: #ba1a1a;
  --color-error-container: #ffdad6;
  --color-on-error: #ffffff;

  /* Tipografia */
  --font-headline: 'Manrope', sans-serif;
  --font-body: 'Inter', sans-serif;

  /* Bordas */
  --radius-sm: 0.25rem;   /* botões */
  --radius-md: 0.375rem;  /* inputs */
}
```
