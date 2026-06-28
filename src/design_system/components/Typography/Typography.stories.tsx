import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Typography } from './Typography'
import type { TypographyVariant } from './typography.types'

// ── Variant lists ─────────────────────────────────────────────────
const ALL_VARIANTS: TypographyVariant[] = [
  'h1', 'h2', 'h3', 'h4', 'h5',
  'subtitle',
  'body', 'body-sm',
  'caption',
  'label',
  'button',
]

const SAMPLE: Record<TypographyVariant, string> = {
  h1:       'H1. Headline',
  h2:       'H2. Headline',
  h3:       'H3. Headline',
  h4:       'H4. Headline',
  h5:       'H5. Headline',
  subtitle: 'Subtitle',
  body:     'Body — The quick brown fox jumps over the lazy dog',
  'body-sm':'Body SM — The quick brown fox jumps over the lazy dog',
  caption:  'Caption',
  label:    'Label',
  button:   'Button',
}

// ── Shared render helpers ─────────────────────────────────────────
const css = {
  grey400: '#9EA2AE',
  grey200: '#E5E7EA',
  grey900: '#131927',
  red:     '#EE443F',
  green:   '#308242',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <p style={{
        fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600,
        color: css.grey400, textTransform: 'uppercase', letterSpacing: '0.08em',
        margin: '0 0 16px', paddingBottom: 8, borderBottom: `1px solid ${css.grey200}`,
      }}>
        {title}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {children}
      </div>
    </div>
  )
}

function VariantRow({ variant }: { variant: TypographyVariant }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
      <code style={{
        fontFamily: 'monospace', fontSize: 11,
        color: css.grey400, minWidth: 100, flexShrink: 0,
      }}>
        {variant}
      </code>
      <Typography variant={variant} style={{ color: css.grey900 }}>
        {SAMPLE[variant]}
      </Typography>
    </div>
  )
}

// ================================================================
//  Meta
// ================================================================
const meta: Meta<typeof Typography> = {
  title:     'Typography/Typography',
  component:  Typography,
  subcomponents: {
    'Typography.Highlight': Typography.Highlight,
    'Typography.Link':      Typography.Link,
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
\`Typography\` là compound component cho hệ thống typography, dùng CSS Modules + clsx.

| Subcomponent | Render | Mô tả |
|---|---|---|
| \`<Typography.Highlight>\` | \`<span>\` | Inline emphasis — semibold + primary color |
| \`<Typography.Link>\` | \`<a>\` hoặc \`<span role="button">\` | Inline interactive — navigate hoặc custom action |
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ALL_VARIANTS,
      description: 'Typography variant',
      table: {
        defaultValue: { summary: 'body' },
        type: { summary: ALL_VARIANTS.join(' | ') },
      },
    },
    as: {
      control: 'text',
      description: 'Override HTML element. Mặc định suy ra từ variant.',
    },
    children: { control: 'text' },
    style:    { control: false },
    className:{ control: false },
  },
}

export default meta
type Story = StoryObj<typeof Typography>


// ================================================================
//  1. Playground
// ================================================================
export const Playground: Story = {
  args: {
    variant:  'body',
    children: 'The quick brown fox jumps over the lazy dog',
  },
  parameters: {
    docs: {
      description: { story: 'Dùng **Controls panel** để thay đổi `variant` và `children` live.' },
    },
  },
}


// ================================================================
//  2. All Variants
// ================================================================
export const AllVariants: Story = {
  name: 'All Variants',
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: 'Toàn bộ 11 variants với giá trị font-size và line-height từ Figma.' },
    },
  },
  render: () => (
    <div>
      <Section title="Headlines — Semi Bold">
        {(['h1','h2','h3','h4','h5'] as TypographyVariant[]).map(v => (
          <VariantRow key={v} variant={v} />
        ))}
      </Section>
      <Section title="Subtitle — Semi Bold">
        <VariantRow variant="subtitle" />
      </Section>
      <Section title="Body">
        {(['body','body-sm'] as TypographyVariant[]).map(v => (
          <VariantRow key={v} variant={v} />
        ))}
      </Section>
      <Section title="Caption">
        <VariantRow variant="caption" />
      </Section>
      <Section title="Semantic Modifiers">
        {(['label','button'] as TypographyVariant[]).map(v => (
          <VariantRow key={v} variant={v} />
        ))}
      </Section>
    </div>
  ),
}


// ================================================================
//  3. Tag override
// ================================================================
export const TagOverride: Story = {
  name: 'as — Tag Override',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Prop `as` override HTML element. Tách visual style khỏi semantic HTML.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {([
        { variant: 'h3'  as TypographyVariant, as: 'div',   label: 'as="div"' },
        { variant: 'body'as TypographyVariant, as: 'span',  label: 'as="span"' },
        { variant: 'body'as TypographyVariant, as: 'label', label: 'as="label"' },
      ]).map(({ variant, as, label }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
          <code style={{ fontFamily: 'monospace', fontSize: 11, color: css.grey400, minWidth: 120 }}>
            {label}
          </code>
          <Typography variant={variant} as={as}>
            Variant {variant} rendered as &lt;{as}&gt;
          </Typography>
        </div>
      ))}
    </div>
  ),
}


// ================================================================
//  4. Typography.Highlight
// ================================================================
export const HighlightDefault: Story = {
  name: 'Typography.Highlight — Default',
  parameters: {
    docs: {
      description: {
        story: 'Mặc định: **semibold** + `var(--color-primary-500)`. Kế thừa font-size, line-height từ parent.',
      },
    },
  },
  render: () => (
    <Typography variant="body">
      Please enter your <Typography.Highlight>email</Typography.Highlight> to login
    </Typography>
  ),
}

export const HighlightColors: Story = {
  name: 'Typography.Highlight — color',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Prop `color` override màu. Dùng `"inherit"` để chỉ áp bold, không đổi màu.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {[
        { label: 'default (primary)', color: undefined        },
        { label: 'danger  (#EE443F)', color: css.red          },
        { label: 'success (#308242)', color: css.green        },
        { label: 'inherit (bold only)', color: 'inherit'      },
      ].map(({ label, color }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
          <code style={{ fontFamily: 'monospace', fontSize: 11, color: css.grey400, minWidth: 200 }}>
            {label}
          </code>
          <Typography variant="body">
            This field is{' '}
            <Typography.Highlight {...(color !== undefined ? { color } : {})}>
              required
            </Typography.Highlight>
            {' '}— please fill in
          </Typography>
        </div>
      ))}
    </div>
  ),
}

export const HighlightBoldFalse: Story = {
  name: 'Typography.Highlight — bold={false}',
  parameters: {
    docs: {
      description: {
        story: '`bold={false}` giữ color của `.highlight` nhưng kế thừa font-weight từ parent.',
      },
    },
  },
  render: () => (
    <Typography variant="body">
      Items marked in <Typography.Highlight bold={false}>blue</Typography.Highlight> are optional
    </Typography>
  ),
}

export const HighlightAcrossVariants: Story = {
  name: 'Typography.Highlight — Across Variants',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Kế thừa đúng font-size từ bất kỳ variant nào của parent — không cần truyền lại.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {(['h4','subtitle','body','body-sm','caption'] as TypographyVariant[]).map(v => (
        <div key={v} style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
          <code style={{ fontFamily: 'monospace', fontSize: 11, color: css.grey400, minWidth: 80 }}>
            {v}
          </code>
          <Typography variant={v}>
            Design <Typography.Highlight>tokens</Typography.Highlight> for everyone
          </Typography>
        </div>
      ))}
    </div>
  ),
}


// ================================================================
//  5. Typography.Link
// ================================================================
export const LinkOnClick: Story = {
  name: 'Typography.Link — onClick',
  parameters: {
    docs: {
      description: {
        story: 'Render `<span role="button" tabIndex={0}>`. Trigger bằng click hoặc **Enter / Space**.',
      },
    },
  },
  render: () => (
    <Typography variant="body">
      Call{' '}
      <Typography.Link onClick={fn('Typography.Link onClick')}>098xxxxxx</Typography.Link>
      {' '}to contact us
    </Typography>
  ),
}

export const LinkHrefTel: Story = {
  name: 'Typography.Link — href tel:',
  parameters: {
    docs: {
      description: {
        story: 'Render `<a href="tel:...">`. Browser/OS xử lý native dialler.',
      },
    },
  },
  render: () => (
    <Typography variant="body">
      Call{' '}
      <Typography.Link href="tel:098xxxxxx">098xxxxxx</Typography.Link>
      {' '}to contact us
    </Typography>
  ),
}

export const LinkHrefUrl: Story = {
  name: 'Typography.Link — href url',
  parameters: {
    docs: {
      description: { story: 'Render `<a href="...">` cho internal/external navigation.' },
    },
  },
  render: () => (
    <Typography variant="body-sm">
      By continuing, you agree to our{' '}
      <Typography.Link href="/terms">Terms of Service</Typography.Link>
      {' '}and{' '}
      <Typography.Link href="/privacy">Privacy Policy</Typography.Link>
    </Typography>
  ),
}

export const LinkNoUnderline: Story = {
  name: 'Typography.Link — underline={false}',
  parameters: {
    docs: {
      description: {
        story: 'Dùng khi visual affordance đến từ màu và weight — không cần underline.',
      },
    },
  },
  render: () => (
    <Typography variant="body">
      Already have an account?{' '}
      <Typography.Link onClick={fn('sign-in')} underline={false}>Sign in</Typography.Link>
      {'  ·  '}New here?{' '}
      <Typography.Link onClick={fn('sign-up')} underline={false}>Sign up</Typography.Link>
    </Typography>
  ),
}

export const LinkKeyboardA11y: Story = {
  name: 'Typography.Link — Keyboard',
  parameters: {
    docs: {
      description: {
        story: 'Tab đến link → focus ring xuất hiện (`:focus-visible`). Nhấn **Enter** hoặc **Space** để trigger.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Typography variant="body">
        Tab đến đây →{' '}
        <Typography.Link onClick={fn('keyboard-action')}>098xxxxxx</Typography.Link>
        {' '}rồi nhấn Enter hoặc Space
      </Typography>
      <Typography variant="caption" style={{ color: css.grey400 }}>
        (Mở story trong browser để test keyboard)
      </Typography>
    </div>
  ),
}


// ================================================================
//  6. Composed — real use cases
// ================================================================
export const ComposedEmailLogin: Story = {
  name: 'Composed — Email Login',
  parameters: {
    docs: {
      description: {
        story: '**Use case 1** — Một từ trong câu được làm nổi bật với bold + màu khác.',
      },
    },
  },
  render: () => (
    <Typography variant="body">
      Please enter your <Typography.Highlight>email</Typography.Highlight> to login
    </Typography>
  ),
}

export const ComposedPhoneCall: Story = {
  name: 'Composed — Phone Call',
  parameters: {
    docs: {
      description: {
        story: '**Use case 2** — Số điện thoại là action target, phần còn lại là text thường.',
      },
    },
  },
  render: () => (
    <Typography variant="body">
      Call{' '}
      <Typography.Link onClick={fn('call-phone')}>098xxxxxx</Typography.Link>
      {' '}to contact us
    </Typography>
  ),
}

export const ComposedMixed: Story = {
  name: 'Composed — Highlight + Link',
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: 'Kết hợp cả hai subcomponent trong một câu.' },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Typography variant="body">
        Enter your <Typography.Highlight>email</Typography.Highlight> or call{' '}
        <Typography.Link onClick={fn('call')}>098xxxxxx</Typography.Link> for help
      </Typography>
      <Typography variant="body-sm">
        This <Typography.Highlight color={css.red}>required</Typography.Highlight> field is empty —{' '}
        <Typography.Link onClick={fn('learn-more')} underline={false}>learn more</Typography.Link>
      </Typography>
      <Typography variant="body-sm">
        By signing up, you agree to our{' '}
        <Typography.Link href="/terms">Terms of Service</Typography.Link>
        {' '}and{' '}
        <Typography.Link href="/privacy">Privacy Policy</Typography.Link>
      </Typography>
    </div>
  ),
}
