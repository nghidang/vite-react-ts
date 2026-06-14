import { Link, useSearchParams } from 'react-router-dom'
import { ROUTES } from '../../../constants/route.constants'
import { getErrorMessage } from '../../../utils/getErrorMessage'
import { CategorySelect } from '../components/CategorySelect'
import { useProducts } from '../hooks/useProducts'
import './List.css'

export function ProductList() {
  const [searchParams] = useSearchParams()
  const search = searchParams.get('search')
  const category = searchParams.get('category')

  const {
    isPending: loading,
    error,
    data: products,
  } = useProducts({ name: search ?? undefined, category: category ?? undefined })

  return (
    <div className="product-list">
      <h1>Product List</h1>
      <p>This is the product list page - {search}</p>

      <CategorySelect />

      {loading && <p>Loading...</p>}
      {error && <p>{getErrorMessage(error)}</p>}

      <ul>
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
