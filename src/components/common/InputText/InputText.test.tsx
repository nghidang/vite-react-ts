import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InputText } from './InputText'

describe('InputText', () => {
  it('renders a text input and forwards typed value via onChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<InputText aria-label="Name" onChange={onChange} />)

    const input = screen.getByRole('textbox', { name: 'Name' })
    await user.type(input, 'hi')

    expect(onChange).toHaveBeenCalledTimes(2)
    expect(input).toHaveValue('hi')
  })

  it('shows the clear button only once there is text (uncontrolled)', async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    render(<InputText aria-label="Search" clearable onClear={onClear} />)

    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument()

    await user.type(screen.getByRole('textbox', { name: 'Search' }), 'abc')
    const clearBtn = screen.getByRole('button', { name: 'Clear' })
    expect(clearBtn).toBeInTheDocument()

    await user.click(clearBtn)
    expect(onClear).toHaveBeenCalledOnce()
    expect(screen.getByRole('textbox', { name: 'Search' })).toHaveValue('')
  })
})
