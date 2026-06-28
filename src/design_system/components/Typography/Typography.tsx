import clsx from 'clsx'
import styles from './typography.module.css'
import type {
  HighlightProps,
  LinkProps,
  TypographyProps,
  TypographyVariant,
} from './typography.types'

// ── Default HTML tag per variant ─────────────────────────────────
function getDefaultTag(variant: TypographyVariant): keyof JSX.IntrinsicElements {
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
    case 'subtitle':
      return 'h6'
    case 'label':
      return 'label'
    default:
      return 'p'
  }
}

// ================================================================
//  Typography
// ================================================================
export function Typography({ variant = 'body', as, children, className, style }: TypographyProps) {
  const Component = as ?? getDefaultTag(variant)

  return (
    <Component className={clsx(styles.base, styles[variant], className)} style={style}>
      {children}
    </Component>
  )
}

// ================================================================
//  Typography.Highlight — inline emphasis
//
//  <Typography variant="body">
//    Please enter your <Typography.Highlight>email</Typography.Highlight> to login
//  </Typography>
// ================================================================
Typography.Highlight = function Highlight({
  children,
  color,
  bold = true,
  className,
}: HighlightProps) {
  return (
    <span
      className={clsx(styles.highlight, !bold && styles['highlight--no-bold'], className)}
      // color is dynamic — inline style is the right tool here
      style={color ? { color } : undefined}
    >
      {children}
    </span>
  )
}

// ================================================================
//  Typography.Link — inline interactive element
//
//  Two modes:
//    href    → <a>                    (navigation / tel: / mailto:)
//    onClick → <span role="button">   (custom action)
//
//  Both are keyboard accessible. Focus ring via :focus-visible CSS.
//
//  <Typography variant="body">
//    Call <Typography.Link onClick={() => openDialer()}>098xxxxxx</Typography.Link> to contact us
//  </Typography>
// ================================================================
Typography.Link = function Link({
  children,
  href,
  onClick,
  underline = true,
  className,
}: LinkProps) {
  const cls = clsx(styles.link, !underline && styles['link--no-underline'], className)

  // ── <a> mode ──────────────────────────────────────────────────
  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    )
  }

  // ── <span role="button"> mode ──────────────────────────────────
  return (
    <span
      role="button"
      tabIndex={0}
      className={cls}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.()
      }}
    >
      {children}
    </span>
  )
}

Typography.displayName = 'Typography'
Typography.Highlight.displayName = 'Typography.Highlight'
Typography.Link.displayName = 'Typography.Link'
