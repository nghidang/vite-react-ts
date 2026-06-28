/**
 * Spacing & Border Radius Design Tokens
 * Source: Figma — Design System Community (design-tokens_tokens.json)
 *
 * Primitive scale (shared base):
 *   0 → 0   |  1 → 4   |  2 → 8
 *   3 → 12  |  4 → 16  |  5 → 20  |  6 → 24  (px)
 */

// ── Primitive scale ───────────────────────────────────────────────
const scale = { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24 };

// ================================================================
//  SPACING TOKENS
//  Use for: padding, margin, gap, width, height
// ================================================================

export const spacing = {
  none: scale[0],  //  0px
  xxs:  scale[1],  //  4px
  xs:   scale[2],  //  8px
  sm:   scale[3],  // 12px
  md:   scale[4],  // 16px
  lg:   scale[5],  // 20px
  xl:   scale[6],  // 24px
};

// ================================================================
//  BORDER RADIUS TOKENS
//  Use for: border-radius on components
// ================================================================

export const radius = {
  xxs:  scale[1],  //  4px — chip, badge, tag
  xs:   scale[2],  //  8px — button, input
  sm:   scale[3],  // 12px — card small
  md:   scale[4],  // 16px — card default
  lg:   scale[5],  // 20px — card large
  xl:   scale[6],  // 24px — modal, container
  full: 9999,      // pill / fully rounded
};

// ================================================================
//  SEMANTIC SPACING — component-level slots
// ================================================================

export const componentSpacing = {
  // Button padding [y, x]
  btn: {
    giant:  { y: spacing.sm,  x: spacing.xl },   // 12px 24px
    large:  { y: spacing.xs,  x: spacing.lg },   //  8px 20px
    medium: { y: spacing.xs,  x: spacing.md },   //  8px 16px
    small:  { y: spacing.xxs, x: spacing.sm },   //  4px 12px
  },

  // Card
  card: {
    padding: spacing.md,  // 16px
    radius:  radius.sm,   // 12px
  },

  // Input
  input: {
    paddingY: spacing.xs,  //  8px
    paddingX: spacing.sm,  // 12px
    radius:   radius.xs,   //  8px
  },

  // Modal / Dialog
  modal: {
    padding: spacing.xl,  // 24px
    radius:  radius.xl,   // 24px
  },

  // Layout gap
  gap: {
    xs: spacing.xs,  //  8px
    sm: spacing.sm,  // 12px
    md: spacing.md,  // 16px
    lg: spacing.xl,  // 24px
  },
};

// ── Helper: convert to px string ─────────────────────────────────
export function px(value) {
  return `${value}px`;
}

// ── Default export ────────────────────────────────────────────────
const spacingTokens = {
  spacing,
  radius,
  component: componentSpacing,
  px,
};

export default spacingTokens;

/* ── Usage examples ─────────────────────────────────────────────
 *
 *  // CSS-in-JS (styled-components / Emotion)
 *  import { spacing, radius, componentSpacing, px } from './spacing.tokens';
 *
 *  const Button = styled.button`
 *    padding: ${px(componentSpacing.btn.large.y)} ${px(componentSpacing.btn.large.x)};
 *    border-radius: ${px(radius.xs)};
 *  `;
 *
 *  const Card = styled.div`
 *    padding: ${px(componentSpacing.card.padding)};
 *    border-radius: ${px(componentSpacing.card.radius)};
 *  `;
 *
 *  // Inline style
 *  <div style={{ padding: px(spacing.md), borderRadius: px(radius.sm) }} />
 *
 * ─────────────────────────────────────────────────────────────── */
