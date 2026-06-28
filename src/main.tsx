import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/design_system/tokens/colors.tokens.css'
import '../src/design_system/tokens/shadow.tokens.css'
import '../src/design_system/tokens/spacing.tokens.css'
import App from './App'
import './index.css'
// if (import.meta.env.DEV) {
//   import('react-grab')
// }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
