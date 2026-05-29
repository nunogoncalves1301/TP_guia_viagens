import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import styles from './AnimatedMap.module.css'

/**
 * AnimatedMap — mapa SVG com rota animada entre destinos.
 *
 * Props:
 *   destinations — array de { id, label, x, y }
 *   paths        — array de strings SVG path (ex: "M 110,160 C 220,130 280,120 310,130")
 *                  cada path liga destinations[i] a destinations[i+1]
 *   autoPlay     — anima automaticamente ao montar (default: true)
 *   width/height — dimensões do viewBox SVG
 *
 * Exemplo de uso:
 *   const destinations = [
 *     { id: 'lisbon',    label: 'Lisboa',    x: 110, y: 160 },
 *     { id: 'barcelona', label: 'Barcelona', x: 310, y: 130 },
 *     { id: 'rome',      label: 'Roma',      x: 500, y: 95  },
 *   ]
 *   const paths = [
 *     'M 110,160 C 180,140 240,120 310,130',
 *     'M 310,130 C 380,140 430,110 500,95',
 *   ]
 *   <AnimatedMap destinations={destinations} paths={paths} />
 */
export default function AnimatedMap({
  destinations = [],
  paths = [],
  autoPlay = true,
  width = 620,
  height = 260,
}) {
  const controls = useAnimation()
  const [visiblePins, setVisiblePins] = useState([])
  const [visiblePaths, setVisiblePaths] = useState([])
  const pathLengths = useRef([])

  // Calcula o comprimento de cada path para o stroke-dashoffset
  const handlePathRef = (el, index) => {
    if (el) pathLengths.current[index] = el.getTotalLength()
  }

  const animate = async () => {
    setVisiblePins([])
    setVisiblePaths([])

    for (let i = 0; i < paths.length; i++) {
      // Mostra o pin de origem (ou todos no último passo)
      setVisiblePins(prev => [...prev, i])
      await new Promise(r => setTimeout(r, 250))

      // Anima o path
      setVisiblePaths(prev => [...prev, i])
      await new Promise(r => setTimeout(r, 1400))
    }

    // Mostra o último pin (destino final)
    setVisiblePins(prev => [...prev, paths.length])
  }

  useEffect(() => {
    if (autoPlay) animate()
  }, [autoPlay])

  return (
    <div className={styles.wrapper}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={styles.svg}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Fundo oceano */}
        <rect width={width} height={height} fill="#D6EAF8" rx="8" />

        {/* Paths — linha tracejada de fundo */}
        {paths.map((d, i) => (
          <path
            key={`dashed-${i}`}
            d={d}
            fill="none"
            stroke="#185FA5"
            strokeWidth="1.5"
            strokeDasharray="6 5"
            opacity={visiblePaths.includes(i) ? 0.3 : 0}
            style={{ transition: 'opacity 0.3s' }}
          />
        ))}

        {/* Paths — linha animada principal */}
        {paths.map((d, i) => (
          <motion.path
            key={`line-${i}`}
            ref={el => handlePathRef(el, i)}
            d={d}
            fill="none"
            stroke="#185FA5"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              visiblePaths.includes(i)
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0, opacity: 0 }
            }
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          />
        ))}

        {/* Pins dos destinos */}
        {destinations.map((dest, i) => (
          <motion.g
            key={dest.id}
            transform={`translate(${dest.x}, ${dest.y})`}
            initial={{ scale: 0, opacity: 0 }}
            animate={
              visiblePins.includes(i)
                ? { scale: 1, opacity: 1 }
                : { scale: 0, opacity: 0 }
            }
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          >
            <circle r="11" fill="white" opacity="0.9" />
            <circle r="6" fill="#185FA5" />
            <text
              y="-16"
              textAnchor="middle"
              fontSize="10"
              fill="#0C447C"
              fontFamily="system-ui, sans-serif"
              fontWeight="500"
            >
              {dest.label}
            </text>
            <text
              y="-4"
              textAnchor="middle"
              fontSize="8"
              fill="#7aaac5"
              fontFamily="system-ui, sans-serif"
            >
              {i + 1}
            </text>
          </motion.g>
        ))}
      </svg>

      {/* Botões de controlo */}
      <div className={styles.controls}>
        <button className={styles.btn} onClick={animate}>
          ▶ Animar rota
        </button>
        <button
          className={`${styles.btn} ${styles.btnSecondary}`}
          onClick={() => { setVisiblePins([]); setVisiblePaths([]) }}
        >
          ↺ Reiniciar
        </button>
      </div>
    </div>
  )
}
