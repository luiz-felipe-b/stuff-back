import { db } from './connection.ts';
import { organizations } from './schemas/organizations.schema.ts';
import { assets } from './schemas/assets/assets.schema.ts';
import { attributes } from './schemas/assets/attributes/attributes.schema.ts';
import { attributeValues } from './schemas/assets/attributes/attribute-values.schema.ts';
import { users } from './schemas/users.schema.ts';
import { usersOrganizations } from './schemas/users-organizations.schema.ts';
import argon2 from 'argon2';
import { env } from '../env.ts';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
        // ...existing code...
    // ...existing code...
    // Seed user-organization relations (after users/orgs are created)
    // This block should be after orgIds and userIds are populated

    if (env.NODE_ENV === 'production') {
        console.error('Seeding is not allowed in production environment.');
        return;
    }

    console.log('🌱 Seeding database...');

    try {
        // Optional DB reset: use --reset CLI flag to clear tables before seeding
        const shouldReset = process.argv.includes('--reset');
        if (shouldReset) {
            await db.delete(attributeValues);
            await db.delete(attributes);
            await db.delete(assets);
            await db.delete(organizations);
            await db.delete(users);
            console.log('🧹 Database reset before seeding.');
        }

        // Create admin user
    const adminPassword = await argon2.hash('admin123');
    const adminId = '00000000-0000-0000-0000-000000000001';
        await db.insert(users).values({
            id: adminId,
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com',
            password: adminPassword,
            role: 'admin',
            active: true,
            authenticated: false,
            createdAt: new Date(),
            updatedAt: new Date()
        }).onConflictDoNothing();

        // Create regular users
        const password = await argon2.hash('password123');
        const userIds: string[] = [];
        const sampleUsers = [
            { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
            { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
            { firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com' },
            { firstName: 'Alice', lastName: 'Williams', email: 'alice@example.com' },
            { firstName: 'Eve', lastName: 'Brown', email: 'eve@example.com' }
        ];
        for (const user of sampleUsers) {
            const id = uuidv4();
            userIds.push(id);
            await db.insert(users).values({
                id,
                ...user,
                password,
                role: 'user',
                active: true,
                authenticated: false,
                createdAt: new Date(),
                updatedAt: new Date()
            }).onConflictDoNothing();
        }

        // Seed organizations
        const orgIds: string[] = [];
        const orgSamples = [
            { name: 'Acme Corp', slug: 'acme-corp', description: 'Sample organization' },
            { name: 'Globex Inc', slug: 'globex-inc', description: 'Another org' },
            { name: 'Umbrella LLC', slug: 'umbrella-llc', description: 'Third org' }
        ];
        for (let i = 0; i < orgSamples.length; i++) {
            const id = uuidv4();
            orgIds.push(id);
            await db.insert(organizations).values({
                id,
                ownerId: adminId,
                name: orgSamples[i].name,
                slug: orgSamples[i].slug,
                password: null,
                description: orgSamples[i].description,
                active: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }).onConflictDoNothing();
        }

        // Seed assets
        const assetIds: string[] = [];
        const assetSamples = [
            { type: 'unique', name: 'Company Car', description: 'A unique company vehicle', quantity: 1 },
            { type: 'replicable', name: 'Laptop', description: 'Employee laptops', quantity: 10 },
            { type: 'unique', name: 'Main Server', description: 'Primary server for infrastructure', quantity: 1 },
            { type: 'replicable', name: 'RFID Badge', description: 'Access badges for staff', quantity: 50 },
            { type: 'unique', name: 'Conference Room TV', description: 'TV in the main conference room', quantity: 1 }
        ];
        const assetInsertData: any[] = [];
        for (let i = 0; i < assetSamples.length; i++) {
            const id = uuidv4();
            assetIds.push(id);
            assetInsertData.push({
                id,
                type: assetSamples[i].type,
                quantity: assetSamples[i].quantity,
                organizationId: orgIds[i % orgIds.length],
                creatorUserId: adminId,
                name: assetSamples[i].name,
                description: assetSamples[i].description,
                trashBin: false,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        await db.insert(assets).values(assetInsertData).onConflictDoNothing();

        // Seed attributes
        const attributeIds: string[] = [];
        const attributeSamples = [
            { name: 'License Plate', description: 'Car license plate', type: 'text' },
            { name: 'RAM Size', description: 'Laptop RAM in GB', type: 'number' },
            { name: 'Is Active', description: 'Is the asset active?', type: 'boolean' },
            { name: 'Purchase Date', description: 'Date of purchase', type: 'date' },
            { name: 'Weight', description: 'Weight in kilograms', type: 'metric', unit: 'kg' },
            { name: 'Operating System', description: 'Laptop OS', type: 'select', options: JSON.stringify(['Windows', 'macOS', 'Linux']) },
            { name: 'Accessories', description: 'Included accessories', type: 'multiselection', options: JSON.stringify(['Mouse', 'Charger', 'Bag']) },
            { name: 'Uptime', description: 'Server uptime', type: 'timemetric', timeUnit: 'seconds' },
            { name: 'Manual File', description: 'URL to asset manual', type: 'file' },
            { name: 'RFID Tag', description: 'RFID tag ID', type: 'rfid' }
        ];
        const attributeInsertData: any[] = [];
        for (let i = 0; i < attributeSamples.length; i++) {
            const id = uuidv4();
            attributeIds.push(id);
            const attr = attributeSamples[i];
            attributeInsertData.push({
                id,
                organizationId: orgIds[i % orgIds.length],
                authorId: adminId,
                name: attr.name,
                description: attr.description,
                type: attr.type,
                options: attr.options || null,
                unit: attr.unit || null,
                timeUnit: attr.timeUnit || null,
                required: false,
                trashBin: false,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        await db.insert(attributes).values(attributeInsertData).onConflictDoNothing();

        // Seed attribute values with correct types (all as strings)
        for (let i = 0; i < assetIds.length; i++) {
            for (let j = 0; j < attributeIds.length; j++) {
                const attrType = attributeSamples[j].type;
                let value: string | number;
                switch (attrType) {
                    case 'text':
                        value = `ABC-${1000 + i}`;
                        break;
                    case 'number':
                        value = String(4 + i); // RAM size in GB
                        break;
                    case 'boolean':
                        value = (i % 2 === 0).toString();
                        break;
                    case 'date':
                        value = new Date(Date.now() - (i * 86400000)).toISOString();
                        break;
                    case 'metric':
                        value = String(2.5 + i);
                        break;
                    case 'select':
                        value = ['Windows', 'macOS', 'Linux'][i % 3];
                        break;
                    case 'multiselection':
                        value = ['Mouse', 'Charger', 'Bag'].filter((_, idx) => (i + idx) % 2 === 0).join(',');
                        break;
                    case 'timemetric':
                        value = 3600 * (i + 1); // integer seconds
                        break;
                    case 'file':
                        value = `https://example.com/manuals/asset${i + 1}.pdf`;
                        break;
                    case 'rfid':
                        value = `RFID-${10000 + i}`;
                        break;
                    default:
                        value = '';
                }
                await db.insert(attributeValues).values({
                    id: uuidv4(),
                    assetInstanceId: assetIds[i],
                    attributeId: attributeIds[j],
                    value: typeof value === 'number' ? value.toString() : value,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }).onConflictDoNothing();
            }
        }

        console.log('✅ Seed completed successfully');
    } catch (error) {
        console.error('❌ Seed failed:', error);
    } finally {
        await db.$client.end();
    }
}

// Run the seed function
seed();