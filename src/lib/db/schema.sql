-- Vêtu Supabase Schema
-- Run this in your Supabase SQL Editor

-- Users table (managed by AUTH_AGENT webhook)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  clerk_id text unique not null,
  email text,
  created_at timestamptz default now(),
  deleted_at timestamptz
);

-- Entitlements table (managed by BILLING_AGENT)
create table if not exists entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  tier text not null default 'free' check (tier in ('free', 'pro', 'api')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Saved outfits (managed by PERSISTENCE_AGENT)
create table if not exists saved_outfits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  outfit_data jsonb not null,
  occasion text not null,
  season text not null,
  created_at timestamptz default now()
);

create index if not exists idx_saved_outfits_user_id on saved_outfits(user_id);
create index if not exists idx_saved_outfits_created_at on saved_outfits(created_at desc);

-- Feedback (managed by PERSISTENCE_AGENT)
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  outfit_id text not null,
  type text not null check (type in ('like', 'dislike')),
  comment text,
  created_at timestamptz default now(),
  unique(user_id, outfit_id)
);

create index if not exists idx_feedback_outfit_id on feedback(outfit_id);
create index if not exists idx_feedback_user_id on feedback(user_id);

-- Usage tracking (managed by BILLING_AGENT)
create table if not exists usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  feature text not null,
  year int not null,
  month int not null,
  count int not null default 1,
  unique(user_id, feature, year, month)
);

create index if not exists idx_usage_user_id on usage(user_id);
create index if not exists idx_usage_period on usage(year, month);

-- RPC function for atomic increment (managed by BILLING_AGENT)
create or replace function increment_usage(
  p_user_id uuid,
  p_feature text,
  p_year int,
  p_month int
) returns void as $$
begin
  update usage
  set count = count + 1
  where user_id = p_user_id
    and feature = p_feature
    and year = p_year
    and month = p_month;
end;
$$ language plpgsql;

-- Enable RLS (managed by SECURITY_AGENT later)
-- alter table saved_outfits enable row level security;
-- alter table feedback enable row level security;
-- alter table usage enable row level security;
