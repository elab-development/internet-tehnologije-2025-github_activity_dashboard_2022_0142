import "dotenv/config";
import bcrypt from 'bcryptjs';
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client"; 

async function main() {
    console.log('Start seeding...');

    const dbUrl = new URL(process.env.DATABASE_URL as string);

    const adapter = new PrismaMariaDb({
        host: dbUrl.hostname,
        port: parseInt(dbUrl.port) || 3306,
        user: dbUrl.username,
        password: decodeURIComponent(dbUrl.password),
        database: dbUrl.pathname.replace("/", ""),
        connectionLimit: 10, 
        ssl: {
            rejectUnauthorized: false,
        },
    });

    const prisma = new PrismaClient({ adapter });

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        await prisma.user.upsert({
            where: { email: 'test@example.com' },
            update: {},
            create: {
                email: 'test@example.com',
                password: hashedPassword,
                role: 'USER',
            },
        });

        console.log('Seeding finished successfully.');
    } catch (error) {
        console.error('Error during seeding:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });