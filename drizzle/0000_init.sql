CREATE TABLE IF NOT EXISTS subscriptions (
  user_id text PRIMARY KEY,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text NOT NULL DEFAULT 'free',
  interval text,
  current_period_end timestamptz,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS practice_quotas (
  user_id text NOT NULL,
  academic_day text NOT NULL,
  seconds_used integer NOT NULL DEFAULT 0,
  lesson_slugs jsonb NOT NULL DEFAULT '[]'::jsonb,
  PRIMARY KEY (user_id, academic_day)
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  user_id text NOT NULL,
  lesson_slug text NOT NULL,
  score integer,
  completed_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mistakes (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  source text NOT NULL,
  prompt text NOT NULL,
  answer text NOT NULL,
  correction text,
  audio_key text,
  created_at timestamptz DEFAULT now()
);
