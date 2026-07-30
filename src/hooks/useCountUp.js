import { useLayoutEffect, useRef } from 'react'

const easeOut = (t) => 1 - Math.pow(1 - t, 3)

/**
 * Contador que anima de 0 até `target` na primeira vez que entra no viewport.
 *
 * Escreve direto no textContent do elemento em vez de usar estado do React:
 * a animação roda a 60 fps e um setState por quadro provocaria dezenas de
 * re-renderizações por segundo — aqui o React não é envolvido no loop.
 *
 * Retorna a ref que deve ser aplicada ao elemento de texto.
 */
export function useCountUp(target, { prefix = '', suffix = '', duration = 1600 } = {}) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const write = (value) => {
      el.textContent = `${prefix}${Math.round(value)}${suffix}`
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      write(target)
      return
    }

    // useLayoutEffect: o zero é escrito antes da pintura, sem piscar o valor final
    write(0)

    let frame = 0
    let start = 0

    const tick = (now) => {
      if (!start) start = now
      const progress = Math.min((now - start) / duration, 1)
      write(target * easeOut(progress))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )

    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [target, prefix, suffix, duration])

  return ref
}
