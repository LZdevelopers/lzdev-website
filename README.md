# LZdev — Website

Site institucional da LZdev, software house full stack. Página única focada em
conversão, em dez seções nesta ordem:

1. **Hero** — promessa e CTA principal
2. **Projetos** — prova de entrega
3. **Ferramentas** — a stack de trabalho
4. **O custo invisível** — o prejuízo de não ter um site profissional
5. **Diferenciais** — por que escolher a LZdev
6. **Nosso processo** — timeline de 6 etapas, do briefing à entrega
7. **Equipe** — quem escreve o código
8. **Nossos números** — métricas com contador
9. **FAQ** — accordion de objeções
10. **Fale com a gente** — formulário, WhatsApp, e-mail e redes sociais

## Stack

React 19 · Vite 7 · Tailwind CSS v4 — quatro dependências no total.

Sem biblioteca de animação, sem biblioteca de ícones, sem biblioteca de
formulário: todas as interações são CSS moderno + hooks próprios, e os ícones são
SVG inline. O resultado é um bundle pequeno e sem dependências para manter.

## Comandos

```bash
npm install      # instala dependências
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção em dist/
npm run preview  # serve o build para conferência
```

## Onde mudar as coisas

**Todo o conteúdo do site vive em `src/data/site.js`** — textos, listas, links,
projetos e FAQ. Alterar copy nunca exige tocar em JSX. As seções estão numeradas
no arquivo na mesma ordem em que aparecem na página.

### ⚠️ Antes de publicar

Os placeholders marcados com `// TODO` em `src/data/site.js` precisam ser
substituídos pelos dados reais:

| O quê | Onde |
|---|---|
| E-mail comercial | `contact.email` |
| WhatsApp da empresa | `contact.whatsapp.number` e `.display` |
| Redes sociais da empresa | `contact.socials[].href` |
| GitHub, WhatsApp e LinkedIn de cada dev | `team.members[].links` |
| URLs dos 4 projetos | `projects.items[].url` |
| Imagens dos projetos | `projects.items[].image` |
| Fotos da equipe | `team.members[].photo` |

Links vazios não geram botão morto: uma rede em `contact.socials` só aparece com
`href` preenchido, e o mesmo vale para `links.linkedin` no card do dev.

**Imagens de projeto e fotos da equipe são opcionais.** Enquanto `image` /
`photo` estiverem vazios, o card desenha o mockup em CSS (projetos) ou o avatar
de iniciais (equipe) — nada de imagem quebrada. Para usar as reais, coloque os
arquivos em `public/` e aponte o caminho (ex.: `/projetos/sprint-max.png`).

Além disso, troque o domínio `lzdev.com.br` em `index.html` (canonical, Open
Graph), `public/robots.txt` e `public/sitemap.xml`.

## Estrutura

```
src/
├─ data/site.js          fonte única de conteúdo
├─ styles/
│  ├─ index.css          tokens de design, utilities, keyframes
│  └─ hero.css           estilos exclusivos do Hero (variáveis --hero-*)
├─ hooks/                reveal, contador, scroll, progresso de scroll
├─ components/
│  ├─ primitives/        Section, Reveal, Card, Button, Counter, Icon
│  ├─ layout/            Navbar, Footer, WhatsAppFab, GridBackdrop, Logo
│  └─ sections/          uma seção por arquivo
│     └─ hero/           composição do Hero: Backdrop, Stage, Dashboard
└─ App.jsx               ordem das seções
```

### Hero

O Hero ocupa ~100vh e é montado por inteiro em JSX/CSS/SVG — nenhuma imagem.
O dashboard inclinado usa `perspective` + `rotateX/Y/Z` e escala por *container
query*: a variável `--s` (em `hero.css`) funciona como unidade, então todo o
mockup encolhe proporcionalmente de 320px ao desktop sem quebrar. Os números do
painel são decorativos e estão marcados como tal em `HeroDashboard.jsx`.

## Formulário de contato

O formulário valida no cliente e monta uma mensagem formatada que abre no
WhatsApp (`wa.me`) — sem backend. Para enviar para um endpoint no futuro, troque
o `window.open` no `onSubmit` de `src/components/sections/Contact.jsx` por um
`fetch`; a montagem da mensagem já está pronta e separada.

## Acessibilidade e movimento

O repertório de animação é deliberadamente curto: **fade, slide, hover e scroll
reveal**. Nada acompanha o cursor — não existe cursor customizado, tilt 3D nem
glow que siga o ponteiro. O brilho dos cards tem posição fixa e só transiciona a
opacidade no hover/foco (utility `card-glow` em `index.css`).

As duas animações ligadas a scroll são o reveal (`useReveal` + `[data-reveal]`) e
o preenchimento da timeline do processo (`useScrollProgress`).

Toda animação respeita `prefers-reduced-motion: reduce`, tratado num único bloco
em `src/styles/index.css`.

## Ícones

`src/components/primitives/Icon.jsx` reúne dois conjuntos: ícones de traço
desenhados à mão (`stroke`) e logos de marca preenchidos (`brand`), estes com a
geometria oficial do Simple Icons embutida — evita carregar uma biblioteca de
ícones inteira só pelos dez logos da seção de Ferramentas.
