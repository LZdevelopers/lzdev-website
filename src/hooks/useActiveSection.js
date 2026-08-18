import { useEffect, useState } from 'react'

/**
 * Qual seção da página está sendo lida agora — a informação que faltava para o
 * menu dizer ONDE o visitante está, e não só para onde ele pode ir.
 *
 * A janela de leitura vai de logo abaixo da barra fixa (`offset`) até 45% da
 * altura da tela. A seção ativa é a PRIMEIRA da ordem do documento que
 * encosta nessa faixa: com duas seções curtas na tela ao mesmo tempo, ganha a
 * de cima, que é a que o olho está lendo.
 *
 * IntersectionObserver em vez de medir posição a cada quadro de rolagem: o
 * navegador só avisa quando a resposta muda, então rolar a página inteira não
 * custa um recálculo de layout por quadro.
 *
 * @param {string[]} ids ids das seções, na ordem em que aparecem na página.
 * @returns {string} id da seção ativa, ou '' quando nenhuma está na faixa.
 */
export function useActiveSection(ids, offset = 88) {
  const [active, setActive] = useState('')

  useEffect(() => {
    const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!nodes.length) return

    const visible = new Map()

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting)
        const current = nodes.find((node) => visible.get(node.id))
        setActive(current ? current.id : '')
      },
      { rootMargin: `-${offset}px 0px -55% 0px` }
    )

    for (const node of nodes) io.observe(node)
    return () => io.disconnect()
  }, [ids, offset])

  return active
}
