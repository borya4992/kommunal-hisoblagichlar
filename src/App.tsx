import { useCallback, useEffect, useMemo, useState } from 'react'
import { InstallAppButton } from './components/InstallAppButton'
import { MeterCard } from './components/MeterCard'
import { ReportsPanel } from './components/ReportsPanel'
import { METERS } from './data/tariffs'
import { THEMES, type ThemeId } from './data/themes'
import { isSupabaseConfigured } from './lib/supabase'
import { t, type Lang } from './i18n/translations'
import { formatSom, localeForLang } from './utils/format'
import {
  clearReports,
  fetchReports,
  insertReport,
  type ReportEntry,
} from './utils/reports'

const LANGS: Lang[] = ['uz', 'ru', 'en']

export default function App() {
  const [totals, setTotals] = useState<Record<string, number>>({})
  const [lang, setLang] = useState<Lang>('uz')
  const [theme, setTheme] = useState<ThemeId>('light')
  const [reports, setReports] = useState<ReportEntry[]>([])
  const [reportsLoading, setReportsLoading] = useState(true)
  const [reportsBusy, setReportsBusy] = useState(false)
  const [reportsError, setReportsError] = useState<string | null>(null)

  const tr = t(lang)
  const locale = localeForLang(lang)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setReportsLoading(true)
      setReportsError(null)
      try {
        const entries = await fetchReports()
        if (!cancelled) setReports(entries)
      } catch (e) {
        if (!cancelled) {
          setReportsError(e instanceof Error ? e.message : 'Load failed')
        }
      } finally {
        if (!cancelled) setReportsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const handleTotalChange = useCallback((id: string, total: number) => {
    setTotals((prev) => {
      if (prev[id] === total) return prev
      return { ...prev, [id]: total }
    })
  }, [])

  const currentTotals = useMemo(() => {
    const electric = totals.electric ?? 0
    const gas = totals.gas ?? 0
    const water = totals.water ?? 0
    return {
      electric,
      gas,
      water,
      total: electric + gas + water,
    }
  }, [totals])

  const grandTotal = currentTotals.total

  const handleSaveReport = useCallback(async () => {
    setReportsBusy(true)
    setReportsError(null)
    try {
      const entry = await insertReport(currentTotals)
      setReports((prev) => [entry, ...prev.filter((e) => e.id !== entry.id)])
    } catch (e) {
      setReportsError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setReportsBusy(false)
    }
  }, [currentTotals])

  const handleClearReports = useCallback(async () => {
    setReportsBusy(true)
    setReportsError(null)
    try {
      await clearReports()
      setReports([])
    } catch (e) {
      setReportsError(e instanceof Error ? e.message : 'Clear failed')
    } finally {
      setReportsBusy(false)
    }
  }, [])

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-8 sm:mb-10">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-muted">
                {tr.brand}
              </p>
              <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
                {tr.title}
              </h1>
              <p className="mt-2 text-sm font-semibold tracking-wide text-[#e67e22] sm:text-base">
                {tr.credit}
              </p>
              <p className="mt-1 text-xs text-muted">
                {isSupabaseConfigured ? tr.storageCloud : tr.storageLocal}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:justify-end">
              <InstallAppButton
                label={tr.installApp}
                installedLabel={tr.installedApp}
                hint={tr.installHint}
              />
              <label className="flex items-center gap-2 rounded-xl border border-line bg-panel px-3 py-2 text-sm">
                <span className="text-muted">{tr.theme}</span>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as ThemeId)}
                  className="rounded-md border-0 bg-input px-2 py-1 font-medium text-ink outline-none"
                >
                  {THEMES.map((th) => (
                    <option key={th.id} value={th.id}>
                      {tr.themes[th.labelKey]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-2 rounded-xl border border-line bg-panel px-3 py-2 text-sm">
                <span className="text-muted">{tr.language}</span>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as Lang)}
                  className="rounded-md border-0 bg-input px-2 py-1 font-medium uppercase text-ink outline-none"
                >
                  {LANGS.map((l) => (
                    <option key={l} value={l}>
                      {l.toUpperCase()}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <p className="max-w-2xl text-base text-muted sm:text-lg">{tr.subtitle}</p>
        </header>

        <div className="grid gap-6">
          {METERS.map((config) => (
            <MeterCard
              key={config.id}
              config={config}
              lang={lang}
              tr={tr}
              onTotalChange={handleTotalChange}
            />
          ))}
        </div>

        <div className="mt-8">
          <ReportsPanel
            tr={tr}
            lang={lang}
            entries={reports}
            currentTotals={currentTotals}
            loading={reportsLoading}
            busy={reportsBusy}
            error={reportsError}
            onSave={handleSaveReport}
            onClear={handleClearReports}
          />
        </div>

        <footer className="mt-8 overflow-hidden rounded-2xl border border-line/40 bg-footer px-5 py-5 text-footer-text shadow-lg sm:px-7 sm:py-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-50">
                {tr.grandTotal}
              </p>
              <p className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                {formatSom(grandTotal, locale)} {tr.som}
              </p>
            </div>
            <p className="text-sm opacity-50">{tr.grandHint}</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
