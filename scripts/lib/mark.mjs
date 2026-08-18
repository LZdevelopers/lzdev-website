/**
 * A ARTE DA MARCA como fonte de imagem: carrega brand/logo.png, descobre onde a
 * arte visível começa e termina e entrega os dois serviços que os geradores
 * usam — reamostrar um recorte quadrado dela em qualquer tamanho, e engrossar o
 * traço antes de reduzir.
 *
 * O arquivo original NÃO mora em public/: ele tem 1,1 MB, é a matriz de onde os
 * ícones saem e nenhum navegador jamais o pede. Em public/ ele era publicado
 * junto do site — mais de um megabyte no servidor de produção sem um único
 * visitante para baixá-lo.
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { decodePng } from './png.mjs'

export const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
export const publicDir = join(repoRoot, 'public')

/**
 * Carrega a arte e mede a caixa do desenho.
 *
 * O logo.png vem num canvas 1536x1024 com ~300px de vazio de cada lado. Todo o
 * resto depende de saber onde a arte realmente está: sem esse recorte, encaixar
 * o 3:2 num slot quadrado comprime o merkaba na horizontal.
 */
export function loadMark(file = join(repoRoot, 'brand', 'logo.png')) {
  const src = decodePng(readFileSync(file))

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

  // Quadrado centrado na arte. `side` é o MAIOR lado: a arte é 934x980, então
  // ela entra inteira e sobra folga na horizontal. Nada é esticado.
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
   * O traço da marca tem ~28px de largura numa arte de 980px: cerca de 3%. A
   * 16px um pixel de saída cobre ~67px de fonte, então a linha preenche menos
   * da metade dele e a média de área devolve cinza médio — a estrela vira
   * borrão. Dilatar o traço ANTES de reduzir muda a conta: a linha passa a
   * preencher o pixel, e o que chega na placa é branco.
   *
   * Filtro de máximo separável (horizontal, depois vertical), `radius` em
   * pixels de fonte. Só o alpha importa: a arte vai para a placa recolorida.
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

  return { src, bounds, side, originX, originY, resample, thicken }
}
