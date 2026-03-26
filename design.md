# MediTech — Design System

> **North Star: "Clinical Precision & Editorial Calm" / "The Clinical Curator"**
> Um design editorial de alto padrão que trata a interface como uma presença curadora — calma e autoritária. Afastamo-nos da "fadiga de dashboard" de grades densas e bordas pesadas, adotando uma estética editorial premium com assimetria intencional, espaço em branco generoso e uma sofisticada camada de off-whites.

---

## 1. Paleta de Cores

### Filosofia
A paleta segue uma filosofia **"Low-Contrast High-Finesse"**. Usamos azuis sofisticados (`#565E74`) não como preenchimento, mas como intervenções cirúrgicas de intenção contra uma paisagem de neutros atmosféricos.

### A Regra "Sem Linhas"
**Explicitamente proibido:** bordas sólidas de 1px para separar seções ou conter layouts. Design de alto padrão é sentido, não delineado. As fronteiras devem ser definidas exclusivamente por mudanças de fundo.

- **Implementação:** Uma seção `surface-container-low` (`#F0F4F7`) sobre um fundo `surface` (`#F7F9FB`) fornece toda a definição estrutural necessária.

### Tokens Principais

| Token                    | Hex                        | Uso                                                  |
|--------------------------|----------------------------|------------------------------------------------------|
| `primary`                | `#565E74`                  | CTAs, links ativos, botões                           |
| `primary-dim`            | `#4A5268`                  | Endpoint do gradiente de botão                       |
| `surface`                | `#F7F9FB`                  | Canvas principal / fundo de página                   |
| `surface-container-low`  | `#F0F4F7`                  | Seções secundárias, sidebars, contrastes de seção    |
| `surface-container-lowest` | `#FFFFFF`                | Cards, módulos de entrada de dados elevados          |
| `on-surface`             | `#2A3439`                  | Títulos / texto principal (nunca preto puro)         |
| `on-surface-variant`     | `#566166`                  | Texto de corpo, labels, metadata                     |
| `outline-variant`        | `rgba(169, 180, 185, 0.15)` | Ghost border — apenas a 15% de opacidade             |
| `surface-container-high` | `#E1E9EE`                  | Fill padrão de inputs                                |
| `tertiary`               | `#506076`                  | Indicadores live, pontos pulse, badges               |
| `tertiary-container`     | `#C8D8F3`                  | Fundo de badges de status                            |
| `surface-dim`            | `#CFDCE3`                  | Estados desabilitados (recuado, não apenas acinzentado) |
| `primary-fixed-dim`      | `#CCD4EE`                  | Fundo de destaque / estado ativo                     |
| `error`                  | `#ba1a1a`                  | Erros e validações                                   |

### Hierarquia de Superfícies

Trate o UI como uma série de camadas físicas — como folhas empilhadas de papel fino.

| Nível                       | Hex         | Uso                                                     |
|-----------------------------|-------------|---------------------------------------------------------|
| `surface`                   | `#F7F9FB`   | Canvas / base                                           |
| `surface-container-low`     | `#F0F4F7`   | Navegação secundária, seções de contraste               |
| `surface-container-lowest`  | `#FFFFFF`   | Cards de dados primários, formulários — "elevação pela pureza" |

---

## 2. Tipografia

Utilizamos **Manrope** pela sua precisão geométrica e **Inter** pela sua clareza técnica em labels.

| Estilo         | Família    | Tamanho    | Peso   | Cor / token            |
|----------------|------------|------------|--------|------------------------|
| Display / H1   | Manrope    | `3.5rem`   | 300–800 | `on-surface` (#2A3439) |
| Headline / H2  | Manrope    | `2–2.4rem` | 700–800 | `on-surface` (#2A3439) |
| Body           | Manrope    | `0.875rem` | 400    | `on-surface` (#2A3439) |
| Label / Meta   | Inter      | `0.75rem`  | 400–600 | `on-surface-variant` (#566166) |

- Tracking recomendado para display: `-0.02em`
- Interação entre tamanhos `display` grandes e `label` compactos cria "dynamic range" que sinaliza qualidade premium.

---

## 3. Elevação e Profundidade

A hierarquia é atingida por **Camadas Tonais**, não por linhas estruturais.

- **Sombras Ambiente:** Para elementos flutuantes (modais/popovers), use blur de 40px a 6% de opacidade. A cor da sombra deve ser `on-surface` (`#2A3439`) para simular luz natural.
- **Ghost Border (fallback):** Se uma borda for essencial para acessibilidade, use `outline-variant` (`rgba(169,180,185,0.15)`) — nunca 100% opaco.
- **Glassmorphism:** Para navegação global ou overlays, use `surface` (`#F7F9FB`) a 80% de opacidade com `backdrop-filter: blur(24px)`.

---

## 4. Componentes

### Botões

| Variante    | Estilo                                                                 | Border-radius |
|-------------|------------------------------------------------------------------------|---------------|
| Primário    | Gradiente `#565E74 → #4A5268` a 135°                                   | `0.375rem`    |
| Secundário  | Sem fundo; ghost border `outline-variant` a 15%; texto `on-surface`    | `0.375rem`    |
| Terciário   | Apenas texto na cor `primary`                                           | —             |

### Cards

- **Proibido:** linhas divisórias. Use espaço vertical para separar itens.
- **Estilo:** `surface-container-lowest` (#FFFFFF), `border-radius: 0.75rem`, sem borda. O contraste com o fundo `surface-container` cria a "elevação".

### Inputs

- **Padrão:** fill `surface-container-high` (`#E1E9EE`)
- **Foco:** ghost border de 1px na cor `primary` a 30% de opacidade + bloom externo de 4px na mesma cor

### Badge "Biometric Pulse"

Indicador de status especializado: fundo `tertiary-container` (`#C8D8F3`), ponto animado na cor `tertiary` (`#506076`) para sinalizar streaming de dados ao vivo.

---

## 5. Espaçamento e Ritmo

Layouts seguem um **"Breathing Grid"**. Use `Spacing 20` (7rem) ou `Spacing 24` (8.5rem) para grandes transições de seção. O uso "generoso" de espaço é um sinal de luxo e precisão.

---

## 6. Regras Gerais

### Fazer
- Margens assimétricas intencionais (ex.: margem esquerda mais larga no título vs. padrão no corpo)
- `surface-dim` (`#CFDCE3`) para estados desabilitados — parecem "recuados", não apenas acinzentados
- `primary-fixed-dim` (`#CCD4EE`) para fundos de destaque em estados ativos

### Não Fazer
- **Nunca** usar preto puro (`#000000`) — sempre `on-surface` (`#2A3439`)
- **Nunca** usar bordas 100% opacas para separar seções
- **Nunca** usar cantos retos — escala mínima `md` (`0.375rem`) a `xl` (`0.75rem`)

---

## 7. Variáveis CSS (base.css)

Todos os tokens são definidos como variáveis CSS no `base.css`:

```css
:root {
    --color-primary:            #565E74;
    --color-primary-dim:        #4A5268;
    --color-surface:            #F7F9FB;
    --color-surface-low:        #F0F4F7;
    --color-surface-lowest:     #FFFFFF;
    --color-surface-container:  #edeeef;
    --color-surface-high:       #E1E9EE;
    --color-on-surface:         #2A3439;
    --color-on-surface-variant: #566166;
    --color-outline-variant:    rgba(169, 180, 185, 0.15);
    --color-tertiary:           #506076;
    --color-tertiary-container: #C8D8F3;
    --color-surface-dim:        #CFDCE3;
    --color-primary-fixed-dim:  #CCD4EE;
    --color-error:              #ba1a1a;
    --font-headline:            'Manrope', sans-serif;
    --font-body:                'Inter', sans-serif;
}
```
