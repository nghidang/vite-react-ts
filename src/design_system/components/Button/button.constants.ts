// ============================================================
// button.constants.ts
// 🔗 SHARED — dùng cho cả React và React Native
// ============================================================

import { green, grey, primary, red, white } from '../../tokens/colors.tokens'
import { radius, spacing }                  from '../../tokens/spacing.tokens'

// ── Size tokens ───────────────────────────────────────────────────
// large.paddingVertical (14) và tiny.paddingVertical (6)
// không có trong spacing scale (0,4,8,12,16,20,24) → raw value.
export const BUTTON_SIZES = {
  giant:  { paddingVertical: spacing.md, paddingHorizontal: spacing.xl, borderRadius: radius.sm, fontSize: 18, lineHeight: 24, iconSize: 24, gap: spacing.xs },
  large:  { paddingVertical: 14,         paddingHorizontal: spacing.lg, borderRadius: radius.sm, fontSize: 16, lineHeight: 20, iconSize: 24, gap: spacing.xs },
  medium: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.sm, fontSize: 14, lineHeight: 16, iconSize: 24, gap: spacing.xs },
  small:  { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: radius.xs, fontSize: 12, lineHeight: 16, iconSize: 24, gap: spacing.xs },
  tiny:   { paddingVertical: 6,          paddingHorizontal: spacing.xs, borderRadius: radius.xs, fontSize: 10, lineHeight: 12, iconSize: 16, gap: spacing.xs },
} as const

// ── Variant color palette (appearance-agnostic) ───────────────────
// Mỗi variant định nghĩa bộ màu của mình.
// Appearance (filled/outline/clear) quyết định dùng màu nào vào đâu.
export const BUTTON_VARIANT_COLORS = {
  primary: {
    accent:      primary[500],  // main color
    accentHover: primary[700],  // filled hover bg
    accentPress: primary[800],  // filled press bg
    accentLight: primary[50],   // outline/clear hover bg
    accentMid:   primary[100],  // outline/clear press bg
    accentRing:  primary[200],  // focus ring
    textOnFill:  white[100],    // text khi bg là accent
  },
  danger: {
    accent:      red[500],
    accentHover: red[700],
    accentPress: red[800],
    accentLight: red[50],
    accentMid:   red[100],
    accentRing:  red[200],
    textOnFill:  white[100],
  },
  success: {
    accent:      green[500],
    accentHover: green[700],
    accentPress: green[800],
    accentLight: green[50],
    accentMid:   green[100],
    accentRing:  green[200],
    textOnFill:  white[100],
  },
} as const

// ── Disabled state (chung cho mọi variant và appearance) ──────────
export const BUTTON_DISABLED = {
  bg:          grey[200],
  text:        grey[400],
  borderColor: grey[400],
} as const
