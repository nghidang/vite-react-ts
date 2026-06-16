import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from './Modal'

describe('Modal', () => {
  it('shows the title and children when open', () => {
    render(
      <Modal open title="Confirm" onClose={() => {}}>
        <p>Body content</p>
      </Modal>
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Confirm' })).toBeInTheDocument()
    expect(screen.getByText('Body content')).toBeInTheDocument()
  })

  it('is closed (no open attribute) when open is false', () => {
    const { container } = render(
      <Modal open={false} title="Confirm" onClose={() => {}}>
        <p>Body content</p>
      </Modal>
    )
    expect(container.querySelector('dialog')).not.toHaveAttribute('open')
  })

  it('calls onClose when the × button is clicked', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(
      <Modal open title="Confirm" onClose={onClose}>
        body
      </Modal>
    )
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose on a backdrop click but not on a content click', () => {
    const onClose = vi.fn()
    render(
      <Modal open title="Confirm" onClose={onClose}>
        <p>body</p>
      </Modal>
    )

    fireEvent.click(screen.getByText('body')) // inside content -> ignored
    expect(onClose).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('dialog')) // the <dialog> element itself = backdrop
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when the dialog emits a native close event (ESC)', () => {
    const onClose = vi.fn()
    render(
      <Modal open title="Confirm" onClose={onClose}>
        body
      </Modal>
    )
    fireEvent(screen.getByRole('dialog'), new Event('close'))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
