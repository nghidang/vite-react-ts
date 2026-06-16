import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { ControlledInputText } from './ControlledInputText'

type Values = { name: string }

function Harness() {
  const { control } = useForm<Values>({ defaultValues: { name: '' } })
  return <ControlledInputText control={control} name="name" aria-label="Name" />
}

describe('ControlledInputText', () => {
  it('wires the input to react-hook-form so typed values flow through form state', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    // InputText is controlled (value={field.value}); the input only reflects "Laptop" if
    // field.onChange pushed it into form state and the value flowed back down.
    const input = screen.getByRole('textbox', { name: 'Name' })
    await user.type(input, 'Laptop')

    expect(input).toHaveValue('Laptop')
  })
})
