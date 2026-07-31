import { useEffect, useMemo, useState } from 'react'
import { calcMeterTotal, type MeterConfig } from '../data/tariffs'
import type { Translation } from '../i18n/translations'
import {
  formatSom,
  formatUsage,
  localeForLang,
  parsePositiveNumber,
} from '../utils/format'
import type { Lang } from '../i18n/translations'
import { DigitalMeter } from './DigitalMeter'

interface MeterCardProps {
  config: MeterConfig
  lang: Lang
  tr: Translation
  onTotalChange: (id: string, total: number) => void
}

function meterTitle(tr: Translation, id: MeterConfig['id']): string {
  if (id === 'electric') return tr.electric
  if (id === 'gas') return tr.gas
  return tr.water
}

function meterUnitLabel(tr: Translation, id: MeterConfig['id']): string {
  if (id === 'electric') return tr.electricUnit
  if (id === 'gas') return tr.gasUnit
  return tr.waterUnit
}

const inputClass =
  'w-full rounded-xl border border-line bg-input px-3.5 py-2.5 text-lg font-medium text-ink outline-none transition focus:border-ink/40 focus:ring-2 focus:ring-ink/10'

export function MeterCard({ config, lang, tr, onTotalChange }: MeterCardProps) {
  const [baseRaw, setBaseRaw] = useState('0')
  const [addedRaw, setAddedRaw] = useState('0')
  const [tariffRaw, setTariffRaw] = useState(String(config.defaultTariff))
  const [limitEnabled, setLimitEnabled] = useState(false)
  const [limitAmountRaw, setLimitAmountRaw] = useState('200')
  const [limitTariffRaw, setLimitTariffRaw] = useState('900')

  const locale = localeForLang(lang)
  const base = parsePositiveNumber(baseRaw)
  const added = parsePositiveNumber(addedRaw)
  const tariff = parsePositiveNumber(tariffRaw)
  const limitAmount = parsePositiveNumber(limitAmountRaw)
  const limitTariff = parsePositiveNumber(limitTariffRaw)

  const currentReading = base + added
  const breakdown = useMemo(
    () =>
      calcMeterTotal(added, tariff, {
        limitEnabled: config.hasLimit && limitEnabled,
        limitAmount,
        limitTariff,
      }),
    [added, tariff, config.hasLimit, limitEnabled, limitAmount, limitTariff],
  )

  useEffect(() => {
    onTotalChange(config.id, breakdown.total)
  }, [config.id, breakdown.total, onTotalChange])

  const title = meterTitle(tr, config.id)
  const unitLabel = meterUnitLabel(tr, config.id)

  return (
    <article
      className="overflow-hidden rounded-2xl border border-line/60 bg-panel shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45)] backdrop-blur-sm"
      style={{ borderTopColor: config.accent, borderTopWidth: 3 }}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 pb-3">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            {title}
          </h2>
          <p className="mt-0.5 text-sm text-muted">{unitLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          {config.hasLimit && (
            <button
              type="button"
              onClick={() => setLimitEnabled((v) => !v)}
              className="rounded-md px-2.5 py-1.5 font-display text-xs font-bold tracking-wide transition"
              style={{
                background: limitEnabled ? config.accent : config.accentSoft,
                color: limitEnabled ? '#111' : config.accent,
              }}
              aria-pressed={limitEnabled}
            >
              {tr.limit}: {limitEnabled ? 'ON' : 'OFF'}
            </button>
          )}
          <span
            className="rounded-md px-2.5 py-1 font-display text-xs font-semibold tracking-wide"
            style={{ background: config.accentSoft, color: config.accent }}
          >
            {config.unit}
          </span>
        </div>
      </header>

      <div className="grid gap-4 px-5 pb-5 lg:grid-cols-[1.15fr_1fr] lg:items-start">
        <DigitalMeter
          kind={config.id}
          value={currentReading}
          wholeDigits={config.digits}
          unit={config.unit}
          accent={config.accent}
          label={`${title} ${tr.meterLabel}`}
          subtitle={
            config.id === 'water'
              ? tr.waterDevice
              : config.id === 'gas'
                ? tr.gasDevice
                : tr.electricDevice
          }
          tariffBadge={config.hasLimit && limitEnabled ? 'T2' : 'T1'}
        />

        <div className="flex flex-col gap-3">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              {tr.baseReading} ({config.unit})
            </span>
            <input
              type="number"
              min={0}
              step="any"
              inputMode="decimal"
              value={baseRaw}
              onChange={(e) => setBaseRaw(e.target.value)}
              className={inputClass}
            />
            <span className="mt-1 block text-xs text-muted">{tr.baseHint}</span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              {tr.added} ({config.unit})
            </span>
            <input
              type="number"
              min={0}
              step="any"
              inputMode="decimal"
              value={addedRaw}
              onChange={(e) => setAddedRaw(e.target.value)}
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              {tr.tariff} ({tr.som} / {config.unit})
            </span>
            <input
              type="number"
              min={0}
              step="any"
              inputMode="decimal"
              value={tariffRaw}
              onChange={(e) => setTariffRaw(e.target.value)}
              className={inputClass}
            />
          </label>

          {config.hasLimit && limitEnabled && (
            <div className="grid gap-3 rounded-xl border border-line/50 p-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                  {tr.limitAmount} ({config.unit})
                </span>
                <input
                  type="number"
                  min={0}
                  step="any"
                  inputMode="decimal"
                  value={limitAmountRaw}
                  onChange={(e) => setLimitAmountRaw(e.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                  {tr.limitTariff} ({tr.som})
                </span>
                <input
                  type="number"
                  min={0}
                  step="any"
                  inputMode="decimal"
                  value={limitTariffRaw}
                  onChange={(e) => setLimitTariffRaw(e.target.value)}
                  className={inputClass}
                />
              </label>
            </div>
          )}

          <div
            className="rounded-xl px-3.5 py-3"
            style={{ background: config.accentSoft }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              {tr.calc}
            </p>
            <p className="mt-1 text-sm text-muted">
              {tr.currentReading}:{' '}
              <span className="font-semibold text-ink">
                {formatUsage(currentReading, locale)} {config.unit}
              </span>
            </p>
            <p className="mt-1 font-display text-base font-semibold text-ink/90 sm:text-lg">
              {tr.billable}: {formatUsage(added, locale)} {config.unit}
            </p>

            {config.hasLimit && limitEnabled ? (
              <div className="mt-2 space-y-1 text-sm text-ink/80">
                <p>
                  {tr.withinLimit}: {formatUsage(breakdown.within, locale)} ×{' '}
                  {formatSom(tariff, locale)} ={' '}
                  {formatSom(breakdown.within * tariff, locale)} {tr.som}
                </p>
                <p>
                  {tr.overLimit}: {formatUsage(breakdown.over, locale)} ×{' '}
                  {formatSom(limitTariff, locale)} ={' '}
                  {formatSom(breakdown.over * limitTariff, locale)} {tr.som}
                </p>
              </div>
            ) : (
              <p className="mt-1 font-display text-base font-semibold text-ink/80 sm:text-lg">
                {formatUsage(added, locale)} {config.unit} ×{' '}
                {formatSom(tariff, locale)} {tr.som}
              </p>
            )}

            <p className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink">
              = {formatSom(breakdown.total, locale)} {tr.som}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
