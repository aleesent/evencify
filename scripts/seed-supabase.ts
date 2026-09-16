import { Client } from 'pg';
import {
  INITIAL_CREW_PROFILES,
  INITIAL_ORGANISER_PROFILE,
  INITIAL_ADMIN_PROFILE,
  INITIAL_USERS,
  INITIAL_EVENTS,
  INITIAL_APPLICATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_EVENT_GROUPS,
} from '../src/mockData';

async function seed() {
  const client = new Client({
    host: 'aws-0-ap-south-1.pooler.supabase.com',
    port: 6543,
    user: 'postgres.tutspdayygbrrqtuepao',
    password: 'Evencify@121',
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('Connected to Postgres on Supabase. Seeding database...');

  // 1. Seed Profiles & User accounts
  for (const u of INITIAL_USERS) {
    await client.query(
      `INSERT INTO public.profiles (id, role, full_name, email, phone, city, address, is_active, is_verified, verification_badge)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (id) DO UPDATE
       SET full_name = EXCLUDED.full_name,
           email = EXCLUDED.email,
           role = EXCLUDED.role,
           is_verified = EXCLUDED.is_verified,
           verification_badge = EXCLUDED.verification_badge;`,
      [
        u.id,
        u.role,
        u.name,
        u.email,
        u.phone || null,
        u.city || 'Surat',
        u.address || null,
        u.status === 'Active',
        Boolean(u.isVerified),
        u.verificationBadge || null,
      ]
    );
  }

  // 2. Seed Organiser Profiles
  await client.query(
    `INSERT INTO public.organiser_profiles (id, user_id, name, company_name, udyam_registered, udyam_number, address, pincode, city, phone, email)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     ON CONFLICT (user_id) DO UPDATE
     SET company_name = EXCLUDED.company_name,
         udyam_registered = EXCLUDED.udyam_registered,
         udyam_number = EXCLUDED.udyam_number;`,
    [
      INITIAL_ORGANISER_PROFILE.id,
      'usr-1',
      INITIAL_ORGANISER_PROFILE.name,
      INITIAL_ORGANISER_PROFILE.companyName,
      INITIAL_ORGANISER_PROFILE.hasUdyam,
      INITIAL_ORGANISER_PROFILE.udyamNumber || null,
      INITIAL_ORGANISER_PROFILE.address,
      INITIAL_ORGANISER_PROFILE.pincode,
      INITIAL_ORGANISER_PROFILE.city,
      INITIAL_ORGANISER_PROFILE.phone,
      INITIAL_ORGANISER_PROFILE.email,
    ]
  );

  // 3. Seed Crew Profiles
  for (const c of INITIAL_CREW_PROFILES) {
    // Ensure profile entry exists
    const matchingUser = INITIAL_USERS.find((u) => u.email === c.email || u.id === c.id);
    const userId = matchingUser ? matchingUser.id : c.id;

    await client.query(
      `INSERT INTO public.profiles (id, role, full_name, email, phone, city, address, is_active, is_verified, avatar_url)
       VALUES ($1, 'crew', $2, $3, $4, $5, $6, true, true, $7)
       ON CONFLICT (id) DO UPDATE
       SET avatar_url = EXCLUDED.avatar_url;`,
      [userId, c.name, c.email, c.phone, c.city, c.address || null, c.photoUrl]
    );

    await client.query(
      `INSERT INTO public.crew_profiles (
        id, user_id, name, email, phone, city, address, pincode,
        experience, experience_years, categories, age, gender,
        profile_photo_url, rating, total_reviews, completed_events,
        availability_status, expected_pay, bio
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      ON CONFLICT (user_id) DO UPDATE
      SET rating = EXCLUDED.rating,
          total_reviews = EXCLUDED.total_reviews,
          completed_events = EXCLUDED.completed_events,
          bio = EXCLUDED.bio;`,
      [
        c.id,
        userId,
        c.name,
        c.email,
        c.phone,
        c.city,
        c.address,
        c.pincode,
        c.experienceLevel,
        c.experienceYears,
        c.categories,
        c.age,
        c.gender,
        c.photoUrl,
        c.systemRating,
        c.reviewsCount,
        c.completedEventsCount,
        c.availability,
        c.expectedPay,
        c.bio,
      ]
    );
  }

  // 4. Seed Events & Event Crew Requirements
  for (const ev of INITIAL_EVENTS) {
    await client.query(
      `INSERT INTO public.events (
        id, organiser_id, organiser_name, event_name, event_type, event_date,
        start_time, end_time, venue, full_address, city, expected_attendance,
        total_crew_required, crew_positions_available, required_category,
        gender_requirement, age_requirement, experience_requirement,
        dress_code, special_requirements, pay_amount, payment_basis,
        payment_method, payment_timeline, advance_required, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)
      ON CONFLICT (id) DO NOTHING;`,
      [
        ev.id,
        'usr-1',
        ev.organiserName,
        ev.name,
        ev.eventType,
        ev.date,
        ev.startTime,
        ev.endTime,
        ev.venue,
        ev.fullAddress || ev.venue,
        ev.city,
        ev.expectedAttendance || 500,
        ev.crewPositionsTotal,
        ev.crewPositionsAvailable,
        ev.requiredCategory,
        ev.genderRequirement,
        ev.ageRequirement || '20 - 30 years',
        ev.experienceRequirement,
        ev.dressCode,
        ev.specialRequirements,
        ev.payAmount,
        ev.payBasis,
        ev.paymentMethod || 'Direct UPI / Bank Transfer',
        ev.paymentTimeline,
        Boolean(ev.advanceRequired),
        ev.status === 'Open' ? 'published' : ev.status.toLowerCase(),
        ev.createdAt || new Date().toISOString(),
      ]
    );

    // Primary requirement
    await client.query(
      `INSERT INTO public.event_crew_requirements (
        event_id, category, number_required, gender_requirement,
        experience_requirement, dress_code, special_requirements,
        pay_amount, payment_basis, payment_method, payment_timeline, advance_required
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`,
      [
        ev.id,
        ev.requiredCategory,
        ev.crewPositionsTotal,
        ev.genderRequirement,
        ev.experienceRequirement,
        ev.dressCode,
        ev.specialRequirements,
        ev.payAmount,
        ev.payBasis,
        ev.paymentMethod || 'Direct UPI / Bank Transfer',
        ev.paymentTimeline,
        Boolean(ev.advanceRequired),
      ]
    );
  }

  // 5. Seed Applications
  for (const app of INITIAL_APPLICATIONS) {
    await client.query(
      `INSERT INTO public.applications (
        id, event_id, event_name, event_date, crew_user_id, crew_name, crew_email,
        crew_phone, crew_photo, crew_category, experience_years, system_rating,
        city, category, status, note
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      ON CONFLICT (id) DO NOTHING;`,
      [
        app.id,
        app.eventId,
        app.eventName || 'Event',
        app.eventDate || '2026-10-20',
        app.crewId,
        app.crewName,
        app.crewEmail || `${app.crewName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        app.crewPhone,
        app.crewPhoto,
        app.crewCategory,
        app.experienceYears,
        app.systemRating,
        app.city,
        app.crewCategory,
        app.status.toLowerCase(),
        app.note || null,
      ]
    );
  }

  // 6. Seed Notifications
  for (const notif of INITIAL_NOTIFICATIONS) {
    await client.query(
      `INSERT INTO public.notifications (id, user_id, title, message, type, is_read)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO NOTHING;`,
      [
        notif.id,
        'usr-2',
        notif.title,
        notif.message,
        notif.type,
        notif.read,
      ]
    );
  }

  // 7. Seed Coordination Groups and Messages
  for (const g of INITIAL_EVENT_GROUPS) {
    await client.query(
      `INSERT INTO public.coordination_groups (
        id, event_id, event_name, event_date, event_venue,
        organiser_id, organiser_name, organiser_phone, crew_members,
        created_by_admin_id, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (id) DO NOTHING;`,
      [
        g.id,
        g.eventId,
        g.eventName,
        g.eventDate,
        g.eventVenue,
        g.organiserId,
        g.organiserName,
        g.organiserPhone || null,
        JSON.stringify(g.crewMembers),
        g.createdByAdminId,
        g.status,
      ]
    );

    for (const msg of g.messages) {
      await client.query(
        `INSERT INTO public.coordination_messages (
          id, group_id, sender_id, sender_name, sender_role, sender_photo, content, is_announcement
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO NOTHING;`,
        [
          msg.id,
          g.id,
          msg.senderId,
          msg.senderName,
          msg.senderRole,
          msg.senderPhoto || null,
          msg.content,
          Boolean(msg.isAnnouncement),
        ]
      );
    }
  }

  console.log('✅ Successfully seeded Supabase with initial Evencify data!');
  await client.end();
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
