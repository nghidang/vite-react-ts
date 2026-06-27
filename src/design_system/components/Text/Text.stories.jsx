/**
 * Text.stories.jsx
 *
 * Covers:
 *   • Text          — 20 variants (h1-h5, s1-s2, b1-b4, c1-c3, label, btn-*)
 *   • Text.Highlight — inline emphasis
 *   • Text.Link      — inline interactive element
 *   • Composed       — real use cases
 */

import { fn } from '@storybook/test';
// Storybook 7 fallback: import { action as fn } from '@storybook/addon-actions';

import Text from './Text';

// ── Color values (tránh import thêm file token vào stories) ──────
const color = {
  primary:  '#4E61F6',
  red:      '#EE443F',
  green:    '#308242',
  grey900:  '#131927',
  grey600:  '#4D5461',
  grey400:  '#9EA2AE',
  grey200:  '#E5E7EA',
  grey100:  '#F3F4F6',
};

// ── Variant lists ─────────────────────────────────────────────────
const TEXT_VARIANTS = [
  'h1','h2','h3','h4','h5',
  's1','s2',
  'b1','b2','b3','b4',
  'c1','c2','c3',
  'label',
];
const BTN_VARIANTS = ['btn-giant','btn-large','btn-medium','btn-small','btn-tiny'];
const ALL_VARIANTS = [...TEXT_VARIANTS, ...BTN_VARIANTS];

// ── Sample text per variant ───────────────────────────────────────
const SAMPLE = {
  h1: 'H1. Headline',
  h2: 'H2. Headline',
  h3: 'H3. Headline',
  h4: 'H4. Headline',
  h5: 'H5. Headline',
  s1: 'S1. Subtitle',
  s2: 'S2. Subtitle',
  b1: 'B1. Body — The quick brown fox jumps over the lazy dog',
  b2: 'B2. Body — The quick brown fox jumps over the lazy dog',
  b3: 'B3. Body — The quick brown fox jumps over the lazy dog',
  b4: 'B4. Body — The quick brown fox jumps over the lazy dog',
  c1: 'C1. Caption',
  c2: 'C2. Caption',
  c3: 'C3. Caption',
  label: 'Label',
  'btn-giant':  'Button Giant',
  'btn-large':  'Button Large',
  'btn-medium': 'Button Medium',
  'btn-small':  'Button Small',
  'btn-tiny':   'Button Tiny',
};

// ── Shared render helpers ─────────────────────────────────────────
const fontFamily = "'Inter', sans-serif";

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <p style={{
        fontFamily, fontSize: 11, fontWeight: 600,
        color: color.grey400, textTransform: 'uppercase',
        letterSpacing: '0.08em', margin: '0 0 16px',
        paddingBottom: 8, borderBottom: `1px solid ${color.grey200}`,
      }}>
        {title}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {children}
      </div>
    </div>
  );
}

function VariantRow({ variant }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
      <code style={{
        fontFamily: 'monospace', fontSize: 11,
        color: color.grey400, minWidth: 100, flexShrink: 0,
      }}>
        {variant}
      </code>
      <Text variant={variant} style={{ color: color.grey900 }}>
        {SAMPLE[variant]}
      </Text>
    </div>
  );
}

// ================================================================
//  Meta
// ================================================================
const meta = {
  title: 'Typography/Text',
  component: Text,
  subcomponents: {
    'Text.Highlight': Text.Highlight,
    'Text.Link':      Text.Link,
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
\`Text\` là compound component cho hệ thống typography.

| Subcomponent | Mô tả |
|---|---|
| \`<Text.Highlight>\` | Inline emphasis — bold + color. Kế thừa font metrics từ parent. |
| \`<Text.Link>\` | Inline interactive — render \`<a>\` nếu có \`href\`, render \`<span role="button">\` nếu có \`onClick\`. |
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ALL_VARIANTS,
      description: 'Typography variant từ design tokens',
      table: {
        defaultValue: { summary: 'b1' },
        type: { summary: ALL_VARIANTS.join(' | ') },
      },
    },
    as: {
      control: 'text',
      description: 'Override HTML element. Mặc định suy ra từ `variant` (vd: h1→`<h1>`, b1→`<p>`).',
      table: { type: { summary: 'keyof JSX.IntrinsicElements' } },
    },
    children: {
      control: 'text',
      description: 'Text content. Có thể chứa `Text.Highlight` hoặc `Text.Link`.',
    },
    style:     { control: false },
    className: { control: false },
  },
};

export default meta;


// ================================================================
//  1. Playground
// ================================================================
export const Playground = {
  args: {
    variant: 'b1',
    children: 'The quick brown fox jumps over the lazy dog',
  },
  parameters: {
    docs: {
      description: {
        story: 'Dùng **Controls panel** để thay đổi `variant` và `children` và xem live preview.',
      },
    },
  },
};


// ================================================================
//  2. All Variants
// ================================================================
export const AllVariants = {
  name: 'All Variants',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Spec sheet — toàn bộ 20 variants với font size, line-height, và weight từ Figma.',
      },
    },
  },
  render: () => (
    <div style={{ fontFamily, color: color.grey900 }}>
      <Section title="Headlines — Semi Bold">
        {['h1','h2','h3','h4','h5'].map(v => <VariantRow key={v} variant={v} />)}
      </Section>
      <Section title="Subtitles — Semi Bold">
        {['s1','s2'].map(v => <VariantRow key={v} variant={v} />)}
      </Section>
      <Section title="Body">
        {['b1','b2','b3','b4'].map(v => <VariantRow key={v} variant={v} />)}
      </Section>
      <Section title="Captions">
        {['c1','c2','c3'].map(v => <VariantRow key={v} variant={v} />)}
      </Section>
      <Section title="Label — Uppercase">
        <VariantRow variant="label" />
      </Section>
      <Section title="Button Font — Semi Bold">
        {BTN_VARIANTS.map(v => <VariantRow key={v} variant={v} />)}
      </Section>
    </div>
  ),
};


// ================================================================
//  3. Tag override
// ================================================================
export const TagOverride = {
  name: 'as — Tag Override',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Prop `as` override HTML element. Hữu ích khi cần tách visual style khỏi semantic HTML (vd: `h1` look nhưng render `div` để tránh duplicate heading).',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[
        { variant: 'h3', as: 'div',  label: 'as="div"' },
        { variant: 'b1', as: 'span', label: 'as="span"', style: { display: 'block' } },
        { variant: 'b3', as: 'label',label: 'as="label"' },
      ].map(({ variant, as, label, style }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
          <code style={{ fontFamily: 'monospace', fontSize: 11, color: color.grey400, minWidth: 120 }}>
            {label}
          </code>
          <Text variant={variant} as={as} style={style}>
            Variant {variant} rendered as &lt;{as}&gt;
          </Text>
        </div>
      ))}
    </div>
  ),
};


// ================================================================
//  4. Text.Highlight
// ================================================================
export const HighlightDefault = {
  name: 'Text.Highlight — Default',
  parameters: {
    docs: {
      description: {
        story: 'Mặc định: **semibold** + **primary[500]** `#4E61F6`. Kế thừa `font-size`, `line-height`, `letter-spacing` từ parent `<Text>`.',
      },
    },
  },
  render: () => (
    <Text variant="b1">
      Please enter your <Text.Highlight>email</Text.Highlight> to login
    </Text>
  ),
};

export const HighlightColors = {
  name: 'Text.Highlight — color',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Override `color` để map vào các semantic colors. Dùng `"inherit"` để chỉ thay đổi weight, không đổi màu.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {[
        { label: 'default (primary)',  colorVal: undefined          },
        { label: 'danger  (#EE443F)', colorVal: color.red          },
        { label: 'success (#308242)', colorVal: color.green        },
        { label: 'inherit — bold only', colorVal: 'inherit'        },
      ].map(({ label, colorVal }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
          <code style={{ fontFamily: 'monospace', fontSize: 11, color: color.grey400, minWidth: 200 }}>
            {label}
          </code>
          <Text variant="b1">
            This field is{' '}
            <Text.Highlight {...(colorVal !== undefined ? { color: colorVal } : {})}>
              required
            </Text.Highlight>
            {' '}— please fill in
          </Text>
        </div>
      ))}
    </div>
  ),
};

export const HighlightBold = {
  name: 'Text.Highlight — bold={false}',
  parameters: {
    docs: {
      description: {
        story: '`bold={false}` kế thừa font-weight từ parent — chỉ thay đổi màu.',
      },
    },
  },
  render: () => (
    <Text variant="b1">
      Items marked in{' '}
      <Text.Highlight bold={false}>blue</Text.Highlight>
      {' '}are optional
    </Text>
  ),
};

export const HighlightAcrossVariants = {
  name: 'Text.Highlight — Across Variants',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: '`Text.Highlight` tự scale đúng với mọi `variant` của parent — không cần truyền lại font-size.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {['h4','s1','b1','b3','c1'].map(v => (
        <div key={v} style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
          <code style={{ fontFamily: 'monospace', fontSize: 11, color: color.grey400, minWidth: 40 }}>
            {v}
          </code>
          <Text variant={v} as={v.startsWith('h') ? v : 'p'}>
            Design <Text.Highlight>tokens</Text.Highlight> for everyone
          </Text>
        </div>
      ))}
    </div>
  ),
};


// ================================================================
//  5. Text.Link
// ================================================================
export const LinkAction = {
  name: 'Text.Link — onClick',
  parameters: {
    docs: {
      description: {
        story: 'Render `<span role="button" tabIndex={0}>`. Click hoặc nhấn **Enter / Space** để trigger `onClick`. Dùng khi cần custom logic thay vì navigate.',
      },
    },
  },
  render: () => (
    <Text variant="b1">
      Call{' '}
      <Text.Link onClick={fn('Text.Link onClick')}>098xxxxxx</Text.Link>
      {' '}to contact us
    </Text>
  ),
};

export const LinkHrefTel = {
  name: 'Text.Link — href tel:',
  parameters: {
    docs: {
      description: {
        story: 'Render `<a href="tel:...">`. Browser/OS tự xử lý native dialler. Ưu tiên dùng khi không cần custom logic.',
      },
    },
  },
  render: () => (
    <Text variant="b1">
      Call{' '}
      <Text.Link href="tel:098xxxxxx">098xxxxxx</Text.Link>
      {' '}to contact us
    </Text>
  ),
};

export const LinkHrefUrl = {
  name: 'Text.Link — href url',
  parameters: {
    docs: {
      description: {
        story: 'Render `<a href="...">` cho external/internal navigation.',
      },
    },
  },
  render: () => (
    <Text variant="b3">
      Read our{' '}
      <Text.Link href="/terms">Terms of Service</Text.Link>
      {' '}and{' '}
      <Text.Link href="/privacy">Privacy Policy</Text.Link>
    </Text>
  ),
};

export const LinkNoUnderline = {
  name: 'Text.Link — underline={false}',
  parameters: {
    docs: {
      description: {
        story: 'Dùng khi visual affordance đến từ màu và weight — không cần underline. Phù hợp cho navigation links trong body text.',
      },
    },
  },
  render: () => (
    <Text variant="b2">
      Already have an account?{' '}
      <Text.Link onClick={fn('sign-in')} underline={false}>Sign in</Text.Link>
      {'  ·  '}New here?{' '}
      <Text.Link onClick={fn('sign-up')} underline={false}>Sign up</Text.Link>
    </Text>
  ),
};

export const LinkKeyboardA11y = {
  name: 'Text.Link — Keyboard & Focus',
  parameters: {
    docs: {
      description: {
        story: 'Tab đến link → focus outline xuất hiện (dùng `primary[500]`). Nhấn **Enter** hoặc **Space** để trigger. Chỉ `<span role="button">` mode — `<a>` có sẵn accessibility của browser.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Text variant="b1">
        Tab đến đây →{' '}
        <Text.Link onClick={fn('keyboard-action')}>098xxxxxx</Text.Link>
        {' '}rồi nhấn Enter hoặc Space
      </Text>
      <Text variant="c1" style={{ color: color.grey400 }}>
        (Mở story trong browser để test keyboard)
      </Text>
    </div>
  ),
};


// ================================================================
//  6. Composed — real use cases
// ================================================================
export const ComposedEmailLogin = {
  name: 'Composed — Email Login',
  parameters: {
    docs: {
      description: {
        story: '**Use case 1** — Một từ trong câu được làm nổi bật với bold + màu khác. Không có interaction.',
      },
    },
  },
  render: () => (
    <Text variant="b1">
      Please enter your <Text.Highlight>email</Text.Highlight> to login
    </Text>
  ),
};

export const ComposedPhoneCall = {
  name: 'Composed — Phone Call',
  parameters: {
    docs: {
      description: {
        story: '**Use case 2** — Số điện thoại là action target, phần còn lại là text thường. Click target chính xác, không áp lên cả câu.',
      },
    },
  },
  render: () => (
    <Text variant="b1">
      Call{' '}
      <Text.Link onClick={fn('call-phone')}>098xxxxxx</Text.Link>
      {' '}to contact us
    </Text>
  ),
};

export const ComposedMixed = {
  name: 'Composed — Highlight + Link',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Kết hợp cả hai subcomponent trong một câu.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Highlight + Link cùng câu */}
      <Text variant="b1">
        Enter your <Text.Highlight>email</Text.Highlight> or call{' '}
        <Text.Link onClick={fn('call')}>098xxxxxx</Text.Link>
        {' '}for help
      </Text>

      {/* Multiple links */}
      <Text variant="b3">
        By signing up, you agree to our{' '}
        <Text.Link href="/terms">Terms of Service</Text.Link>
        {' '}and{' '}
        <Text.Link href="/privacy">Privacy Policy</Text.Link>
      </Text>

      {/* Danger highlight + link */}
      <Text variant="b3">
        This <Text.Highlight color={color.red}>required</Text.Highlight> field is empty —{' '}
        <Text.Link onClick={fn('learn-more')} underline={false}>learn more</Text.Link>
      </Text>
    </div>
  ),
};
