import { useSearchParams } from 'react-router-dom'
import { ALL_CATEGORIES, PRODUCT_CATEGORIES } from '../../product.constants'
import './CategorySelect.css'

export function CategorySelect() {
  const [searchParams, setSearchParams] = useSearchParams()
  const value = searchParams.get('category') ?? ALL_CATEGORIES

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value

    setSearchParams((prev) => {
      if (next === ALL_CATEGORIES) prev.delete('category')
      else prev.set('category', next)

      prev.delete('page') // ← reset phân trang khi đổi danh mục

      return prev
    })
  }

  return (
    <select
      className="category-select"
      value={value}
      onChange={handleChange}
      aria-label="Filter by category"
    >
      <option value={ALL_CATEGORIES}>{ALL_CATEGORIES}</option>
      {PRODUCT_CATEGORIES.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  )
}
