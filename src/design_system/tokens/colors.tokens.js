/**
 * Color Design Tokens
 * Source: Figma — Design System Community
 * https://www.figma.com/design/UR3gk0YIw2va8EsqHfigid/
 */

// ── Black (alpha scale) ──────────────────────────────────────────
export const black = {
  100: 'rgba(0, 0, 0, 1.00)',
  90:  'rgba(0, 0, 0, 0.90)',
  80:  'rgba(0, 0, 0, 0.80)',
  70:  'rgba(0, 0, 0, 0.70)',
  60:  'rgba(0, 0, 0, 0.60)',
  50:  'rgba(0, 0, 0, 0.50)',
  40:  'rgba(0, 0, 0, 0.40)',
  30:  'rgba(0, 0, 0, 0.30)',
  20:  'rgba(0, 0, 0, 0.20)',
  10:  'rgba(0, 0, 0, 0.10)',
};

// ── White (alpha scale) ──────────────────────────────────────────
export const white = {
  100: 'rgba(255, 255, 255, 1.00)',
  90:  'rgba(255, 255, 255, 0.90)',
  80:  'rgba(255, 255, 255, 0.80)',
  70:  'rgba(255, 255, 255, 0.70)',
  60:  'rgba(255, 255, 255, 0.60)',
  50:  'rgba(255, 255, 255, 0.50)',
  40:  'rgba(255, 255, 255, 0.40)',
  30:  'rgba(255, 255, 255, 0.30)',
  20:  'rgba(255, 255, 255, 0.20)',
  10:  'rgba(255, 255, 255, 0.10)',
};

// ── Primary ──────────────────────────────────────────────────────
export const primary = {
  900: '#212967',
  800: '#2B3587',
  700: '#3745AF',
  600: '#4758E0',
  500: '#4E61F6',
  400: '#7181F8',
  300: '#8895F9',
  200: '#AEB6FB',
  100: '#C8CEFC',
  50:  '#EDEFFE',
};

// ── Grey ─────────────────────────────────────────────────────────
export const grey = {
  900: '#131927',
  800: '#212936',
  700: '#394050',
  600: '#4D5461',
  500: '#6D717F',
  400: '#9EA2AE',
  300: '#D2D5DB',
  200: '#E5E7EA',
  100: '#F3F4F6',
  50:  '#F9FAFB',
};

// ── Green / Success ──────────────────────────────────────────────
export const green = {
  900: '#1C4D27',
  800: '#256533',
  700: '#308242',
  600: '#3DA755',
  500: '#43B75D',
  400: '#69C57D',
  300: '#81CF92',
  200: '#A9DEB4',
  100: '#C5E9CD',
  50:  '#ECF8EF',
};

// ── Red / Danger ─────────────────────────────────────────────────
export const red = {
  900: '#641D1A',
  800: '#832523',
  700: '#A9302D',
  600: '#D93E39',
  500: '#EE443F',
  400: '#F16965',
  300: '#F4827E',
  200: '#F7A9A7',
  100: '#FAC5C3',
  50:  '#FDECEC',
};

// ── Yellow / Warning ─────────────────────────────────────────────
export const yellow = {
  900: '#6B4700',
  800: '#8C5E00',
  700: '#B57900',
  600: '#E89B00',
  500: '#FFAA00',
  400: '#FFBB33',
  300: '#FFC654',
  200: '#FFD88A',
  100: '#FFE5B0',
  50:  '#FFF7E6',
};

// ── Blue / Info ──────────────────────────────────────────────────
export const blue = {
  900: '#003F6B',
  800: '#00528C',
  700: '#006AB5',
  600: '#0088E8',
  500: '#0095FF',
  400: '#33AAFF',
  300: '#54B8FF',
  200: '#8ACEFF',
  100: '#B0DEFF',
  50:  '#E6F4FF',
};

// ================================================================
//  SEMANTIC TOKENS
//  Map palette values to UI roles.
// ================================================================

export const text = {
  primary:   grey[900],
  secondary: grey[600],
  tertiary:  grey[400],
  disabled:  grey[300],
  inverse:   white[100],
  link:      primary[500],
  success:   green[700],
  danger:    red[600],
  warning:   yellow[700],
  info:      blue[700],
};

export const surface = {
  white:   white[100],
  subtle:  grey[50],
  muted:   grey[100],
  overlay: black[50],
};

export const border = {
  default: grey[200],
  strong:  grey[300],
  focus:   primary[500],
};

export const action = {
  primary:       primary[500],
  primaryHover:  primary[600],
  primaryActive: primary[700],
  primarySubtle: primary[50],
};

export const status = {
  success:        green[500],
  successSubtle:  green[50],
  danger:         red[500],
  dangerSubtle:   red[50],
  warning:        yellow[500],
  warningSubtle:  yellow[50],
  info:           blue[500],
  infoSubtle:     blue[50],
};

// ── Default export ────────────────────────────────────────────────
const colors = {
  // Palette
  black,
  white,
  primary,
  grey,
  green,
  red,
  yellow,
  blue,

  // Semantic
  text,
  surface,
  border,
  action,
  status,
};

export default colors;
