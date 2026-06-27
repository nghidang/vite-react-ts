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
  variant?: TypographyVariant
  as?: React.ElementType
  children: React.ReactNode
  className?: string
}
