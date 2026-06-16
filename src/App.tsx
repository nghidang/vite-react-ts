import './App.css'
import { AppProviders } from './app/AppProviders'
import { AppRouter } from './router/AppRouter'

function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}

export default App
