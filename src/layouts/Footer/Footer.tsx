import { useContext } from 'react'
import { LangContext } from '../../i18n/LangContext'
import { LangSwitcher } from '../../components/common/LangSwitcher/LangSwitcher'
import './Footer.css'

export function Footer() {
  const { lang } = useContext(LangContext)

  return (
    <footer className="footer">
      <p>Footer {lang}</p>
      <LangSwitcher />
    </footer>
  )
}
