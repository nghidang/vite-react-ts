import { z } from 'zod'

type Translate = (key: string) => string

/**
 * Schema validate cho form đăng nhập — nguồn sự thật duy nhất cho mọi luật của form.
 * Là factory nhận `t` để thông báo lỗi vẫn theo ngôn ngữ hiện tại (i18n).
 *
 * Các check chạy theo thứ tự khai báo; zodResolver lấy issue đầu tiên của mỗi field,
 * nên đặt `min(1)` (bắt buộc) trước `min(3)` / `regex` để báo "required" khi để trống.
 */
export const createLoginSchema = (t: Translate) =>
  z.object({
    username: z
      .string()
      .min(1, { message: t('auth.login.validation.usernameRequired') })
      .min(3, { message: t('auth.login.validation.usernameMinLength') })
      .regex(/^[a-zA-Z0-9_]+$/, { message: t('auth.login.validation.usernameInvalid') }),
    password: z
      .string()
      .min(1, { message: t('auth.login.validation.passwordRequired') })
      .min(6, { message: t('auth.login.validation.passwordMinLength') }),
  })

// Kiểu dữ liệu form suy ra thẳng từ schema -> không khai báo type trùng lặp.
export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>
