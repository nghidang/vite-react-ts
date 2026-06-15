import { useEffect, useRef, type ReactNode } from 'react'
import './Modal.css'

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

/**
 * Modal dùng thẻ native <dialog>: tự có ESC để đóng, focus trap, backdrop (::backdrop).
 * `open` đồng bộ vào showModal()/close(); click ra backdrop hoặc nút × cũng gọi onClose.
 */
export function Modal({ open, onClose, title, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className="modal"
      // ESC (sự kiện 'cancel') và .close() đều bắn 'close' -> báo parent đóng.
      onClose={onClose}
      // Click vào vùng backdrop (chính phần tử <dialog>, ngoài nội dung) thì đóng.
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
    >
      <div className="modal__content">
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button type="button" className="modal__close" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>
        {children}
      </div>
    </dialog>
  )
}
