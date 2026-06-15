# Vite + React + TypeScript — Bài tập khoá học Web

SPA frontend mô phỏng một ứng dụng thương mại điện tử nhỏ (đăng nhập/đăng ký, danh sách & chi tiết sản phẩm, giỏ hàng, đa ngôn ngữ). Dự án tập trung thể hiện các **kỹ thuật React/TypeScript** thường gặp trong sản phẩm thật.

## Tech stack

| Nhóm | Thư viện |
| --- | --- |
| Core | React 19, TypeScript 6, Vite 8 (`@vitejs/plugin-react` + Oxc) |
| Server state | `@tanstack/react-query` 5 |
| Auth state | Redux Toolkit 2 + `react-redux` |
| Local feature state | `zustand` 5 (notifications) |
| Routing | `react-router-dom` 7 |
| Form & validation | `react-hook-form` 7 + `zod` 4 (`@hookform/resolvers`) |
| HTTP | `axios` (interceptor + refresh token) |
| Lint/format | ESLint 10 (flat config) + Prettier (no semi, single quote, width 100) |

Package manager: **Yarn**.

```bash
yarn dev        # Vite dev server + HMR
yarn build      # tsc -b && vite build
yarn lint       # ESLint
yarn preview    # Preview bản build
```

## Kỹ thuật đã áp dụng

Mỗi mục kèm file dẫn chứng để dễ rà lại trong code.

### 1. Debounce (search-as-you-type)
- Custom hook generic `useDebouncedValue<T>` trả về giá trị sau khi "lặng" 400ms, huỷ timer cũ mỗi lần gõ → tránh fetch theo từng phím.
- `src/hooks/useDebouncedValue.ts`, dùng tại `src/components/common/SearchBox/SearchBox.tsx`.

### 2. AbortController / huỷ request
- `queryFn` nhận `signal` từ react-query và truyền xuống axios; khi đổi filter, request cũ tự bị abort.
- `src/features/product/services/productService.ts`, `src/features/product/hooks/useProducts.ts`.

### 3. React Query (server state)
- `QueryClient` cấu hình tập trung: `staleTime`, `retry: 1`, `refetchOnWindowFocus: false`, xử lý lỗi qua `queryCache`/`mutationCache` — `src/app/queryClient.ts`.
- `useQuery` + **query key factory** (`productKeys`) và `placeholderData: keepPreviousData` để giữ list cũ khi đổi filter (UX mượt) — `src/features/product/hooks/useProducts.ts`.
- `useMutation` cho login/register, validate payload ngay trong `mutationFn` — `src/features/auth/hooks/authMutations.ts`.
- Mutation thêm sản phẩm **invalidate theo query key** (`productKeys.all`) để list tự refetch, thay vì vá cache thủ công — `src/features/product/hooks/useAddProduct.ts`.
- **Derive từ cache**: chưa có endpoint chi tiết nên `useProduct` lấy 1 sản phẩm bằng cách `.find` trong cache list dùng chung, đổi id trên URL không gọi API mới — `src/features/product/hooks/useProduct.ts`.

### 4. Redux Toolkit (client/auth state)
- `configureStore` + `createSlice` (`loginSuccess`, `tokenRefreshed`, `logout`) và selectors — `src/app/store.ts`, `src/features/auth/stores/authSlice.ts`.
- Typed hooks `useAppDispatch` / `useAppSelector` — `src/app/hooks.ts`.
- State auth được persist qua localStorage — `src/features/auth/stores/authStorage.ts`.

### 5. Zustand (local feature state)
- Store notifications dùng `create` + middleware `persist` (lưu localStorage), tách bạch với react-query (server) và Redux (auth) — `src/features/notification/stores/notificationStore.ts`.
- **Selector riêng** `selectUnreadCount` để component (badge ở Header) chỉ re-render khi số chưa đọc đổi, không phải mọi thay đổi của `items`.

### 6. React Router + code splitting
- `BrowserRouter` + định nghĩa routes — `src/app/AppProviders.tsx`, `src/router/AppRouter.tsx`.
- **Lazy loading** các page bằng `React.lazy` + `<Suspense>` với fallback dùng chung — `src/router/AppRouter.tsx`, `src/components/common/RouteFallback/`.
- **ProtectedRoute** (chặn khi chưa đăng nhập) & **GuestRoute** (đẩy user đã đăng nhập khỏi /login), lưu `from` để quay lại sau khi login — `src/router/ProtectedRoute.tsx`, `src/router/GuestRoute.tsx`, `src/features/auth/hooks/useAuthSuccess.ts`.
- Nhiều layout lồng nhau (`MainLayout` / `MainLayoutAuth`) — `src/layouts/`.

### 7. React Hook Form + Zod
- Zod schema, bao gồm `.refine` **cross-field** (xác nhận mật khẩu khớp) và schema động dùng hàm dịch `t` — `src/features/auth/auth.schemas.ts`.
- `zodResolver` nối Zod với RHF; suy ra type form bằng `z.infer` — `src/features/auth/components/LoginForm.tsx`.
- `Controller` + component `ControlledInputText<T>` generic — `src/features/auth/components/AuthField.tsx`, `src/components/common/InputText/ControlledInputText.tsx`.
- Form thêm sản phẩm: `productSchema` (`z.infer` → `ProductFormValues` trùng khít `NewProduct`, truyền thẳng vào `mutate`) — `src/features/product/product.schemas.ts`, `src/features/product/components/AddProductForm.tsx`.

### 8. Axios: interceptor + refresh token
- Request interceptor gắn `Authorization`; response interceptor bắt 401 → refresh 1 lần rồi replay request gốc (`_retry`) — `src/services/axiosClient.ts`.
- **Single-flight refresh**: nhiều request 401 đồng thời chia sẻ chung một `refreshPromise`, thất bại thì logout — `src/services/tokenRefresh.ts`.
- Refresh dùng axios "trần" (không interceptor) để tránh đệ quy — `src/features/auth/services/tokenService.ts`.

### 9. i18n (đa ngôn ngữ EN/VI)
- Hệ thống dịch tự viết: resolve key theo dot-path, fallback EN khi thiếu — `src/i18n/`.
- `LangContext` + `LangProvider` (đồng bộ localStorage, `useMemo` cho context value) + hook `useTranslation` — `src/contexts/`, `src/app/LangProvider.tsx`, `src/hooks/useTranslation.ts`.

### 10. Custom hooks & localStorage abstraction
- `useLocalStorage<T>` generic (đọc/ghi an toàn, trả tuple `[value, setValue]`) — `src/hooks/useLocalStorage.ts`.
- `useCart` (reducer wrapper, tính `totalPrice`), `useProducts`, `useAuthSuccess` — `src/features/*/hooks/`.

### 11. Component UI tái sử dụng
- `Modal` dùng thẻ native `<dialog>`: sẵn ESC để đóng, focus trap, `::backdrop`; đồng bộ prop `open` với `showModal()`/`close()`, click backdrop để đóng — `src/components/common/Modal/Modal.tsx`.

### 12. Patterns TypeScript & xử lý lỗi
- **Generics** ở hook/component (`useLocalStorage<T>`, `AuthField<T extends FieldValues>`).
- **Discriminated union** cho `CartAction` + reducer dạng switch immutable — `src/features/cart/cart.types.ts`, `src/features/cart/stores/cartReducer.ts`.
- **Type guards** (`axios.isAxiosError`, `instanceof InvalidAuthDataError`) và custom error class — `src/utils/getErrorMessage.ts`, `src/features/auth/auth.errors.ts`.
- Suy luận type từ runtime: `z.infer`, `ReturnType<typeof store.getState>` (RootState).

## Cấu trúc thư mục (feature-based)

```
src/
├── app/          # store, queryClient, providers, typed hooks
├── components/    # UI dùng chung (InputText, SearchBox, LangSwitcher, Modal, layout)
├── features/      # tách theo domain
│   ├── auth/          # schemas, errors, slice, services, hooks, components, pages
│   ├── product/       # services, hooks (react-query), schemas, components, pages
│   ├── cart/          # reducer, hooks, pages
│   └── notification/  # Zustand store, components
├── hooks/         # custom hooks dùng chung (debounce, localStorage, translation)
├── i18n/          # hệ thống dịch + locales (en/vi)
├── router/        # AppRouter + Protected/Guest route
├── services/      # axiosClient + tokenRefresh
└── utils/         # getErrorMessage, formatDate
```
