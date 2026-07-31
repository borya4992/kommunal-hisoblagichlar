export function formatSom(value: number, locale = 'uz-UZ'): string {
  if (!Number.isFinite(value)) return '0'
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(Math.round(value))
}

export function formatUsage(value: number, locale = 'uz-UZ'): string {
  if (!Number.isFinite(value)) return '0'
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  }).format(value)
}

export function parsePositiveNumber(raw: string): number {
  const cleaned = raw.replace(',', '.').replace(/[^\d.]/g, '')
  if (cleaned === '' || cleaned === '.') return 0
  const n = Number(cleaned)
  return Number.isFinite(n) && n >= 0 ? n : 0
}

export function localeForLang(lang: 'uz' | 'ru' | 'en'): string {
  if (lang === 'ru') return 'ru-RU'
  if (lang === 'en') return 'en-US'
  return 'uz-UZ'
}
