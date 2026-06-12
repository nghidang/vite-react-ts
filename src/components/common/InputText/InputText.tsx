import { useRef, useState, type ChangeEvent, type InputHTMLAttributes } from 'react'
import './InputText.css'

type InputTextProps = InputHTMLAttributes<HTMLInputElement> & {
  clearable?: boolean
  onClear?: () => void
}

export function InputText({ clearable = false, onClear, onChange, ...props }: InputTextProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const isControlled = props.value !== undefined
  const [hasText, setHasText] = useState(String(props.value ?? props.defaultValue ?? '').length > 0)

  const showClear = clearable && (isControlled ? String(props.value ?? '').length > 0 : hasText)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setHasText(e.target.value.length > 0)
    onChange?.(e)
  }

  const handleClear = () => {
    const input = inputRef.current
    if (!input) return

    // Set value qua native setter rồi dispatch 'input' để React onChange (controlled) nhận được.
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
    setter?.call(input, '')
    input.dispatchEvent(new Event('input', { bubbles: true }))

    if (!isControlled) setHasText(false)
    input.focus()
    onClear?.()
  }

  return (
    <span className="input-text">
      <input ref={inputRef} type="text" {...props} onChange={handleChange} />
      {showClear && (
        <button
          type="button"
          className="input-text__clear"
          aria-label="Clear"
          tabIndex={-1}
          onClick={handleClear}
        >
          x
        </button>
      )}
    </span>
  )
}
