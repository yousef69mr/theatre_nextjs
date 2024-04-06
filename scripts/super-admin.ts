const { PrismaClient, UserRole } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const database = new PrismaClient();

async function adminMain() {
  try {
    // await database.user.deleteMany();

    const admins = await database.user.findMany({
      where: {
        role: UserRole.ADMIN,
      },
    });

    const hashedPassword = await bcrypt.hash(`admin${admins.length + 1}`, 10);

    // await database.$queryRaw`ALTER TABLE Festival A`
    const admin = await database.user.create({
      data: {
        name: `super admin ${admins.length + 1}`,
        email: `admin${admins.length + 1}@admin.com`,
        password: hashedPassword,
        role: UserRole.ADMIN,
        emailVerified: new Date(),
      },
    });

    console.log(`${admin.email} added successfully`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding the database super admin", error);
    process.exit(1);
  } finally {
    await database.$disconnect();
  }
}

adminMain();
