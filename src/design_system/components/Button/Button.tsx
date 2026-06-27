// ============================================================
// Button.tsx
// ⚛️  REACT WEB — chỉ dùng cho React web
// ============================================================

import clsx from 'clsx'
import type { CSSProperties } from 'react'
import styles from './button.module.css'
import type { ButtonBaseProps } from './button.types'

type ButtonProps = ButtonBaseProps & {
  /** HTML button type. Default: 'button' */
  type?:      'button' | 'submit' | 'reset'
  onClick?:   () => void
  className?: string
  style?:     CSSProperties
}

export function Button({
  variant   = 'filled',
  size      = 'medium',
  disabled  = false,
  loading   = false,
  leftIcon,
  rightIcon,
  children,
  onClick,
  type      = 'button',
  className,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={clsx(
        styles.btn,
        styles[variant],
        styles[size],
        loading && styles.loading,
        className,
      )}
      style={style}
      aria-disabled={isDisabled}
      aria-busy={loading}
    >
      {loading
        ? <span className={styles.spinner} aria-hidden="true" />
        : leftIcon
      }

      {children}

      {!loading && rightIcon}
    </button>
  )
}
