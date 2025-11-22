import { motion } from 'motion/react'
import { Flame } from 'lucide-react'
import { useStore } from './store'

export function Counter() {
  const count = useStore((state) => state.count)
  const increment = useStore((state) => state.increment)
  const decrement = useStore((state) => state.decrement)

  return (
    <motion.div
      className="counter"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 180, damping: 14 }}
    >
      <div className="counter-value">
        <Flame size={20} />
        <span>{count}</span>
      </div>
      <div className="counter-actions">
        <button type="button" onClick={decrement}>
          -1
        </button>
        <button type="button" onClick={increment}>
          +1
        </button>
      </div>
    </motion.div>
  )
}
