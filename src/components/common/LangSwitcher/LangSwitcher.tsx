import { useContext } from 'react'
import { LangContext } from '../../../contexts/LangContext'
import './LangSwitcher.css'

export function LangSwitcher() {
  const { lang, setLang } = useContext(LangContext)

  return (
    <div className="lang-switcher">
      <button
        type="button"
        className="lang-button"
        disabled={lang === 'en'}
        onClick={() => setLang('en')}
        aria-label="English"
        title="English"
      >
        🇬🇧
      </button>
      <button
        type="button"
        className="lang-button"
        disabled={lang === 'vi'}
        onClick={() => setLang('vi')}
        aria-label="Tiếng Việt"
        title="Tiếng Việt"
      >
        🇻🇳
      </button>
    </div>
  )
}
