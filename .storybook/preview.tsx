// .storybook/preview.tsx

import type { Preview } from '@storybook/react-vite'
import React from 'react'

// 🔗 Import JS tokens — destructure để lấy values
import {
  black,
  blue,
  green,
  grey,
  primary,
  red,
  white,
  yellow,
} from '../src/design_system/tokens/colors.tokens'
import { shadow } from '../src/design_system/tokens/shadow.tokens'
import { radius, spacing } from '../src/design_system/tokens/spacing.tokens'

// ── Generate :root { --color-* } từ JS token objects ─────────────
function buildCSSVars(): string {
  const lines: string[] = []

  // Colors
  for (const [name, scale] of Object.entries({ primary, grey, green, red, yellow, blue })) {
    for (const [step, value] of Object.entries(scale)) {
      lines.push(`  --color-${name}-${step}: ${value};`)
    }
  }
  for (const [step, value] of Object.entries(white)) {
    lines.push(`  --color-white-${step}: ${value};`)
  }
  for (const [step, value] of Object.entries(black)) {
    lines.push(`  --color-black-${step}: ${value};`)
  }

  // Spacing
  for (const [name, value] of Object.entries(spacing)) {
    lines.push(`  --spacing-${name}: ${value}px;`)
  }

  // Border Radius
  for (const [name, value] of Object.entries(radius)) {
    const px = typeof value === 'number' ? `${value}px` : value
    lines.push(`  --radius-${name}: ${px};`)
  }

  // Shadows
  for (const [step, value] of Object.entries(shadow)) {
    lines.push(`  --shadow-${step}: ${value};`)
  }

  return `:root {\n${lines.join('\n')}\n}`
}

const CSS_VARS = buildCSSVars()

const withTokens = (Story: React.ComponentType) => (
  <>
    <style>{CSS_VARS}</style>
    <Story />
  </>
)

// ── Preview config ────────────────────────────────────────────────
const preview: Preview = {
  decorators: [withTokens],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
}

export default preview
