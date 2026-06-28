import { useCallback, useState } from 'react'
import { Button, Typography } from '../design_system'
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

      <Typography variant="h2" as="div">
        Please enter your{' '}
        <Typography.Highlight>
          <Typography.Link
            onClick={() => {
              console.log('email clicked')
            }}
          >
            email
          </Typography.Link>
        </Typography.Highlight>{' '}
        to continue
      </Typography>

      <Button variant="primary" appearance="filled" size="giant">
        Primary
      </Button>
      <Button variant="danger" appearance="outline" size="medium">
        Danger
      </Button>
      <Button variant="success" appearance="clear" size="tiny">
        Success
      </Button>
    </div>
  )
}
