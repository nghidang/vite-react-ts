import type { StorybookConfig } from '@storybook/react-vite'
import '../src/design_system/tokens/colors.tokens'
import '../src/design_system/tokens/shadow.tokens'
import '../src/design_system/tokens/spacing.tokens'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-mcp',
  ],
  framework: '@storybook/react-vite',
}
export default config
