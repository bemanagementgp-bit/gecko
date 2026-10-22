-- Esquema del panel de gecko. Se corre una vez en el SQL Editor de Supabase (o con la CLI).
-- Cada tabla guarda el elemento completo en `data` (jsonb); así el panel puede sumar campos sin migraciones.

create table if not exists public.editors (
  email text primary key,
  created_at timestamptz not null default now()
);

create or replace function public.is_editor() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.editors e where e.email = (auth.jwt() ->> 'email'));
$$;

do $$
declare t text;
begin
  foreach t in array array['projects', 'products', 'materials'] loop
    execute format('create table if not exists public.%I (
      slug text primary key,
      data jsonb not null default ''{}''::jsonb,
      published boolean not null default true,
      sort integer not null default 0,
      updated_at timestamptz not null default now()
    )', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "lectura publica" on public.%I', t);
    execute format('create policy "lectura publica" on public.%I for select using (published or public.is_editor())', t);
    execute format('drop policy if exists "edicion editores" on public.%I', t);
    execute format('create policy "edicion editores" on public.%I for all to authenticated using (public.is_editor()) with check (public.is_editor())', t);
  end loop;
end $$;

alter table public.editors enable row level security;
drop policy if exists "editores se ven" on public.editors;
create policy "editores se ven" on public.editors for select to authenticated using (public.is_editor());

-- Fotos subidas desde el panel: lectura pública, escritura solo editores.
insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict (id) do nothing;
drop policy if exists "media lectura" on storage.objects;
create policy "media lectura" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "media editores" on storage.objects;
create policy "media editores" on storage.objects for all to authenticated
  using (bucket_id = 'media' and public.is_editor()) with check (bucket_id = 'media' and public.is_editor());

-- Después de crear los usuarios en Authentication → Users, habilitalos como editores:
-- insert into public.editors (email) values ('persona@gecko.estudio');
