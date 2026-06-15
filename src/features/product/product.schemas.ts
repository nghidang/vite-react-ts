import { z } from 'zod'

/**
 * Schema form thêm product. Khớp đúng `NewProduct` (name, price, category, status).
 * `category` chỉ cần `min(1)` vì <select> đã giới hạn trong PRODUCT_CATEGORIES.
 */
export const productSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  price: z
    .number({ message: 'Price must be a number' })
    .positive({ message: 'Price must be greater than 0' }),
  category: z.string().min(1, { message: 'Category is required' }),
  status: z.boolean(),
})

// Kiểu form suy ra thẳng từ schema -> trùng khít NewProduct, truyền thẳng vào mutate.
export type ProductFormValues = z.infer<typeof productSchema>
