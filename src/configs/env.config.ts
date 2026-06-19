/**
 * Cấu hình theo môi trường — đọc & VALIDATE biến môi trường Vite (`import.meta.env.VITE_*`).
 *
 * Khác với `constants/` (giá trị bất biến), giá trị ở đây đổi theo môi trường
 * (local / dev / test / production) và override qua các file `.env*` mà không phải sửa code.
 *
 * Mọi biến đều BẮT BUỘC (required) — KHÔNG có default ngầm: file `.env` common đã cung cấp
 * giá trị nền cho mọi mode. Toàn bộ env được parse qua zod NGAY KHI module load nên thiếu/sai
 * biến sẽ fail-fast với thông báo rõ ràng, thay vì lỗi `undefined` mơ hồ ở tận runtime.
 */
import { z } from 'zod'

const envSchema = z.object({
  VITE_APP_ENV: z.enum(['local', 'dev', 'test', 'production'], {
    error: 'VITE_APP_ENV là bắt buộc (một trong: local | dev | test | production)',
  }),
  VITE_API_BASE_URL: z.url({
    error: 'VITE_API_BASE_URL là bắt buộc và phải là URL hợp lệ',
  }),
  // Env vars là string -> nhận 'true'/'false' rồi transform về boolean.
  VITE_ENABLE_DEVTOOLS: z
    .enum(['true', 'false'], { error: "VITE_ENABLE_DEVTOOLS là bắt buộc ('true' | 'false')" })
    .transform((v) => v === 'true'),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
    .join('\n')
  throw new Error(`❌ Biến môi trường không hợp lệ — kiểm tra file .env tương ứng:\n${details}`)
}

const env = parsed.data

export const ENV = {
  APP_ENV: env.VITE_APP_ENV,
  API_BASE_URL: env.VITE_API_BASE_URL,
  ENABLE_DEVTOOLS: env.VITE_ENABLE_DEVTOOLS,
  IS_LOCAL: env.VITE_APP_ENV === 'local',
  IS_PROD: env.VITE_APP_ENV === 'production',
  /** Vite mode thô (`vite --mode <x>`), hữu ích khi debug. */
  MODE: import.meta.env.MODE,
} as const
