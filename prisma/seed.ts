import { PrismaClient } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import bcrypt from 'bcryptjs';

const host = process.env.DATABASE_HOST;
const user = process.env.DATABASE_USER;
const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_NAME;

if (!host || !user || !password || !database) {
    throw new Error('Database connection environment variables for seeding are not fully set!');
}

const adapter = new PrismaMariaDb({
    host,
    user,
    password,
    database,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Start seeding with adapter...');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    await prisma.user.create({
    data: {
        email: 'test@example.com',
        password: hashedPassword,
        role: 'USER',
    },
    });

    console.log('Seeding finished successfully.');
}

main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
    })
    .finally(async () => {
    await prisma.$disconnect();
    });
