-- Server-authoritative premium entitlement.
--
-- Before this, the app wrote `profiles.premium_unlocked` itself and read it back
-- as truth, so a patched client could grant itself Premium and have the server
-- persist it. This table is the new source of truth: only the RevenueCat webhook
-- (service role) can write it, and a user may only read their own row.

create table if not exists public.premium_entitlements (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  is_active    boolean     not null default false,
  product_id   text,
  store        text,
  expires_at   timestamptz,
  event_type   text,
  updated_at   timestamptz not null default now()
);

alter table public.premium_entitlements enable row level security;

-- Read your own entitlement. Nothing else.
drop policy if exists "read own entitlement" on public.premium_entitlements;
create policy "read own entitlement"
  on public.premium_entitlements
  for select
  using (auth.uid() = user_id);

-- Deliberately NO insert/update/delete policies for `authenticated` or `anon`.
-- With RLS on and no permissive policy, those writes are rejected. The webhook
-- uses the service-role key, which bypasses RLS.
revoke insert, update, delete on public.premium_entitlements from anon, authenticated;

-- The client must never be able to set this again. Guarded: the column may not
-- exist on every environment, and a bare REVOKE would abort the whole script.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles'
      and column_name = 'premium_unlocked'
  ) then
    execute 'revoke update (premium_unlocked) on public.profiles from anon, authenticated';
  end if;
end $$;

comment on table public.premium_entitlements is
  'Written only by the revenuecat-webhook edge function. Clients read their own row.';
