import { useState } from "react";

// ── Tokens (inlined for demo) ────────────────────────────────────
const fontFamily  = "'Inter', sans-serif";
const fontWeight  = { regular: 400, medium: 500, semibold: 600 };
const primary     = { 500: '#4E61F6', 50: '#EDEFFE' };
const grey        = { 900: '#131927', 700: '#394050', 600: '#4D5461', 300: '#D2D5DB', 200: '#E5E7EA', 100: '#F3F4F6', 50: '#F9FAFB' };
const red         = { 500: '#EE443F', 50: '#FDECEC' };
const green       = { 600: '#3DA755', 50: '#ECF8EF' };

const textFont = {
  h4: { fontSize: 28, lineHeight: 34, fontWeight: fontWeight.semibold, letterSpacing: 0 },
  s1: { fontSize: 18, lineHeight: 28, fontWeight: fontWeight.semibold, letterSpacing: 0 },
  b1: { fontSize: 16, lineHeight: 24, fontWeight: fontWeight.regular,  letterSpacing: 0 },
  b2: { fontSize: 16, lineHeight: 24, fontWeight: fontWeight.medium,   letterSpacing: 0 },
  b3: { fontSize: 14, lineHeight: 20, fontWeight: fontWeight.regular,  letterSpacing: 0 },
  c1: { fontSize: 12, lineHeight: 16, fontWeight: fontWeight.regular,  letterSpacing: 0 },
};

// ── Text ─────────────────────────────────────────────────────────
const DEFAULT_TAG = {
  h4: 'h4', s1: 'h6',
  b1: 'p', b2: 'p', b3: 'p',
  c1: 'span',
};

function Text({ variant = 'b1', as, style, children }) {
  const token = textFont[variant] || textFont.b1;
  const Tag   = as || DEFAULT_TAG[variant] || 'p';
  return (
    <Tag style={{
      fontFamily, margin: 0,
      fontSize:      `${token.fontSize}px`,
      lineHeight:    `${token.lineHeight}px`,
      fontWeight:    token.fontWeight,
      letterSpacing: `${token.letterSpacing}px`,
      color: grey[900],
      ...style,
    }}>
      {children}
    </Tag>
  );
}

Text.Highlight = function TextHighlight({ color = primary[500], bold = true, style, children }) {
  return (
    <span style={{
      fontWeight:    bold ? fontWeight.semibold : 'inherit',
      color,
      fontFamily:    'inherit', fontSize: 'inherit',
      lineHeight:    'inherit', letterSpacing: 'inherit',
      ...style,
    }}>
      {children}
    </span>
  );
};

Text.Link = function TextLink({ href, onClick, color = primary[500], bold = true, underline = true, style, children }) {
  const [focused, setFocused] = useState(false);
  const baseStyle = {
    fontWeight:     bold ? fontWeight.semibold : 'inherit',
    color,
    textDecoration: underline ? 'underline' : 'none',
    fontFamily: 'inherit', fontSize: 'inherit',
    lineHeight: 'inherit', letterSpacing: 'inherit',
    cursor: 'pointer', borderRadius: '2px',
    outline: focused ? `2px solid ${primary[500]}` : 'none',
    outlineOffset: '2px',
    ...style,
  };
  if (href) {
    return <a href={href} style={baseStyle} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>{children}</a>;
  }
  return (
    <span role="button" tabIndex={0} style={baseStyle}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.(e)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    >{children}</span>
  );
};

// ── Badge ─────────────────────────────────────────────────────────
function Badge({ children, color, bg }) {
  return (
    <span style={{
      fontFamily, fontSize: 11, fontWeight: fontWeight.semibold,
      color, background: bg, padding: '2px 8px',
      borderRadius: 4, letterSpacing: '0.03em',
    }}>
      {children}
    </span>
  );
}

// ── Code pill ────────────────────────────────────────────────────
function Code({ children }) {
  return (
    <code style={{
      fontFamily: 'monospace', fontSize: 12,
      color: primary[500], background: primary[50],
      padding: '2px 8px', borderRadius: 4,
    }}>
      {children}
    </code>
  );
}

// ── Demo row ─────────────────────────────────────────────────────
function Row({ tag, badge, badgeBg, badgeColor, code, children }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${grey[200]}`, borderRadius: 12, overflow: 'hidden' }}>
      <div style={{
        padding: '10px 20px', borderBottom: `1px solid ${grey[100]}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Badge color={badgeColor} bg={badgeBg}>{badge}</Badge>
          <Code>{code}</Code>
        </div>
      </div>
      <div style={{ padding: '20px 24px' }}>{children}</div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────
export default function App() {
  const [log, setLog] = useState(null);

  return (
    <div style={{ fontFamily, background: grey[50], minHeight: '100vh', padding: '32px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <span style={{ fontFamily, fontSize: 11, fontWeight: fontWeight.semibold, color: primary[500], letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Compound Component
        </span>
        <h1 style={{ fontFamily, fontSize: 28, fontWeight: fontWeight.semibold, color: grey[900], margin: '6px 0 8px' }}>
          &lt;Text&gt;
        </h1>
        <p style={{ fontFamily, fontSize: 14, color: grey[600], margin: 0, lineHeight: '20px' }}>
          Subcomponent thừa kế font metrics từ parent — không cần truyền lại <Code>variant</Code>.
        </p>
      </div>

      {/* Subcomponent reference */}
      <div style={{
        background: '#fff', border: `1px solid ${grey[200]}`,
        borderRadius: 12, padding: '16px 20px', marginBottom: 24,
      }}>
        <p style={{ fontFamily, fontSize: 11, fontWeight: fontWeight.semibold, color: grey[600], textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
          Subcomponents
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            {
              name: 'Text.Highlight',
              desc: 'Inline emphasis — bold + color. Dùng cho từ khoá, giá trị quan trọng.',
              props: 'color?, bold?',
              bg: primary[50], color: primary[500],
            },
            {
              name: 'Text.Link',
              desc: 'Inline action — bold + underline + clickable. Render <a> nếu có href, <span role="button"> nếu có onClick.',
              props: 'href? | onClick?, color?, bold?, underline?',
              bg: green[50], color: green[600],
            },
          ].map(({ name, desc, props, bg, color }) => (
            <div key={name} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <Badge color={color} bg={bg}>{name}</Badge>
              <div>
                <p style={{ fontFamily, fontSize: 13, color: grey[700], margin: '0 0 2px', lineHeight: '18px' }}>{desc}</p>
                <Code>{props}</Code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cases */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>

        {/* UC1 */}
        <Row badge="Text.Highlight" badgeBg={primary[50]} badgeColor={primary[500]}
          code={`<Text.Highlight>email</Text.Highlight>`}>
          <Text variant="b1">
            Please enter your <Text.Highlight>email</Text.Highlight> to login
          </Text>
        </Row>

        {/* UC2a — onClick */}
        <Row badge="Text.Link / onClick" badgeBg={green[50]} badgeColor={green[600]}
          code={`<Text.Link onClick={fn}>098xxxxxx</Text.Link>`}>
          <Text variant="b1">
            Call{' '}
            <Text.Link onClick={() => setLog('📞 Calling 098xxxxxx...')}>
              098xxxxxx
            </Text.Link>
            {' '}to contact us
          </Text>
        </Row>

        {/* UC2b — tel: href */}
        <Row badge="Text.Link / href tel:" badgeBg={green[50]} badgeColor={green[600]}
          code={`<Text.Link href="tel:098xxxxxx">098xxxxxx</Text.Link>`}>
          <Text variant="b1">
            Call{' '}
            <Text.Link href="tel:098xxxxxx">098xxxxxx</Text.Link>
            {' '}to contact us
          </Text>
        </Row>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0' }}>
          <div style={{ flex: 1, height: 1, background: grey[200] }} />
          <span style={{ fontFamily, fontSize: 11, color: grey[300], fontWeight: fontWeight.medium, textTransform: 'uppercase', letterSpacing: '0.08em' }}>More use cases</span>
          <div style={{ flex: 1, height: 1, background: grey[200] }} />
        </div>

        {/* bold only */}
        <Row badge="Text.Highlight" badgeBg={primary[50]} badgeColor={primary[500]}
          code={`color="inherit" — bold only`}>
          <Text variant="b3">
            By continuing, you agree to our{' '}
            <Text.Highlight color="inherit">Terms of Service</Text.Highlight>
            {' '}and{' '}
            <Text.Highlight color="inherit">Privacy Policy</Text.Highlight>
          </Text>
        </Row>

        {/* danger */}
        <Row badge="Text.Highlight" badgeBg={red[50]} badgeColor={red[500]}
          code={`color={red[500]}`}>
          <Text variant="b3">
            This field is{' '}
            <Text.Highlight color={red[500]}>required</Text.Highlight>
            {' '}— please fill it in before continuing
          </Text>
        </Row>

        {/* multiple links */}
        <Row badge="Text.Link / onClick" badgeBg={green[50]} badgeColor={green[600]}
          code={`underline={false} — navigation links`}>
          <Text variant="b2">
            Already have an account?{' '}
            <Text.Link onClick={() => setLog('→ Sign in')} underline={false}>Sign in</Text.Link>
            {'  ·  '}New here?{' '}
            <Text.Link onClick={() => setLog('→ Sign up')} underline={false}>Sign up</Text.Link>
          </Text>
        </Row>

        {/* heading */}
        <Row badge="Text.Highlight" badgeBg={primary[50]} badgeColor={primary[500]}
          code={`variant="h4"`}>
          <Text variant="h4" as="h4">
            Design <Text.Highlight>tokens</Text.Highlight> for everyone
          </Text>
        </Row>

      </div>

      {/* Action log */}
      {log && (
        <div style={{
          background: '#fff', border: `1px solid ${grey[200]}`,
          borderRadius: 12, padding: '14px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <Text variant="b3" style={{ color: grey[700] }}>{log}</Text>
          <button onClick={() => setLog(null)} style={{
            fontFamily, fontSize: 12, color: grey[600],
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}>
            Dismiss
          </button>
        </div>
      )}

    </div>
  );
}
