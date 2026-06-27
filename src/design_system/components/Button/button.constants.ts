// ============================================================
// button.constants.ts
// 🔗 SHARED — dùng cho cả React và React Native
//
// Giá trị extract từ Figma — Design System Community
// https://www.figma.com/design/UR3gk0YIw2va8EsqHfigid/
// ============================================================

// ── Size tokens ───────────────────────────────────────────────────
export const BUTTON_SIZES = {
  giant:  { paddingVertical: 16, paddingHorizontal: 24, borderRadius: 12, fontSize: 18, lineHeight: 24, iconSize: 24, gap: 8 },
  large:  { paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12, fontSize: 16, lineHeight: 20, iconSize: 24, gap: 8 },
  medium: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, fontSize: 14, lineHeight: 16, iconSize: 24, gap: 8 },
  small:  { paddingVertical: 8,  paddingHorizontal: 12, borderRadius: 8,  fontSize: 12, lineHeight: 16, iconSize: 24, gap: 8 },
  tiny:   { paddingVertical: 6,  paddingHorizontal: 8,  borderRadius: 8,  fontSize: 10, lineHeight: 12, iconSize: 16, gap: 8 },
} as const

// ── Color tokens per variant × state ─────────────────────────────
export const BUTTON_COLORS = {
  filled: {
    default:  { bg: '#4E61F6', text: '#FFFFFF', borderColor: 'transparent', borderWidth: 0 },
    hover:    { bg: '#3745AF', text: '#FFFFFF', borderColor: 'transparent', borderWidth: 0 },
    focus:    { bg: '#4E61F6', text: '#FFFFFF', borderColor: 'transparent', borderWidth: 0, focusRing: '#AEB6FB' },
    press:    { bg: '#2B3587', text: '#FFFFFF', borderColor: 'transparent', borderWidth: 0 },
    disabled: { bg: '#E5E7EA', text: '#9EA2AE', borderColor: 'transparent', borderWidth: 0 },
  },
  outline: {
    default:  { bg: 'transparent', text: '#4E61F6', borderColor: '#4E61F6', borderWidth: 1.5 },
    hover:    { bg: '#EDEFFE',     text: '#4E61F6', borderColor: '#4E61F6', borderWidth: 1.5 },
    focus:    { bg: '#FFFFFF',     text: '#4E61F6', borderColor: '#4E61F6', borderWidth: 1.5, focusRing: '#AEB6FB' },
    press:    { bg: '#C8CEFC',     text: '#4E61F6', borderColor: '#4E61F6', borderWidth: 1.5 },
    disabled: { bg: 'transparent', text: '#9EA2AE', borderColor: '#9EA2AE', borderWidth: 1.5 },
  },
  clear: {
    default:  { bg: 'transparent', text: '#4E61F6', borderColor: 'transparent', borderWidth: 0 },
    hover:    { bg: '#EDEFFE',     text: '#4E61F6', borderColor: 'transparent', borderWidth: 0 },
    focus:    { bg: '#FFFFFF',     text: '#4E61F6', borderColor: 'transparent', borderWidth: 0, focusRing: '#AEB6FB' },
    press:    { bg: '#C8CEFC',     text: '#4E61F6', borderColor: 'transparent', borderWidth: 0 },
    disabled: { bg: 'transparent', text: '#9EA2AE', borderColor: 'transparent', borderWidth: 0 },
  },
} as const

export type ButtonState = keyof typeof BUTTON_COLORS.filled
