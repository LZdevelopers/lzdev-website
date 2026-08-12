import { useEffect, useState } from 'react'

/**
 * Quanto da PÁGINA inteira já foi percorrido (0→1).
 *
 * Diferente de `useScrollProgress`, que mede a travessia de um elemento pelo
 * viewport. Aqui o alvo é o documento, para a barra fina do topo da navbar.
 *
 * A leitura acontece dentro de um rAF: o handler de scroll só agenda, então
 * `scrollHeight` (que força layout) é lido no máximo uma vez por quadro.
 */
export function usePageProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setProgress(scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0)
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return progress
}
