/**
 * RichText
 * Renders a line of text with inline segments that can have
 * independent style overrides and/or click handlers.
 *
 * Built on the same typography tokens as <Text />.
 *
 * Segment shape:
 * {
 *   text     : string            — content (required)
 *   bold     ?: boolean          — fontWeight 600 (semibold)
 *   color    ?: string           — any CSS color, or import from colors.tokens
 *   onClick  ?: () => void       — makes the span interactive (button role)
 *   underline?: boolean          — text-decoration underline
 * }
 */

import { textFont, buttonFont, fontFamily, fontWeight } from '../tokens/typography.tokens';
import { text as textColors, primary } from '../tokens/colors.tokens';

// ── Token maps (mirrors Text.jsx) ────────────────────────────────
const VARIANTS = {
  h1: textFont.h1, h2: textFont.h2, h3: textFont.h3,
  h4: textFont.h4, h5: textFont.h5,
  s1: textFont.s1, s2: textFont.s2,
  b1: textFont.b1, b2: textFont.b2,
  b3: textFont.b3, b4: textFont.b4,
  c1: textFont.c1, c2: textFont.c2, c3: textFont.c3,
  label: textFont.label,
  'btn-giant':  buttonFont.giant,
  'btn-large':  buttonFont.large,
  'btn-medium': buttonFont.medium,
  'btn-small':  buttonFont.small,
  'btn-tiny':   buttonFont.tiny,
};

const DEFAULT_TAG = {
  h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5',
  s1: 'h6', s2: 'h6',
  b1: 'p',  b2: 'p',  b3: 'p',  b4: 'p',
  c1: 'span', c2: 'span', c3: 'span',
  label: 'span',
  'btn-giant': 'span', 'btn-large': 'span',
  'btn-medium': 'span', 'btn-small': 'span', 'btn-tiny': 'span',
};

// ── Default highlight style (pulled from design tokens) ──────────
const DEFAULT_HIGHLIGHT_COLOR = primary[500];    // #4E61F6
const INTERACTIVE_CURSOR      = 'pointer';
const INTERACTIVE_OUTLINE     = `2px solid ${primary[500]}`;

// ── Segment renderer ─────────────────────────────────────────────
function Segment({ text, base, bold, color, onClick, underline }) {
  const isInteractive = typeof onClick === 'function';

  const style = {
    fontWeight:     bold ? fontWeight.semibold : base.fontWeight,
    color:          color ?? undefined,
    textDecoration: underline ? 'underline' : 'none',
    cursor:         isInteractive ? INTERACTIVE_CURSOR : undefined,
    borderRadius:   isInteractive ? '2px' : undefined,
    // Keep font metrics identical to the parent
    fontFamily:     'inherit',
    fontSize:       'inherit',
    lineHeight:     'inherit',
    letterSpacing:  'inherit',
  };

  if (isInteractive) {
    return (
      <span
        role="button"
        tabIndex={0}
        style={style}
        onClick={onClick}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(e)}
        onFocus={(e)  => (e.currentTarget.style.outline = INTERACTIVE_OUTLINE)}
        onBlur={(e)   => (e.currentTarget.style.outline = 'none')}
      >
        {text}
      </span>
    );
  }

  return <span style={style}>{text}</span>;
}

// ── RichText ─────────────────────────────────────────────────────
export function RichText({
  variant  = 'b1',
  as,
  segments = [],
  style,
  className,
  ...props
}) {
  const token = VARIANTS[variant];

  if (!token) {
    console.warn(`[RichText] Unknown variant: "${variant}"`);
    return null;
  }

  const Tag = as || DEFAULT_TAG[variant] || 'p';

  const baseStyle = {
    fontFamily:    fontFamily.base,
    fontSize:      `${token.fontSize}px`,
    lineHeight:    `${token.lineHeight}px`,
    fontWeight:    token.fontWeight,
    letterSpacing: `${token.letterSpacing}px`,
    color:         textColors.primary,           // Grey/900 — #131927
    margin:        0,
    ...(token.textTransform ? { textTransform: token.textTransform } : {}),
  };

  return (
    <Tag style={{ ...baseStyle, ...style }} className={className} {...props}>
      {segments.map((seg, i) => (
        <Segment key={i} base={token} {...seg} />
      ))}
    </Tag>
  );
}

// ── Helper: build a plain segment ────────────────────────────────
export function plain(text) {
  return { text };
}

// ── Helper: build a highlighted segment (bold + brand color) ─────
export function highlight(text, options = {}) {
  return {
    text,
    bold:      options.bold      ?? true,
    color:     options.color     ?? DEFAULT_HIGHLIGHT_COLOR,
    underline: options.underline ?? false,
  };
}

// ── Helper: build a clickable/action segment ─────────────────────
export function action(text, onClick, options = {}) {
  return {
    text,
    bold:      options.bold      ?? true,
    color:     options.color     ?? DEFAULT_HIGHLIGHT_COLOR,
    underline: options.underline ?? true,
    onClick,
  };
}

export default RichText;

/* ── Usage ───────────────────────────────────────────────────────
 *
 *  import RichText, { plain, highlight, action } from './RichText';
 *
 *  // Use case 1 — inline bold + color highlight
 *  <RichText
 *    variant="b1"
 *    segments={[
 *      plain("Please enter your "),
 *      highlight("email"),
 *      plain(" to login"),
 *    ]}
 *  />
 *
 *  // Use case 2 — clickable action segment
 *  <RichText
 *    variant="b1"
 *    segments={[
 *      plain("Call "),
 *      action("098xxxxxx", () => window.location.href = 'tel:098xxxxxx'),
 *      plain(" to contact us"),
 *    ]}
 *  />
 *
 *  // Custom color override
 *  highlight("email", { color: colors.text.danger })
 *
 *  // Bold only (no color change)
 *  highlight("email", { color: 'inherit', bold: true })
 *
 * ─────────────────────────────────────────────────────────────── */
