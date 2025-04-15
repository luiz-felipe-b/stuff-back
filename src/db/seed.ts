import { db } from './connection.ts';
import { users } from './schemas/users.schema.ts';
import { nanoid } from 'nanoid';
import argon2 from 'argon2';
import { env } from '../env.ts';

async function seed() {

    if (env.NODE_ENV === 'production') {
        console.error('Seeding is not allowed in production environment.');
        return;
    }

    console.log('🌱 Seeding database...');

    try {
        // Clear existing data (optional, be careful in production)
        await db.delete(users);

        // Create admin user
        const adminPassword = await argon2.hash('admin123');
        await db.insert(users).values({
            id: nanoid(),
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com',
            password: adminPassword,
            role: 'admin',
            active: true,
            authenticated: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }).onConflictDoNothing();

        // Create regular users
        const password = await argon2.hash('password123');

        // Sample regular users
        const sampleUsers = [
            {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
            },
            {
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane@example.com',
            },
            {
                firstName: 'Bob',
                lastName: 'Johnson',
                email: 'bob@example.com',
            }
        ];

        for (const user of sampleUsers) {
            await db.insert(users).values({
                id: nanoid(),
                ...user,
                password,
                role: 'user',
                organizationId: null,
                active: true,
                authenticated: false,
                createdAt: new Date(),
                updatedAt: new Date()
            }).onConflictDoNothing();
        }

        // Add more seed data for other tables as needed
        // await db.insert(otherTable).values([...])

        console.log('✅ Seed completed successfully');
    } catch (error) {
        console.error('❌ Seed failed:', error);
    } finally {
        await db.$client.end();
    }
}

// Run the seed function
seed();