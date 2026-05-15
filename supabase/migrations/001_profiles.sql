create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text,
  capybara_color text not null default 'brown',
  level integer not null default 3,
  focus_xp integer not null default 0,
  focus_level integer not null default 1,
  discipline_xp integer not null default 0,
  discipline_level integer not null default 1,
  output_xp integer not null default 0,
  output_level integer not null default 1,
  focus_crystals integer not null default 0,
  iron integer not null default 0,
  momentum integer not null default 0,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_mission_date date,
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
