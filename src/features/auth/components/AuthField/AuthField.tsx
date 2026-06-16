import type { InputHTMLAttributes } from 'react'
import type { Control, FieldPathByValue, FieldValues } from 'react-hook-form'
import { ControlledInputText } from '../../../../components/common/InputText/ControlledInputText'

type AuthFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPathByValue<T, string>
  label: string
  /** Message lỗi của field (vd: errors.username?.message); rỗng -> không hiện. */
  error?: string
} & Pick<InputHTMLAttributes<HTMLInputElement>, 'type' | 'autoComplete'>

/**
 * Một dòng field cho form auth: label + input (đã nối React Hook Form) + message lỗi.
 * `id` lấy luôn từ `name` để `htmlFor`/`id` khớp nhau, khỏi truyền thủ công ở mỗi chỗ dùng.
 */
export function AuthField<T extends FieldValues>({
  control,
  name,
  label,
  error,
  ...inputProps
}: AuthFieldProps<T>) {
  return (
    <>
      <div className="auth-field">
        <label htmlFor={name}>{label}</label>
        <ControlledInputText control={control} name={name} id={name} {...inputProps} />
      </div>
      {error && <p className="auth-error">{error}</p>}
    </>
  )
}
