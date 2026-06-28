// ============================================================
// button.types.ts
// 🔗 SHARED — dùng cho cả React và React Native
// ============================================================

import type { ReactNode } from 'react'

export type ButtonSize = 'giant' | 'large' | 'medium' | 'small' | 'tiny'

/** Visual structure của button */
export type ButtonAppearance = 'filled' | 'outline' | 'clear'

/** Color scheme của button */
export type ButtonVariant = 'primary' | 'danger' | 'success'

export type ButtonBaseProps = {
  appearance?: ButtonAppearance
  variant?:    ButtonVariant
  size?:       ButtonSize
  disabled?:   boolean
  loading?:    boolean
  leftIcon?:   ReactNode
  rightIcon?:  ReactNode
  children:    ReactNode
}
