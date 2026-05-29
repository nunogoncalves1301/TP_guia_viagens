import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

// Variantes de animação — podes trocar por outras (ver comentários abaixo)
const variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -16 },
}

// Alternativa "slide horizontal":
// const variants = {
//   initial: { opacity: 0, x: 60 },
//   animate: { opacity: 1, x: 0 },
//   exit:    { opacity: 0, x: -60 },
// }

export default function PageTransition({ children }) {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
