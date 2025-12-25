import { X } from 'lucide-react'
import RippleEffect from '@/components/ui/effects/RippleEffect'

export default function CloseBtn({ onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      aria-label="Close button"
      className={`absolute top-4 right-4 transform transition-all duration-300 ${className}`}
    >
      <RippleEffect className="group relative text-text bg-text/10 hover:bg-text/20 rounded-full shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer p-2.5">
        <div className="absolute inset-0 bg-main/0 group-hover:bg-main/10 rounded-full transition-all duration-300" />

        <X size={20} className="transition-all duration-300 ease-out group-hover:rotate-90" />

        <div className="absolute inset-0 rounded-full border border-text/0 group-hover:border-text/20 transition-all duration-300" />
      </RippleEffect>
    </button>
  )
}
