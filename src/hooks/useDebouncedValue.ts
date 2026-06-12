import { useEffect, useState } from 'react'

/**
 * Trả về `value` sau khi nó đã "lặng" trong `delay` ms.
 * Mỗi lần `value` đổi, timer cũ bị huỷ -> chỉ cập nhật khi người dùng ngừng gõ.
 * Dùng cho search-as-you-type để tránh fetch mỗi phím gõ.
 *
 * @example
 * const debounced = useDebouncedValue(keyword, 400)
 */
export function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}
