import Link from 'next/link'
import { memo } from 'react'
import RippleEffect from '@/components/ui/effects/RippleEffect'

export default memo(function MainBtn({
  children,

  to,
  href,
  onClick,

  variant = 'main', // 'main', 'outline', 'ghost'
  size = 'md', // 'sm', 'md', 'lg'
  fullWidth = false,
  disabled = false,

  className = '',
  ...rest
}) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-medium uppercase border rounded-full transition-colors duration-200 outline-none'

  const variants = {
    main: 'bg-main text-bg border-main hover:bg-main/75',
    outline: 'bg-transparent text-main border-main hover:bg-main hover:text-white',
    ghost: 'bg-transparent text-main border-transparent hover:bg-main/10',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const styles = `
    ${baseStyles}
    ${variants[variant] || variants.main}
    ${sizes[size] || sizes.md}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ')

  const commonProps = {
    className: styles,
    disabled,
    ...rest,
  }

  if (to)
    return (
      <Link href={to} {...commonProps}>
        {children}
      </Link>
    )
  if (href)
    return (
      <a href={href} {...commonProps}>
        {children}
      </a>
    )

  return (
    <RippleEffect className="flex rounded-full">
      <button type="button" onClick={onClick} disabled={disabled} {...commonProps}>
        {children}
      </button>
    </RippleEffect>
  )
})
