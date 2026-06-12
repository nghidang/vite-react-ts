import { LangProvider } from './app/LangProvider'
import { AppProviders } from './app/AppProviders'
import { AppRouter } from './router/AppRouter'
import './App.css'

function App() {
  return (
    <LangProvider>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </LangProvider>
  )
}

export default App
