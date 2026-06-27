export type ButtonVariant = 'primary' | 'secondary' | 'danger'
export type ButtonAppearance = 'filled' | 'outline' | 'ghost'
export type ButtonSize = 'giant' | 'large' | 'medium' | 'small' | 'tiny'

export type ButtonProps = {
  variant?: ButtonVariant
  appearance?: ButtonAppearance
  size?: ButtonSize
  disabled?: boolean
}
