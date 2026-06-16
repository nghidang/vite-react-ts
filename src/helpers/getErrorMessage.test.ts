import { describe, it, expect } from 'vitest'
import { getErrorMessage } from './getErrorMessage'

// Minimal shape that passes `axios.isAxiosError` (it only checks `isAxiosError === true`).
const axiosError = (data?: unknown) => ({
  isAxiosError: true,
  response: data === undefined ? undefined : { data },
})

describe('getErrorMessage', () => {
  it('prefers the server-provided message on an axios error', () => {
    expect(getErrorMessage(axiosError({ message: 'Email already taken' }))).toBe(
      'Email already taken'
    )
  })

  it('uses the fallback when an axios error carries no message', () => {
    expect(getErrorMessage(axiosError({}), 'Custom fallback')).toBe('Custom fallback')
    expect(getErrorMessage(axiosError(undefined), 'Custom fallback')).toBe('Custom fallback')
  })

  it('uses the fallback for non-axios errors instead of leaking error.message', () => {
    expect(getErrorMessage(new Error('Network Error'), 'Friendly message')).toBe('Friendly message')
  })

  it('falls back to the translated default when no fallback is given', () => {
    expect(getErrorMessage(new Error('boom'))).toBe('Something went wrong. Please try again.')
  })
})
