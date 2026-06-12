import { memo } from 'react'

const ItemInfo = ({
  item,
  onDelete,
}: {
  item: { id: string; name: string; description: string }
  onDelete: (id: string) => void
}) => {
  return (
    <div>
      <h2>{item.name}</h2>
      <p>{item.description}</p>
      <button type="button" onClick={() => onDelete(item.id)}>
        Delete Item
      </button>
    </div>
  )
}

export default memo(ItemInfo)
