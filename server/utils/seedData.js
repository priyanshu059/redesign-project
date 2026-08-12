// ============================================================
// utils/seedData.js - Populate Database with Sample Data
// ============================================================
// Run this once to create test accounts and sample events.
// Command: node utils/seedData.js
// ============================================================

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Venue from '../models/Venue.js';
import Speaker from '../models/Speaker.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Event.deleteMany();
    await Venue.deleteMany();
    await Speaker.deleteMany();

    // Create Users
    await User.create({
      name: 'Admin User',
      email: 'admin@eventops.com',
      password: 'admin123',
      role: 'admin',
    });

    await User.create({
      name: 'Regular User',
      email: 'user@eventops.com',
      password: 'user123',
      role: 'user',
    });
    console.log('✅ Users created');

    // Create Venues
    await Venue.create({
      name: 'Grand Convention Center',
      address: '123 Main Street',
      city: 'Mumbai',
      capacity: 500,
      facilities: 'WiFi, Projector, Stage, Parking',
    });

    await Venue.create({
      name: 'Tech Hub Auditorium',
      address: '456 Tech Park',
      city: 'Bangalore',
      capacity: 200,
      facilities: 'WiFi, Multiple Screens, AC',
    });
    console.log('✅ Venues created');

    // ✅ Fixed: Removed non-existent fields (endDate, venue ref, category, price, imageUrl)
    // ✅ Fixed: status is now lowercase 'upcoming' to match schema enum
    // ✅ Fixed: date is a String "YYYY-MM-DD" to match schema (not a Date object)
    await Event.create([
      {
        title: 'Annual Tech Summit 2026',
        description: 'A premier technology conference bringing together industry leaders, innovators, and developers.',
        date: '2026-09-15',
        time: '09:00 AM',
        location: 'Mumbai',
        category: 'Technology',
        status: 'upcoming',
        capacity: 500,
        price: 999,
      },
      {
        title: 'AI & Machine Learning Workshop',
        description: 'Hands-on workshop covering the latest in artificial intelligence and machine learning.',
        date: '2026-08-20',
        time: '10:00 AM',
        location: 'Bangalore',
        category: 'Workshop',
        status: 'upcoming',
        capacity: 100,
        price: 499,
      },
      {
        title: 'Startup Networking Night',
        description: 'Connect with founders, investors, and mentors in a casual networking environment.',
        date: '2026-08-30',
        time: '06:00 PM',
        location: 'Delhi',
        category: 'Networking',
        status: 'upcoming',
        capacity: 150,
        price: 0,
      },
    ]);
    console.log('✅ Events created');

    // ✅ Fixed: Removed non-existent fields (expertise, organization, email) from Speaker
    await Speaker.create([
      { name: 'Dr. Sarah Johnson', bio: 'AI researcher with 15 years of experience', sessionTitle: 'Keynote: The Future of AI', schedule: 'Day 1 09:00' },
      { name: 'Raj Patel', bio: 'Serial entrepreneur and startup mentor', sessionTitle: 'Building Startups in 2026', schedule: 'Day 2 11:00' },
    ]);
    console.log('✅ Speakers created');

    console.log('\n🎉 Seed complete!');
    console.log('─────────────────────────────');
    console.log('Admin login: admin@eventops.com / admin123');
    console.log('User login:  user@eventops.com / user123');
    console.log('─────────────────────────────');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
