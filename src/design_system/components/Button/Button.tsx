function resolveButtonStyles({ variant, appearance }) {
  return buttonStyles[variant]?.[appearance]
}

export function Button({
  variant = 'primary',
  appearance = 'filled',
  size = 'md',
  disabled,
  children,
}) {
  const styles = resolveButtonStyles({ variant, appearance })

  return (
    <button
      style={{
        backgroundColor: styles.bg,
        color: styles.color,
        borderColor: styles.border,
      }}
      className="transition"
      disabled={disabled}
    >
      {children}
    </button>
  )
}

// function getButtonClass({ variant, appearance }) {
//   const s = buttonStyles[variant][appearance];

//   return `
//     ${s.base || ""}
//     hover:${s.hover || ""}
//     active:${s.active || ""}
//   `;
// }

// export function Button(props) {
//   const { variant = 'primary', appearance = 'filled' } = props

//   const className = getButtonClass({ variant, appearance })

//   return <button className={className}>{props.children}</button>
// }
