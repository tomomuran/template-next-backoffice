create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin', 'member');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_status') then
    create type public.user_status as enum ('invited', 'active', 'suspended');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'contact_status') then
    create type public.contact_status as enum ('lead', 'active', 'archived');
  end if;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role public.app_role not null default 'member',
  status public.user_status not null default 'invited',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id)
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  company_name text not null,
  email text not null,
  phone text not null,
  status public.contact_status not null default 'lead',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id)
);

create unique index if not exists contacts_email_unique on public.contacts (email) where deleted_at is null;
create index if not exists contacts_status_idx on public.contacts (status);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor uuid not null references auth.users(id),
  action text not null,
  target_type text not null,
  target_id uuid not null,
  before jsonb,
  after jsonb,
  occurred_at timestamptz not null default now()
);

create or replace function public.current_user_role()
returns public.app_role
language sql
stable
as $$
  select role
  from public.user_profiles
  where id = auth.uid()
    and deleted_at is null
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(public.current_user_role() = 'admin', false)
$$;

drop trigger if exists set_user_profiles_updated_at on public.user_profiles;
create trigger set_user_profiles_updated_at
before update on public.user_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_contacts_updated_at on public.contacts;
create trigger set_contacts_updated_at
before update on public.contacts
for each row execute function public.set_updated_at();

alter table public.user_profiles enable row level security;
alter table public.contacts enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "profiles_select_self_or_admin" on public.user_profiles;
create policy "profiles_select_self_or_admin"
on public.user_profiles
for select
using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_insert_self_or_admin" on public.user_profiles;
create policy "profiles_insert_self_or_admin"
on public.user_profiles
for insert
with check (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_self_or_admin" on public.user_profiles;
create policy "profiles_update_self_or_admin"
on public.user_profiles
for update
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

drop policy if exists "contacts_read_authenticated" on public.contacts;
create policy "contacts_read_authenticated"
on public.contacts
for select
using (auth.uid() is not null);

drop policy if exists "contacts_write_authenticated" on public.contacts;
create policy "contacts_write_authenticated"
on public.contacts
for insert
with check (auth.uid() is not null);

drop policy if exists "contacts_update_authenticated" on public.contacts;
create policy "contacts_update_authenticated"
on public.contacts
for update
using (auth.uid() is not null)
with check (auth.uid() is not null);

drop policy if exists "audit_logs_insert_authenticated" on public.audit_logs;
create policy "audit_logs_insert_authenticated"
on public.audit_logs
for insert
with check (auth.uid() = actor);

drop policy if exists "audit_logs_select_admin_only" on public.audit_logs;
create policy "audit_logs_select_admin_only"
on public.audit_logs
for select
using (public.is_admin());
