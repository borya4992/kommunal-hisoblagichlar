import { getDeviceId, isSupabaseConfigured, supabase } from '../lib/supabase'

export type ReportEntry = {
  id: string
  createdAt: string
  year: number
  month: number
  electric: number
  gas: number
  water: number
  total: number
}

type ReportRow = {
  id: string
  device_id: string
  created_at: string
  year: number
  month: number
  electric: number
  gas: number
  water: number
  total: number
}

const STORAGE_KEY = 'komculate-reports-v1'

function rowToEntry(row: ReportRow): ReportEntry {
  return {
    id: row.id,
    createdAt: row.created_at,
    year: row.year,
    month: row.month,
    electric: Number(row.electric),
    gas: Number(row.gas),
    water: Number(row.water),
    total: Number(row.total),
  }
}

function loadLocalReports(): ReportEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ReportEntry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveLocalReports(entries: ReportEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export async function fetchReports(): Promise<ReportEntry[]> {
  if (!supabase || !isSupabaseConfigured) {
    return loadLocalReports()
  }

  const deviceId = getDeviceId()
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('device_id', deviceId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase fetchReports:', error.message)
    return loadLocalReports()
  }

  const entries = (data as ReportRow[]).map(rowToEntry)
  saveLocalReports(entries)
  return entries
}

export async function insertReport(totals: {
  electric: number
  gas: number
  water: number
}): Promise<ReportEntry> {
  const now = new Date()
  const electric = totals.electric || 0
  const gas = totals.gas || 0
  const water = totals.water || 0
  const total = electric + gas + water
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  if (!supabase || !isSupabaseConfigured) {
    const entry: ReportEntry = {
      id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: now.toISOString(),
      year,
      month,
      electric,
      gas,
      water,
      total,
    }
    const next = [entry, ...loadLocalReports()]
    saveLocalReports(next)
    return entry
  }

  const deviceId = getDeviceId()
  const { data, error } = await supabase
    .from('reports')
    .insert({
      device_id: deviceId,
      year,
      month,
      electric,
      gas,
      water,
      total,
    })
    .select('*')
    .single()

  if (error || !data) {
    console.error('Supabase insertReport:', error?.message)
    const entry: ReportEntry = {
      id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: now.toISOString(),
      year,
      month,
      electric,
      gas,
      water,
      total,
    }
    const next = [entry, ...loadLocalReports()]
    saveLocalReports(next)
    return entry
  }

  const entry = rowToEntry(data as ReportRow)
  saveLocalReports([entry, ...loadLocalReports().filter((e) => e.id !== entry.id)])
  return entry
}

export async function clearReports(): Promise<void> {
  if (!supabase || !isSupabaseConfigured) {
    saveLocalReports([])
    return
  }

  const deviceId = getDeviceId()
  const { error } = await supabase.from('reports').delete().eq('device_id', deviceId)
  if (error) {
    console.error('Supabase clearReports:', error.message)
  }
  saveLocalReports([])
}

export function sumEntries(entries: ReportEntry[]) {
  return entries.reduce(
    (acc, e) => ({
      electric: acc.electric + e.electric,
      gas: acc.gas + e.gas,
      water: acc.water + e.water,
      total: acc.total + e.total,
    }),
    { electric: 0, gas: 0, water: 0, total: 0 },
  )
}

export function filterByMonth(
  entries: ReportEntry[],
  year: number,
  month: number,
) {
  return entries.filter((e) => e.year === year && e.month === month)
}

export function filterByYear(entries: ReportEntry[], year: number) {
  return entries.filter((e) => e.year === year)
}
