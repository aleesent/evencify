import pg from 'pg';
const { Client } = pg;

async function reconcile() {
  const client = new Client({
    host: 'aws-0-ap-south-1.pooler.supabase.com',
    port: 6543,
    user: 'postgres.tutspdayygbrrqtuepao',
    password: 'Evencify@121',
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('Connected to Supabase PostgreSQL database.');

  // 1. Fetch all auth.users
  const authUsers = await client.query(`
    SELECT id, email, raw_user_meta_data, created_at 
    FROM auth.users
    ORDER BY created_at ASC
  `);
  console.log(`Found ${authUsers.rows.length} accounts in auth.users.`);

  for (const u of authUsers.rows) {
    const meta = u.raw_user_meta_data || {};
    let role = meta.role || (u.email === 'admin@evencify.com' ? 'admin' : 'crew');
    if (u.email === 'admin@evencify.com') {
      role = 'admin';
    }
    const fullName = meta.full_name || meta.name || (u.email ? u.email.split('@')[0] : 'Evencify User');
    const companyName = meta.company_name || `${fullName} Events`;
    const isVerified = Boolean(meta.email_verified !== false);

    console.log(`Restoring account: ${u.email} | role: ${role} | name: ${fullName}`);

    // Upsert into profiles
    await client.query(`
      INSERT INTO public.profiles (id, role, full_name, email, is_active, is_verified, created_at, updated_at)
      VALUES ($1, $2, $3, $4, true, $5, $6, NOW())
      ON CONFLICT (email) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        is_active = true,
        is_verified = true,
        updated_at = NOW()
    `, [u.id, role, fullName, u.email, isVerified, u.created_at || new Date().toISOString()]);

    // Check actual profile ID in public.profiles
    const profRow = await client.query('SELECT id FROM public.profiles WHERE email = $1', [u.email]);
    const profId = profRow.rows[0]?.id || u.id;

    if (role === 'crew') {
      await client.query(`
        INSERT INTO public.crew_profiles (user_id, name, email, rating, total_reviews, completed_events, availability_status, expected_pay, categories)
        VALUES ($1, $2, $3, 4.9, 0, 0, 'Available for Shifts', '₹1,500 / shift', ARRAY['Event Helper']::TEXT[])
        ON CONFLICT (user_id) DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email
      `, [profId, fullName, u.email]);
    } else if (role === 'organiser') {
      await client.query(`
        INSERT INTO public.organiser_profiles (user_id, name, email, company_name, udyam_registered)
        VALUES ($1, $2, $3, $4, false)
        ON CONFLICT (user_id) DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          company_name = EXCLUDED.company_name
      `, [profId, fullName, u.email, companyName]);
    }
  }

  // 2. Also ensure seed organiser usr-1 and crew usr-2 exist
  await client.query(`
    INSERT INTO public.profiles (id, role, full_name, email, is_active, is_verified)
    VALUES ('usr-1', 'organiser', 'Rajesh Singhania', 'rajesh@singhaniaevents.com', true, true)
    ON CONFLICT (email) DO NOTHING
  `);
  await client.query(`
    INSERT INTO public.organiser_profiles (id, user_id, name, email, company_name)
    VALUES ('org-1', 'usr-1', 'Rajesh Singhania', 'rajesh@singhaniaevents.com', 'Singhania Events & Entertainment')
    ON CONFLICT (user_id) DO NOTHING
  `);

  await client.query(`
    INSERT INTO public.profiles (id, role, full_name, email, is_active, is_verified)
    VALUES ('usr-2', 'crew', 'Sneha Verma', 'sneha.verma@example.com', true, true)
    ON CONFLICT (email) DO NOTHING
  `);
  await client.query(`
    INSERT INTO public.crew_profiles (id, user_id, name, email, rating, total_reviews, completed_events, availability_status, expected_pay, categories)
    VALUES ('crew-1', 'usr-2', 'Sneha Verma', 'sneha.verma@example.com', 4.9, 14, 18, 'Available for Shifts', '₹1,500 / shift', ARRAY['Hospitality Staff', 'Anchor / Emcee']::TEXT[])
    ON CONFLICT (user_id) DO NOTHING
  `);

  // 3. Update the handle_new_user() trigger so any future auth.users automatically get profiles and role records
  await client.query(`
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    DECLARE
      assigned_role TEXT;
      user_full_name TEXT;
      user_company TEXT;
    BEGIN
      assigned_role := COALESCE(NEW.raw_user_meta_data->>'role', 'crew');
      IF NEW.email = 'admin@evencify.com' THEN
        assigned_role := 'admin';
      ELSIF assigned_role NOT IN ('crew', 'organiser', 'admin') THEN
        assigned_role := 'crew';
      END IF;

      user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
      user_company := COALESCE(NEW.raw_user_meta_data->>'company_name', user_full_name || ' Events');

      INSERT INTO public.profiles (id, role, full_name, email, is_active, is_verified, created_at, updated_at)
      VALUES (NEW.id::TEXT, assigned_role, user_full_name, NEW.email, true, true, now(), now())
      ON CONFLICT (email) DO UPDATE
      SET full_name = EXCLUDED.full_name,
          role = EXCLUDED.role,
          is_active = true,
          is_verified = true,
          updated_at = now();

      IF assigned_role = 'crew' THEN
        INSERT INTO public.crew_profiles (user_id, name, email, rating, total_reviews, completed_events, availability_status, expected_pay, categories)
        VALUES (NEW.id::TEXT, user_full_name, NEW.email, 4.9, 0, 0, 'Available for Shifts', '₹1,500 / shift', ARRAY['Event Helper']::TEXT[])
        ON CONFLICT (user_id) DO UPDATE
        SET name = EXCLUDED.name,
            email = EXCLUDED.email;
      ELSIF assigned_role = 'organiser' THEN
        INSERT INTO public.organiser_profiles (user_id, name, email, company_name, udyam_registered)
        VALUES (NEW.id::TEXT, user_full_name, NEW.email, user_company, false)
        ON CONFLICT (user_id) DO UPDATE
        SET name = EXCLUDED.name,
            email = EXCLUDED.email,
            company_name = EXCLUDED.company_name;
      END IF;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `);

  console.log('PostgreSQL trigger public.handle_new_user() successfully updated.');

  // 4. Verify profiles count
  const pCount = await client.query('SELECT count(*) FROM public.profiles');
  console.log(`Total public.profiles in database: ${pCount.rows[0].count}`);

  const allProfiles = await client.query('SELECT id, email, role, full_name, is_active, is_verified, created_at FROM public.profiles ORDER BY created_at DESC');
  console.log('Current Profiles in DB:');
  console.table(allProfiles.rows);

  await client.end();
  console.log('Database reconciliation complete.');
}

reconcile().catch(err => {
  console.error('Reconciliation error:', err);
  process.exit(1);
});
