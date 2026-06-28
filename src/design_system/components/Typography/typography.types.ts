import type { CSSProperties, ElementType, ReactNode } from 'react'

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'subtitle'
  | 'body'
  | 'body-sm'
  | 'caption'
  | 'label'
  | 'button'

export type TypographyProps = {
  variant?:   TypographyVariant
  as?:        ElementType
  children:   ReactNode
  className?: string
  style?:     CSSProperties
}

export type HighlightProps = {
  children:   ReactNode
  /** Override color. Default: var(--color-primary-500) */
  color?:     string
  /** Apply semibold weight. Default: true */
  bold?:      boolean
  className?: string
}

export type LinkProps = {
  children:    ReactNode
  /** Navigate — renders <a>. Supports tel:, mailto:, /path */
  href?:       string
  /** Custom action — renders <span role="button">. Keyboard accessible. */
  onClick?:    () => void
  /** Show underline. Default: true */
  underline?:  boolean
  className?:  string
}
