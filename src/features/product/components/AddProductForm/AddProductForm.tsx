import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { getErrorMessage } from '../../../../utils/getErrorMessage'
import { useAddProduct } from '../../hooks/useAddProduct'
import { PRODUCT_CATEGORIES } from '../../product.constants'
import { productSchema, type ProductFormValues } from '../../product.schemas'
import './AddProductForm.css'

export function AddProductForm({ onClose }: { onClose: () => void }) {
  const addProduct = useAddProduct()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: '', status: true },
  })

  // ProductFormValues trùng khít NewProduct -> truyền thẳng. Đóng modal khi xong.
  const onSubmit = (values: ProductFormValues) => addProduct.mutate(values, { onSuccess: onClose })

  return (
    <form className="add-product-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="add-product-field">
        <label htmlFor="name">Name</label>
        <input id="name" {...register('name')} />
      </div>
      {errors.name && <p className="add-product-error">{errors.name.message}</p>}

      <div className="add-product-field">
        <label htmlFor="price">Price</label>
        {/* valueAsNumber: RHF ép input -> number để khớp schema z.number() */}
        <input id="price" type="number" {...register('price', { valueAsNumber: true })} />
      </div>
      {errors.price && <p className="add-product-error">{errors.price.message}</p>}

      <div className="add-product-field">
        <label htmlFor="category">Category</label>
        <select id="category" defaultValue="" {...register('category')}>
          <option value="" disabled>
            Select category
          </option>
          {PRODUCT_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      {errors.category && <p className="add-product-error">{errors.category.message}</p>}

      <label className="add-product-checkbox">
        <input type="checkbox" {...register('status')} /> In stock
      </label>

      {addProduct.error && <p className="add-product-error">{getErrorMessage(addProduct.error)}</p>}

      <div className="add-product-actions">
        <button type="button" onClick={onClose} disabled={addProduct.isPending}>
          Cancel
        </button>
        <button type="submit" disabled={addProduct.isPending}>
          {addProduct.isPending ? 'Adding...' : 'Add product'}
        </button>
      </div>
    </form>
  )
}
