# LZdev — Website

Site institucional da LZdev: desenvolvimento de sites, landing pages e sistemas
web sob medida. Página única focada em conversão, em dez seções nesta ordem:

1. **Hero** — o que fazemos, em uma frase, e o CTA principal
2. **Serviços** — o que se contrata: o que é, para quem é e o que entra
3. **Projetos** — prova de entrega
4. **Tecnologias** — a stack de trabalho
5. **O custo invisível** — o prejuízo de não ter um site profissional
6. **Diferenciais** — por que escolher a LZdev
7. **Equipe** — quem escreve o código
8. **Nossos números** — métricas com contador
9. **FAQ** — accordion de objeções
10. **Fale com a gente** — formulário, WhatsApp, e-mail e redes sociais

## Stack

React 19 · Vite 7 · Tailwind CSS v4 — quatro dependências no total.

Sem biblioteca de animação, sem biblioteca de ícones, sem biblioteca de
formulário e sem roteador: todas as interações são CSS moderno + hooks próprios,
e os ícones são SVG inline. O resultado é um bundle pequeno e sem dependências
para manter.

## Comandos

```bash
npm install      # instala dependências
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção em dist/ (inclui SEO + prerender)
npm run preview  # serve o build para conferência
npm run check    # revisão automática do build (links, headings, alt, SEO)

npm run seo      # reescreve o <head>, robots.txt, sitemap.xml e o manifest
npm run icons    # regera os ícones da marca a partir de brand/logo.png
npm run og       # regera a imagem de compartilhamento (og-cover.png)
npm run fonts    # copia as fontes de node_modules para public/fonts
npm run assets   # icons + og + fonts de uma vez
```

### O que o `npm run build` faz

```
npm run seo                     grava as meta tags, robots.txt, sitemap e manifest
vite build                      o bundle do site em dist/
vite build --ssr entry-server   um bundle de servidor em dist-ssr/ (temporário)
node scripts/prerender.mjs      renderiza a página dentro de dist/index.html
```

O último passo é o que importa mais para o Google e para as redes sociais: sem
ele, o HTML publicado é literalmente `<div id="root"></div>`. O Google executa
JavaScript e acabaria vendo o conteúdo, mas o rastreador do WhatsApp, do
LinkedIn, do Facebook, do Discord e a maioria dos rastreadores de IA **não
executam JavaScript** — para eles a página não teria um parágrafo, e os dados
estruturados não existiriam. Depois do prerender o HTML sai do build com a página
inteira dentro, e o React apenas hidrata o que já está na tela (`src/main.jsx`).

Rode `npm run check` depois do build: ele lê `dist/` e reclama de âncora que não
existe, link sem destino, imagem sem `alt`, heading pulando nível, `title`
comprido, JSON-LD inválido, sitemap de outro domínio e `og:image` que não foi
publicada. Sai com código 1 só em erro de verdade — serve como etapa de CI.

## Onde mudar as coisas

**O conteúdo do site vive em `src/data/site.js`** — textos, listas, links,
serviços, projetos e FAQ. Alterar copy nunca exige tocar em JSX. As seções estão
numeradas no arquivo na mesma ordem em que aparecem na página.

**Os metadados vivem em `src/data/seo.js`** — domínio, `title`, `description`,
Open Graph e a lista de URLs do sitemap. Nenhum outro arquivo-fonte repete o
domínio: `npm run seo` propaga o valor para o `<head>` do `index.html`, para o
`robots.txt`, para o `sitemap.xml` e para o `site.webmanifest`, e o JSON-LD lê o
mesmo arquivo em tempo de render. **Trocar de domínio é editar uma linha.**

O bloco do `index.html` entre `<!-- SEO:START -->` e `<!-- SEO:END -->` é
gerado. Editar ali funciona até o próximo build.

### Serviços — a lista é contrato

`services` em `src/data/site.js` alimenta ao mesmo tempo os cards da seção
Serviços e os nós `Service` do JSON-LD. **O schema espelha a tela**: anunciar ao
Google um serviço que a página não mostra é marcação enganosa e custa a
elegibilidade a resultados enriquecidos do site inteiro. Serviço novo entra ali
primeiro.

Por isso `SaaS`, `automações` e `APIs` saíram do `title` e do JSON-LD: estavam
anunciados no HTML antigo e nenhuma seção do site os sustentava. E pelo mesmo
motivo os nós `Service` não têm `offers` — o preço saiu dos cards, então saiu
também do schema.

### Sem preço e sem prazo — e existe uma trava

Cada card de Serviços tinha um pé com "A partir de R$ 1.800" e "cerca de 1
semana". Os dois saíram por decisão da LZdev: valor e cronograma sem escopo
definido são chute, e chute publicado vira âncora contra a própria proposta (o
visitante decide por um número antes de saber o que está comprando) e promessa
que alguém cobra depois. Os dois voltam na conversa, onde existe escopo para
sustentá-los.

Isso é **regra do site, não preferência de quem escreveu o texto**:
`npm run check` varre o HTML publicado e **reprova o build** se um preço
(`R$ …`, "… reais") ou um prazo ("em 7 dias", "2 a 3 semanas") reaparecer em
qualquer lugar da página — inclusive vindo de outro arquivo, de uma tradução ou
de um CMS. Os números do painel do Hero não contam: ele é um `role="img"` e a
varredura o ignora inteiro.

### Contatos do time

E-mail, WhatsApp, GitHub e Instagram dos dois desenvolvedores saem dos objetos
`enzo` e `luis`, no topo de `src/data/site.js`. **Trocar o link ali atualiza o
site inteiro** — cartão da pessoa na Equipe, redes da seção de contato, canais
diretos, botão flutuante e o JSON-LD — porque nenhum desses lugares repete a URL.

O primeiro item de `contact.whatsapps` é o canal principal: é dele que saem o
botão flutuante e o envio do formulário, que precisam de um destino só.

### ⚠️ Antes de publicar

O que ainda está marcado com `// FALTA` em `src/data/site.js`:

| O quê | Onde |
|---|---|
| URLs dos projetos ainda não hospedados (Sprint Max, Kimori, Horário de Brasília) | `projects.items[].url` |
| Imagens dos projetos | `projects.items[].image` |
| Fotos da equipe | `team.members[].photo` |
| LinkedIn de cada dev | `enzo.linkedin` / `luis.linkedin` |
| Perfis próprios da LZdev (hoje o site usa os pessoais) | `contact.socials` |
| Stack e descrição confirmadas do Tio Preto Barbearia | `projects.items[3]` |

Sem confirmação de ninguém, também seguem no ar os números de `stats`
(30+ projetos, 20+ clientes, 10+ tecnologias e 100% de satisfação). `npm run check`
avisa sobre eles a cada build, sem travar o trabalho de ninguém.

**Link vazio nunca gera botão morto.** Uma rede em `contact.socials` só aparece
com `href` preenchido; um projeto sem `url` mostra o selo "Publicação em breve"
em vez de um botão que não abre nada. Imagens são opcionais pelo mesmo motivo:
enquanto `image` / `photo` estiverem vazios, o card desenha a moldura de espera
(projetos) ou o avatar de iniciais (equipe) — nunca uma imagem quebrada.

### Google Search Console

1. Search Console → Adicionar propriedade → **prefixo de URL** → `https://lzdev.com.br`
2. Escolha "Tag HTML" e copie **apenas** o valor do atributo `content`
3. Cole em `googleSiteVerification` em `src/data/seo.js` e rode `npm run seo`
4. Publique, valide no Search Console e envie `https://lzdev.com.br/sitemap.xml`

Enquanto o valor for `null`, o `<head>` sai com um comentário no lugar da tag.
**Nunca preencha com um valor inventado** — uma tag falsa não valida nada.

## Publicação

O site é estático: sirva `dist/` em qualquer host. Dois detalhes de configuração
que mudam o comportamento do Google:

- **`404.html`** — Netlify, Vercel, GitHub Pages, Cloudflare Pages e Nginx
  (`error_page 404 /404.html;`) usam esse arquivo automaticamente. Ele é um HTML
  solto, com CSS embutido: funciona sem o bundle, que muda de nome a cada build.
- **NÃO configure reescrita de SPA** (`/* → /index.html`). Este site não tem
  roteador: com a reescrita, qualquer endereço errado devolveria a home com
  status 200, e o Google trataria isso como *soft 404* — página inexistente
  indexada como conteúdo. Sem a reescrita, o host devolve 404 de verdade e a
  página de erro aparece.

## Estrutura

```
brand/logo.png           arte original da marca (fonte dos ícones, NÃO publicada)
public/
├─ 404.html              página de erro, com CSS embutido (não depende do bundle)
├─ fonts/                as duas famílias em .woff2 (subconjunto latino)
├─ diferenciais/         as ilustrações SVG da seção Diferenciais
├─ marcas/               logo que não cabe em SVG inline (Composer)
└─ …                     ícones, og-cover.png, robots.txt, sitemap.xml e o
                         manifest — todos GERADOS, não edite à mão
scripts/
├─ lib/png.mjs           codec de PNG sem dependências
├─ lib/mark.mjs          recorte e reamostragem da arte da marca
├─ generate-icons.mjs    favicons, apple-touch-icon e ícones do manifest
├─ generate-og.mjs       public/og-cover.png (1200x630)
├─ generate-seo.mjs      <head>, robots.txt, sitemap.xml, site.webmanifest
├─ copy-fonts.mjs        as duas fontes latinas para public/fonts
├─ prerender.mjs         injeta o HTML renderizado em dist/index.html
└─ check-seo.mjs         revisão automática do build
src/
├─ data/
│  ├─ site.js            fonte única de conteúdo
│  └─ seo.js             fonte única de metadados e do domínio
├─ styles/
│  ├─ fonts.css          @font-face das duas famílias (subconjunto latino)
│  ├─ index.css          tokens de design, utilities, keyframes
│  ├─ hero.css           estilos exclusivos do Hero (variáveis --hero-*)
│  └─ team.css           fundo discreto da seção Equipe
├─ hooks/                reveal, contador, scroll, seção ativa, altura da barra
├─ components/
│  ├─ primitives/        Section, Reveal, Card, Button, Counter, Carousel, Icon
│  ├─ layout/            Navbar, Footer, WhatsAppFab, GridBackdrop, Logo, StructuredData
│  └─ sections/          uma seção por arquivo
│     └─ hero/           composição do Hero: Backdrop, Stage, Dashboard
├─ App.jsx               ordem das seções
├─ main.jsx              hidrata (produção) ou monta (dev)
└─ entry-server.jsx      entrada usada só pelo prerender
```

### Ícones da marca

`brand/logo.png` é a arte original e a **única fonte** dos ícones. Ela fica fora
de `public/` de propósito: tem 1,1 MB, nenhum navegador jamais a pede e em
`public/` ela era publicada junto do site.

A arte vem num canvas 3:2 com ~300px de vazio de cada lado — usá-la direto em
qualquer slot quadrado distorce a marca. `npm run icons` recorta o canvas morto,
centra a arte num quadrado (sem esticar) e reamostra para cada destino:

- `logo-mark-256.png` — transparente, usado pelo `<Logo />` na página
- `favicon-16/32/48/180.png` e `apple-touch-icon.png` — sobre placa **preta**
  (`#000000`) com a estrela em branco, porque a arte nasce branca e sozinha
  desapareceria numa aba de tema claro
- `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` — os tamanhos que o
  `site.webmanifest` exige para o site poder ser instalado na tela inicial

A marca é um merkaba em wireframe e é ela que vai em **todos** os tamanhos. O
problema é o traço: ~3% da largura do símbolo, ou seja meio pixel a 16px, que a
média de área devolve em cinza médio. Nos tamanhos de aba (16/32/48) o script
compensa em dois passos — engrossa o traço na arte em resolução cheia (filtro de
máximo) *antes* de reduzir, e estica o contraste do alpha *depois*, para a linha
chegar branca e o vão entre as arestas ficar preto. A dose é por tamanho e vive na
tabela `TARGETS`. A 180px nada disso entra, lá o traço já tem corpo.
`ICON_THEME=white npm run icons` inverte a placa (branca, arte em preto).

### Imagem de compartilhamento

`public/og-cover.png` (1200×630) é gerada por `npm run og` com a linguagem visual
do site: preto puro, a malha de 72px, os halos de alfa baixo e a plataforma de luz
sob a marca. Ela **não tem texto** — rasterizar a wordmark exigiria as curvas da
Plus Jakarta Sans, que vivem comprimidas dentro do `.woff2`, e uma fonte
aproximada seria uma marca errada. As redes sociais desenham `og:title` e
`og:description` como texto ao lado da imagem.

Para uma capa desenhada com wordmark e headline, exporte 1200×630 e sobrescreva
`public/og-cover.png`: nada no código precisa mudar.

### Fontes

`src/styles/fonts.css` declara as duas famílias apontando para `public/fonts`, e
o `index.html` pré-carrega os dois arquivos. Isso substituiu
`import '@fontsource-variable/inter'`, que trazia **onze** subconjuntos por
família (cirílico, grego, vietnamita…) para um site em português e com nome de
arquivo com hash — o que impedia o preload. Os pacotes npm continuam sendo a
fonte: atualizar é `npm update` + `npm run fonts`.

## As seções por dentro

### Hero

O Hero ocupa ~100vh e é montado por inteiro em JSX/CSS/SVG — a única imagem é a
marca d'água ao fundo, a 7,5% de opacidade. O dashboard inclinado usa
`perspective` + `rotateX/Y/Z` e escala por *container query*: a variável `--s`
(em `hero.css`) funciona como unidade, então todo o mockup encolhe
proporcionalmente de 320px ao desktop sem quebrar. Os números do painel são
**decorativos** e estão marcados como tal em `HeroDashboard.jsx` — o painel
inteiro é um `role="img"` com descrição, para nenhum leitor de tela ler
"R$ 48.750,00" como se fosse dado da empresa.

O painel **responde ao visitante**: a trilha lateral troca a tela inteira (cinco
telas, cada uma com KPIs, gráfico e atividades próprios), o gráfico tem leitura
por ponto (linha guia, bolinha e balão com o valor do mês apontado) e o palco se
inclina alguns graus atrás do cursor. Nada disso é focável pelo teclado, de
propósito: dentro de um `role="img"` os elementos não existem para o leitor de
tela, e botão fora da árvore de acessibilidade não pode receber foco. Como os
dados são fictícios, nenhuma informação fica inacessível — o porquê está escrito
no cabeçalho de `HeroDashboard.jsx`.

A curva do gráfico é **calculada** a partir dos valores (Catmull-Rom convertido
em Bézier), não escrita à mão: trocar um número em `VIEWS` redesenha a linha.

### Equipe

Os cartões **não dividem áreas nem listam tecnologia** — nada de "fulano cuida do
front" ou "sicrano usa React". A seção promete que o cliente fala direto com quem
escreve o código, e separar front de back cria exatamente a pergunta que ela
existe para eliminar; a stack já é apresentada, uma vez e com descrição, na seção
Tecnologias. O que fica no cartão é quem é a pessoa, que ela acompanha o projeto
inteiro e por onde falar com ela.

O fundo da seção (`team.css`) é **textura, não desenho**: uma trama fina de
pontos que se dissolve nas bordas, uma luz de 3,5% vinda de cima e um halo largo
e quase transparente que deriva na direção do cursor, com quase um segundo de
atraso. Sem animação, sem mesclagem, sem contraste alto — esta é a seção em que
o visitante lê nomes e decide falar com alguém, e fundo que puxa o olho compete
exatamente com isso. Tudo em gradiente CSS: nenhuma imagem, nenhum canvas.

### Formulário de contato

O formulário valida no cliente e monta uma mensagem formatada que abre no
WhatsApp (`wa.me`) — sem backend. A microcópia ao lado do botão avisa isso
**antes** do clique. Para enviar para um endpoint no futuro, troque o
`window.open` no `onSubmit` de `src/components/sections/Contact.jsx` por um
`fetch`; a montagem da mensagem já está pronta e separada.

## Acessibilidade e movimento

O repertório de animação é deliberadamente curto: **fade, slide, hover e scroll
reveal**, mais a troca de tela do painel do Hero.

Três coisas acompanham o cursor — o brilho dos cards, a inclinação do painel do
Hero e o halo do fundo da Equipe — e as três seguem a mesma regra: o evento de
ponteiro escreve **duas custom properties** num elemento que já existe, e o CSS
faz o resto. Nenhuma passa por estado do React, nenhuma re-renderiza nada, nenhuma
dispara layout. Todas ignoram dedo e caneta (`pointerType !== 'mouse'`), porque em
toque o efeito ficaria congelado no último ponto tocado.

- cada `<section>` é uma **região nomeada** pelo próprio `<h2>`
  (`aria-labelledby`), então quem navega por regiões ouve "Serviços",
  "Projetos", "Equipe" em vez de "seção, seção, seção"
- o menu marca a seção que está sendo lida em **cor e traço** (nunca só cor) e
  com `aria-current`
- alvos de toque com no mínimo 24px, inclusive os pontinhos dos carrosséis
- foco visível em anel branco, o traço mais claro da tela
- toda animação respeita `prefers-reduced-motion: reduce`, num único bloco em
  `src/styles/index.css`; com movimento reduzido o painel do Hero também para de
  seguir o cursor. Abaixo de 640px os halos do fundo param de derivar, porque
  redesenhar um borrão de 34rem é trabalho permanente de GPU num celular de
  entrada

## Ícones da interface

`src/components/primitives/Icon.jsx` reúne dois conjuntos: ícones de traço
desenhados à mão (`stroke`) e logos de marca preenchidos (`brand`), estes com a
geometria oficial do Simple Icons embutida — evita carregar uma biblioteca de
ícones inteira só pelos logos da seção de Tecnologias e das redes sociais. Sem `title`, um ícone
é decorativo e sai da árvore de acessibilidade.
