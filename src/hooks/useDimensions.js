import { useState, useLayoutEffect } from 'react'

export function useDimensions(ref) {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  })

  useLayoutEffect(() => {
    function measure() {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        setDimensions({
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
        })
      }
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [ref])

  return dimensions
}
