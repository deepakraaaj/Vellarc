create table if not exists public.projects (
  id text primary key,
  title text not null,
  tagline text not null default '',
  status text not null default 'Draft',
  last_updated text not null,
  project_data jsonb not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint projects_status_check check (status in ('Draft', 'In Review', 'Approved'))
);

create or replace function public.set_projects_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row
execute function public.set_projects_updated_at();

alter table public.projects enable row level security;

drop policy if exists "projects_select_public" on public.projects;
create policy "projects_select_public"
on public.projects
for select
to anon, authenticated
using (true);

drop policy if exists "projects_insert_public" on public.projects;
create policy "projects_insert_public"
on public.projects
for insert
to anon, authenticated
with check (true);

drop policy if exists "projects_update_public" on public.projects;
create policy "projects_update_public"
on public.projects
for update
to anon, authenticated
using (true)
with check (true);

comment on table public.projects is
'Prototype storage for SpecArc project documents. Tighten these public policies before production.';
