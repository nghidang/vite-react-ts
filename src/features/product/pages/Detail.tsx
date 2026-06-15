import { Link, useParams } from 'react-router-dom'
import { ROUTES } from '../../../constants/route.constants'
import { getErrorMessage } from '../../../utils/getErrorMessage'
import { useProduct } from '../hooks/useProduct'
import './Detail.css'

export default function ProductDetail() {
  const { id } = useParams()
  const { data: product, isPending, error } = useProduct(Number(id))

  // Đang fetch list (deep-link/reload, chưa có seed từ cache).
  if (isPending) {
    return (
      <div className="product-detail">
        <p>Loading...</p>
      </div>
    )
  }

  // Lỗi mạng khi lấy list.
  if (error) {
    return (
      <div className="product-detail">
        <p>{getErrorMessage(error)}</p>
        <Link to={ROUTES.PRODUCT_LIST}>← Back to list</Link>
      </div>
    )
  }

  // Đã fetch xong nhưng không có product khớp id.
  if (!product) {
    return (
      <div className="product-detail">
        <p>Product not found.</p>
        <Link to={ROUTES.PRODUCT_LIST}>← Back to list</Link>
      </div>
    )
  }

  return (
    <div className="product-detail">
      <h1>Product Detail</h1>
      <p>This is the product detail page for product ID: {id}</p>

      <dl className="product-detail__info">
        <dt>Name</dt>
        <dd>{product.name}</dd>

        <dt>Price</dt>
        <dd>{product.price.toLocaleString('vi-VN')} ₫</dd>

        <dt>Category</dt>
        <dd>{product.category}</dd>

        <dt>Status</dt>
        <dd>{product.status ? 'In stock' : 'Out of stock'}</dd>
      </dl>

      <Link to={ROUTES.PRODUCT_LIST}>← Back to list</Link>
    </div>
  )
}
