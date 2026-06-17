import { describe, it, expect } from 'vitest'
import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('formats a date with full month, day and year', () => {
    const date = new Date(2026, 5, 17) // tháng 0-indexed -> 17 June 2026

    // So với cùng options + cùng locale mặc định (undefined) -> KHÔNG phụ thuộc locale của CI,
    // nhưng vẫn bắt lỗi nếu options bị đổi (vd month: 'long' -> 'short'/'numeric').
    // Ở locale en-US chuỗi này là "June 17, 2026".
    const expected = date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    expect(formatDate(date)).toBe(expected)
  })

  it('uses the long (alphabetic) month name, not a numeric one', () => {
    const result = formatDate(new Date(2026, 0, 1))
    expect(result).toMatch(/\p{L}/u) // có chữ cái -> tên tháng dạng chữ, không phải số
    expect(result).toContain('2026')
  })
})
