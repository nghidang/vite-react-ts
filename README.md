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
- `src/features/product/services/product.service.ts`, `src/features/product/hooks/useProducts.ts`.

### 3. React Query (server state)
- `QueryClient` cấu hình tập trung: `staleTime`, `retry: 1`, `refetchOnWindowFocus: false`, xử lý lỗi qua `queryCache`/`mutationCache` — `src/app/query.client.ts`.
- `useQuery` + **query key factory** (`productKeys`) và `placeholderData: keepPreviousData` để giữ list cũ khi đổi filter (UX mượt) — `src/features/product/hooks/useProducts.ts`.
- `useMutation` cho login/register, validate payload ngay trong `mutationFn` — `src/features/auth/hooks/useAuthMutations.ts`.
- Mutation thêm sản phẩm **invalidate theo query key** (`productKeys.all`) để list tự refetch, thay vì vá cache thủ công — `src/features/product/hooks/useAddProduct.ts`.
- **Derive từ cache**: chưa có endpoint chi tiết nên `useProduct` lấy 1 sản phẩm bằng cách `.find` trong cache list dùng chung, đổi id trên URL không gọi API mới — `src/features/product/hooks/useProduct.ts`.

### 4. Redux Toolkit (client/auth state)
- `configureStore` + `createSlice` (`loginSuccess`, `tokenRefreshed`, `logout`) và selectors — `src/app/store.ts`, `src/features/auth/stores/auth.slice.ts`.
- Typed hooks `useAppDispatch` / `useAppSelector` — `src/app/hooks.ts`.
- State auth được persist qua localStorage — `src/features/auth/stores/auth.storage.ts`.

### 5. Zustand (local feature state)
- Store notifications dùng `create` + middleware `persist` (lưu localStorage), tách bạch với react-query (server) và Redux (auth) — `src/features/notification/stores/notification.store.ts`.
- **Selector riêng** `selectUnreadCount` để component (badge ở Header) chỉ re-render khi số chưa đọc đổi, không phải mọi thay đổi của `items`.

### 6. React Router + code splitting
- `BrowserRouter` + định nghĩa routes — `src/app/AppProviders.tsx`, `src/router/AppRouter.tsx`.
- **Lazy loading** các page bằng `React.lazy` + `<Suspense>` với fallback dùng chung — `src/router/AppRouter.tsx`, `src/components/common/RouteFallback/`.
- **ProtectedRoute** (chặn khi chưa đăng nhập) & **GuestRoute** (đẩy user đã đăng nhập khỏi /login), lưu `from` để quay lại sau khi login — `src/router/ProtectedRoute.tsx`, `src/router/GuestRoute.tsx`, `src/features/auth/hooks/useAuthSuccess.ts`.
- Nhiều layout lồng nhau (`MainLayout` / `MainLayoutAuth`), kèm `Header` / `Footer` — `src/layouts/`.

### 7. React Hook Form + Zod
- Zod schema, bao gồm `.refine` **cross-field** (xác nhận mật khẩu khớp) và schema động dùng hàm dịch `t` — `src/features/auth/auth.schemas.ts`.
- `zodResolver` nối Zod với RHF; suy ra type form bằng `z.infer` — `src/features/auth/components/LoginForm/LoginForm.tsx`.
- `Controller` + component `ControlledInputText<T>` generic — `src/features/auth/components/AuthField/AuthField.tsx`, `src/components/common/InputText/ControlledInputText.tsx`.
- Form thêm sản phẩm: `productSchema` (`z.infer` → `ProductFormValues` trùng khít `NewProduct`, truyền thẳng vào `mutate`) — `src/features/product/product.schemas.ts`, `src/features/product/components/AddProductForm/AddProductForm.tsx`.

### 8. Axios: interceptor + refresh token
- Request interceptor gắn `Authorization`; response interceptor bắt 401 → refresh 1 lần rồi replay request gốc (`_retry`) — `src/services/axios.client.ts`.
- **Single-flight refresh**: nhiều request 401 đồng thời chia sẻ chung một `refreshPromise`, thất bại thì logout — `src/services/token.refresh.ts`.
- Refresh dùng axios "trần" (không interceptor) để tránh đệ quy — `src/features/auth/services/token.service.ts`.

### 9. i18n (đa ngôn ngữ EN/VI)
- Hệ thống dịch tự viết: resolve key theo dot-path, fallback EN khi thiếu — `src/i18n/`.
- `LangContext` + `LangProvider` (đồng bộ localStorage, `useMemo` cho context value) + hook `useTranslation` — tất cả gom trong `src/i18n/` (`LangContext.tsx`, `LangProvider.tsx`, `useTranslation.ts`).

### 10. Custom hooks & localStorage abstraction
- `useLocalStorage<T>` generic (đọc/ghi an toàn, trả tuple `[value, setValue]`) — `src/hooks/useLocalStorage.ts`.
- `useCart` (reducer wrapper, tính `totalPrice`), `useProducts`, `useAuthSuccess` — `src/features/*/hooks/`.

### 11. Component UI tái sử dụng
- `Modal` dùng thẻ native `<dialog>`: sẵn ESC để đóng, focus trap, `::backdrop`; đồng bộ prop `open` với `showModal()`/`close()`, click backdrop để đóng — `src/components/common/Modal/Modal.tsx`.

### 12. Patterns TypeScript & xử lý lỗi
- **Generics** ở hook/component (`useLocalStorage<T>`, `AuthField<T extends FieldValues>`).
- **Discriminated union** cho `CartAction` + reducer dạng switch immutable — `src/features/cart/cart.types.ts`, `src/features/cart/reducer/cart.reducer.ts`.
- **Type guards** (`axios.isAxiosError`, `instanceof InvalidAuthDataError`) và custom error class — `src/helpers/getErrorMessage.ts`, `src/features/auth/auth.errors.ts`.
- Suy luận type từ runtime: `z.infer`, `ReturnType<typeof store.getState>` (RootState).

### 13. Ranh giới module & validate tại biên
- **Public API mỗi feature**: code ngoài feature chỉ import qua `features/<name>` (`index.ts`), không deep-import vào nội bộ. Ép buộc bằng ESLint `no-restricted-imports` (`pages/` được miễn để giữ lazy code-splitting) — `eslint.config.js`, `src/features/*/index.ts`.
- **Validate response API bằng zod**: service `.parse()` dữ liệu trả về thay vì cast — `z.coerce.number()` nắn `id`/`price` về number tại runtime → type luôn đúng sự thật — `src/features/product/product.schemas.ts`, `src/features/product/services/product.service.ts`.
- **Type dùng chung** đặt ở `src/types/` (vd `Product` chuẩn trong `product.types.ts`) — feature import lại, không định nghĩa trùng.

## Cấu trúc thư mục (feature-based)

```
src/
├── app/           # store, query.client, providers, typed hooks
├── components/    # UI dùng chung (InputText, SearchBox, LangSwitcher, Modal, RouteFallback)
├── features/      # tách theo domain — mỗi feature lộ public API qua index.ts
│   ├── auth/          # *.slice/*.storage, *.service, hooks, components/, pages, *.schemas/*.errors/*.types
│   ├── product/       # *.service, hooks (react-query), *.schemas/*.constants, components/, pages
│   ├── cart/          # reducer/cart.reducer, hooks, pages, cart.types
│   └── notification/  # *.store (Zustand), components
├── helpers/       # getErrorMessage
├── hooks/         # custom hooks dùng chung (useDebouncedValue, useLocalStorage)
├── i18n/          # dịch + LangContext/LangProvider/useTranslation + locales (en/vi)
├── layouts/       # MainLayout(Auth) + Header/ + Footer/
├── router/        # AppRouter + Protected/Guest route
├── services/      # axios.client + token.refresh
└── types/         # type dùng chung (api, product, router)
```

> **Quy ước đặt tên:** component/page là `PascalCase.tsx` (mỗi cái trong thư mục cùng tên); hook là `useX.ts`; các module-vai-trò còn lại dùng dot-case `<subject>.<role>.ts` (`*.service`, `*.slice`, `*.store`, `*.reducer`, `*.client`, `*.types`, `*.schemas`, `*.errors`, `*.constants`).
