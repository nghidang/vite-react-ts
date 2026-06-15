export type Product = {
  id: number
  name: string
  price: number
  category: string
  status: boolean
}

/** Payload tạo product — id do server sinh. */
export type NewProduct = Omit<Product, 'id'>
