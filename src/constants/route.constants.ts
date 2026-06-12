export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  USER: '/user',
  PRODUCT_LIST: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
}

// Các link công khai (luôn hiển thị trên Header). Link phụ thuộc đăng nhập
// (Login / User / Logout) được xử lý riêng trong Header theo trạng thái auth.
export const PAGES = [
  {
    name: 'Home',
    path: ROUTES.HOME,
  },
  {
    name: 'Products',
    path: ROUTES.PRODUCT_LIST,
  },
  {
    name: 'Cart',
    path: ROUTES.CART,
  },
]
