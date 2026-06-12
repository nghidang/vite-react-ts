import { useCallback, useState } from 'react'
import ItemInfo from './components/ItemInfo'

export function HomePage() {
  const [count, setCount] = useState(0)
  const [items, setItems] = useState([
    { id: '1', name: 'Item 1', description: 'This is item 1' },
    { id: '2', name: 'Item 2', description: 'This is item 2' },
    { id: '3', name: 'Item 3', description: 'This is item 3' },
  ])

  const handleDelete = useCallback((id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }, [])

  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>
      <button type="button" onClick={() => setCount((prev) => prev + 1)}>
        Increment Count: {count}
      </button>
      {items.map((item) => (
        <ItemInfo key={item.id} item={item} onDelete={handleDelete} />
      ))}
    </div>
  )
}
