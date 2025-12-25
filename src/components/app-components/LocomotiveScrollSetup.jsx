'use client'

import { useEffect } from 'react'

export default function LocomotiveScrollSetup() {
  useEffect(() => {
    ;(async () => {
      const LocomotiveScroll = (await import('locomotive-scroll')).default
      const locomotiveScroll = new LocomotiveScroll()
    })()
  }, [])
  return
}
