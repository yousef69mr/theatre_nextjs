const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
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

    console.log("Success");
  } catch (error) {
    console.error("Error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();
