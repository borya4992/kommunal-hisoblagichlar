import { useCallback, useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface InstallAppButtonProps {
  label: string
  installedLabel: string
  hint: string
}

export function InstallAppButton({
  label,
  installedLabel,
  hint,
}: InstallAppButtonProps) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  )
  const [installed, setInstalled] = useState(false)
  const [busy, setBusy] = useState(false)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in navigator &&
        Boolean((navigator as Navigator & { standalone?: boolean }).standalone))

    if (standalone) {
      setInstalled(true)
      return
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }

    const onInstalled = () => {
      setInstalled(true)
      setDeferred(null)
      setShowHint(false)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const handleClick = useCallback(async () => {
    if (busy) return
    if (!deferred) {
      setShowHint((v) => !v)
      return
    }
    setBusy(true)
    try {
      await deferred.prompt()
      const choice = await deferred.userChoice
      if (choice.outcome === 'accepted') setInstalled(true)
      setDeferred(null)
    } finally {
      setBusy(false)
    }
  }, [deferred, busy])

  if (installed) {
    return (
      <div className="rounded-xl border border-line bg-panel px-3 py-2 text-sm font-semibold text-muted">
        ✓ {installedLabel}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-stretch gap-1 sm:items-end">
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className="rounded-xl bg-[#e67e22] px-3.5 py-2 text-sm font-bold text-white shadow-sm transition hover:brightness-110 disabled:opacity-60"
      >
        {busy ? '…' : label}
      </button>
      {showHint && !deferred && (
        <p className="max-w-xs text-right text-xs leading-snug text-muted">
          {hint}
        </p>
      )}
    </div>
  )
}
