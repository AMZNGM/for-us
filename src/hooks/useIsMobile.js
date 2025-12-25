import { useWindowSize } from '@/hooks/useWindowSize'

export function useIsMobile(breakpoint = 768) {
  const { width } = useWindowSize()
  return width <= breakpoint
}
