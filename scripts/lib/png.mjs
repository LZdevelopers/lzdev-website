/**
 * Leitura e escrita de PNG sem dependência externa — só o zlib do Node.
 *
 * Vive à parte porque DOIS geradores precisam do mesmo codec: os ícones da
 * marca (scripts/generate-icons.mjs) e a capa de compartilhamento
 * (scripts/generate-og.mjs). Duplicar um decodificador de PNG em dois arquivos
 * é garantir que um dia eles divirjam.
 */
import { deflateSync, inflateSync } from 'node:zlib'

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

/**
 * Codifica RGBA de 8 bits.
 * Só IHDR/IDAT/IEND: descarta de propósito o caBX (25 KB de metadado C2PA)
 * que vem no arquivo original da marca.
 */
export function encodePng(width, height, rgba) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // profundidade de bits
  ihdr[9] = 6 // truecolor + alpha
  const stride = width * 4
  const raw = Buffer.alloc((stride + 1) * height)
  for (let y = 0; y < height; y++) {
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride)
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

export function decodePng(buf) {
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

export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
