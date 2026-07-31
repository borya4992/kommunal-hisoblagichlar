export type ThemeId = 'light' | 'dark' | 'midnight' | 'neon' | 'aurora'

export const THEMES: { id: ThemeId; labelKey: ThemeId }[] = [
  { id: 'light', labelKey: 'light' },
  { id: 'dark', labelKey: 'dark' },
  { id: 'midnight', labelKey: 'midnight' },
  { id: 'neon', labelKey: 'neon' },
  { id: 'aurora', labelKey: 'aurora' },
]
