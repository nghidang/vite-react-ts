import { useContext } from 'react'
import { LangContext } from '../contexts/LangContext'
import { translate, type Lang } from '../i18n'

/**
 * Hook dịch chuỗi cho component React.
 * Bám theo ngôn ngữ trong LangContext nên component tự re-render khi đổi ngôn ngữ.
 */
export function useTranslation() {
  const { lang } = useContext(LangContext)
  const t = (key: string): string => translate(key, lang as Lang)

  return { t, lang: lang as Lang }
}
