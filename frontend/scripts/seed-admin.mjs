import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'moonlightcurtainshop@gmail.com';
  const password = 'moonlightadmin';

  console.log(`Checking if admin user ${email} exists...`);
  
  const existingAdmin = await prisma.user.findUnique({ where: { email } });
  if (existingAdmin) {
    console.log('Admin already exists in the database. You can log in!');
    process.exit(0);
  }

  console.log('Hashing password securely...');
  const passwordHash = await bcrypt.hash(password, 10);

  console.log('Creating Admin account in MongoDB...');
  const admin = await prisma.user.create({
    data: {
      name: 'Master Admin',
      email: email,
      passwordHash: passwordHash,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin created successfully!');
  console.log('Email:', admin.email);
  console.log('Password: moonlightadmin');
}

main()
  .catch((e) => {
    console.error('❌ Failed to create admin account:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
