import type { InputHTMLAttributes } from 'react'
import {
  Controller,
  type Control,
  type FieldPathByValue,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form'
import { InputText } from './InputText'

type ControlledInputTextProps<T extends FieldValues> = {
  control: Control<T>
  // Chỉ cho phép trỏ tới field có giá trị string -> field.value tự suy ra kiểu string.
  name: FieldPathByValue<T, string>
  rules?: RegisterOptions<T, FieldPathByValue<T, string>>
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur'
>

/**
 * Cầu nối React Hook Form <-> InputText: gom phần wiring lặp lại của `Controller` về một chỗ.
 * Cố ý không truyền `field.ref` vì InputText không forwardRef (truyền vào sẽ ghi đè ref nội bộ của nó).
 */
export function ControlledInputText<T extends FieldValues>({
  control,
  name,
  rules,
  ...inputProps
}: ControlledInputTextProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <InputText
          {...inputProps}
          name={field.name}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
        />
      )}
    />
  )
}
