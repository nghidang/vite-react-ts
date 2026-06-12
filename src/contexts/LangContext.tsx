import { createContext } from 'react'

interface LangContextType {
  lang: string
  setLang: (lang: string) => void
}

export const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
})
