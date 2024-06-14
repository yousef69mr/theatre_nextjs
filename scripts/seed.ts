// const { PrismaClient } = require("@prisma/client");

// const database = new PrismaClient();

async function generateFestivals() {
  try {
    await database.festival.deleteMany();

    // await database.$queryRaw`ALTER TABLE Festival A`
    await database.festival.createMany({
      data: [
        { name: "مهرجان إبداع" },
        { name: "المهرجان القومى" },
        { name: "مهرجان جامعة القاهرة للعروض الطويلة" },
        { name: "مهرجان جامعة القاهرة للعروض القصيرة" },
      ],
    });
  } catch (error) {
    console.error("Error seeding the database festivals", error);
    throw error;
  }
}

async function generateActors() {
  try {
    await database.actor.deleteMany();

    // await database.$queryRaw`ALTER TABLE Festival A`
    await database.actor.createMany({
      data: [
        { name: "طارق الحلوانى" },
        { name: "ندى أشرف" },
        { name: "سارة عادل" },
        { name: "محمود تويكس", nickname: "twix" },
      ],
    });
  } catch (error) {
    console.error("Error seeding the database festivals", error);
    throw error;
  }
}
async function main() {
  try {
    await generateFestivals();

    await generateActors();

    console.log("Success");
    process.exit(0);
  } catch (error) {
    process.exit(1);
  } finally {
    await database.$disconnect();
  }
}

main();
