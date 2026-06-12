import en from './locales/en.json'
import vi from './locales/vi.json'

export type Lang = 'en' | 'vi'

export const DEFAULT_LANG: Lang = 'en'

const dictionaries: Record<Lang, typeof en> = { en, vi }

/**
 * Ngôn ngữ đang dùng cho code KHÔNG nằm trong React (vd: getErrorMessage).
 * Được LangProvider đồng bộ mỗi khi người dùng đổi ngôn ngữ.
 */
let activeLang: Lang = DEFAULT_LANG

export function setActiveLang(lang: Lang): void {
  activeLang = lang
}

/** Lấy giá trị theo key dạng dot-path (vd: 'auth.login.title'). */
function resolve(dict: unknown, key: string): string | undefined {
  const value = key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, dict)

  return typeof value === 'string' ? value : undefined
}

/**
 * Dịch một key. Nếu thiếu ở ngôn ngữ hiện tại thì fallback về tiếng Anh,
 * cuối cùng trả về chính key để dễ phát hiện chuỗi còn thiếu.
 */
export function translate(key: string, lang: Lang = activeLang): string {
  return resolve(dictionaries[lang], key) ?? resolve(dictionaries[DEFAULT_LANG], key) ?? key
}

/** Phiên bản dùng cho code ngoài React; bám theo `activeLang`. */
export const t = (key: string): string => translate(key)
