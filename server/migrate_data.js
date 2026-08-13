import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import connectDB from './config/db.js';

// Import models
import User from './models/User.js';
import Event from './models/Event.js';
import Registration from './models/Registration.js';
import Venue from './models/Venue.js';
import Speaker from './models/Speaker.js';
import Sponsorship from './models/Sponsorship.js';
import Incident from './models/Incident.js';

const MIGRATION_FILE = 'C:\\Users\\manas\\PycharmProjects\\Event_managementplatform\\exported_data.json';

const migrateData = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB for migration...');

    if (!fs.existsSync(MIGRATION_FILE)) {
      console.error(`❌ Migration file not found at ${MIGRATION_FILE}`);
      process.exit(1);
    }

    const rawData = fs.readFileSync(MIGRATION_FILE, 'utf-8');
    const sqliteData = JSON.parse(rawData);
    
    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Event.deleteMany({}),
      Registration.deleteMany({}),
      Venue.deleteMany({}),
      Speaker.deleteMany({}),
      Sponsorship.deleteMany({}),
      Incident.deleteMany({})
    ]);

    const idMap = {
      user: {},
      event: {}
    };
    const venueNameMap = {};
    let firstEventId = null;
    let firstAdminId = null;

    // 1. Migrate Venues First (so we can link them to events)
    console.log(`Migrating ${sqliteData.venue?.length || 0} venues...`);
    for (const sqliteVenue of sqliteData.venue || []) {
      const newObjectId = new mongoose.Types.ObjectId();
      venueNameMap[sqliteVenue.name] = newObjectId; // Track by Name for linking
      
      await Venue.create({
        _id: newObjectId,
        name: sqliteVenue.name,
        address: 'N/A', // Required by Mongoose, missing in SQLite
        city: 'N/A',    // Required by Mongoose, missing in SQLite
        capacity: sqliteVenue.capacity || 0,
        description: `Status was: ${sqliteVenue.status}`,
        createdAt: sqliteVenue.created_at
      });
    }

    // 2. Migrate Users
    console.log(`Migrating ${sqliteData.user?.length || 0} users...`);
    for (const sqliteUser of sqliteData.user || []) {
      const newObjectId = new mongoose.Types.ObjectId();
      idMap.user[sqliteUser.id] = newObjectId;
      
      // Track first admin user to assign unlinked incidents later
      if (sqliteUser.role === 'admin' && !firstAdminId) {
        firstAdminId = newObjectId;
      }
      
      await User.create({
        _id: newObjectId,
        name: sqliteUser.name,
        email: sqliteUser.email,
        password: 'password123', 
        role: sqliteUser.role || 'user',
        createdAt: sqliteUser.created_at
      });
    }
    
    // Fallback if no admin found
    if (!firstAdminId && sqliteData.user?.length > 0) {
        firstAdminId = idMap.user[sqliteData.user[0].id];
    }

    // 3. Migrate Events
    console.log(`Migrating ${sqliteData.event?.length || 0} events...`);
    for (const sqliteEvent of sqliteData.event || []) {
      const newObjectId = new mongoose.Types.ObjectId();
      idMap.event[sqliteEvent.id] = newObjectId;
      
      // Track first event to assign unlinked sponsorships/incidents later
      if (!firstEventId) firstEventId = newObjectId;

      // Smart link: Match Event Location string to Venue Name!
      const venueId = venueNameMap[sqliteEvent.location] || null;
      
      await Event.create({
        _id: newObjectId,
        title: sqliteEvent.title,
        description: sqliteEvent.description,
        date: sqliteEvent.date,
        time: sqliteEvent.time,
        location: sqliteEvent.location, 
        venue: venueId, // Boom! Linked perfectly.
        capacity: sqliteEvent.capacity || 0,
        status: sqliteEvent.status || 'upcoming',
        createdAt: sqliteEvent.created_at
      });
    }

    // 4. Migrate Registrations
    console.log(`Migrating ${sqliteData.registration?.length || 0} registrations...`);
    const seenRegs = new Set();
    
    for (const sqliteReg of sqliteData.registration || []) {
      const userId = idMap.user[sqliteReg.user_id];
      const eventId = idMap.event[sqliteReg.event_id];
      
      if (userId && eventId) {
        // Prevent duplicate Registration crash
        const regKey = `${userId.toString()}-${eventId.toString()}`;
        if (seenRegs.has(regKey)) {
            console.log(`⚠️ Skipping duplicate registration for User ${sqliteReg.user_id} and Event ${sqliteReg.event_id}`);
            continue;
        }
        seenRegs.add(regKey);

        await Registration.create({
          user: userId,
          event: eventId,
          ticketType: sqliteReg.ticket_type || 'Standard',
          status: sqliteReg.status === 'registered' || sqliteReg.status === 'cancelled' ? sqliteReg.status : 'registered',
          checkedIn: sqliteReg.checked_in === 1,
          registeredAt: sqliteReg.registered_at
        });
      }
    }

    // 5. Migrate Speakers
    console.log(`Migrating ${sqliteData.speaker?.length || 0} speakers...`);
    for (const sp of sqliteData.speaker || []) {
      await Speaker.create({
        name: sp.name,
        bio: sp.bio,
        sessionTitle: sp.session_title,
        schedule: sp.schedule,
        availability: sp.availability === 1
      });
    }

    // 6. Migrate Sponsorships
    console.log(`Migrating ${sqliteData.sponsorship?.length || 0} sponsorships...`);
    for (const spon of sqliteData.sponsorship || []) {
      if (firstEventId) {
        // Parse "$50k" -> 50000
        let amountParsed = 0;
        if (spon.commitment) {
          const num = parseInt(spon.commitment.replace(/\D/g, ''), 10); // get numbers
          if (!isNaN(num)) {
            amountParsed = spon.commitment.toLowerCase().includes('k') ? num * 1000 : num;
          }
        }
        
        await Sponsorship.create({
          event: firstEventId, // Assigning to first event because SQLite lacked this link
          sponsorName: spon.sponsor_name,
          amount: amountParsed, 
          description: `Deliverables: ${spon.deliverables}. ROI: ${spon.roi}`
        });
      }
    }

    // 7. Migrate Incidents
    console.log(`Migrating ${sqliteData.incident?.length || 0} incidents...`);
    for (const inc of sqliteData.incident || []) {
      if (firstEventId && firstAdminId) {
        let mappedSeverity = 'Low';
        if (inc.priority === 'high') mappedSeverity = 'High';
        if (inc.priority === 'medium') mappedSeverity = 'Medium';
        
        let mappedStatus = 'Open';
        if (inc.status === 'resolved' || inc.status === 'closed') mappedStatus = 'Resolved';
          
        await Incident.create({
          event: firstEventId, // Assigning to first event because SQLite lacked this link
          reportedBy: firstAdminId, // Assigning to admin because SQLite lacked this link
          title: inc.title,
          description: inc.description,
          severity: mappedSeverity,
          status: mappedStatus
        });
      }
    }

    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrateData();
