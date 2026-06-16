/**
 * Public API của feature `product`.
 * Code ngoài feature CHỈ được import từ đây. (Trang dùng cho routing được import trực tiếp
 * tại `router/AppRouter.tsx` để giữ code-splitting của `React.lazy`.)
 */
export { useProducts, productKeys } from './hooks/useProducts'
export { useProduct } from './hooks/useProduct'
export { useAddProduct } from './hooks/useAddProduct'
export { productRoutes } from './product.routes'
