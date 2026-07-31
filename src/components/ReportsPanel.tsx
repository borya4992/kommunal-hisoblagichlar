import { useMemo, useState } from 'react'
import type { Translation } from '../i18n/translations'
import type { Lang } from '../i18n/translations'
import {
  filterByMonth,
  filterByYear,
  sumEntries,
  type ReportEntry,
} from '../utils/reports'
import { formatSom, localeForLang } from '../utils/format'

interface ReportsPanelProps {
  tr: Translation
  lang: Lang
  entries: ReportEntry[]
  currentTotals: { electric: number; gas: number; water: number; total: number }
  loading?: boolean
  busy?: boolean
  error?: string | null
  onSave: () => void | Promise<void>
  onClear: () => void | Promise<void>
}

type Period = 'month' | 'year'

const MONTH_KEYS = [
  'm1',
  'm2',
  'm3',
  'm4',
  'm5',
  'm6',
  'm7',
  'm8',
  'm9',
  'm10',
  'm11',
  'm12',
] as const

export function ReportsPanel({
  tr,
  lang,
  entries,
  currentTotals,
  loading = false,
  busy = false,
  error = null,
  onSave,
  onClear,
}: ReportsPanelProps) {
  const now = new Date()
  const [period, setPeriod] = useState<Period>('month')
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const locale = localeForLang(lang)

  const years = useMemo(() => {
    const set = new Set(entries.map((e) => e.year))
    set.add(now.getFullYear())
    return [...set].sort((a, b) => b - a)
  }, [entries, now])

  const filtered = useMemo(() => {
    return period === 'month'
      ? filterByMonth(entries, year, month)
      : filterByYear(entries, year)
  }, [entries, period, year, month])

  const summed = useMemo(() => sumEntries(filtered), [filtered])
  const maxBar = Math.max(summed.electric, summed.gas, summed.water, 1)

  const monthLabel = (m: number) => {
    const key = MONTH_KEYS[m - 1]
    return tr.months[key]
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-line/60 bg-panel shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line/50 px-5 py-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            {tr.reports}
          </h2>
          <p className="mt-0.5 text-sm text-muted">{tr.reportsHint}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void onSave()}
            disabled={busy || loading}
            className="rounded-xl bg-ink px-3.5 py-2 text-sm font-semibold text-panel transition hover:opacity-90 disabled:opacity-50"
          >
            {busy ? tr.saving : tr.saveReport}
          </button>
          <button
            type="button"
            onClick={() => void onClear()}
            disabled={busy || loading}
            className="rounded-xl border border-line px-3.5 py-2 text-sm font-semibold text-muted transition hover:text-ink disabled:opacity-50"
          >
            {tr.clearReports}
          </button>
        </div>
      </header>

      {error && (
        <p className="border-b border-line/50 bg-[#e85a4f]/10 px-5 py-2 text-sm text-[#c62828]">
          {error}
        </p>
      )}

      {loading && (
        <p className="border-b border-line/50 px-5 py-2 text-sm text-muted">
          {tr.loadingReports}
        </p>
      )}

      <div className="space-y-5 px-5 py-5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-line bg-input p-1">
            <button
              type="button"
              onClick={() => setPeriod('month')}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                period === 'month' ? 'bg-ink text-panel' : 'text-muted'
              }`}
            >
              {tr.monthly}
            </button>
            <button
              type="button"
              onClick={() => setPeriod('year')}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                period === 'year' ? 'bg-ink text-panel' : 'text-muted'
              }`}
            >
              {tr.yearly}
            </button>
          </div>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded-xl border border-line bg-input px-3 py-2 text-sm font-medium text-ink outline-none"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {period === 'month' && (
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="rounded-xl border border-line bg-input px-3 py-2 text-sm font-medium text-ink outline-none"
            >
              {MONTH_KEYS.map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {monthLabel(i + 1)}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Current unsaved snapshot */}
        <div className="rounded-xl border border-dashed border-line/80 bg-input/40 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            {tr.currentSession}
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-4">
            <Stat
              label={tr.electric}
              value={formatSom(currentTotals.electric, locale)}
              unit={tr.som}
            />
            <Stat
              label={tr.gas}
              value={formatSom(currentTotals.gas, locale)}
              unit={tr.som}
            />
            <Stat
              label={tr.water}
              value={formatSom(currentTotals.water, locale)}
              unit={tr.som}
            />
            <Stat
              label={tr.grandTotal}
              value={formatSom(currentTotals.total, locale)}
              unit={tr.som}
              strong
            />
          </div>
        </div>

        {/* Period totals */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
            {period === 'month' ? tr.monthlyTotal : tr.yearlyTotal}
            {period === 'month'
              ? ` · ${monthLabel(month)} ${year}`
              : ` · ${year}`}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MeterBar
              label={tr.electric}
              amount={summed.electric}
              max={maxBar}
              color="#e8a317"
              locale={locale}
              som={tr.som}
            />
            <MeterBar
              label={tr.gas}
              amount={summed.gas}
              max={maxBar}
              color="#2d8a6e"
              locale={locale}
              som={tr.som}
            />
            <MeterBar
              label={tr.water}
              amount={summed.water}
              max={maxBar}
              color="#2a6f9e"
              locale={locale}
              som={tr.som}
            />
            <div className="rounded-xl border border-line bg-input px-3.5 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                {tr.grandTotal}
              </p>
              <p className="mt-1 font-display text-2xl font-extrabold text-ink">
                {formatSom(summed.total, locale)}{' '}
                <span className="text-sm font-semibold text-muted">{tr.som}</span>
              </p>
              <p className="mt-1 text-xs text-muted">
                {filtered.length} {tr.entriesCount}
              </p>
            </div>
          </div>
        </div>

        {/* Entry list */}
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-input/80 text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-3 py-2.5 font-semibold">{tr.date}</th>
                <th className="px-3 py-2.5 font-semibold">{tr.electric}</th>
                <th className="px-3 py-2.5 font-semibold">{tr.gas}</th>
                <th className="px-3 py-2.5 font-semibold">{tr.water}</th>
                <th className="px-3 py-2.5 font-semibold">{tr.grandTotal}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-6 text-center text-muted"
                  >
                    {tr.noReports}
                  </td>
                </tr>
              ) : (
                filtered
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime(),
                  )
                  .map((e) => (
                    <tr key={e.id} className="border-t border-line/60">
                      <td className="px-3 py-2.5 text-ink">
                        {new Date(e.createdAt).toLocaleString(locale)}
                      </td>
                      <td className="px-3 py-2.5 tabular-nums">
                        {formatSom(e.electric, locale)}
                      </td>
                      <td className="px-3 py-2.5 tabular-nums">
                        {formatSom(e.gas, locale)}
                      </td>
                      <td className="px-3 py-2.5 tabular-nums">
                        {formatSom(e.water, locale)}
                      </td>
                      <td className="px-3 py-2.5 font-semibold tabular-nums text-ink">
                        {formatSom(e.total, locale)} {tr.som}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function Stat({
  label,
  value,
  unit,
  strong,
}: {
  label: string
  value: string
  unit: string
  strong?: boolean
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
        {label}
      </p>
      <p
        className={`mt-0.5 tabular-nums ${
          strong
            ? 'font-display text-lg font-extrabold text-ink'
            : 'font-semibold text-ink'
        }`}
      >
        {value} <span className="text-xs text-muted">{unit}</span>
      </p>
    </div>
  )
}

function MeterBar({
  label,
  amount,
  max,
  color,
  locale,
  som,
}: {
  label: string
  amount: number
  max: number
  color: string
  locale: string
  som: string
}) {
  const pct = Math.max(4, Math.round((amount / max) * 100))
  return (
    <div className="rounded-xl border border-line bg-input px-3.5 py-3">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          {label}
        </p>
        <p className="font-display text-sm font-bold tabular-nums text-ink">
          {formatSom(amount, locale)} {som}
        </p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-line/40">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}
