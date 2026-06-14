import { z } from 'zod'

type Translate = (key: string) => string

/**
 * Luật cho field dùng chung giữa các form auth (login, register, ...).
 * Tách riêng để mọi form dùng chung một bộ rule + message (xem `auth.validation.*`).
 *
 * Các check chạy theo thứ tự khai báo; zodResolver lấy issue đầu tiên của mỗi field,
 * nên đặt `min(1)` (bắt buộc) trước `min(3)` / `regex` để báo "required" khi để trống.
 */
const usernameField = (t: Translate) =>
  z
    .string()
    .min(1, { message: t('auth.validation.usernameRequired') })
    .min(3, { message: t('auth.validation.usernameMinLength') })
    .regex(/^[a-zA-Z0-9_]+$/, { message: t('auth.validation.usernameInvalid') })

const passwordField = (t: Translate) =>
  z
    .string()
    .min(1, { message: t('auth.validation.passwordRequired') })
    .min(6, { message: t('auth.validation.passwordMinLength') })

/** Schema form đăng nhập — factory nhận `t` để message theo ngôn ngữ hiện tại (i18n). */
export const createLoginSchema = (t: Translate) =>
  z.object({
    username: usernameField(t),
    password: passwordField(t),
  })

// Kiểu dữ liệu form suy ra thẳng từ schema -> không khai báo type trùng lặp.
export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>

/**
 * Schema cho form đăng ký. Minh hoạ validate "cross-field" (so khớp mật khẩu):
 * từng field tự kiểm tra ở `z.object`, còn `.refine` chạy SAU đó trên cả object
 * để so 2 field `password` và `confirmPassword` với nhau.
 */
export const createRegisterSchema = (t: Translate) =>
  z
    .object({
      username: usernameField(t),
      password: passwordField(t),
      confirmPassword: z
        .string()
        .min(1, { message: t('auth.register.validation.confirmRequired') }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('auth.register.validation.passwordMismatch'),
      // Gắn lỗi vào ô confirm -> hiện đúng dưới ô đó, không phải lỗi chung của form.
      path: ['confirmPassword'],
    })

export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>
