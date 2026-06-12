import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ROUTES } from '../../../constants/route.constants'
import { useApiRequest } from '../../../hooks/useApiRequest'
import { CategorySelect } from '../components/CategorySelect'
import type { Product } from '../product.types'
import * as productService from '../services/productService'
import './List.css'

export function ProductList() {
  const [searchParams] = useSearchParams()
  const search = searchParams.get('search')
  const category = searchParams.get('category')

  const { loading, error, data: products, run } = useApiRequest<Product[]>()

  useEffect(() => {
    run((signal) =>
      productService.getProducts(
        { name: search ?? undefined, category: category ?? undefined },
        signal
      )
    )
  }, [run, search, category])

  return (
    <div className="product-list">
      <h1>Product List</h1>
      <p>This is the product list page - {search}</p>

      <CategorySelect />

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

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
