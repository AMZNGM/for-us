'use client'

import { motion } from 'framer-motion'
import { useMouseMotion } from '@/hooks/useMouseMotion'
import { useIsMobile } from '@/hooks/useIsMobile'

export default function CustomCursor() {
  const { x, y } = useMouseMotion({ current: null }, { springConfig: { stiffness: 150, damping: 20 } })
  const { x: x2, y: y2 } = useMouseMotion({ current: null }, { springConfig: { stiffness: 300, damping: 40 } })

  const isMobile = useIsMobile()
  if (isMobile) return

  return (
    <div className="flex justify-center items-center">
      <motion.div
        style={{
          x: x,
          y: y,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="w-2 h-2 fixed top-0 left-0 rounded-full bg-main pointer-events-none z-9999"
      />
      <motion.div
        style={{
          x: x2,
          y: y2,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="w-8 h-8 fixed top-0 left-0 rounded-full border border-main pointer-events-none z-9999"
      />
    </div>
  )
}
