/**
 * Text — compound component
 *
 * <Text variant="b1">Block-level text</Text>
 *
 * Subcomponents (inline, inherit parent font metrics):
 *   <Text.Highlight> — bold + brand color  (use case 1)
 *   <Text.Link>      — bold + clickable     (use case 2)
 *
 * Usage:
 *   <Text variant="b1">
 *     Please enter your <Text.Highlight>email</Text.Highlight> to login
 *   </Text>
 *
 *   <Text variant="b1">
 *     Call <Text.Link onClick={() => call()}>098xxxxxx</Text.Link> to contact us
 *   </Text>
 */

import { useState } from 'react';
import { textFont, buttonFont, fontFamily, fontWeight } from '../tokens/typography.tokens';
import { primary }                                      from '../tokens/colors.tokens';

// ── Token maps ────────────────────────────────────────────────────
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

// ================================================================
//  Text — block / flow element
// ================================================================
export function Text({ variant = 'b1', as, style, className, children, ...props }) {
  const token = VARIANTS[variant];

  if (!token) {
    console.warn(`[Text] Unknown variant: "${variant}". Valid: ${Object.keys(VARIANTS).join(', ')}`);
    return null;
  }

  const Tag = as || DEFAULT_TAG[variant] || 'p';

  const baseStyle = {
    fontFamily:    fontFamily.base,
    fontSize:      `${token.fontSize}px`,
    lineHeight:    `${token.lineHeight}px`,
    fontWeight:    token.fontWeight,
    letterSpacing: `${token.letterSpacing}px`,
    margin:        0,
    ...(token.textTransform ? { textTransform: token.textTransform } : {}),
  };

  return (
    <Tag style={{ ...baseStyle, ...style }} className={className} {...props}>
      {children}
    </Tag>
  );
}

// ================================================================
//  Text.Highlight — inline emphasis (use case 1)
//
//  Renders as <span>. Inherits font-size / line-height từ parent.
//  Mặc định: semibold + primary[500].
//
//  Props:
//    color?  string   — CSS color. Default: primary[500] (#4E61F6)
//    bold?   boolean  — fontWeight semibold. Default: true
//    style?  object   — style override
// ================================================================
Text.Highlight = function TextHighlight({
  color  = primary[500],
  bold   = true,
  style,
  children,
}) {
  return (
    <span
      style={{
        fontWeight:     bold ? fontWeight.semibold : 'inherit',
        color,
        fontFamily:     'inherit',
        fontSize:       'inherit',
        lineHeight:     'inherit',
        letterSpacing:  'inherit',
        ...style,
      }}
    >
      {children}
    </span>
  );
};

// ================================================================
//  Text.Link — inline interactive element (use case 2)
//
//  Có 2 chế độ:
//    • href  → render <a> (navigation / tel: / mailto:)
//    • onClick → render <span role="button"> (custom action)
//
//  Cả hai đều: keyboard accessible (Enter / Space), focus outline.
//
//  Props:
//    href?       string     — URL, tel:xxx, mailto:xxx
//    onClick?    function   — custom action handler
//    color?      string     — CSS color. Default: primary[500]
//    bold?       boolean    — fontWeight semibold. Default: true
//    underline?  boolean    — text-decoration. Default: true
//    style?      object     — style override
// ================================================================
Text.Link = function TextLink({
  href,
  onClick,
  color      = primary[500],
  bold       = true,
  underline  = true,
  style,
  children,
  ...props
}) {
  const [focused, setFocused] = useState(false);

  const baseStyle = {
    fontWeight:     bold ? fontWeight.semibold : 'inherit',
    color,
    textDecoration: underline ? 'underline' : 'none',
    fontFamily:     'inherit',
    fontSize:       'inherit',
    lineHeight:     'inherit',
    letterSpacing:  'inherit',
    cursor:         'pointer',
    outline:        focused ? `2px solid ${primary[500]}` : 'none',
    outlineOffset:  '2px',
    borderRadius:   '2px',
    ...style,
  };

  // ── <a> mode — navigation / tel / mailto ─────────────────────
  if (href) {
    return (
      <a
        href={href}
        style={baseStyle}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      >
        {children}
      </a>
    );
  }

  // ── <span role="button"> mode — custom action ─────────────────
  return (
    <span
      role="button"
      tabIndex={0}
      style={baseStyle}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.(e)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...props}
    >
      {children}
    </span>
  );
};

// ── Display names (React DevTools) ───────────────────────────────
Text.Highlight.displayName = 'Text.Highlight';
Text.Link.displayName      = 'Text.Link';

export default Text;

/* ── Examples ────────────────────────────────────────────────────
 *
 *  // Use case 1 — Highlight
 *  <Text variant="b1">
 *    Please enter your <Text.Highlight>email</Text.Highlight> to login
 *  </Text>
 *
 *  // Use case 2 — tel: link
 *  <Text variant="b1">
 *    Call <Text.Link href="tel:0981234567">098xxxxxx</Text.Link> to contact us
 *  </Text>
 *
 *  // Use case 2 — custom action
 *  <Text variant="b1">
 *    Call <Text.Link onClick={() => openDialer()}>098xxxxxx</Text.Link> to contact us
 *  </Text>
 *
 *  // Custom color
 *  <Text.Highlight color={red[500]}>required</Text.Highlight>
 *
 *  // Bold only, no color
 *  <Text.Highlight color="inherit">Terms of Service</Text.Highlight>
 *
 *  // Link without underline
 *  <Text.Link onClick={...} underline={false}>Sign in</Text.Link>
 *
 * ─────────────────────────────────────────────────────────────── */
