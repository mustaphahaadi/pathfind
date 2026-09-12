import type { InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
  icon?: ReactNode
  trailing?: ReactNode
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, hint, icon, trailing, id, className = '', ...rest }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className={className}>
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-semibold text-ink"
        >
          {label}
        </label>
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-ink-soft/60">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-xl border border-line bg-white py-3 text-[15px] text-ink placeholder:text-ink-soft/50 focus:border-ink/40 focus:outline-none ${
              icon ? 'pl-10' : 'pl-4'
            } ${trailing ? 'pr-11' : 'pr-4'}`}
            {...rest}
          />
          {trailing && (
            <span className="absolute inset-y-0 right-3.5 flex items-center">
              {trailing}
            </span>
          )}
        </div>
        {hint && <p className="mt-1.5 text-xs text-ink-soft/70">{hint}</p>}
      </div>
    )
  },
)

TextField.displayName = 'TextField'
