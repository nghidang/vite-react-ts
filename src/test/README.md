# Bảng các loại test (test catalog)

Mỗi file dưới đây là **một ví dụ tiêu biểu cho một loại test** trong dự án React + TS này.
Mục tiêu: học "có thể test những gì" và "test bằng kỹ thuật nào". Toàn bộ chạy bằng **Vitest**
(`yarn test`, `yarn test:run`, `yarn coverage`); test có DOM/React dùng thêm **React Testing
Library**, còn test logic thuần chỉ cần Vitest.

## Hạ tầng test

| File | Vai trò |
| --- | --- |
| [setup.ts](./setup.ts) | Đăng ký matcher `jest-dom`, `cleanup()` sau mỗi test, polyfill `<dialog>` cho jsdom |
| [queryWrapper.tsx](./queryWrapper.tsx) | `QueryClient` tắt retry + wrapper provider dùng cho test các hook React Query |

## Các loại test

| # | Loại test | Ví dụ | Kỹ thuật chính |
| --- | --- | --- | --- |
| 1 | **Hàm thuần (pure function)** | [getErrorMessage.test.ts](../helpers/getErrorMessage.test.ts) · [formatDate.test.ts](../utils/formatDate.test.ts) | input → output, không cần DOM (formatDate: tránh hardcode theo locale) |
| 2 | **Reducer (`useReducer`)** | [cart.reducer.test.ts](../features/cart/reducer/cart.reducer.test.ts) | gọi reducer với `(state, action)`, kiểm tra immutability |
| 3 | **Schema validation (zod)** | [auth.schemas.test.ts](../features/auth/auth.schemas.test.ts) | `safeParse`, kiểm tra message + cross-field |
| 4 | **Custom hook + fake timers** | [useDebouncedValue.test.ts](../hooks/useDebouncedValue.test.ts) | `renderHook`, `act`, `vi.useFakeTimers()` |
| 5 | **React Query — query (async)** | [useProducts.test.tsx](../features/product/hooks/useProducts.test.tsx) | mock service, `wrapper`, `waitFor` |
| 6 | **React Query — mutation** | [useAddProduct.test.tsx](../features/product/hooks/useAddProduct.test.tsx) | `mutate`, spy `invalidateQueries` |
| 7 | **Redux Toolkit slice** | [auth.slice.test.ts](../features/auth/stores/auth.slice.test.ts) | reducer + selector + persistence |
| 8 | **Zustand store** | [notification.store.test.ts](../features/notification/stores/notification.store.test.ts) | `getState()/setState()`, selector |
| 9 | **Component + tương tác** | [InputText.test.tsx](../components/common/InputText/InputText.test.tsx) | `render`, `userEvent`, query theo role/label |
| 10 | **Component + API/effect của trình duyệt** | [Modal.test.tsx](../components/common/Modal/Modal.test.tsx) | `<dialog>`, `fireEvent`, native `close` event |
| 11 | **Component + Context** | [LangSwitcher.test.tsx](../components/common/LangSwitcher/LangSwitcher.test.tsx) | bọc `Context.Provider` để cấp giá trị |
| 12 | **Component + react-hook-form** | [ControlledInputText.test.tsx](../components/common/InputText/ControlledInputText.test.tsx) | harness `useForm`, kiểm tra value chảy qua form state |
| 13 | **Route guard (Redux + Router)** | [ProtectedRoute.test.tsx](../router/ProtectedRoute.test.tsx) | `MemoryRouter` + `Provider`, kiểm tra redirect |
| 14 | **Service / API boundary (axios)** | [product.service.test.ts](../features/product/services/product.service.test.ts) | mock `axiosClient`, kiểm tra params + parse zod |
| 15 | **Module có state (single-flight)** | [token.refresh.test.ts](../services/token.refresh.test.ts) | mock 1 phần module, gộp promise đồng thời |
| 16 | **Integration (nhiều mảnh ghép)** | [useTranslation.test.tsx](../i18n/useTranslation.test.tsx) | Provider + component + persistence cùng lúc |

## Quy ước

- File test đặt **cạnh** code: `*.test.ts` / `*.test.tsx`.
- Query theo **vai trò/nhãn** (`getByRole`, `getByLabelText`) thay vì `data-testid`.
- Dùng `@testing-library/user-event` cho tương tác (gõ, click); `fireEvent` cho event cấp thấp.
- Mock ở **ranh giới** (service/axios/module), không mock thứ đang test.
