-- Enable anonymous sign-ins (do this in Auth > Settings in the dashboard)

-- Profiles table: stores equipment preferences and month label per user
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  equipment jsonb not null default '[]',
  month_label text not null default '',
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Week plan table: one row per day per user
create table if not exists week_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  day text not null,
  workout_id text not null, -- 'rest' or a workout id string
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, day)
);

-- Workout logs table: one row per logged workout session
create table if not exists workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workout_id text not null,
  logged_at timestamptz not null default now(),
  data jsonb not null default '{}', -- { exercises: {...}, duration: '', notes: '' }
  created_at timestamptz not null default now()
);

-- Custom workouts table: one row per custom workout
create table if not exists custom_workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workout_id text not null, -- the client-side id (e.g. 'custom-1234')
  data jsonb not null default '{}', -- full workout object
  created_at timestamptz not null default now(),
  unique(user_id, workout_id)
);

-- Row Level Security: users can only read/write their own data
alter table profiles enable row level security;
alter table week_plans enable row level security;
alter table workout_logs enable row level security;
alter table custom_workouts enable row level security;

create policy "Users can manage their own profile"
  on profiles for all using (auth.uid() = id);

create policy "Users can manage their own week plan"
  on week_plans for all using (auth.uid() = user_id);

create policy "Users can manage their own workout logs"
  on workout_logs for all using (auth.uid() = user_id);

create policy "Users can manage their own custom workouts"
  on custom_workouts for all using (auth.uid() = user_id);

-- Auto-create a profile row when a new user signs up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
