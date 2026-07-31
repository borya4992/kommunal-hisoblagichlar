import type { MeterKind } from '../data/tariffs'

interface DigitalMeterProps {
  kind: MeterKind
  value: number
  wholeDigits?: number
  fracDigits?: number
  unit: string
  label: string
  accent: string
  subtitle: string
  tariffBadge?: string
}

const MODELS: Record<MeterKind, string> = {
  electric: 'EL92',
  water: 'SV12',
  gas: 'GZ20',
}

function padReading(value: number, whole: number, frac: number): string {
  const scale = 10 ** frac
  const total = Math.round(Math.max(0, Number.isFinite(value) ? value : 0) * scale)
  return String(total).padStart(whole + frac, '0').slice(-(whole + frac))
}

function BmbLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-1.5 ${className}`}>
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1a1f24] font-display text-[11px] font-extrabold tracking-tight text-white">
        BMB
      </span>
      <span className="font-display text-lg font-extrabold tracking-[0.12em] text-[#1a1f24]">
        BMB
      </span>
    </div>
  )
}

function LcdPanel({
  wholePart,
  fracPart,
  unit,
  wholeDigits,
  fracDigits,
  badge,
  topLabel,
  compact,
}: {
  wholePart: string
  fracPart: string
  unit: string
  wholeDigits: number
  fracDigits: number
  badge?: string
  topLabel?: string
  compact?: boolean
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-md border-2 border-[#5f6758] ${
        compact ? 'px-2 py-2' : 'px-2.5 py-2.5 sm:px-3 sm:py-3'
      }`}
      style={{
        background:
          'linear-gradient(180deg, #c9d6a4 0%, #b7c68f 48%, #a8b882 100%)',
        boxShadow:
          'inset 0 0 0 1px rgba(255,255,255,0.28), inset 0 8px 14px rgba(0,0,0,0.12)',
      }}
    >
      <div className="relative z-10 mb-0.5 flex items-start justify-between gap-2">
        <span className="font-lcd text-[9px] font-bold tracking-wide text-[#1a2218]/75 sm:text-[10px]">
          {topLabel ?? unit}
        </span>
        {badge ? (
          <span className="font-lcd text-[9px] font-bold text-[#1a2218]/75 sm:text-[10px]">
            {badge}
          </span>
        ) : (
          <span className="font-lcd text-[9px] font-bold text-[#1a2218]/75 sm:text-[10px]">
            {unit}
          </span>
        )}
      </div>

      <div className="relative z-10 flex items-end justify-center gap-0.5 py-0.5">
        <span
          className={`font-lcd leading-none tracking-[0.06em] text-[#141a12] ${
            compact ? 'text-[1.65rem]' : 'text-[1.85rem] sm:text-[2.35rem]'
          }`}
        >
          {wholePart}
        </span>
        <span
          className={`mb-0.5 font-lcd leading-none text-[#141a12] ${
            compact ? 'text-xl' : 'text-2xl sm:text-3xl'
          }`}
        >
          .
        </span>
        <span
          className={`font-lcd leading-none tracking-[0.06em] text-[#141a12] ${
            compact ? 'text-[1.65rem]' : 'text-[1.85rem] sm:text-[2.35rem]'
          }`}
        >
          {fracPart}
        </span>
      </div>

      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-2 top-[52%] -translate-y-1/2 text-center font-lcd leading-none tracking-[0.06em] text-[#141a12]/[0.07] ${
          compact ? 'text-[1.65rem]' : 'text-[1.85rem] sm:text-[2.35rem]'
        }`}
      >
        {'8'.repeat(wholeDigits)}.{'8'.repeat(fracDigits)}
      </div>
    </div>
  )
}

function ElectricMeterShell(props: {
  wholePart: string
  fracPart: string
  unit: string
  label: string
  accent: string
  tariffBadge?: string
  wholeDigits: number
  fracDigits: number
  model: string
}) {
  const {
    wholePart,
    fracPart,
    unit,
    label,
    accent,
    tariffBadge,
    wholeDigits,
    fracDigits,
    model,
  } = props

  return (
    <div
      className="rounded-[1.35rem] border border-[#b8c0c8] p-3 shadow-[0_12px_28px_-12px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.65)] sm:p-4"
      style={{
        background:
          'linear-gradient(160deg, #d8dde3 0%, #c5ccd4 42%, #b7bfc8 100%)',
      }}
    >
      <div
        className="relative rounded-[1rem] border border-[#a7afb8]/70 px-3 pb-3 pt-3 sm:px-4"
        style={{
          background:
            'linear-gradient(180deg, #dfe4ea 0%, #ced4dc 55%, #c2c9d1 100%)',
          boxShadow:
            'inset 0 2px 4px rgba(255,255,255,0.55), inset 0 -2px 6px rgba(0,0,0,0.08)',
        }}
      >
        <div className="mb-2 flex justify-center">
          <BmbLogo />
        </div>

        <div className="mx-auto mb-3 h-1.5 w-[40%] rounded-sm bg-[#9aa3ad] shadow-inner" />

        <div className="flex items-stretch gap-3">
          <div className="hidden w-10 shrink-0 flex-col items-center justify-center sm:flex">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c8ced6] shadow-[inset_0_2px_6px_rgba(0,0,0,0.2)]">
              <div className="h-5 w-8 rounded-md bg-[#1a1f24]" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <LcdPanel
              wholePart={wholePart}
              fracPart={fracPart}
              unit={unit}
              wholeDigits={wholeDigits}
              fracDigits={fracDigits}
              badge={tariffBadge}
            />

            <div className="mt-2.5 flex items-center justify-center gap-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-2.5 w-2.5 rounded-full border border-black/20"
                  style={{
                    background:
                      i === 0
                        ? `radial-gradient(circle at 30% 30%, ${accent}, #333)`
                        : 'radial-gradient(circle at 30% 30%, #6a737c, #2a3036)',
                    boxShadow:
                      i === 0
                        ? `0 0 8px ${accent}99`
                        : 'inset 0 1px 2px rgba(0,0,0,0.4)',
                  }}
                />
              ))}
            </div>

            <p className="mt-2 text-center text-[9px] font-semibold uppercase tracking-[0.14em] text-[#3a4450]/80 sm:text-[10px]">
              {label}
            </p>
          </div>

          <div className="flex w-12 shrink-0 flex-col items-center justify-end gap-2 pb-1 sm:w-14">
            <div className="text-[8px] font-bold uppercase tracking-wider text-[#4a5560]">
              2024
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#9aa3ad] bg-gradient-to-b from-[#f2f4f6] to-[#c9d0d8] text-[9px] font-bold uppercase tracking-wide text-[#333] shadow-[0_2px_4px_rgba(0,0,0,0.2)] sm:h-12 sm:w-12 sm:text-[10px]">
              Qayta
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-end justify-between gap-2 border-t border-[#a7afb8]/50 pt-2">
          <div>
            <p className="font-display text-base font-extrabold tracking-wide text-[#2a323c]">
              {model}
            </p>
            <p className="mt-0.5 text-[8px] leading-tight text-[#5a6570] sm:text-[9px]">
              220V · 5(60)A · 50Hz · cl.1.0
            </p>
          </div>
          <div className="flex items-center gap-1.5 opacity-70">
            <span className="rounded border border-[#5a6570] px-1 py-0.5 text-[7px] font-bold uppercase text-[#5a6570]">
              dlms
            </span>
            <span className="rounded border border-[#5a6570] px-1 py-0.5 text-[7px] font-bold uppercase text-[#5a6570]">
              G3-PLC
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function WaterMeterShell(props: {
  wholePart: string
  fracPart: string
  unit: string
  label: string
  wholeDigits: number
  fracDigits: number
  model: string
  subtitle: string
}) {
  const {
    wholePart,
    fracPart,
    unit,
    label,
    wholeDigits,
    fracDigits,
    model,
    subtitle,
  } = props

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[340px]">
      {/* Brass pipe stubs */}
      <div className="absolute top-1/2 -left-2 z-0 h-7 w-8 -translate-y-1/2 rounded-l-md bg-gradient-to-r from-[#9a7a45] to-[#c4a56a] shadow-md" />
      <div className="absolute top-1/2 -right-2 z-0 h-7 w-8 -translate-y-1/2 rounded-r-md bg-gradient-to-l from-[#9a7a45] to-[#c4a56a] shadow-md" />

      {/* Red outer ring */}
      <div
        className="absolute inset-0 rounded-full p-[10px] shadow-[0_14px_32px_-10px_rgba(0,0,0,0.45)]"
        style={{
          background:
            'radial-gradient(circle at 35% 28%, #e85a4f 0%, #c62828 55%, #8e1b1b 100%)',
        }}
      >
        {/* White face */}
        <div
          className="flex h-full w-full flex-col items-center overflow-hidden rounded-full border border-[#d8dde3] px-7 pt-5 pb-3 sm:px-8"
          style={{
            background:
              'radial-gradient(circle at 40% 30%, #ffffff 0%, #f4f6f8 70%, #e6eaef 100%)',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          <BmbLogo className="scale-90" />

          <div className="mt-2 w-[78%]">
            <LcdPanel
              wholePart={wholePart}
              fracPart={fracPart}
              unit={unit}
              wholeDigits={wholeDigits}
              fracDigits={fracDigits}
              compact
            />
          </div>

          <p className="mt-2 max-w-[70%] truncate text-center text-[8px] font-bold uppercase tracking-[0.1em] text-[#2a323c] sm:text-[9px]">
            {subtitle}
          </p>
          <p className="mt-0.5 font-display text-sm font-extrabold tracking-wide text-[#1a1f24]">
            {model}
          </p>

          <div className="mt-auto grid w-[72%] grid-cols-2 gap-x-3 gap-y-0.5 pt-2 text-[7px] leading-tight text-[#5a6570] sm:text-[8px]">
            <div className="min-w-0 space-y-0.5 overflow-hidden">
              <p className="truncate">Pмакс 1.6 MPa</p>
              <p className="truncate">T 5…90°C</p>
              <p className="truncate">Ду-15</p>
            </div>
            <div className="min-w-0 space-y-0.5 overflow-hidden text-right">
              <p className="truncate">qn 1.5</p>
              <p className="truncate">qmax 3.0</p>
              <p className="truncate font-semibold text-[#2a323c]">EAC</p>
            </div>
          </div>

          <div className="mt-2 flex w-[78%] items-center justify-between">
            <div className="h-5 w-5 shrink-0 rounded-full bg-gradient-to-b from-[#d0d5db] to-[#9aa3ad] shadow-inner" />
            <p className="mx-2 min-w-0 truncate text-center text-[7px] font-semibold tracking-wider text-[#5a6570] sm:text-[8px]">
              {label}
            </p>
            <div className="h-3.5 w-5 shrink-0 rounded-full bg-[#1a1f24]/80" />
          </div>
        </div>
      </div>
    </div>
  )
}

function GasMeterShell(props: {
  wholePart: string
  fracPart: string
  unit: string
  label: string
  wholeDigits: number
  fracDigits: number
  model: string
  subtitle: string
}) {
  const {
    wholePart,
    fracPart,
    unit,
    label,
    wholeDigits,
    fracDigits,
    model,
    subtitle,
  } = props

  return (
    <div className="relative mx-auto w-full max-w-md sm:max-w-[28rem]">
      {/* Top pipe ports */}
      <div className="mb-[-6px] flex justify-center gap-20 px-12">
        <div className="h-4 w-11 rounded-t-md bg-[#1e3a5f] shadow-sm" />
        <div className="h-4 w-11 rounded-t-md bg-[#1e3a5f] shadow-sm" />
      </div>

      <div
        className="rounded-[1.1rem] border border-[#cfd5dc] px-5 pb-4 pt-5 shadow-[0_14px_30px_-12px_rgba(0,0,0,0.4)]"
        style={{
          background:
            'linear-gradient(165deg, #f4f6f8 0%, #e8ecf0 48%, #d7dde4 100%)',
        }}
      >
        <div className="mb-3 flex justify-center">
          <BmbLogo />
        </div>

        <div className="flex items-start gap-3">
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex h-7 w-8 items-center justify-center rounded-md border border-[#b0b8c1] bg-[#eef1f4] text-[8px] font-bold text-[#4a5560]">
              ST
            </div>
            <div className="flex h-7 w-8 items-center justify-center rounded-md border border-[#b0b8c1] bg-[#eef1f4] text-[8px] font-bold text-[#4a5560]">
              DT
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <LcdPanel
              wholePart={wholePart}
              fracPart={fracPart}
              unit={unit}
              wholeDigits={wholeDigits}
              fracDigits={fracDigits}
              topLabel="Total"
            />
          </div>

          <div className="flex w-9 flex-col items-center gap-2 pt-1">
            <div className="h-8 w-8 rounded-full bg-gradient-to-b from-[#e8ebef] to-[#9aa3ad] shadow-[0_2px_4px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.7)]" />
            <div className="h-3 w-3 rounded-full bg-[#1a1f24]" />
            <div className="mt-1 h-10 w-10 rounded-full border-2 border-[#b0b8c1] bg-[#dfe4ea] shadow-inner" />
          </div>
        </div>

        <div className="mt-3 text-center">
          <p className="text-[11px] font-semibold text-[#2a323c]">{subtitle}</p>
          <p className="mt-0.5 font-display text-base font-extrabold tracking-wide text-[#1a1f24]">
            {model}
          </p>
          <p className="mt-0.5 text-[10px] text-[#5a6570]">{label}</p>
          <p className="mt-1 text-[9px] tracking-wide text-[#5a6570]">
            G4 · basic · BMB MChJ
          </p>
        </div>

        <div className="mt-3 flex items-end justify-between border-t border-[#c5ccd4]/80 pt-2">
          <div className="flex flex-col items-start gap-1">
            <div className="h-8 w-14 bg-[repeating-linear-gradient(90deg,#1a1f24_0_1px,transparent_1px_3px)] opacity-70" />
            <p className="text-[8px] tracking-wider text-[#5a6570]">
              24-0000{model.slice(-2)}
            </p>
          </div>
          <p className="text-[9px] font-semibold text-[#5a6570]">iMeter</p>
        </div>
      </div>
    </div>
  )
}

export function DigitalMeter({
  kind,
  value,
  wholeDigits = 6,
  fracDigits = 2,
  unit,
  label,
  accent,
  subtitle,
  tariffBadge = 'T1',
}: DigitalMeterProps) {
  const digits = padReading(value, wholeDigits, fracDigits)
  const wholePart = digits.slice(0, wholeDigits)
  const fracPart = digits.slice(wholeDigits)
  const model = MODELS[kind]

  return (
    <div
      className="relative mx-auto w-full select-none"
      aria-label={`${label}: ${wholePart}.${fracPart} ${unit}`}
    >
      {kind === 'water' ? (
        <WaterMeterShell
          wholePart={wholePart}
          fracPart={fracPart}
          unit={unit}
          label={label}
          wholeDigits={wholeDigits}
          fracDigits={fracDigits}
          model={model}
          subtitle={subtitle}
        />
      ) : kind === 'gas' ? (
        <GasMeterShell
          wholePart={wholePart}
          fracPart={fracPart}
          unit={unit}
          label={label}
          wholeDigits={wholeDigits}
          fracDigits={fracDigits}
          model={model}
          subtitle={subtitle}
        />
      ) : (
        <ElectricMeterShell
          wholePart={wholePart}
          fracPart={fracPart}
          unit={unit}
          label={label}
          accent={accent}
          tariffBadge={tariffBadge}
          wholeDigits={wholeDigits}
          fracDigits={fracDigits}
          model={model}
        />
      )}
    </div>
  )
}
