-- ============================================================================
-- EVENCIFY — PRODUCTION SUPABASE POSTGRESQL SCHEMA & MIGRATION
-- Event Crew On-Demand Marketplace & Real-Time Shift Coordination Platform
-- ============================================================================
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- It safely creates/alters all required tables, performance indexes, RLS policies,
-- realtime replication, triggers, and seed data with ZERO errors on existing or new DBs.
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  role TEXT NOT NULL CHECK (role IN ('crew', 'organiser', 'admin')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  address TEXT,
  pincode TEXT,
  city TEXT DEFAULT 'Surat',
  is_active BOOLEAN DEFAULT true NOT NULL,
  is_verified BOOLEAN DEFAULT false NOT NULL,
  verification_badge TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Ensure all columns exist on pre-existing table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verification_badge TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Surat';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pincode TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- ============================================================================
-- 2. CREW PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.crew_profiles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  name TEXT,
  email TEXT,
  phone TEXT,
  city TEXT DEFAULT 'Surat',
  address TEXT,
  pincode TEXT,
  experience TEXT DEFAULT 'Experienced',
  experience_years NUMERIC DEFAULT 2,
  categories TEXT[] DEFAULT ARRAY['Event Helper']::TEXT[],
  age INTEGER DEFAULT 22,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
  profile_photo_url TEXT,
  rating NUMERIC DEFAULT 4.9 NOT NULL,
  total_reviews INTEGER DEFAULT 0 NOT NULL,
  completed_events INTEGER DEFAULT 0 NOT NULL,
  availability_status TEXT DEFAULT 'Available for Shifts' NOT NULL,
  expected_pay TEXT DEFAULT '₹1,500 / shift',
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Ensure all columns exist on pre-existing table
ALTER TABLE public.crew_profiles ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.crew_profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.crew_profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.crew_profiles ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Surat';
ALTER TABLE public.crew_profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.crew_profiles ADD COLUMN IF NOT EXISTS pincode TEXT;
ALTER TABLE public.crew_profiles ADD COLUMN IF NOT EXISTS experience_years NUMERIC DEFAULT 2;
ALTER TABLE public.crew_profiles ADD COLUMN IF NOT EXISTS expected_pay TEXT DEFAULT '₹1,500 / shift';
ALTER TABLE public.crew_profiles ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'Available for Shifts';

-- ============================================================================
-- 3. ORGANISER PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.organiser_profiles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  name TEXT,
  company_name TEXT NOT NULL,
  udyam_registered BOOLEAN DEFAULT false NOT NULL,
  udyam_number TEXT,
  address TEXT,
  pincode TEXT,
  city TEXT DEFAULT 'Surat',
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Ensure all columns exist on pre-existing table
ALTER TABLE public.organiser_profiles ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.organiser_profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.organiser_profiles ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Surat';
ALTER TABLE public.organiser_profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.organiser_profiles ADD COLUMN IF NOT EXISTS pincode TEXT;
ALTER TABLE public.organiser_profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- ============================================================================
-- 4. EVENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  organiser_id TEXT NOT NULL,
  organiser_name TEXT DEFAULT 'Event Organiser',
  event_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  venue TEXT NOT NULL,
  full_address TEXT,
  city TEXT NOT NULL,
  expected_attendance INTEGER,
  total_crew_required INTEGER DEFAULT 1 NOT NULL,
  crew_positions_available INTEGER DEFAULT 1 NOT NULL,
  required_category TEXT DEFAULT 'Event Helper',
  gender_requirement TEXT DEFAULT 'Any',
  age_requirement TEXT,
  experience_requirement TEXT DEFAULT 'Both',
  dress_code TEXT,
  special_requirements TEXT,
  pay_amount NUMERIC DEFAULT 1500 NOT NULL,
  payment_basis TEXT DEFAULT 'Per Shift' NOT NULL,
  payment_method TEXT DEFAULT 'Direct UPI / Bank Transfer' NOT NULL,
  payment_timeline TEXT DEFAULT 'Same Day' NOT NULL,
  advance_required BOOLEAN DEFAULT false NOT NULL,
  advance_amount NUMERIC DEFAULT 0 NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'paused', 'closed', 'completed', 'cancelled')) DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Ensure all columns exist on pre-existing table (fixes ERROR: 42703)
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS advance_required BOOLEAN DEFAULT false;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS advance_amount NUMERIC DEFAULT 0;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS full_address TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS organiser_name TEXT DEFAULT 'Event Organiser';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS expected_attendance INTEGER;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS dress_code TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS special_requirements TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS payment_timeline TEXT DEFAULT 'Same Day';

-- ============================================================================
-- 5. EVENT CREW REQUIREMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.event_crew_requirements (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  number_required INTEGER DEFAULT 1 NOT NULL,
  gender_requirement TEXT DEFAULT 'Any' NOT NULL,
  min_age INTEGER,
  max_age INTEGER,
  experience_requirement TEXT DEFAULT 'Both' NOT NULL,
  dress_code TEXT,
  special_requirements TEXT,
  pay_amount NUMERIC DEFAULT 1500 NOT NULL,
  payment_basis TEXT DEFAULT 'Per Shift' NOT NULL,
  payment_method TEXT DEFAULT 'Direct UPI / Bank Transfer' NOT NULL,
  payment_timeline TEXT DEFAULT 'Same Day' NOT NULL,
  advance_required BOOLEAN DEFAULT false NOT NULL,
  advance_amount NUMERIC DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.event_crew_requirements ADD COLUMN IF NOT EXISTS advance_required BOOLEAN DEFAULT false;
ALTER TABLE public.event_crew_requirements ADD COLUMN IF NOT EXISTS advance_amount NUMERIC DEFAULT 0;

-- ============================================================================
-- 6. APPLICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.applications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  event_name TEXT,
  event_date TEXT,
  crew_user_id TEXT NOT NULL,
  crew_name TEXT,
  crew_email TEXT,
  crew_phone TEXT,
  crew_photo TEXT,
  crew_category TEXT,
  experience_years NUMERIC DEFAULT 2,
  system_rating NUMERIC DEFAULT 4.9,
  city TEXT DEFAULT 'Surat',
  category TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'shortlisted', 'accepted', 'rejected', 'withdrawn')) DEFAULT 'pending',
  note TEXT,
  applied_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================================
-- 7. EVENT COORDINATION GROUPS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.coordination_groups (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  event_date TEXT NOT NULL,
  event_venue TEXT,
  organiser_id TEXT,
  organiser_name TEXT,
  organiser_phone TEXT,
  crew_members JSONB DEFAULT '[]'::jsonb,
  created_by_admin_id TEXT DEFAULT 'usr-admin',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.coordination_groups ADD COLUMN IF NOT EXISTS event_venue TEXT;
ALTER TABLE public.coordination_groups ADD COLUMN IF NOT EXISTS crew_members JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.coordination_groups ADD COLUMN IF NOT EXISTS created_by_admin_id TEXT DEFAULT 'usr-admin';

-- ============================================================================
-- 8. COORDINATION CHAT MESSAGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.coordination_messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  group_id TEXT NOT NULL REFERENCES public.coordination_groups(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('admin', 'organiser', 'crew')),
  sender_photo TEXT,
  content TEXT NOT NULL,
  is_announcement BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================================
-- 9. NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'system' CHECK (type IN ('application', 'system', 'event', 'payment')),
  is_read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_events_organiser_id ON public.events(organiser_id);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_city ON public.events(city);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_event_crew_requirements_event ON public.event_crew_requirements(event_id);
CREATE INDEX IF NOT EXISTS idx_applications_event ON public.applications(event_id);
CREATE INDEX IF NOT EXISTS idx_applications_crew ON public.applications(crew_user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_coordination_messages_group ON public.coordination_messages(group_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

-- ============================================================================
-- REALTIME REPLICATION CONFIGURATION
-- ============================================================================
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.coordination_groups;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.coordination_messages;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crew_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organiser_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_crew_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coordination_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coordination_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Profiles readable by all" ON public.profiles;
CREATE POLICY "Profiles readable by all" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Profiles insertable by all" ON public.profiles;
CREATE POLICY "Profiles insertable by all" ON public.profiles FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Profiles updatable by all" ON public.profiles;
CREATE POLICY "Profiles updatable by all" ON public.profiles FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Profiles deletable by all" ON public.profiles;
CREATE POLICY "Profiles deletable by all" ON public.profiles FOR DELETE USING (true);

-- Crew Profiles Policies
DROP POLICY IF EXISTS "Crew profiles readable by all" ON public.crew_profiles;
CREATE POLICY "Crew profiles readable by all" ON public.crew_profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Crew profiles insertable by all" ON public.crew_profiles;
CREATE POLICY "Crew profiles insertable by all" ON public.crew_profiles FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Crew profiles updatable by all" ON public.crew_profiles;
CREATE POLICY "Crew profiles updatable by all" ON public.crew_profiles FOR UPDATE USING (true);

-- Organiser Profiles Policies
DROP POLICY IF EXISTS "Organiser profiles readable by all" ON public.organiser_profiles;
CREATE POLICY "Organiser profiles readable by all" ON public.organiser_profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Organiser profiles insertable by all" ON public.organiser_profiles;
CREATE POLICY "Organiser profiles insertable by all" ON public.organiser_profiles FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Organiser profiles updatable by all" ON public.organiser_profiles;
CREATE POLICY "Organiser profiles updatable by all" ON public.organiser_profiles FOR UPDATE USING (true);

-- Events Policies
DROP POLICY IF EXISTS "Events readable by all" ON public.events;
CREATE POLICY "Events readable by all" ON public.events FOR SELECT USING (true);
DROP POLICY IF EXISTS "Events insertable by all" ON public.events;
CREATE POLICY "Events insertable by all" ON public.events FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Events updatable by all" ON public.events;
CREATE POLICY "Events updatable by all" ON public.events FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Events deletable by all" ON public.events;
CREATE POLICY "Events deletable by all" ON public.events FOR DELETE USING (true);

-- Event Requirements Policies
DROP POLICY IF EXISTS "Requirements readable by all" ON public.event_crew_requirements;
CREATE POLICY "Requirements readable by all" ON public.event_crew_requirements FOR SELECT USING (true);
DROP POLICY IF EXISTS "Requirements manageable by all" ON public.event_crew_requirements;
CREATE POLICY "Requirements manageable by all" ON public.event_crew_requirements FOR ALL USING (true);

-- Applications Policies
DROP POLICY IF EXISTS "Applications readable by all" ON public.applications;
CREATE POLICY "Applications readable by all" ON public.applications FOR SELECT USING (true);
DROP POLICY IF EXISTS "Applications insertable by all" ON public.applications;
CREATE POLICY "Applications insertable by all" ON public.applications FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Applications updatable by all" ON public.applications;
CREATE POLICY "Applications updatable by all" ON public.applications FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Applications deletable by all" ON public.applications;
CREATE POLICY "Applications deletable by all" ON public.applications FOR DELETE USING (true);

-- Coordination Groups & Messages Policies
DROP POLICY IF EXISTS "Coordination groups readable by all" ON public.coordination_groups;
CREATE POLICY "Coordination groups readable by all" ON public.coordination_groups FOR SELECT USING (true);
DROP POLICY IF EXISTS "Coordination groups manageable by all" ON public.coordination_groups;
CREATE POLICY "Coordination groups manageable by all" ON public.coordination_groups FOR ALL USING (true);

DROP POLICY IF EXISTS "Messages readable by all" ON public.coordination_messages;
CREATE POLICY "Messages readable by all" ON public.coordination_messages FOR SELECT USING (true);
DROP POLICY IF EXISTS "Messages insertable by all" ON public.coordination_messages;
CREATE POLICY "Messages insertable by all" ON public.coordination_messages FOR INSERT WITH CHECK (true);

-- Notifications Policies
DROP POLICY IF EXISTS "Notifications readable by all" ON public.notifications;
CREATE POLICY "Notifications readable by all" ON public.notifications FOR ALL USING (true);

-- ============================================================================
-- AUTOMATIC PROFILE TRIGGER ON AUTH.USERS SIGNUP
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role TEXT;
  user_full_name TEXT;
BEGIN
  assigned_role := COALESCE(NEW.raw_user_meta_data->>'role', 'crew');
  IF assigned_role NOT IN ('crew', 'organiser', 'admin') THEN
    assigned_role := 'crew';
  END IF;

  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));

  INSERT INTO public.profiles (id, role, full_name, email, is_active)
  VALUES (NEW.id::TEXT, assigned_role, user_full_name, NEW.email, true)
  ON CONFLICT (email) DO UPDATE
  SET full_name = EXCLUDED.full_name;

  IF assigned_role = 'crew' THEN
    INSERT INTO public.crew_profiles (user_id, rating, total_reviews, completed_events)
    VALUES (NEW.id::TEXT, 4.9, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;
  ELSIF assigned_role = 'organiser' THEN
    INSERT INTO public.organiser_profiles (user_id, company_name)
    VALUES (NEW.id::TEXT, COALESCE(NEW.raw_user_meta_data->>'company_name', user_full_name || ' Events'))
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- IDEMPOTENT SEED DATA (Only inserts records that do not already exist)
-- ============================================================================

-- 1. Profiles
INSERT INTO public.profiles (id, role, full_name, email, phone, avatar_url, city, address, pincode, is_active)
SELECT 'usr-admin', 'admin', 'Evencify Operations Admin', 'admin@evencify.com', '+91 98250 11223', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', 'Surat', 'Ring Road Business Hub', '395002', true
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = 'usr-admin' OR email = 'admin@evencify.com');

INSERT INTO public.profiles (id, role, full_name, email, phone, avatar_url, city, address, pincode, is_active)
SELECT 'usr-1', 'organiser', 'Rajesh Singhania', 'rajesh@singhaniaevents.com', '+91 98251 98765', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', 'Surat', 'Ghod Dod Road, Athwa', '395007', true
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = 'usr-1' OR email = 'rajesh@singhaniaevents.com');

INSERT INTO public.profiles (id, role, full_name, email, phone, avatar_url, city, address, pincode, is_active)
SELECT 'usr-2', 'crew', 'Ananya Sharma', 'ananya.sharma@example.com', '+91 98251 44321', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80', 'Surat', 'City Light Town', '395007', true
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = 'usr-2' OR email = 'ananya.sharma@example.com');

INSERT INTO public.profiles (id, role, full_name, email, phone, avatar_url, city, address, pincode, is_active)
SELECT 'usr-3', 'crew', 'Rohan Mehta', 'rohan.mehta@example.com', '+91 98795 12345', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80', 'Surat', 'Vesu Main Road', '395007', true
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = 'usr-3' OR email = 'rohan.mehta@example.com');

INSERT INTO public.profiles (id, role, full_name, email, phone, avatar_url, city, address, pincode, is_active)
SELECT 'usr-4', 'crew', 'Vikramaditya Rathore', 'vikram.rathore@example.com', '+91 97123 45678', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80', 'Mumbai', 'Bandra West', '400050', true
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = 'usr-4' OR email = 'vikram.rathore@example.com');

INSERT INTO public.profiles (id, role, full_name, email, phone, avatar_url, city, address, pincode, is_active)
SELECT 'crew-3', 'crew', 'Priya Choksi', 'priya.choksi@example.com', '+91 98241 88990', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', 'Surat', 'Adajan Circle', '395009', true
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = 'crew-3' OR email = 'priya.choksi@example.com');

INSERT INTO public.profiles (id, role, full_name, email, phone, avatar_url, city, address, pincode, is_active)
SELECT 'usr-5', 'crew', 'Kavita Patel', 'kavita.patel@example.com', '+91 98980 11223', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80', 'Ahmedabad', 'SG Highway', '380054', true
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = 'usr-5' OR email = 'kavita.patel@example.com');

INSERT INTO public.profiles (id, role, full_name, email, phone, avatar_url, city, address, pincode, is_active)
SELECT 'crew-5', 'crew', 'Tanvi Joshi', 'tanvi.j@example.com', '+91 98111 22334', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80', 'Surat', 'Pal Rander Road', '395009', true
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = 'crew-5' OR email = 'tanvi.j@example.com');

-- 2. Crew Profiles
INSERT INTO public.crew_profiles (user_id, experience, categories, age, gender, profile_photo_url, rating, total_reviews, completed_events, availability_status, expected_pay, bio)
VALUES
  ('usr-2', 'Experienced', ARRAY['Hospitality Staff', 'Registration Desk', 'Event Helper']::TEXT[], 23, 'Female', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80', 4.9, 18, 22, 'Available for Shifts', '₹1,600 / shift', 'Enthusiastic guest relations and hospitality crew member with 3+ years experience in luxury weddings and corporate summits.'),
  ('usr-3', 'Veteran', ARRAY['Security', 'Setup / Teardown', 'Support']::TEXT[], 26, 'Male', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80', 4.8, 34, 45, 'Available for Shifts', '₹2,000 / shift', 'Stage production specialist, security coordinator, and logistics team lead.'),
  ('crew-3', 'Experienced', ARRAY['Registration Desk', 'Promoter', 'Hospitality Staff']::TEXT[], 22, 'Female', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', 5.0, 12, 16, 'Available for Shifts', '₹1,500 / shift', 'Fluent in English, Hindi, and Gujarati. Excellent attendee welcoming and registration desk management.'),
  ('usr-4', 'Veteran', ARRAY['Security', 'Event Helper']::TEXT[], 28, 'Male', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80', 4.9, 29, 38, 'Available for Shifts', '₹2,200 / shift', 'Professional event crowd management and VIP liaison for major arena concerts.'),
  ('crew-5', 'Experienced', ARRAY['Hospitality Staff', 'Waiter / Service Staff']::TEXT[], 24, 'Female', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80', 4.7, 15, 19, 'Available for Shifts', '₹1,500 / shift', 'Hospitality coordinator with fine-dining catering and luxury convention experience.')
ON CONFLICT (user_id) DO UPDATE SET
  rating = EXCLUDED.rating,
  total_reviews = EXCLUDED.total_reviews,
  completed_events = EXCLUDED.completed_events;

-- 3. Organiser Profiles
INSERT INTO public.organiser_profiles (user_id, company_name, udyam_registered, udyam_number, address, city, pincode, phone)
VALUES
  ('usr-1', 'Singhania Events & Media Ltd.', true, 'UDYAM-GJ-24-0019283', '3rd Floor, International Trade Center, Ring Road', 'Surat', '395002', '+91 98251 98765')
ON CONFLICT (user_id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  udyam_registered = EXCLUDED.udyam_registered;

-- 4. Events (Uses WHERE NOT EXISTS on id to never conflict with existing events)
INSERT INTO public.events (
  id, organiser_id, organiser_name, event_name, event_type, event_date, start_time, end_time,
  venue, full_address, city, expected_attendance, total_crew_required, crew_positions_available,
  required_category, gender_requirement, age_requirement, experience_requirement, dress_code,
  special_requirements, pay_amount, payment_basis, payment_method, payment_timeline,
  advance_required, advance_amount, status
)
SELECT
  'evt-101', 'usr-1', 'Singhania Events & Media Ltd.', 'Grand Wedding Celebration — Mehta & Desai',
  'Wedding', '2026-10-15', '16:00', '23:30', 'Avadh Utopia Resort',
  'Dumas Road, Near Airport, Surat, Gujarat 395007', 'Surat', 1200, 15, 6,
  'Hospitality Staff', 'Any', '20-30', 'Experienced', 'Black Formals with Nehru Jacket',
  'Fluent Gujarati & Hindi speaker. Welcoming VIP guests at main foyer and escorting to banquet hall.',
  1800, 'Per Shift', 'Direct UPI / Bank Transfer', 'Same Day', false, 0, 'published'
WHERE NOT EXISTS (SELECT 1 FROM public.events WHERE id = 'evt-101');

INSERT INTO public.events (
  id, organiser_id, organiser_name, event_name, event_type, event_date, start_time, end_time,
  venue, full_address, city, expected_attendance, total_crew_required, crew_positions_available,
  required_category, gender_requirement, age_requirement, experience_requirement, dress_code,
  special_requirements, pay_amount, payment_basis, payment_method, payment_timeline,
  advance_required, advance_amount, status
)
SELECT
  'evt-102', 'usr-1', 'Singhania Events & Media Ltd.', 'FinTech Leaders Summit 2026',
  'Corporate', '2026-10-22', '08:30', '18:00', 'Surat International Exhibition & Convention Centre (SIECC)',
  'Sarsana, Althan Road, Surat, Gujarat 395007', 'Surat', 800, 8, 3,
  'Registration Desk', 'Female', '21-28', 'Experienced', 'Navy Blue Blazer, White Shirt, Trousers',
  'Handling RFID delegate badge printing and QR check-in desks. Laptop skills required.',
  2200, 'Per Day', 'Direct UPI / Bank Transfer', 'Within 24 Hours', false, 0, 'published'
WHERE NOT EXISTS (SELECT 1 FROM public.events WHERE id = 'evt-102');

-- 5. Applications
INSERT INTO public.applications (
  id, event_id, event_name, event_date, crew_user_id, crew_name, crew_email, crew_phone,
  crew_photo, crew_category, experience_years, system_rating, city, category, status, note, applied_at
)
SELECT
  'app-1', 'evt-101', 'Grand Wedding Celebration — Mehta & Desai', '2026-10-15', 'usr-2', 'Ananya Sharma', 'ananya.sharma@example.com', '+91 98251 44321', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80', 'Hospitality Staff', 3, 4.9, 'Surat', 'Hospitality Staff', 'accepted', 'Experienced in luxury weddings at Avadh Utopia. Ready for full evening shift.', now() - INTERVAL '3 days'
WHERE NOT EXISTS (SELECT 1 FROM public.applications WHERE id = 'app-1');

INSERT INTO public.applications (
  id, event_id, event_name, event_date, crew_user_id, crew_name, crew_email, crew_phone,
  crew_photo, crew_category, experience_years, system_rating, city, category, status, note, applied_at
)
SELECT
  'app-2', 'evt-101', 'Grand Wedding Celebration — Mehta & Desai', '2026-10-15', 'usr-3', 'Rohan Mehta', 'rohan.mehta@example.com', '+91 98795 12345', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80', 'Security', 5, 4.8, 'Surat', 'Security', 'accepted', 'Available with private vehicle for early venue inspection.', now() - INTERVAL '2 days'
WHERE NOT EXISTS (SELECT 1 FROM public.applications WHERE id = 'app-2');

-- 6. Event Coordination Groups
INSERT INTO public.coordination_groups (
  id, event_id, event_name, event_date, event_venue, organiser_id, organiser_name,
  organiser_phone, created_by_admin_id, status, crew_members
)
SELECT
  'group-evt-101', 'evt-101', 'Grand Wedding Celebration — Mehta & Desai', '2026-10-15',
  'Avadh Utopia Resort, Dumas Road', 'usr-1', 'Rajesh Singhania',
  '+91 98251 98765', 'usr-admin', 'active',
  '[{"userId":"usr-2","name":"Ananya Sharma","category":"Hospitality Staff"},{"userId":"usr-3","name":"Rohan Mehta","category":"Security"}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.coordination_groups WHERE id = 'group-evt-101');

-- 7. Coordination Chat Messages
INSERT INTO public.coordination_messages (id, group_id, sender_id, sender_name, sender_role, content, is_announcement, created_at)
SELECT 'msg-1', 'group-evt-101', 'usr-admin', 'Evencify Operations Admin', 'admin', 'Welcome team! This is the official shift coordination group for the Mehta & Desai Wedding at Avadh Utopia.', true, now() - INTERVAL '2 hours'
WHERE NOT EXISTS (SELECT 1 FROM public.coordination_messages WHERE id = 'msg-1');

INSERT INTO public.coordination_messages (id, group_id, sender_id, sender_name, sender_role, content, is_announcement, created_at)
SELECT 'msg-2', 'group-evt-101', 'usr-1', 'Rajesh Singhania', 'organiser', 'Welcome everyone! Please report at the service entrance gate by 3:30 PM sharp for your RFID wristbands and briefing.', false, now() - INTERVAL '1 hour 45 minutes'
WHERE NOT EXISTS (SELECT 1 FROM public.coordination_messages WHERE id = 'msg-2');

-- 8. Notifications
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at)
SELECT 'notif-1', 'usr-2', 'Application Accepted!', 'Congratulations Ananya! You have been accepted for Grand Wedding Celebration — Mehta & Desai on Oct 15.', 'application', false, now() - INTERVAL '2 hours'
WHERE NOT EXISTS (SELECT 1 FROM public.notifications WHERE id = 'notif-1');

INSERT INTO public.notifications (id, user_id, title, message, type, is_read, created_at)
SELECT 'notif-2', 'usr-1', 'New Applicant', 'Priya Choksi has applied for Registration Desk at your event Gujarat Textile Expo.', 'application', false, now() - INTERVAL '1 hour'
WHERE NOT EXISTS (SELECT 1 FROM public.notifications WHERE id = 'notif-2');

-- Confirmation output
SELECT 'Evencify Database Schema & Seed Data successfully provisioned!' AS status;
