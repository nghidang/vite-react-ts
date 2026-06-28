/**
 * Shadow Design Tokens
 * Source: Figma — Design System Community
 * https://www.figma.com/design/UR3gk0YIw2va8EsqHfigid/
 *
 * Each shadow is a two-layer CSS box-shadow:
 *   layer 1 — tight sharp shadow  (depth cue)
 *   layer 2 — diffuse ambient shadow (elevation spread)
 *
 * Shadow color base: #131927 (Grey/900)
 * Format: "offset-x offset-y blur spread color, ..."
 */

// ── Shadow color base ────────────────────────────────────────────
const c08 = 'rgba(19, 25, 39, 0.08)';
const c10 = 'rgba(19, 25, 39, 0.10)';
const c12 = 'rgba(19, 25, 39, 0.12)';
const c14 = 'rgba(19, 25, 39, 0.14)';

// ── Palette ──────────────────────────────────────────────────────
export const shadow = {
  /** Resting / subtle */
  100: `0px 2px  4px -2px ${c12}, 0px 4px  4px -2px ${c08}`,
  200: `0px 4px  6px -4px ${c12}, 0px 8px  8px -4px ${c08}`,
  300: `0px 6px  8px -6px ${c12}, 0px 8px  16px -6px ${c08}`,
  400: `0px 6px  12px -6px ${c12}, 0px 8px  24px -4px ${c08}`,
  500: `0px 6px  14px -6px ${c12}, 0px 10px 32px -4px ${c10}`,
  600: `0px 8px  18px -6px ${c12}, 0px 12px 42px -4px ${c12}`,
  700: `0px 8px  22px -6px ${c12}, 0px 14px 64px -4px ${c12}`,
  /** Floating / high elevation */
  800: `0px 8px  28px -6px ${c12}, 0px 18px 88px -4px ${c14}`,
};

// ── Structured format (for CSS-in-JS or animation libs) ─────────
export const shadowLayers = {
  100: [
    { offsetX: 0, offsetY:  2, blur:  4, spread: -2, color: c12 },
    { offsetX: 0, offsetY:  4, blur:  4, spread: -2, color: c08 },
  ],
  200: [
    { offsetX: 0, offsetY:  4, blur:  6, spread: -4, color: c12 },
    { offsetX: 0, offsetY:  8, blur:  8, spread: -4, color: c08 },
  ],
  300: [
    { offsetX: 0, offsetY:  6, blur:  8, spread: -6, color: c12 },
    { offsetX: 0, offsetY:  8, blur: 16, spread: -6, color: c08 },
  ],
  400: [
    { offsetX: 0, offsetY:  6, blur: 12, spread: -6, color: c12 },
    { offsetX: 0, offsetY:  8, blur: 24, spread: -4, color: c08 },
  ],
  500: [
    { offsetX: 0, offsetY:  6, blur: 14, spread: -6, color: c12 },
    { offsetX: 0, offsetY: 10, blur: 32, spread: -4, color: c10 },
  ],
  600: [
    { offsetX: 0, offsetY:  8, blur: 18, spread: -6, color: c12 },
    { offsetX: 0, offsetY: 12, blur: 42, spread: -4, color: c12 },
  ],
  700: [
    { offsetX: 0, offsetY:  8, blur: 22, spread: -6, color: c12 },
    { offsetX: 0, offsetY: 14, blur: 64, spread: -4, color: c12 },
  ],
  800: [
    { offsetX: 0, offsetY:  8, blur: 28, spread: -6, color: c12 },
    { offsetX: 0, offsetY: 18, blur: 88, spread: -4, color: c14 },
  ],
};

// ── Semantic tokens ───────────────────────────────────────────────
export const shadowSemantic = {
  card:       shadow[100],   // default card, tile
  cardHover:  shadow[300],   // card on hover
  dropdown:   shadow[300],   // dropdown menu
  popover:    shadow[400],   // tooltip, popover
  modal:      shadow[600],   // dialog, modal
  drawer:     shadow[700],   // side drawer
  overlay:    shadow[800],   // floating panel
};

// ── Helper: convert layers to CSS box-shadow string ──────────────
export function layersToBoxShadow(layers) {
  return layers
    .map(({ offsetX, offsetY, blur, spread, color }) =>
      `${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}`
    )
    .join(', ');
}

// ── Default export ────────────────────────────────────────────────
const shadows = {
  shadow,
  shadowLayers,
  semantic: shadowSemantic,
  layersToBoxShadow,
};

export default shadows;

/* ── Usage examples ─────────────────────────────────────────────
 *
 *  // CSS-in-JS (styled-components / Emotion)
 *  import { shadow, shadowSemantic } from './shadow.tokens';
 *
 *  const Card = styled.div`
 *    box-shadow: ${shadow[100]};
 *    &:hover { box-shadow: ${shadow[300]}; }
 *  `;
 *
 *  const Modal = styled.div`
 *    box-shadow: ${shadowSemantic.modal};
 *  `;
 *
 *  // Inline style
 *  <div style={{ boxShadow: shadow[200] }} />
 *
 * ─────────────────────────────────────────────────────────────── */
