-- ============================================================================
-- EVENCIFY — SUPABASE POSTGRESQL SCHEMA & ROW LEVEL SECURITY
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('crew', 'organiser', 'admin')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  address TEXT,
  pincode TEXT,
  city TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. CREW PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.crew_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  experience TEXT DEFAULT 'Experienced',
  categories TEXT[] DEFAULT ARRAY['Event Helper']::TEXT[],
  age INTEGER,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
  profile_photo_url TEXT,
  rating NUMERIC DEFAULT 4.9 NOT NULL,
  total_reviews INTEGER DEFAULT 0 NOT NULL,
  completed_events INTEGER DEFAULT 0 NOT NULL,
  availability_status TEXT DEFAULT 'Available' NOT NULL,
  expected_pay TEXT DEFAULT '₹1,500 / shift',
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. ORGANISER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.organiser_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  company_name TEXT NOT NULL,
  udyam_registered BOOLEAN DEFAULT false NOT NULL,
  udyam_number TEXT,
  address TEXT,
  pincode TEXT,
  city TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organiser_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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
  dress_code TEXT,
  special_requirements TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'paused', 'closed', 'completed', 'cancelled')) DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 5. EVENT CREW REQUIREMENTS TABLE (Multi-requirement support per event)
CREATE TABLE IF NOT EXISTS public.event_crew_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  number_required INTEGER DEFAULT 1 NOT NULL,
  gender_requirement TEXT DEFAULT 'Any' NOT NULL,
  min_age INTEGER,
  max_age INTEGER,
  experience_requirement TEXT DEFAULT 'Both' NOT NULL,
  dress_code TEXT,
  special_requirements TEXT,
  pay_amount NUMERIC NOT NULL,
  payment_basis TEXT DEFAULT 'Per Shift' NOT NULL,
  payment_method TEXT DEFAULT 'Direct UPI / Bank Transfer' NOT NULL,
  payment_timeline TEXT DEFAULT 'Same Day' NOT NULL,
  advance_required BOOLEAN DEFAULT false NOT NULL,
  advance_amount NUMERIC DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 6. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  crew_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'shortlisted', 'accepted', 'rejected', 'withdrawn')) DEFAULT 'pending',
  note TEXT,
  applied_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT unique_crew_event_application UNIQUE (event_id, crew_user_id)
);

-- 7. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'system' NOT NULL,
  is_read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================================
-- INDEXES FOR FAST QUERYING
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
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crew_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organiser_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_crew_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- HELPER FUNCTIONS FOR SECURITY
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin' AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES POLICIES
CREATE POLICY "Public profiles are readable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- CREW PROFILES POLICIES
CREATE POLICY "Crew profiles are viewable by authenticated users"
  ON public.crew_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Crew can update their own profile"
  ON public.crew_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Crew can insert their own profile"
  ON public.crew_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all crew profiles"
  ON public.crew_profiles FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ORGANISER PROFILES POLICIES
CREATE POLICY "Organiser profiles readable by authenticated users"
  ON public.organiser_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Organisers can update their own profile"
  ON public.organiser_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Organisers can insert their own profile"
  ON public.organiser_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all organiser profiles"
  ON public.organiser_profiles FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- EVENTS POLICIES
CREATE POLICY "Published events are readable by everyone"
  ON public.events FOR SELECT
  USING (status = 'published' OR (auth.uid() IS NOT NULL AND (organiser_id = auth.uid() OR public.is_admin(auth.uid()))));

CREATE POLICY "Organisers can insert their own events"
  ON public.events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = organiser_id);

CREATE POLICY "Organisers can update their own events"
  ON public.events FOR UPDATE
  TO authenticated
  USING (auth.uid() = organiser_id OR public.is_admin(auth.uid()));

CREATE POLICY "Organisers can delete their own events"
  ON public.events FOR DELETE
  TO authenticated
  USING (auth.uid() = organiser_id OR public.is_admin(auth.uid()));

-- EVENT REQUIREMENTS POLICIES
CREATE POLICY "Requirements readable for readable events"
  ON public.event_crew_requirements FOR SELECT
  USING (true);

CREATE POLICY "Organisers can manage requirements for their events"
  ON public.event_crew_requirements FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_crew_requirements.event_id
      AND (events.organiser_id = auth.uid() OR public.is_admin(auth.uid()))
    )
  );

-- APPLICATIONS POLICIES
CREATE POLICY "Crew can view their own applications"
  ON public.applications FOR SELECT
  TO authenticated
  USING (
    crew_user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = applications.event_id AND events.organiser_id = auth.uid()
    )
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Crew can apply to events"
  ON public.applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = crew_user_id);

CREATE POLICY "Organisers can update application status for their events"
  ON public.applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = applications.event_id AND (events.organiser_id = auth.uid() OR public.is_admin(auth.uid()))
    )
    OR crew_user_id = auth.uid()
  );

-- NOTIFICATIONS POLICIES
CREATE POLICY "Users can view and manage their own notifications"
  ON public.notifications FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH.USERS
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role TEXT;
  user_full_name TEXT;
BEGIN
  -- Default to 'crew' if role not provided in raw_user_meta_data
  assigned_role := COALESCE(NEW.raw_user_meta_data->>'role', 'crew');
  IF assigned_role NOT IN ('crew', 'organiser', 'admin') THEN
    assigned_role := 'crew';
  END IF;

  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));

  INSERT INTO public.profiles (id, role, full_name, email, is_active)
  VALUES (NEW.id, assigned_role, user_full_name, NEW.email, true)
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      email = EXCLUDED.email;

  -- Automatically initialize role profile
  IF assigned_role = 'crew' THEN
    INSERT INTO public.crew_profiles (user_id, rating, total_reviews, completed_events)
    VALUES (NEW.id, 4.9, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;
  ELSIF assigned_role = 'organiser' THEN
    INSERT INTO public.organiser_profiles (user_id, company_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'company_name', user_full_name || ' Events'))
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
-- ADMIN SAFETY: PREVENT DEMOTION OR DELETION OF THE LAST REMAINING ADMIN
-- ============================================================================
CREATE OR REPLACE FUNCTION public.prevent_last_admin_demotion()
RETURNS TRIGGER AS $$
DECLARE
  admin_count INTEGER;
BEGIN
  IF OLD.role = 'admin' AND (NEW.role <> 'admin' OR NEW.is_active = false) THEN
    SELECT COUNT(*) INTO admin_count
    FROM public.profiles
    WHERE role = 'admin' AND is_active = true AND id <> OLD.id;

    IF admin_count = 0 THEN
      RAISE EXCEPTION 'Admin Safety: Cannot demote or deactivate the last remaining active administrator.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_last_admin_demotion ON public.profiles;
CREATE TRIGGER trg_prevent_last_admin_demotion
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_last_admin_demotion();

CREATE OR REPLACE FUNCTION public.prevent_last_admin_deletion()
RETURNS TRIGGER AS $$
DECLARE
  admin_count INTEGER;
BEGIN
  IF OLD.role = 'admin' THEN
    SELECT COUNT(*) INTO admin_count
    FROM public.profiles
    WHERE role = 'admin' AND is_active = true AND id <> OLD.id;

    IF admin_count = 0 THEN
      RAISE EXCEPTION 'Admin Safety: Cannot delete the last remaining active administrator.';
    END IF;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_last_admin_deletion ON public.profiles;
CREATE TRIGGER trg_prevent_last_admin_deletion
  BEFORE DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_last_admin_deletion();

-- ============================================================================
-- STORAGE BUCKET CONFIGURATION FOR AVATARS
-- ============================================================================
-- 1. Create bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies
CREATE POLICY "Public can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users can update their own avatars"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin(auth.uid())));

CREATE POLICY "Users can delete their own avatars"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'avatars' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin(auth.uid())));
