import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { ROUTES } from '../../../constants/route.constants'
import { useDebouncedValue } from '../../../hooks/useDebouncedValue'
import { InputText } from '../InputText/InputText'
import './SearchBox.css'

export function SearchBox() {
  const [searchParams, setSearchParams] = useSearchParams()
  // `value` là buffer gõ cục bộ -> gõ mượt, không phụ thuộc round-trip lên URL.
  const [value, setValue] = useState(searchParams.get('search') ?? '')
  const location = useLocation()

  // Đồng bộ ngược URL -> input khi query đổi từ bên ngoài (back/forward, đổi route).
  // Điều chỉnh state ngay trong render (React docs) thay vì useEffect: không remount nên
  // giữ được focus khi đang gõ, lại tránh render thừa. Bỏ qua nếu chỉ khác khoảng trắng
  // (đang gõ "ab " thì URL là "ab") để không nuốt ký tự người dùng vừa gõ.
  const urlSearch = searchParams.get('search') ?? ''
  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch)
  if (urlSearch !== prevUrlSearch) {
    setPrevUrlSearch(urlSearch)
    if (urlSearch !== value.trim()) setValue(urlSearch)
  }

  // Ghi từ khoá lên URL từ khoá khi người dùng ngừng gõ. URL là nguồn sự thật duy nhất:
  // ProductList lắng nghe URL để fetch (AbortController trong useApiRequest huỷ request cũ).
  const debounced = useDebouncedValue(value.trim(), 400)

  /** Đồng bộ từ khoá (đã debounce hoặc submit) lên URL. Tách ra để debounce và Enter dùng chung. */
  const syncToUrl = (keyword: string, replace: boolean) => {
    setSearchParams(
      (prev) => {
        if (keyword) prev.set('search', keyword)
        else prev.delete('search')
        prev.delete('page') // ← reset phân trang khi từ khoá đổi
        return prev
      },
      { replace }
    )
  }

  useEffect(() => {
    // Đã khớp URL (vd: lần mount đầu, hoặc Enter vừa flush) -> bỏ qua, tránh điều hướng thừa.
    if ((searchParams.get('search') ?? '') === debounced) return
    // replace: gõ liên tục không làm phình lịch sử trình duyệt.
    syncToUrl(debounced, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Enter -> áp dụng ngay, không chờ debounce; push để là một mục lịch sử rõ ràng.
    syncToUrl(value.trim(), false)
  }

  return (
    <form className="search-box" role="search" onSubmit={handleSubmit}>
      <InputText
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={
          location.pathname === ROUTES.PRODUCT_LIST
            ? 'Search products...'
            : location.pathname === ROUTES.CART
              ? 'Search cart...'
              : 'Search...'
        }
        aria-label="Search"
        clearable
      />
    </form>
  )
}
