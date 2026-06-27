// ============================================================
// Button.stories.tsx
// ⚛️  REACT WEB — chỉ dùng cho Storybook web
// ============================================================

import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Button } from './Button'
import type { ButtonSize, ButtonVariant } from './button.types'

const ALL_VARIANTS: ButtonVariant[] = ['filled', 'outline', 'clear']
const ALL_SIZES: ButtonSize[]       = ['giant', 'large', 'medium', 'small', 'tiny']

// ── Shared render helpers ─────────────────────────────────────────
const colors = {
  grey200: '#E5E7EA',
  grey400: '#9EA2AE',
  grey50:  '#F9FAFB',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <p style={{
        fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600,
        color: colors.grey400, textTransform: 'uppercase', letterSpacing: '0.08em',
        margin: '0 0 16px', paddingBottom: 8,
        borderBottom: `1px solid ${colors.grey200}`,
      }}>
        {title}
      </p>
      {children}
    </div>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 12 }}>
      {children}
    </div>
  )
}

// ── Simple icon placeholder ───────────────────────────────────────
const IconArrow = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
Button component với 3 variants, 5 sizes, 5 states.

| Prop | Type | Default |
|---|---|---|
| \`variant\` | \`filled \\| outline \\| clear\` | \`filled\` |
| \`size\` | \`giant \\| large \\| medium \\| small \\| tiny\` | \`medium\` |
| \`disabled\` | \`boolean\` | \`false\` |
| \`loading\` | \`boolean\` | \`false\` |
| \`leftIcon\` | \`ReactNode\` | — |
| \`rightIcon\` | \`ReactNode\` | — |
        `,
      },
    },
  },
  argTypes: {
    variant:   { control: 'select',   options: ALL_VARIANTS },
    size:      { control: 'select',   options: ALL_SIZES },
    disabled:  { control: 'boolean' },
    loading:   { control: 'boolean' },
    children:  { control: 'text' },
    leftIcon:  { control: false },
    rightIcon: { control: false },
    onClick:   { control: false },
  },
}

export default meta
type Story = StoryObj<typeof Button>


// ================================================================
//  1. Playground
// ================================================================
export const Playground: Story = {
  args: {
    variant:  'filled',
    size:     'medium',
    children: 'Button',
    onClick:  fn(),
  },
}


// ================================================================
//  2. Variants
// ================================================================
export const Variants: Story = {
  name: 'Variants',
  parameters: {
    controls: { disable: true },
    docs: { description: { story: '3 variants × size medium.' } },
  },
  render: () => (
    <Row>
      <Button variant="filled"  onClick={fn()}>Filled</Button>
      <Button variant="outline" onClick={fn()}>Outline</Button>
      <Button variant="clear"   onClick={fn()}>Clear</Button>
    </Row>
  ),
}


// ================================================================
//  3. Sizes
// ================================================================
export const Sizes: Story = {
  name: 'Sizes',
  parameters: {
    controls: { disable: true },
    docs: { description: { story: '5 sizes × variant filled.' } },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {ALL_SIZES.map(size => (
        <Row key={size}>
          <code style={{ fontFamily: 'monospace', fontSize: 11, color: colors.grey400, width: 60 }}>
            {size}
          </code>
          <Button size={size} variant="filled"  onClick={fn()}>Button</Button>
          <Button size={size} variant="outline" onClick={fn()}>Button</Button>
          <Button size={size} variant="clear"   onClick={fn()}>Button</Button>
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
    docs: {
      description: {
        story: 'Disabled và Loading states. Hover/Focus/Press thể hiện qua CSS pseudo-classes (thử trong browser).',
      },
    },
  },
  render: () => (
    <div>
      <Section title="Disabled">
        <Row>
          <Button variant="filled"  disabled onClick={fn()}>Filled</Button>
          <Button variant="outline" disabled onClick={fn()}>Outline</Button>
          <Button variant="clear"   disabled onClick={fn()}>Clear</Button>
        </Row>
      </Section>
      <Section title="Loading">
        <Row>
          <Button variant="filled"  loading onClick={fn()}>Filled</Button>
          <Button variant="outline" loading onClick={fn()}>Outline</Button>
          <Button variant="clear"   loading onClick={fn()}>Clear</Button>
        </Row>
      </Section>
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
    docs: { description: { story: 'leftIcon và rightIcon — icon scale tự động theo size.' } },
  },
  render: () => (
    <div>
      <Section title="Left icon">
        <Row>
          {ALL_SIZES.map(size => (
            <Button key={size} size={size} variant="filled" leftIcon={<IconArrow />} onClick={fn()}>
              Button
            </Button>
          ))}
        </Row>
      </Section>
      <Section title="Right icon">
        <Row>
          {ALL_SIZES.map(size => (
            <Button key={size} size={size} variant="filled" rightIcon={<IconArrow />} onClick={fn()}>
              Button
            </Button>
          ))}
        </Row>
      </Section>
      <Section title="Both icons">
        <Row>
          <Button variant="filled"  leftIcon={<IconArrow />} rightIcon={<IconArrow />} onClick={fn()}>Button</Button>
          <Button variant="outline" leftIcon={<IconArrow />} rightIcon={<IconArrow />} onClick={fn()}>Button</Button>
          <Button variant="clear"   leftIcon={<IconArrow />} rightIcon={<IconArrow />} onClick={fn()}>Button</Button>
        </Row>
      </Section>
    </div>
  ),
}


// ================================================================
//  6. All Variants × Sizes (spec sheet)
// ================================================================
export const AllVariantsSizes: Story = {
  name: 'All Variants × Sizes',
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'Spec sheet — full matrix variants × sizes.' } },
  },
  render: () => (
    <div>
      {ALL_VARIANTS.map(variant => (
        <Section key={variant} title={variant}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ALL_SIZES.map(size => (
              <Row key={size}>
                <code style={{ fontFamily: 'monospace', fontSize: 11, color: colors.grey400, width: 60 }}>
                  {size}
                </code>
                <Button variant={variant} size={size} onClick={fn()}>Default</Button>
                <Button variant={variant} size={size} disabled onClick={fn()}>Disabled</Button>
                <Button variant={variant} size={size} loading onClick={fn()}>Loading</Button>
              </Row>
            ))}
          </div>
        </Section>
      ))}
    </div>
  ),
}
