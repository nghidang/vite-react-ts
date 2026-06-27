// ============================================================
// button.types.ts
// 🔗 SHARED — dùng cho cả React và React Native
// ============================================================

import type { ReactNode } from 'react'

export type ButtonVariant = 'filled' | 'outline' | 'clear'

export type ButtonSize = 'giant' | 'large' | 'medium' | 'small' | 'tiny'

/**
 * Props chung — không có API platform-specific.
 * React và React Native đều extend từ đây.
 */
export type ButtonBaseProps = {
  variant?:   ButtonVariant
  size?:      ButtonSize
  disabled?:  boolean
  loading?:   boolean
  leftIcon?:  ReactNode
  rightIcon?: ReactNode
  children:   ReactNode
}
