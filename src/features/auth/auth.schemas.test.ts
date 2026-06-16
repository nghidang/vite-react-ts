import { describe, it, expect } from 'vitest'
import { createLoginSchema, createRegisterSchema } from './auth.schemas'

// Identity `t` -> error messages come back as their i18n keys, so assertions stay readable.
const t = (key: string) => key
const loginSchema = createLoginSchema(t)
const registerSchema = createRegisterSchema(t)

const firstError = (result: { success: boolean; error?: { issues: { message: string }[] } }) =>
  result.success ? undefined : result.error!.issues[0].message

describe('createLoginSchema', () => {
  it('accepts a valid username/password', () => {
    expect(loginSchema.safeParse({ username: 'john_99', password: 'secret1' }).success).toBe(true)
  })

  it('reports "required" before length/format when the username is empty', () => {
    expect(firstError(loginSchema.safeParse({ username: '', password: 'secret1' }))).toBe(
      'auth.validation.usernameRequired'
    )
  })

  it('enforces the minimum username length', () => {
    expect(firstError(loginSchema.safeParse({ username: 'ab', password: 'secret1' }))).toBe(
      'auth.validation.usernameMinLength'
    )
  })

  it('rejects usernames with disallowed characters', () => {
    expect(firstError(loginSchema.safeParse({ username: 'a b!', password: 'secret1' }))).toBe(
      'auth.validation.usernameInvalid'
    )
  })

  it('requires a password and enforces its minimum length', () => {
    expect(firstError(loginSchema.safeParse({ username: 'john', password: '' }))).toBe(
      'auth.validation.passwordRequired'
    )
    expect(firstError(loginSchema.safeParse({ username: 'john', password: '123' }))).toBe(
      'auth.validation.passwordMinLength'
    )
  })
})

describe('createRegisterSchema', () => {
  const valid = { username: 'john_99', password: 'secret1', confirmPassword: 'secret1' }

  it('accepts matching passwords', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true)
  })

  it('requires the confirmation field', () => {
    expect(
      firstError(registerSchema.safeParse({ ...valid, confirmPassword: '' }))
    ).toBe('auth.register.validation.confirmRequired')
  })

  it('flags a password mismatch on the confirmPassword field', () => {
    const result = registerSchema.safeParse({ ...valid, confirmPassword: 'different' })
    expect(result.success).toBe(false)
    const mismatch = result.success
      ? undefined
      : result.error.issues.find((i) => i.path.includes('confirmPassword'))
    expect(mismatch?.message).toBe('auth.register.validation.passwordMismatch')
  })
})
