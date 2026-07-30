import { useEffect, useRef, useState } from 'react'

/**
 * Progresso (0→1) da travessia do elemento pelo viewport.
 * Usado pela timeline do processo para preencher a linha conforme o scroll.
 */
export function useScrollProgress() {
  const ref = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let frame = 0
    const update = () => {
      const rect = el.getBoundingClientRect()
      const anchor = window.innerHeight * 0.72
      const raw = (anchor - rect.top) / rect.height
      setProgress(Math.min(Math.max(raw, 0), 1))
    }

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return { ref, progress }
}
