create table public.inventory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  booster_type text not null check (booster_type in ('xp_surge', 'streak_shield', 'mission_reroll', 'clarity_lens')),
  quantity integer not null default 0 check (quantity >= 0),
  updated_at timestamptz not null default now(),
  unique(user_id, booster_type)
);

create table public.cosmetics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  type text not null check (type in ('hat', 'accessory', 'aura', 'background', 'armor', 'effect')),
  unlock_level integer not null default 1,
  resource_cost jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.user_cosmetics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  cosmetic_id uuid references public.cosmetics not null,
  equipped boolean not null default false,
  acquired_at timestamptz not null default now(),
  unique(user_id, cosmetic_id)
);

create table public.dialog_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  trigger_type text not null check (trigger_type in ('mission_assign', 'mission_complete', 'level_up')),
  mission_id uuid references public.missions,
  dialog_data jsonb not null,
  player_choices jsonb not null default '[]',
  created_at timestamptz not null default now()
);

insert into public.cosmetics (slug, name, description, type, unlock_level, resource_cost) values
  ('brown-beret', 'Brown Beret', 'A classic beret for the cultured capybara.', 'hat', 1, '{"focus_crystals": 30}'),
  ('tactical-vest', 'Tactical Vest', 'Standard issue. No questions asked.', 'armor', 3, '{"iron": 50}'),
  ('momentum-aura', 'Momentum Aura', 'A faint shimmer of forward motion.', 'aura', 5, '{"momentum": 40, "focus_crystals": 20}');
