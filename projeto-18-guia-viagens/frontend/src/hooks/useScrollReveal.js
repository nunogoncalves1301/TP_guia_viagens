import { useEffect, useRef, useState } from 'react'

/**
 * useScrollReveal — hook que deteta quando um elemento entra no viewport.
 *
 * Retorna [ref, isVisible].
 * Aplica `ref` ao elemento que queres observar.
 *
 * Parâmetros:
 *   options.threshold — % do elemento visível para disparar (default: 0.15)
 *   options.once      — observar só uma vez (default: true)
 *   options.rootMargin — margem extra (default: '-60px')
 *
 * Exemplo de uso sem Framer Motion (CSS puro):
 *   const [ref, isVisible] = useScrollReveal()
 *   <div ref={ref} className={isVisible ? 'revealed' : 'hidden'}>...</div>
 *
 * Uso com classes CSS:
 *   .hidden  { opacity: 0; transform: translateY(24px); transition: all 0.5s ease; }
 *   .revealed{ opacity: 1; transform: translateY(0); }
 */
export function useScrollReveal({
  threshold = 0.15,
  once = true,
  rootMargin = '-60px',
} = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once, rootMargin])

  return [ref, isVisible]
}
