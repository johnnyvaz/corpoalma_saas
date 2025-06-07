
-- Update users table to use UUID for Supabase auth
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE users ALTER COLUMN id TYPE UUID USING id::uuid;
ALTER TABLE users ADD PRIMARY KEY (id);

-- Update foreign key references
ALTER TABLE team_members ALTER COLUMN user_id TYPE UUID USING user_id::uuid;
ALTER TABLE activity_logs ALTER COLUMN user_id TYPE UUID USING user_id::uuid;
ALTER TABLE user_progress ALTER COLUMN user_id TYPE UUID USING user_id::uuid;
ALTER TABLE weight_tracking ALTER COLUMN user_id TYPE UUID USING user_id::uuid;
ALTER TABLE testimonials ALTER COLUMN user_id TYPE UUID USING user_id::uuid;
ALTER TABLE invitations ALTER COLUMN invited_by TYPE UUID USING invited_by::uuid;

-- Remove password_hash column since Supabase handles auth
ALTER TABLE users DROP COLUMN IF EXISTS password_hash;

-- Add program start date for new users
UPDATE users SET program_start_date = NOW() WHERE program_start_date IS NULL;
