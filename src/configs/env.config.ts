/**
 * Cấu hình phụ thuộc môi trường — đọc từ biến môi trường Vite (`import.meta.env.VITE_*`).
 * Khác với `constants/` (giá trị bất biến), giá trị ở đây đổi theo môi trường (dev/staging/prod)
 * và có thể override qua file `.env` / `.env.local` mà không phải sửa code.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api'
