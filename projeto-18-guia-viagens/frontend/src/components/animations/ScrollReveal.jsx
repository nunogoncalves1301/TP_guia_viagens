import { motion } from 'framer-motion'

// Variante padrão: fade + subida
const defaultVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
}

/**
 * ScrollReveal — anima os filhos quando entram no viewport.
 *
 * Props:
 *   children    — conteúdo a animar
 *   delay       — atraso em segundos (default: 0)
 *   duration    — duração em segundos (default: 0.5)
 *   variants    — variantes personalizadas (opcional)
 *   className   — classe CSS extra (opcional)
 *   once        — anima só uma vez (default: true)
 *
 * Uso básico:
 *   <ScrollReveal><DestinationCard ... /></ScrollReveal>
 *
 * Com stagger em lista:
 *   {destinations.map((d, i) => (
 *     <ScrollReveal key={d.id} delay={i * 0.1}>
 *       <DestinationCard {...d} />
 *     </ScrollReveal>
 *   ))}
 */
export default function ScrollReveal({
  children,
  delay = 0,
  duration = 0.5,
  variants = defaultVariants,
  className = '',
  once = true,
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-60px' }}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
