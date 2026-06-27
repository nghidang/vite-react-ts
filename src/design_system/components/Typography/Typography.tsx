import clsx from 'clsx'
import styles from './typography.module.css'
import type { TypographyProps, TypographyVariant } from './typography.types'

function getDefaultTag(variant: TypographyVariant) {
  switch (variant) {
    case 'h1':
      return 'h1'
    case 'h2':
      return 'h2'
    case 'h3':
      return 'h3'
    case 'h4':
      return 'h4'
    case 'h5':
      return 'h5'
    case 'label':
      return 'label'
    default:
      return 'p'
  }
}

export function Typography({ variant = 'body', as, children, className }: TypographyProps) {
  const Component = as || getDefaultTag(variant)

  return <Component className={clsx(styles.base, styles[variant], className)}>{children}</Component>
}

Typography.Highlight = function Highlight({ children }: { children: React.ReactNode }) {
  return <span className={styles.highlight}>{children}</span>
}

Typography.Link = function Link({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <span className={styles.link} onClick={onClick}>
      {children}
    </span>
  )
}
