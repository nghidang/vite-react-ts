// ============================================================
// button.constants.ts
// 🔗 SHARED — dùng cho cả React và React Native
// ============================================================

import { grey, primary, white } from '../../tokens/colors.tokens'
import { radius, spacing }      from '../../tokens/spacing.tokens'

// ── Size tokens ───────────────────────────────────────────────────
// Giá trị từ Figma. large.paddingVertical (14) và tiny.paddingVertical (6)
// không có trong spacing scale (0,4,8,12,16,20,24) → dùng raw value.
export const BUTTON_SIZES = {
  giant:  { paddingVertical: spacing.md, paddingHorizontal: spacing.xl, borderRadius: radius.sm, fontSize: 18, lineHeight: 24, iconSize: 24, gap: spacing.xs },
  large:  { paddingVertical: 14,         paddingHorizontal: spacing.lg, borderRadius: radius.sm, fontSize: 16, lineHeight: 20, iconSize: 24, gap: spacing.xs },
  medium: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.sm, fontSize: 14, lineHeight: 16, iconSize: 24, gap: spacing.xs },
  small:  { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: radius.xs, fontSize: 12, lineHeight: 16, iconSize: 24, gap: spacing.xs },
  tiny:   { paddingVertical: 6,          paddingHorizontal: spacing.xs, borderRadius: radius.xs, fontSize: 10, lineHeight: 12, iconSize: 16, gap: spacing.xs },
} as const

// ── Color tokens per variant × state ─────────────────────────────
export const BUTTON_COLORS = {
  filled: {
    default:  { bg: primary[500], text: white[100],  borderColor: 'transparent', borderWidth: 0 },
    hover:    { bg: primary[700], text: white[100],  borderColor: 'transparent', borderWidth: 0 },
    focus:    { bg: primary[500], text: white[100],  borderColor: 'transparent', borderWidth: 0, focusRing: primary[200] },
    press:    { bg: primary[800], text: white[100],  borderColor: 'transparent', borderWidth: 0 },
    disabled: { bg: grey[200],    text: grey[400],   borderColor: 'transparent', borderWidth: 0 },
  },
  outline: {
    default:  { bg: 'transparent', text: primary[500], borderColor: primary[500], borderWidth: 1.5 },
    hover:    { bg: primary[50],   text: primary[500], borderColor: primary[500], borderWidth: 1.5 },
    focus:    { bg: white[100],    text: primary[500], borderColor: primary[500], borderWidth: 1.5, focusRing: primary[200] },
    press:    { bg: primary[100],  text: primary[500], borderColor: primary[500], borderWidth: 1.5 },
    disabled: { bg: 'transparent', text: grey[400],   borderColor: grey[400],    borderWidth: 1.5 },
  },
  clear: {
    default:  { bg: 'transparent', text: primary[500], borderColor: 'transparent', borderWidth: 0 },
    hover:    { bg: primary[50],   text: primary[500], borderColor: 'transparent', borderWidth: 0 },
    focus:    { bg: white[100],    text: primary[500], borderColor: 'transparent', borderWidth: 0, focusRing: primary[200] },
    press:    { bg: primary[100],  text: primary[500], borderColor: 'transparent', borderWidth: 0 },
    disabled: { bg: 'transparent', text: grey[400],    borderColor: 'transparent', borderWidth: 0 },
  },
} as const

export type ButtonState = keyof typeof BUTTON_COLORS.filled
