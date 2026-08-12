import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Adjusting dotenv path based on where we run it (from server/scripts)
dotenv.config({ path: '../.env' }); 

import User from '../models/User.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import Venue from '../models/Venue.js';
import Speaker from '../models/Speaker.js';
import Sponsorship from '../models/Sponsorship.js';
import Incident from '../models/Incident.js';
import Notification from '../models/Notification.js';
import Reminder from '../models/Reminder.js';
import Feedback from '../models/Feedback.js';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventops';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

const importData = async () => {
    await connectDB();
    console.log('Reading data.json...');
    const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
    
    // Clear existing data to avoid conflicts on multiple runs
    console.log('Clearing old data from MongoDB (optional, but good for clean migration)...');
    await User.deleteMany();
    await Event.deleteMany();
    await Registration.deleteMany();
    await Venue.deleteMany();
    await Speaker.deleteMany();
    await Sponsorship.deleteMany();
    await Incident.deleteMany();
    await Notification.deleteMany();
    await Reminder.deleteMany();
    await Feedback.deleteMany();

    // Mappings for foreign keys
    const userMap = {}; 
    const eventMap = {}; 

    // Import Users
    console.log('Importing Users...');
    for (const sqliteUser of data.user) {
        const user = new User({
            name: sqliteUser.name,
            email: sqliteUser.email,
            // Werkzeug hashes are incompatible with bcrypt by default. 
            // Setting a default password for migrated users.
            password: 'password123', 
            role: sqliteUser.role,
        });
        await user.save();
        userMap[sqliteUser.id] = user._id;
    }

    // Import Venues
    console.log('Importing Venues...');
    for (const v of data.venue) {
        const venue = new Venue({
            name: v.name,
            capacity: v.capacity,
            utilization: v.utilization,
            status: v.status,
        });
        await venue.save();
    }

    // Import Events
    console.log('Importing Events...');
    for (const e of data.event) {
        const event = new Event({
            title: e.title,
            description: e.description,
            date: e.date,
            time: e.time,
            location: e.location,
            capacity: e.capacity,
            status: e.status,
        });
        await event.save();
        eventMap[e.id] = event._id;
    }

    // Import Registrations
    console.log('Importing Registrations...');
    for (const r of data.registration) {
        if (userMap[r.user_id] && eventMap[r.event_id]) {
            const reg = new Registration({
                user: userMap[r.user_id],
                event: eventMap[r.event_id],
                ticketType: r.ticket_type,
                status: r.status,
                checkedIn: !!r.checked_in,
            });
            await reg.save();
        }
    }

    // Import Speakers
    console.log('Importing Speakers...');
    for (const s of data.speaker) {
        const speaker = new Speaker({
            name: s.name,
            bio: s.bio,
            sessionTitle: s.session_title,
            schedule: s.schedule,
            availability: !!s.availability,
        });
        await speaker.save();
    }

    // Import Sponsorships
    console.log('Importing Sponsorships...');
    for (const s of data.sponsorship) {
        const sponsorship = new Sponsorship({
            sponsorName: s.sponsor_name,
            commitment: s.commitment,
            deliverables: s.deliverables,
            visibilityScore: s.visibility_score,
            roi: s.roi,
        });
        await sponsorship.save();
    }

    // Import Incidents
    console.log('Importing Incidents...');
    for (const i of data.incident) {
        const incident = new Incident({
            title: i.title,
            description: i.description,
            priority: i.priority,
            status: i.status,
        });
        await incident.save();
    }

    // Import Notifications
    console.log('Importing Notifications...');
    for (const n of data.notification) {
        if (!n.user_id || userMap[n.user_id]) {
            const notification = new Notification({
                user: n.user_id ? userMap[n.user_id] : null,
                recipient: n.recipient,
                channel: n.channel,
                subject: n.subject,
                message: n.message,
                read: !!n.read,
            });
            await notification.save();
        }
    }

    console.log('Data migration complete!');
    process.exit(0);
};

importData();
