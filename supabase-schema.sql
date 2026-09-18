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
-- 10. STORAGE BUCKET FOR AVATARS & ASSETS
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage object access policies for avatars
DROP POLICY IF EXISTS "Public avatars are accessible" ON storage.objects;
CREATE POLICY "Public avatars are accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Anyone can upload avatars" ON storage.objects;
CREATE POLICY "Anyone can upload avatars" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Anyone can update avatars" ON storage.objects;
CREATE POLICY "Anyone can update avatars" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Anyone can delete avatars" ON storage.objects;
CREATE POLICY "Anyone can delete avatars" ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars');

-- ============================================================================
-- 11. AUTOMATIC TIMESTAMP TRIGGER
-- ============================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_crew_profiles_updated_at ON public.crew_profiles;
CREATE TRIGGER trg_crew_profiles_updated_at
  BEFORE UPDATE ON public.crew_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_organiser_profiles_updated_at ON public.organiser_profiles;
CREATE TRIGGER trg_organiser_profiles_updated_at
  BEFORE UPDATE ON public.organiser_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_events_updated_at ON public.events;
CREATE TRIGGER trg_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_applications_updated_at ON public.applications;
CREATE TRIGGER trg_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

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
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.crew_profiles;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.organiser_profiles;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
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
-- ============================================================================
-- IDEMPOTENT DEPLOY READY SEED DATA (1 Organiser, 1 Crew, 0 Events)
-- ============================================================================

-- Clean out legacy sample events & demo test records if any exist
DELETE FROM public.applications WHERE id IN ('app-1', 'app-2', 'app-3', 'app-4', 'app-5', 'app-6', 'app-7', 'app-8');
DELETE FROM public.coordination_messages WHERE group_id IN ('group-evt-101', 'group-evt-102');
DELETE FROM public.coordination_groups WHERE id IN ('group-evt-101', 'group-evt-102');
DELETE FROM public.event_crew_requirements WHERE event_id IN ('evt-101', 'evt-102', 'evt-103', 'evt-104', 'evt-105', 'evt-106', 'evt-107', 'evt-108', 'evt-109', 'evt-110', 'evt-111');
DELETE FROM public.events WHERE id IN ('evt-101', 'evt-102', 'evt-103', 'evt-104', 'evt-105', 'evt-106', 'evt-107', 'evt-108', 'evt-109', 'evt-110', 'evt-111');
DELETE FROM public.crew_profiles WHERE user_id IN ('usr-3', 'usr-4', 'usr-5', 'crew-3', 'crew-4', 'crew-5');
DELETE FROM public.profiles WHERE id IN ('usr-3', 'usr-4', 'usr-5', 'crew-3', 'crew-4', 'crew-5');

-- 1. Profiles (1 Organiser, 1 Crew, 1 Operations Admin)
INSERT INTO public.profiles (id, role, full_name, email, phone, avatar_url, city, address, pincode, is_active, is_verified)
SELECT 'usr-admin', 'admin', 'Evencify Operations Admin', 'admin@evencify.com', '+91 98000 00001', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', 'Surat', 'Ring Road Business Hub', '395002', true, true
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = 'usr-admin' OR email = 'admin@evencify.com');

INSERT INTO public.profiles (id, role, full_name, email, phone, avatar_url, city, address, pincode, is_active, is_verified)
SELECT 'usr-1', 'organiser', 'Rajesh Singhania', 'rajesh@singhaniaevents.com', '+91 98251 10022', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', 'Surat', '601, World Trade Center, Ring Road', '395002', true, true
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = 'usr-1' OR email = 'rajesh@singhaniaevents.com');

INSERT INTO public.profiles (id, role, full_name, email, phone, avatar_url, city, address, pincode, is_active, is_verified)
SELECT 'usr-2', 'crew', 'Sneha Verma', 'sneha.verma@example.com', '+91 98251 44321', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', 'Surat', '402, Riverfront Enclave, Vesu', '395007', true, true
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = 'usr-2' OR email = 'sneha.verma@example.com');

-- 2. Crew Profile (Single initial crew: Sneha Verma)
INSERT INTO public.crew_profiles (user_id, experience, categories, age, gender, profile_photo_url, rating, total_reviews, completed_events, availability_status, expected_pay, bio)
VALUES
  ('usr-2', 'Experienced', ARRAY['Hospitality Staff', 'Registration Desk']::TEXT[], 23, 'Female', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', 4.9, 0, 0, 'Available for Shifts', '₹1,500 / shift', 'Experienced in VIP hospitality, guest registration desks, and crowd facilitation for luxury weddings and corporate summits.')
ON CONFLICT (user_id) DO UPDATE SET
  rating = EXCLUDED.rating,
  categories = EXCLUDED.categories,
  expected_pay = EXCLUDED.expected_pay;

-- 3. Organiser Profile (Single initial organiser: Rajesh Singhania / Singhania Events)
INSERT INTO public.organiser_profiles (user_id, company_name, udyam_registered, udyam_number, address, city, pincode, phone)
VALUES
  ('usr-1', 'Singhania Events & Media Ltd.', true, 'UDYAM-GJ-24-0098412', '601, World Trade Center, Ring Road', 'Surat', '395002', '+91 98251 10022')
ON CONFLICT (user_id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  udyam_registered = EXCLUDED.udyam_registered,
  udyam_number = EXCLUDED.udyam_number;

-- Note: Events, Applications, and Coordination Groups are completely cleared (0 existing events)
-- Ready for production deployment!

-- Confirmation output
SELECT 'Evencify Database Schema initialized with 1 Organiser and 1 Crew (Deploy Ready)!' AS status;
