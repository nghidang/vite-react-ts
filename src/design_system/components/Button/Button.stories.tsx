// ============================================================
// Button.stories.tsx
// ⚛️  REACT WEB / Storybook
// ============================================================

import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Button } from './Button'
import type { ButtonAppearance, ButtonSize, ButtonVariant } from './button.types'

const ALL_APPEARANCES: ButtonAppearance[] = ['filled', 'outline', 'clear']
const ALL_VARIANTS:    ButtonVariant[]    = ['primary', 'danger', 'success']
const ALL_SIZES:       ButtonSize[]       = ['giant', 'large', 'medium', 'small', 'tiny']

// ── Shared helpers ────────────────────────────────────────────────
function Row({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 12 }}>
      {children}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <p style={{
        fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600,
        color: '#9EA2AE', textTransform: 'uppercase', letterSpacing: '0.08em',
        margin: '0 0 16px', paddingBottom: 8, borderBottom: '1px solid #E5E7EA',
      }}>
        {title}
      </p>
      {children}
    </div>
  )
}

const ArrowIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// ================================================================
//  Meta
// ================================================================
const meta: Meta<typeof Button> = {
  title:     'Components/Button',
  component:  Button,
  tags:       ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Button với 2 axes độc lập:

| Prop | Type | Mô tả |
|---|---|---|
| \`appearance\` | \`filled \\| outline \\| clear\` | Visual structure |
| \`variant\` | \`primary \\| danger \\| success\` | Color scheme |
| \`size\` | \`giant \\| large \\| medium \\| small \\| tiny\` | Kích thước |
        `,
      },
    },
  },
  argTypes: {
    appearance: { control: 'select', options: ALL_APPEARANCES },
    variant:    { control: 'select', options: ALL_VARIANTS },
    size:       { control: 'select', options: ALL_SIZES },
    disabled:   { control: 'boolean' },
    loading:    { control: 'boolean' },
    children:   { control: 'text' },
    leftIcon:   { control: false },
    rightIcon:  { control: false },
    onClick:    { control: false },
  },
}

export default meta
type Story = StoryObj<typeof Button>

// ================================================================
//  1. Playground
// ================================================================
export const Playground: Story = {
  args: {
    appearance: 'filled',
    variant:    'primary',
    size:       'medium',
    children:   'Button',
    onClick:    fn(),
  },
}

// ================================================================
//  2. Appearances × Variants (full matrix)
// ================================================================
export const AppearancesVariants: Story = {
  name: 'Appearances × Variants',
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'Full matrix — 3 appearances × 3 variants.' } },
  },
  render: () => (
    <div>
      {ALL_VARIANTS.map(variant => (
        <Section key={variant} title={`variant="${variant}"`}>
          <Row>
            {ALL_APPEARANCES.map(appearance => (
              <Button key={appearance} appearance={appearance} variant={variant} onClick={fn()}>
                {appearance}
              </Button>
            ))}
          </Row>
        </Section>
      ))}
    </div>
  ),
}

// ================================================================
//  3. Sizes
// ================================================================
export const Sizes: Story = {
  name: 'Sizes',
  parameters: {
    controls: { disable: true },
    docs: { description: { story: '5 sizes × appearance=filled × variant=primary.' } },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {ALL_SIZES.map(size => (
        <Row key={size}>
          <code style={{ fontFamily: 'monospace', fontSize: 11, color: '#9EA2AE', width: 60 }}>
            {size}
          </code>
          {ALL_APPEARANCES.map(appearance => (
            <Button key={appearance} appearance={appearance} size={size} onClick={fn()}>
              Button
            </Button>
          ))}
        </Row>
      ))}
    </div>
  ),
}

// ================================================================
//  4. States
// ================================================================
export const States: Story = {
  name: 'States',
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'Disabled và Loading — áp dụng đồng nhất mọi variant.' } },
  },
  render: () => (
    <div>
      {ALL_VARIANTS.map(variant => (
        <Section key={variant} title={`variant="${variant}"`}>
          <Row>
            {ALL_APPEARANCES.map(a => (
              <Button key={a} appearance={a} variant={variant} disabled onClick={fn()}>Disabled</Button>
            ))}
          </Row>
          <Row>
            {ALL_APPEARANCES.map(a => (
              <Button key={a} appearance={a} variant={variant} loading onClick={fn()}>Loading</Button>
            ))}
          </Row>
        </Section>
      ))}
    </div>
  ),
}

// ================================================================
//  5. With Icons
// ================================================================
export const WithIcons: Story = {
  name: 'With Icons',
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div>
      <Section title="leftIcon">
        <Row>
          {ALL_VARIANTS.map(v => (
            <Button key={v} variant={v} leftIcon={<ArrowIcon />} onClick={fn()}>Button</Button>
          ))}
        </Row>
      </Section>
      <Section title="rightIcon">
        <Row>
          {ALL_VARIANTS.map(v => (
            <Button key={v} variant={v} rightIcon={<ArrowIcon />} onClick={fn()}>Button</Button>
          ))}
        </Row>
      </Section>
    </div>
  ),
}
