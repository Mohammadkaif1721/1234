const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Event = require('./models/Event');
const Registration = require('./models/Registration');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
    try {
        await Registration.deleteMany();
        await Event.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed...');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const users = [];
        for (let i = 1; i <= 5; i++) {
            users.push({
                name: `User ${i}`,
                email: `user${i}@example.com`,
                password: hashedPassword // Manually hashed, or could rely on pre-save hook if using create() properly, but insertMany skips hooks usually. Let's use create or loop.
            });
        }

        // Using loop to ensure hooks run if we used create, but insertMany is faster. 
        // Since we hashed manually, insertMany is fine.
        // Wait, the User model has timestamps.

        const createdUsers = await User.insertMany(users.map(u => ({ ...u, password: 'password123' })));
        // NOTE: insertMany DOES NOT trigger pre-save hooks (hash password). 
        // We must loop and create to use the model logic, OR manually hash.
        // Let's re-do to use the model's create so hashing works reliably with the schema hook.

        // Actually, let's just clear and use a loop to be safe and simple.
        await User.deleteMany();

        const createdUsersList = [];
        for (let i = 1; i <= 5; i++) {
            const user = await User.create({
                name: `User ${i}`,
                email: `user${i}@example.com`,
                password: 'password123'
            });
            createdUsersList.push(user);
        }

        const adminUser = createdUsersList[0]._id;

        const events = [
            {
                name: 'Tech Summit 2026',
                description: 'A gathering of the brightest minds in technology.',
                location: 'Delhi',
                date: new Date('2026-03-15'),
                category: 'Tech',
                capacity: 100,
                organizer: adminUser
            },
            {
                name: 'Music Fest',
                description: 'Live performances by top bands.',
                location: 'Mumbai',
                date: new Date('2026-04-20'),
                category: 'Music',
                capacity: 500,
                organizer: adminUser
            },
            {
                name: 'Startup Bootcamp',
                description: 'Learn how to build a successful startup.',
                location: 'Bangalore',
                date: new Date('2026-02-28'),
                category: 'Business',
                capacity: 50,
                organizer: adminUser
            },
            {
                name: 'Yoga Retreat',
                description: 'Relax and rejuvenate.',
                location: 'Pune',
                date: new Date('2026-05-10'),
                category: 'Sports',
                capacity: 30,
                organizer: adminUser
            },
            {
                name: 'AI Workshop',
                description: 'Hands-on workshop on Artificial Intelligence.',
                location: 'Hyderabad',
                date: new Date('2026-03-10'),
                category: 'Tech',
                capacity: 60,
                organizer: adminUser
            },
            // Past Event
            {
                name: 'Past Tech Talk',
                description: 'A talk that happened in the past.',
                location: 'Delhi',
                date: new Date('2025-01-01'),
                category: 'Tech',
                capacity: 100,
                organizer: adminUser
            }
        ];

        // Generate more mock events
        const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune'];
        const categories = ['Tech', 'Sports', 'Music', 'Business', 'Other'];

        for (let i = 0; i < 10; i++) {
            events.push({
                name: `Random Event ${i + 1}`,
                description: `This is a description for random event ${i + 1}.`,
                location: cities[Math.floor(Math.random() * cities.length)],
                date: new Date(Date.now() + Math.random() * 10000000000), // Random future date
                category: categories[Math.floor(Math.random() * categories.length)],
                capacity: Math.floor(Math.random() * 100) + 20,
                organizer: adminUser
            });
        }

        await Event.create(events);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Registration.deleteMany();
        await Event.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
