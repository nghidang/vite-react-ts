import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Modal } from '../../../components/common/Modal/Modal'
import { ROUTES } from '../../../constants/route.constants'
import { getErrorMessage } from '../../../helpers/getErrorMessage'
import { AddProductForm } from '../components/AddProductForm/AddProductForm'
import { CategorySelect } from '../components/CategorySelect/CategorySelect'
import { useProducts } from '../hooks/useProducts'
import './ProductListPage.css'

export function ProductListPage() {
  const [searchParams] = useSearchParams()
  const search = searchParams.get('search')
  const category = searchParams.get('category')

  const [isAddOpen, setIsAddOpen] = useState(false)

  const {
    isPending: loading,
    isPlaceholderData,
    error,
    data: products,
  } = useProducts({ name: search ?? undefined, category: category ?? undefined })

  return (
    <div className="product-list">
      <h1>Product List</h1>
      <p>This is the product list page - {search}</p>

      <CategorySelect />

      <button type="button" className="product-list__add" onClick={() => setIsAddOpen(true)}>
        Add product
      </button>

      <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add product">
        {/* Render khi mở -> mỗi lần mở là form mới, khỏi reset thủ công. */}
        {isAddOpen && <AddProductForm onClose={() => setIsAddOpen(false)} />}
      </Modal>

      {loading && <p>Loading...</p>}
      {error && <p>{getErrorMessage(error)}</p>}

      {/* isPlaceholderData: đang fetch filter mới nhưng vẫn hiện list cũ -> làm mờ để báo đang tải. */}
      <ul className={isPlaceholderData ? 'is-loading' : undefined}>
        {products?.map((product) => (
          <li key={product.id}>
            <Link to={ROUTES.PRODUCT_DETAIL.replace(':id', String(product.id))}>
              {product.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
