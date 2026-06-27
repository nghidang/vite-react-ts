/**
 * Typography Design Tokens
 * Source: Figma — Design System Community
 * https://www.figma.com/design/UR3gk0YIw2va8EsqHfigid/
 * Font: Inter
 */

// ── Font Family ─────────────────────────────────────────────────
export const fontFamily = {
  base: "'Inter', sans-serif",
};

// ── Font Weights ─────────────────────────────────────────────────
export const fontWeight = {
  regular:  400,
  medium:   500,
  semibold: 600,
};

// ================================================================
//  TEXT FONT
// ================================================================

export const textFont = {

  // ── Headlines ─────────────────────────────────────────────────
  h1: { fontSize: 48, lineHeight: 58, fontWeight: fontWeight.semibold, letterSpacing: 0 },
  h2: { fontSize: 40, lineHeight: 48, fontWeight: fontWeight.semibold, letterSpacing: 0 },
  h3: { fontSize: 32, lineHeight: 38, fontWeight: fontWeight.semibold, letterSpacing: 0 },
  h4: { fontSize: 28, lineHeight: 34, fontWeight: fontWeight.semibold, letterSpacing: 0 },
  h5: { fontSize: 24, lineHeight: 28, fontWeight: fontWeight.semibold, letterSpacing: 0 },

  // ── Subtitles ──────────────────────────────────────────────────
  s1: { fontSize: 18, lineHeight: 28, fontWeight: fontWeight.semibold, letterSpacing: 0 },
  s2: { fontSize: 16, lineHeight: 24, fontWeight: fontWeight.semibold, letterSpacing: 0 },

  // ── Body ───────────────────────────────────────────────────────
  b1: { fontSize: 16, lineHeight: 24, fontWeight: fontWeight.regular,  letterSpacing: 0 },
  b2: { fontSize: 16, lineHeight: 24, fontWeight: fontWeight.medium,   letterSpacing: 0 },
  b3: { fontSize: 14, lineHeight: 20, fontWeight: fontWeight.regular,  letterSpacing: 0 },
  b4: { fontSize: 14, lineHeight: 20, fontWeight: fontWeight.medium,   letterSpacing: 0 },

  // ── Captions ───────────────────────────────────────────────────
  c1: { fontSize: 12, lineHeight: 16, fontWeight: fontWeight.regular,  letterSpacing: 0 },
  c2: { fontSize: 12, lineHeight: 16, fontWeight: fontWeight.medium,   letterSpacing: 0 },
  c3: { fontSize: 10, lineHeight: 14, fontWeight: fontWeight.medium,   letterSpacing: 0 },

  // ── Label ──────────────────────────────────────────────────────
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: fontWeight.medium,
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
};

// ================================================================
//  BUTTON FONT
// ================================================================

export const buttonFont = {
  giant:  { fontSize: 18, lineHeight: 24, fontWeight: fontWeight.semibold, letterSpacing: 0 },
  large:  { fontSize: 16, lineHeight: 20, fontWeight: fontWeight.semibold, letterSpacing: 0 },
  medium: { fontSize: 14, lineHeight: 16, fontWeight: fontWeight.semibold, letterSpacing: 0 },
  small:  { fontSize: 12, lineHeight: 16, fontWeight: fontWeight.semibold, letterSpacing: 0 },
  tiny:   { fontSize: 10, lineHeight: 12, fontWeight: fontWeight.semibold, letterSpacing: 0 },
};

// ── Helpers ──────────────────────────────────────────────────────
// Converts a token to React inline style (values in px strings)
export function toStyle(token) {
  const style = {
    fontFamily: fontFamily.base,
    fontSize:     `${token.fontSize}px`,
    lineHeight:   `${token.lineHeight}px`,
    fontWeight:   token.fontWeight,
    letterSpacing: `${token.letterSpacing}px`,
  };
  if (token.textTransform) style.textTransform = token.textTransform;
  return style;
}

// ── Default export ────────────────────────────────────────────────
const typography = {
  fontFamily,
  fontWeight,
  text:   textFont,
  button: buttonFont,
  toStyle,
};

export default typography;
