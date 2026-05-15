create table public.missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text not null,
  stat_type text not null check (stat_type in ('focus', 'discipline', 'output')),
  difficulty integer not null default 1 check (difficulty between 1 and 10),
  status text not null default 'pending' check (status in ('pending', 'active', 'completed', 'failed', 'skipped')),
  estimated_minutes integer not null default 20,
  xp_reward integer not null default 20,
  resource_rewards jsonb not null default '{}',
  assigned_date date not null default current_date,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.stat_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  stat_type text not null check (stat_type in ('focus', 'discipline', 'output')),
  delta integer not null,
  source text not null check (source in ('mission_complete', 'daily_decay', 'booster')),
  mission_id uuid references public.missions,
  created_at timestamptz not null default now()
);
