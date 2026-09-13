import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'outline-light' | 'ghost'
type Shape = 'pill' | 'rounded'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  shape?: Shape
  size?: Size
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-ink text-paper hover:bg-ink-soft disabled:bg-ink/40 disabled:cursor-not-allowed',
  secondary:
    'bg-white text-ink border border-line hover:border-ink/30 hover:bg-mist/60',
  'outline-light':
    'bg-transparent text-paper border border-paper/30 hover:bg-paper/10',
  ghost: 'bg-transparent text-ink hover:bg-ink/5',
}

const shapeClasses: Record<Shape, string> = {
  pill: 'rounded-full',
  rounded: 'rounded-xl',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-5 py-3 text-[15px] gap-2',
  lg: 'px-7 py-3.5 text-base gap-2',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      shape = 'rounded',
      size = 'md',
      icon,
      iconPosition = 'right',
      className = '',
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center font-medium whitespace-nowrap transition-colors duration-150 ${variantClasses[variant]} ${shapeClasses[shape]} ${sizeClasses[size]} ${className}`}
        {...rest}
      >
        {icon && iconPosition === 'left' ? icon : null}
        {children}
        {icon && iconPosition === 'right' ? icon : null}
      </button>
    )
  },
)

Button.displayName = 'Button'
