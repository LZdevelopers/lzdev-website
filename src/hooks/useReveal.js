import { useEffect } from 'react'

/**
 * Observa todos os elementos [data-reveal] do documento e adiciona
 * `.is-visible` quando entram no viewport. Um único observer serve a
 * página inteira — nós que aparecem depois (acordeões, resultados) são
 * capturados por um MutationObserver.
 */
export function useReveal() {
  useEffect(() => {
    /* Sem IntersectionObserver não há como saber o que entrou na tela — e o
       conteúdo NÃO pode ficar preso em opacity: 0 por causa disso. Aqui ele
       aparece todo de uma vez, sem animação, que é o mesmo destino de quem
       pediu movimento reduzido. */
    if (typeof IntersectionObserver === 'undefined') {
      for (const el of document.querySelectorAll('[data-reveal]')) el.classList.add('is-visible')
      return
    }

    const nodes = new WeakSet()

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          io.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    )

    const scan = () => {
      for (const el of document.querySelectorAll('[data-reveal]:not(.is-visible)')) {
        if (nodes.has(el)) continue
        nodes.add(el)
        io.observe(el)
      }
    }

    scan()

    // Qualquer re-render do React dispara mutações (digitar no formulário, por
    // exemplo). Duas defesas, e as duas importam para a resposta ao toque:
    //
    //   · só mutação que ADICIONA elemento pode trazer um [data-reveal] novo.
    //     Digitar num campo troca texto, não estrutura — e antes disso varria o
    //     documento inteiro a cada tecla, no meio da digitação;
    //   · o que sobra é coalescido num único rAF, então dez mutações no mesmo
    //     quadro custam uma varredura.
    let queued = 0
    const addedElements = (records) =>
      records.some((record) => {
        for (const node of record.addedNodes) if (node.nodeType === 1) return true
        return false
      })

    const mo = new MutationObserver((records) => {
      if (queued || !addedElements(records)) return
      queued = requestAnimationFrame(() => {
        queued = 0
        scan()
      })
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
      cancelAnimationFrame(queued)
    }
  }, [])
}
