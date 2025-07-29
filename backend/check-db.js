const { PrismaClient } = require('./src/generated/prisma');

const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('Checking directions...');
    const directions = await prisma.direction.findMany();
    console.log('Directions:', directions);
    
    console.log('Checking site settings...');
    const settings = await prisma.siteSettings.findMany();
    console.log('Site settings:', settings);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData(); 