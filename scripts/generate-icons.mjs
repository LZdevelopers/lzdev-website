/**
 * Deriva todos os ícones da marca de public/logo.png — a arte original.
 *
 *   node scripts/generate-icons.mjs      (ou: npm run icons)
 *
 * O logo.png vem num canvas 1536x1024 com ~300px de vazio de cada lado. Um
 * navegador encaixando esse 3:2 num slot quadrado de favicon comprime a arte
 * na horizontal — é essa a distorção que este script elimina: recorta o canvas
 * morto, centra a arte num quadrado (SEM esticar, a arte é 934x980) e reamostra
 * por média de área para cada tamanho de destino.
 *
 * Dois grupos de saída, sempre com o wireframe do merkaba — a marca, inteira:
 *   · logo-mark-*.png  → transparente, para a marca dentro da página (fundo escuro)
 *   · favicon-* / apple-touch-icon → sobre placa preta, porque a arte é branca
 *     e desapareceria numa aba de navegador com tema claro.
 *
 * Nos favicons pequenos entram os dois passos que salvam o traço fino: engrossar
 * antes de reduzir (`thicken`) e esticar o contraste depois (`contrast`). Sem
 * eles o traço mede meio pixel a 16px e a estrela vira um borrão cinza.
 *
 * Sem dependência externa: PNG montado à mão sobre o zlib do Node. Reexecute
 * sempre que o logo.png mudar.
 */
import { deflateSync, inflateSync } from 'node:zlib'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/* -------------------------------------------------------------------------- */
/*  PNG                                                                       */
/* -------------------------------------------------------------------------- */

const CRC_TABLE = (() => {
  const table = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c
  }
  return table
})()

function crc32(buf) {
  let c = -1
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ -1) >>> 0
}

function chunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([length, body, crc])
}

/** Só IHDR/IDAT/IEND: descarta de propósito o caBX (25 KB de metadado C2PA). */
function encodePng(size, rgba) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // profundidade de bits
  ihdr[9] = 6 // truecolor + alpha
  const stride = size * 4
  const raw = Buffer.alloc((stride + 1) * size)
  for (let y = 0; y < size; y++) {
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride)
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

function decodePng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('não é um PNG')
  const width = buf.readUInt32BE(16)
  const height = buf.readUInt32BE(20)
  if (buf[24] !== 8 || buf[25] !== 6) throw new Error('esperado PNG RGBA de 8 bits')
  if (buf[28] !== 0) throw new Error('PNG entrelaçado não é suportado')

  let off = 8
  const parts = []
  while (off < buf.length) {
    const len = buf.readUInt32BE(off)
    const type = buf.subarray(off + 4, off + 8).toString('latin1')
    if (type === 'IDAT') parts.push(buf.subarray(off + 8, off + 8 + len))
    off += 12 + len
    if (type === 'IEND') break
  }

  const raw = inflateSync(Buffer.concat(parts))
  const bpp = 4
  const stride = width * bpp
  const px = Buffer.alloc(width * height * bpp)

  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)]
    const line = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride)
    const cur = px.subarray(y * stride, y * stride + stride)
    const prev = y > 0 ? px.subarray((y - 1) * stride, y * stride) : Buffer.alloc(stride)
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? cur[i - bpp] : 0
      const b = prev[i]
      const c = i >= bpp ? prev[i - bpp] : 0
      let v = line[i]
      if (filter === 1) v += a
      else if (filter === 2) v += b
      else if (filter === 3) v += (a + b) >> 1
      else if (filter === 4) {
        const p = a + b - c
        const pa = Math.abs(p - a)
        const pb = Math.abs(p - b)
        const pc = Math.abs(p - c)
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c
      }
      cur[i] = v & 0xff
    }
  }
  return { width, height, px }
}

/* -------------------------------------------------------------------------- */
/*  FONTE — recorte do canvas morto                                           */
/* -------------------------------------------------------------------------- */

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')
const src = decodePng(readFileSync(join(publicDir, 'logo.png')))

/** Caixa da arte visível — o contorno do merkaba, sem o canvas vazio em volta. */
const bounds = (() => {
  let x0 = src.width, y0 = src.height, x1 = -1, y1 = -1
  for (let y = 0; y < src.height; y++) {
    for (let x = 0; x < src.width; x++) {
      if (src.px[(y * src.width + x) * 4 + 3] > 6) {
        if (x < x0) x0 = x
        if (x > x1) x1 = x
        if (y < y0) y0 = y
        if (y > y1) y1 = y
      }
    }
  }
  return { x0, y0, w: x1 - x0 + 1, h: y1 - y0 + 1 }
})()

// Quadrado centrado na arte. `side` é o MAIOR lado: a arte é 934x980, então ela
// entra inteira e sobra folga na horizontal. Nada é esticado.
const side = Math.max(bounds.w, bounds.h)
const originX = bounds.x0 + bounds.w / 2 - side / 2
const originY = bounds.y0 + bounds.h / 2 - side / 2

/**
 * Reamostra o quadrado da fonte para `n`x`n` por média de área, com alpha
 * premultiplicado — sem premultiplicar, as bordas ganham franja escura.
 * `art` é uma fonte em resolução cheia (o traço ou a silhueta) e `fill` é a
 * fração do quadro que a arte ocupa (o resto vira respiro).
 */
function resample(art, n, fill) {
  const out = Buffer.alloc(n * n * 4)
  const span = side / fill // lado da janela na fonte, maior que a arte = respiro
  const ox = originX - (span - side) / 2
  const oy = originY - (span - side) / 2
  const box = span / n

  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const bx0 = Math.floor(ox + i * box)
      const by0 = Math.floor(oy + j * box)
      const bx1 = Math.max(bx0 + 1, Math.ceil(ox + (i + 1) * box))
      const by1 = Math.max(by0 + 1, Math.ceil(oy + (j + 1) * box))

      let r = 0, g = 0, b = 0, a = 0, count = 0
      for (let y = by0; y < by1; y++) {
        for (let x = bx0; x < bx1; x++) {
          count++
          if (x < 0 || y < 0 || x >= src.width || y >= src.height) continue
          const p = (y * src.width + x) * 4
          const al = art[p + 3] / 255
          r += art[p] * al
          g += art[p + 1] * al
          b += art[p + 2] * al
          a += art[p + 3]
        }
      }

      const alpha = a / count
      const o = (j * n + i) * 4
      if (alpha > 0) {
        const un = alpha / 255
        out[o] = Math.min(255, Math.round(r / count / un))
        out[o + 1] = Math.min(255, Math.round(g / count / un))
        out[o + 2] = Math.min(255, Math.round(b / count / un))
      }
      out[o + 3] = Math.round(alpha)
    }
  }
  return out
}

/**
 * ENGROSSAR — o passo que faz o wireframe sobreviver aos tamanhos pequenos.
 *
 * O traço da marca tem ~28px de largura numa arte de 980px: cerca de 3%. A 16px
 * um pixel de saída cobre ~67px de fonte, então a linha preenche menos da metade
 * dele e a média de área devolve cinza médio — a estrela vira borrão. Dilatar o
 * traço ANTES de reduzir muda a conta: a linha passa a preencher o pixel, e o que
 * chega na placa é branco.
 *
 * Filtro de máximo separável (horizontal, depois vertical), `radius` em pixels
 * de fonte. Só o alpha importa: a arte vai para a placa recolorida por `ink`.
 */
function thicken(radius) {
  const { width: w, height: h, px } = src
  const rows = new Uint8Array(w * h)
  const grown = new Uint8Array(w * h)

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let max = 0
      const from = Math.max(0, x - radius)
      const to = Math.min(w - 1, x + radius)
      for (let i = from; i <= to; i++) {
        const v = px[(y * w + i) * 4 + 3]
        if (v > max) max = v
      }
      rows[y * w + x] = max
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let max = 0
      const from = Math.max(0, y - radius)
      const to = Math.min(h - 1, y + radius)
      for (let i = from; i <= to; i++) {
        const v = rows[i * w + x]
        if (v > max) max = v
      }
      grown[y * w + x] = max
    }
  }

  const out = Buffer.alloc(w * h * 4)
  for (let i = 0; i < w * h; i++) {
    out[i * 4] = 255
    out[i * 4 + 1] = 255
    out[i * 4 + 2] = 255
    out[i * 4 + 3] = grown[i]
  }
  return out
}

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
 *   'black' → placa #09090B (o mesmo preto do site), arte forçada a branco puro.
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
  black: { plate: [0x09, 0x09, 0x0b], ink: [0xff, 0xff, 0xff] },
  white: { plate: [0xff, 0xff, 0xff], ink: [0, 0, 0] },
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

function sdRoundSquare(px, py, half, radius) {
  const qx = Math.abs(px - half) - (half - radius)
  const qy = Math.abs(py - half) - (half - radius)
  return Math.min(Math.max(qx, qy), 0) + Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) - radius
}

/**
 * Compõe a arte sobre a placa.
 * `bleed` = sem cantos e 100% opaco: é o que o apple-touch-icon pede, porque o
 * iOS aplica a própria máscara arredondada (um PNG já arredondado ficaria com
 * halo escuro dentro dela).
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

console.log(`fonte: ${src.width}x${src.height} · arte ${bounds.w}x${bounds.h} em (${bounds.x0},${bounds.y0})`)
console.log(`quadrado: ${side}x${side} a partir de (${originX.toFixed(0)},${originY.toFixed(0)})`)
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
]

/** Uma passada de `thicken` por raio, reaproveitada entre destinos iguais. */
const thickened = new Map()
const artFor = (t) => {
  if (!t.thicken) return src.px
  const radius = Math.round((t.thicken * side) / t.fill / t.size)
  if (!thickened.has(radius)) thickened.set(radius, thicken(radius))
  return thickened.get(radius)
}

for (const t of TARGETS) {
  let rgba = resample(artFor(t), t.size, t.fill)
  if (t.contrast) rgba = contrast(rgba, ...t.contrast)
  if (t.plate) rgba = onPlate(t.size, rgba, { bleed: t.bleed })
  const png = encodePng(t.size, rgba)
  writeFileSync(join(publicDir, t.file), png)
  console.log(`${t.file.padEnd(22)} ${String(t.size).padStart(3)}px  ${(png.length / 1024).toFixed(1)} kB`)
}
