-- Run this in Supabase Dashboard → SQL Editor
create extension if not exists "pgcrypto";

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  created_at timestamptz not null default now(),
  year int not null,
  month int not null check (month between 1 and 12),
  electric numeric not null default 0,
  gas numeric not null default 0,
  water numeric not null default 0,
  total numeric not null default 0
);

create index if not exists reports_device_created_idx
  on public.reports (device_id, created_at desc);

create index if not exists reports_device_year_month_idx
  on public.reports (device_id, year, month);

alter table public.reports enable row level security;

drop policy if exists "reports_select_own" on public.reports;
drop policy if exists "reports_insert_own" on public.reports;
drop policy if exists "reports_delete_own" on public.reports;

-- Public calculator: clients send device_id; open anon policies for insert/select/delete by device
create policy "reports_select_anon"
  on public.reports for select
  to anon, authenticated
  using (true);

create policy "reports_insert_anon"
  on public.reports for insert
  to anon, authenticated
  with check (true);

create policy "reports_delete_anon"
  on public.reports for delete
  to anon, authenticated
  using (true);
