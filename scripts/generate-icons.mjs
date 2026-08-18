/**
 * Deriva todos os ícones da marca de brand/logo.png — a arte original.
 *
 *   node scripts/generate-icons.mjs      (ou: npm run icons)
 *
 * O recorte do canvas morto, a reamostragem por média de área e o engrossamento
 * do traço vivem em scripts/lib/mark.mjs; o codec de PNG, em scripts/lib/png.mjs
 * (os dois são compartilhados com o gerador da capa social). Aqui fica só a
 * TABELA de destinos e a placa de fundo.
 *
 * Três grupos de saída, sempre com o wireframe do merkaba — a marca, inteira:
 *   · logo-mark-*.png  → transparente, para a marca dentro da página (fundo escuro)
 *   · favicon-* / apple-touch-icon → sobre placa preta, porque a arte é branca
 *     e desapareceria numa aba de navegador com tema claro.
 *   · icon-192 / icon-512 / icon-maskable-512 → os tamanhos que o
 *     site.webmanifest exige para o site poder ser instalado na tela inicial.
 *
 * Nos favicons pequenos entram os dois passos que salvam o traço fino: engrossar
 * antes de reduzir (`thicken`) e esticar o contraste depois (`contrast`). Sem
 * eles o traço mede meio pixel a 16px e a estrela vira um borrão cinza.
 *
 * Sem dependência externa. Reexecute sempre que o logo.png mudar.
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { clamp01, encodePng } from './lib/png.mjs'
import { loadMark, publicDir } from './lib/mark.mjs'

const mark = loadMark()

/**
 * Contraste no alpha já reduzido, o par do `thicken`. Mesmo com o traço
 * engrossado a média de área deixa muita linha em meio-tom; aqui o que ficou
 * abaixo de `lo` (respingo entre linhas) vai a zero e o que passou de `hi`
 * (linha de verdade) vai a branco. É o que abre o vão escuro entre as arestas,
 * e é o vão que faz a estrela ser lida como estrela.
 */
function contrast(rgba, lo, hi) {
  const out = Buffer.from(rgba)
  for (let i = 3; i < out.length; i += 4) {
    out[i] = Math.round(clamp01((rgba[i] / 255 - lo) / (hi - lo)) * 255)
  }
  return out
}

/* -------------------------------------------------------------------------- */
/*  PLACA DE FUNDO DO ÍCONE                                                   */
/* -------------------------------------------------------------------------- */

/**
 * A arte é branca com alpha, então sozinha ela some numa aba de tema claro. A
 * placa resolve isso — e preto/branco puros dão o par de contraste máximo
 * possível, que é o que a estrela precisa a 16px.
 *
 *   'black' → placa #000000 (o mesmo preto do site), arte forçada a branco puro.
 *   'white' → placa branca, arte forçada a preto.
 *
 * `ink` recolore a arte mantendo o alpha, e nos dois temas vale a pena: o branco
 * do original oscila entre 239 e 255, então forçar 255 devolve o pouco de brilho
 * que falta na linha. Toda a forma vive no alpha; o RGB não carrega nada.
 *
 * O padrão é 'black'. Para gerar a outra sem editar nada:
 * `ICON_THEME=white npm run icons`.
 */
const ICON_THEME = process.env.ICON_THEME ?? 'black'

const THEMES = {
  black: { plate: [0x00, 0x00, 0x00], ink: [0xff, 0xff, 0xff] },
  white: { plate: [0xff, 0xff, 0xff], ink: [0, 0, 0] },
}

function sdRoundSquare(px, py, half, radius) {
  const qx = Math.abs(px - half) - (half - radius)
  const qy = Math.abs(py - half) - (half - radius)
  return Math.min(Math.max(qx, qy), 0) + Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) - radius
}

/**
 * Compõe a arte sobre a placa.
 * `bleed` = sem cantos e 100% opaco: é o que o apple-touch-icon pede, porque o
 * iOS aplica a própria máscara arredondada (um PNG já arredondado ficaria com
 * halo escuro dentro dela) — e é o que o ícone `maskable` do manifest pede, pelo
 * mesmo motivo, com a arte ainda mais recuada para caber na zona segura.
 */
function onPlate(n, art, { bleed = false, theme = ICON_THEME } = {}) {
  const out = Buffer.alloc(n * n * 4)
  const half = n / 2
  const radius = 0.22 * n
  const { plate, ink } = THEMES[theme]

  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const px = x + 0.5
      const py = y + 0.5
      const cover = bleed ? 1 : clamp01(0.5 - sdRoundSquare(px, py, half, radius))
      const o = (y * n + x) * 4
      if (cover <= 0) continue

      const color = [...plate]
      const a = art[o + 3] / 255
      // `ink` recolore a arte mantendo o alpha — é o que inverte o branco em
      // preto no tema claro, sem tocar no antialiasing nem no glow.
      for (let c = 0; c < 3; c++) color[c] += ((ink ? ink[c] : art[o + c]) - color[c]) * a

      out[o] = Math.round(clamp01(color[0] / 255) * 255)
      out[o + 1] = Math.round(clamp01(color[1] / 255) * 255)
      out[o + 2] = Math.round(clamp01(color[2] / 255) * 255)
      out[o + 3] = Math.round(cover * 255)
    }
  }
  return out
}

/* -------------------------------------------------------------------------- */

console.log(`fonte: ${mark.src.width}x${mark.src.height} · arte ${mark.bounds.w}x${mark.bounds.h}`)
console.log(`placa: ${ICON_THEME}\n`)

/**
 * `thicken` é em FRAÇÃO DE PIXEL DE SAÍDA, não em pixel de fonte: é assim que a
 * dose acompanha o tamanho do destino em vez de virar outra a cada ajuste de
 * `fill`. Quanto menor o ícone, mais engrossa e mais duro o contraste — a 180px
 * nada disso entra, lá o traço já tem corpo de sobra.
 */
const TARGETS = [
  // Marca dentro da página — transparente, sobre o fundo escuro do site. Um
  // arquivo só serve navbar, rodapé e marca d'água do Hero (132px): sobra
  // resolução até 2x em todos, e depois da primeira vez vem do cache.
  { file: 'logo-mark-256.png', size: 256, fill: 0.94 },
  // Favicons de aba — 16/32/48 são os três tamanhos que o navegador escolhe
  // conforme o DPI da tela, e o ajuste é o que iguala o peso do traço entre eles.
  { file: 'favicon-16.png', size: 16, fill: 0.9, thicken: 0.2, contrast: [0.2, 0.75], plate: true },
  { file: 'favicon-32.png', size: 32, fill: 0.9, thicken: 0.14, contrast: [0.18, 0.72], plate: true },
  { file: 'favicon-48.png', size: 48, fill: 0.9, thicken: 0.1, contrast: [0.16, 0.68], plate: true },
  // Atalho de desktop, tile do Windows e tela inicial do celular: aqui o
  // wireframe vai cru, sem engrossar nem forçar contraste.
  { file: 'favicon-180.png', size: 180, fill: 0.82, plate: true },
  { file: 'apple-touch-icon.png', size: 180, fill: 0.72, plate: true, bleed: true },
  // Ícones do site.webmanifest. 192 e 512 são os dois tamanhos que o Chrome
  // exige para oferecer a instalação; o `maskable` é o mesmo 512 com a arte
  // recuada para 62% do quadro, porque o Android recorta o ícone na forma do
  // sistema (círculo, quadrado com cantos, gota) e come as bordas.
  { file: 'icon-192.png', size: 192, fill: 0.82, plate: true },
  { file: 'icon-512.png', size: 512, fill: 0.82, plate: true },
  { file: 'icon-maskable-512.png', size: 512, fill: 0.62, plate: true, bleed: true },
]

/** Uma passada de `thicken` por raio, reaproveitada entre destinos iguais. */
const thickened = new Map()
const artFor = (t) => {
  if (!t.thicken) return mark.src.px
  const radius = Math.round((t.thicken * mark.side) / t.fill / t.size)
  if (!thickened.has(radius)) thickened.set(radius, mark.thicken(radius))
  return thickened.get(radius)
}

for (const t of TARGETS) {
  let rgba = mark.resample(artFor(t), t.size, t.fill)
  if (t.contrast) rgba = contrast(rgba, ...t.contrast)
  if (t.plate) rgba = onPlate(t.size, rgba, { bleed: t.bleed })
  const png = encodePng(t.size, t.size, rgba)
  writeFileSync(join(publicDir, t.file), png)
  console.log(`${t.file.padEnd(24)} ${String(t.size).padStart(3)}px  ${(png.length / 1024).toFixed(1)} kB`)
}
