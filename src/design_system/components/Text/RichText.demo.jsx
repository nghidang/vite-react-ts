import { useState } from "react";

// ── Design tokens (inlined for demo) ────────────────────────────
const fontFamily   = "'Inter', sans-serif";
const fontWeight   = { regular: 400, medium: 500, semibold: 600 };
const primary      = { 500: '#4E61F6', 50: '#EDEFFE' };
const grey         = { 900: '#131927', 600: '#4D5461', 100: '#F3F4F6', 200: '#E5E7EA', 50: '#F9FAFB' };
const red          = { 500: '#EE443F', 50: '#FDECEC' };
const green        = { 700: '#308242', 50: '#ECF8EF' };

const textFont = {
  h4: { fontSize: 28, lineHeight: 34, fontWeight: fontWeight.semibold, letterSpacing: 0 },
  b1: { fontSize: 16, lineHeight: 24, fontWeight: fontWeight.regular,  letterSpacing: 0 },
  b2: { fontSize: 16, lineHeight: 24, fontWeight: fontWeight.medium,   letterSpacing: 0 },
  b3: { fontSize: 14, lineHeight: 20, fontWeight: fontWeight.regular,  letterSpacing: 0 },
  s1: { fontSize: 18, lineHeight: 28, fontWeight: fontWeight.semibold, letterSpacing: 0 },
  c1: { fontSize: 12, lineHeight: 16, fontWeight: fontWeight.regular,  letterSpacing: 0 },
};

// ── Segment ──────────────────────────────────────────────────────
function Segment({ text, base, bold, color, onClick, underline }) {
  const [focused, setFocused] = useState(false);
  const isInteractive = typeof onClick === 'function';

  const style = {
    fontWeight:     bold ? fontWeight.semibold : base.fontWeight,
    color:          color ?? undefined,
    textDecoration: underline ? 'underline' : 'none',
    cursor:         isInteractive ? 'pointer' : undefined,
    borderRadius:   isInteractive ? '2px' : undefined,
    outline:        focused ? `2px solid ${primary[500]}` : 'none',
    outlineOffset:  '2px',
    fontFamily:     'inherit',
    fontSize:       'inherit',
    lineHeight:     'inherit',
  };

  if (isInteractive) {
    return (
      <span
        role="button"
        tabIndex={0}
        style={style}
        onClick={onClick}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(e)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {text}
      </span>
    );
  }
  return <span style={style}>{text}</span>;
}

// ── RichText ─────────────────────────────────────────────────────
function RichText({ variant = 'b1', as, segments = [], style }) {
  const token = textFont[variant] || textFont.b1;
  const Tag   = as || (variant.startsWith('h') ? variant : 'p');

  const baseStyle = {
    fontFamily,
    fontSize:      `${token.fontSize}px`,
    lineHeight:    `${token.lineHeight}px`,
    fontWeight:    token.fontWeight,
    letterSpacing: `${token.letterSpacing}px`,
    color:         grey[900],
    margin:        0,
    ...style,
  };

  return (
    <Tag style={baseStyle}>
      {segments.map((seg, i) => (
        <Segment key={i} base={token} {...seg} />
      ))}
    </Tag>
  );
}

// ── Helpers ───────────────────────────────────────────────────────
const plain     = (text)           => ({ text });
const highlight = (text, opts={})  => ({ text, bold: opts.bold ?? true, color: opts.color ?? primary[500], underline: opts.underline ?? false });
const action    = (text, onClick, opts={}) => ({ text, bold: opts.bold ?? true, color: opts.color ?? primary[500], underline: opts.underline ?? true, onClick });

// ── Demo ──────────────────────────────────────────────────────────
export default function App() {
  const [log, setLog] = useState([]);

  const addLog = (msg) => setLog(prev => [{ msg, id: Date.now() }, ...prev].slice(0, 5));

  const cases = [
    {
      label: 'Use case 1 — Highlight với bold + color',
      code:  `highlight("email")`,
      node: (
        <RichText variant="b1" segments={[
          plain("Please enter your "),
          highlight("email"),
          plain(" to login"),
        ]} />
      ),
    },
    {
      label: 'Use case 2 — Clickable action segment',
      code:  `action("098xxxxxx", () => call())`,
      node: (
        <RichText variant="b1" segments={[
          plain("Call "),
          action("098xxxxxx", () => addLog('📞 Calling 098xxxxxx...')),
          plain(" to contact us"),
        ]} />
      ),
    },
    {
      label: 'Variant b3 — Bold only, no color change',
      code:  `highlight("Terms of Service", { color: 'inherit' })`,
      node: (
        <RichText variant="b3" segments={[
          plain("By continuing, you agree to our "),
          highlight("Terms of Service", { color: 'inherit' }),
          plain(" and "),
          highlight("Privacy Policy", { color: 'inherit' }),
        ]} />
      ),
    },
    {
      label: 'Danger color highlight',
      code:  `highlight("required", { color: red[500] })`,
      node: (
        <RichText variant="b3" segments={[
          plain("This field is "),
          highlight("required", { color: red[500] }),
          plain(" — please fill it in"),
        ]} />
      ),
    },
    {
      label: 'Multiple actions trong một dòng',
      code:  `action("Sign in", ...) + action("Sign up", ...)`,
      node: (
        <RichText variant="b2" segments={[
          plain("Already have an account? "),
          action("Sign in", () => addLog('→ Navigate to Sign in'), { underline: false }),
          plain("  ·  New here? "),
          action("Sign up", () => addLog('→ Navigate to Sign up'), { underline: false }),
        ]} />
      ),
    },
    {
      label: 'Heading với highlight',
      code:  `variant="h4"`,
      node: (
        <RichText variant="h4" as="h4" segments={[
          plain("Design "),
          highlight("tokens", { color: primary[500] }),
          plain(" for everyone"),
        ]} />
      ),
    },
  ];

  return (
    <div style={{ fontFamily, background: grey[50], minHeight: '100vh', padding: '32px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontFamily, fontSize: 12, fontWeight: fontWeight.medium, color: primary[500], letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 8px' }}>Component</p>
        <h1 style={{ fontFamily, fontSize: 28, fontWeight: fontWeight.semibold, color: grey[900], margin: '0 0 8px' }}>RichText</h1>
        <p style={{ fontFamily, fontSize: 14, fontWeight: fontWeight.regular, color: grey[600], margin: 0, lineHeight: '20px' }}>
          Inline text segments với style và action độc lập — dùng design tokens.
        </p>
      </div>

      {/* API ref */}
      <div style={{ background: '#fff', border: `1px solid ${grey[200]}`, borderRadius: 12, padding: '16px 20px', marginBottom: 32 }}>
        <p style={{ fontFamily, fontSize: 12, fontWeight: fontWeight.semibold, color: grey[600], textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>API helpers</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            ['plain(text)', 'Đoạn text thường'],
            ['highlight(text, opts?)', 'Bold + màu primary (hoặc custom color)'],
            ['action(text, onClick, opts?)', 'Bold + underline + clickable, keyboard accessible'],
          ].map(([sig, desc]) => (
            <div key={sig} style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
              <code style={{ fontFamily: 'monospace', fontSize: 13, color: primary[500], background: primary[50], padding: '1px 8px', borderRadius: 4, whiteSpace: 'nowrap' }}>{sig}</code>
              <span style={{ fontFamily, fontSize: 13, color: grey[600] }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cases */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
        {cases.map(({ label, code, node }, i) => (
          <div key={i} style={{ background: '#fff', border: `1px solid ${grey[200]}`, borderRadius: 12, overflow: 'hidden' }}>
            {/* Label bar */}
            <div style={{ padding: '10px 20px', borderBottom: `1px solid ${grey[100]}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily, fontSize: 12, fontWeight: fontWeight.medium, color: grey[600] }}>{label}</span>
              <code style={{ fontFamily: 'monospace', fontSize: 11, color: grey[600], background: grey[100], padding: '2px 8px', borderRadius: 4 }}>{code}</code>
            </div>
            {/* Preview */}
            <div style={{ padding: '20px 24px' }}>{node}</div>
          </div>
        ))}
      </div>

      {/* Action log */}
      {log.length > 0 && (
        <div style={{ background: '#fff', border: `1px solid ${grey[200]}`, borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <p style={{ fontFamily, fontSize: 12, fontWeight: fontWeight.semibold, color: grey[600], textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Action log</p>
            <button onClick={() => setLog([])} style={{ fontFamily, fontSize: 12, color: grey[600], background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Clear</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {log.map(({ msg, id }, i) => (
              <div key={id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontFamily, fontSize: 13, color: i === 0 ? grey[900] : grey[600] }}>{msg}</span>
                {i === 0 && <span style={{ fontFamily, fontSize: 11, color: green[700], background: green[50], padding: '1px 6px', borderRadius: 4 }}>latest</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
