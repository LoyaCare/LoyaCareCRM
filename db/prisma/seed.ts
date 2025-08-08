import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'hans.schmidt@example.com',
      name: 'Hans Schmidt',
      password: 'hashedpassword1',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'julia.meier@example.com',
      name: 'Julia Meier',
      password: 'hashedpassword2',
    },
  });

  const contact1 = await prisma.contact.create({
    data: {
      id: uuidv4(),
      clientName: 'Müller GmbH',
      organization: 'Müller GmbH',
      email: 'kontakt@mueller.de',
      phone: '+49 170 1234567',
    },
  });

  const contact2 = await prisma.contact.create({
    data: {
      id: uuidv4(),
      clientName: 'Schneider AG',
      organization: 'Schneider AG',
      email: 'info@schneider-ag.de',
      phone: '+49 171 7654321',
    },
  });

  const contact3 = await prisma.contact.create({
    data: {
      id: uuidv4(),
      clientName: 'Beispiel & Co',
      organization: 'Beispiel & Co',
      email: 'hallo@beispiel.co',
      phone: '+49 172 1122334',
    },
  });

  const lead1 = await prisma.deal.create({
    data: {
      id: uuidv4(),
      contactId: contact1.id,
      creatorId: user1.id,
      assigneeId: user1.id,
      stage: 'LEAD',
      productInterest: 'CRM-System',
      potentialValue: 3000,
      notes: {
        create: [
          { content: 'Erstes Gespräch mit dem Kunden geführt.', creatorId: user1.id },
          { content: 'Kunde ist interessiert, möchte aber nächste Woche sprechen.', creatorId: user1.id },
        ],
      },
      appointments: {
        create: [
          { datetime: new Date(), type: 'call', notes: 'Telefonat zur Bedarfsermittlung.' },
        ],
      },
    },
  });

  const lead2 = await prisma.deal.create({
    data: {
      id: uuidv4(),
      contactId: contact2.id,
      creatorId: user1.id,
      assigneeId: user1.id,
      stage: 'LEAD',
      productInterest: 'Marketingberatung',
      potentialValue: 2500,
    },
  });

  const lead3 = await prisma.deal.create({
    data: {
      id: uuidv4(),
      contactId: contact3.id,
      creatorId: user2.id,
      assigneeId: user2.id,
      stage: 'LEAD',
      productInterest: 'E-Commerce Beratung',
      potentialValue: 4000,
    },
  });

  const lead4 = await prisma.deal.create({
    data: {
      id: uuidv4(),
      contactId: contact1.id,
      creatorId: user2.id,
      assigneeId: user2.id,
      stage: 'LEAD',
      productInterest: 'Support Services',
      potentialValue: 1800,
    },
  });

  const lead5 = await prisma.deal.create({
    data: {
      id: uuidv4(),
      contactId: contact2.id,
      creatorId: user2.id,
      assigneeId: user2.id,
      stage: 'LEAD',
      productInterest: 'Cloud Hosting',
      potentialValue: 3200,
    },
  });

  const deal1 = await prisma.deal.create({
    data: {
      id: uuidv4(),
      contactId: contact1.id,
      creatorId: user1.id,
      assigneeId: user1.id,
      stage: 'QUALIFIED',
      productInterest: 'ERP-Integration',
      potentialValue: 9000,
      notes: {
        create: [
          { content: 'Vertrag in Prüfung.', creatorId: user1.id },
        ],
      },
      appointments: {
        create: [
          { datetime: new Date(), type: 'meeting', notes: 'Vor-Ort-Präsentation.' },
        ],
      },
    },
  });

  const deal2 = await prisma.deal.create({
    data: {
      id: uuidv4(),
      contactId: contact2.id,
      creatorId: user1.id,
      assigneeId: user1.id,
      stage: 'QUALIFIED',
      productInterest: 'Webentwicklung',
      potentialValue: 7500,
      notes: {
        create: [
          { content: 'Designvorschläge gesendet.', creatorId: user1.id },
        ],
      },
    },
  });

  const deal3 = await prisma.deal.create({
    data: {
      id: uuidv4(),
      contactId: contact3.id,
      creatorId: user1.id,
      assigneeId: user1.id,
      stage: 'QUALIFIED',
      productInterest: 'App Entwicklung',
      potentialValue: 10500,
      notes: {
        create: [
          { content: 'Feedback zu Feature-Liste erhalten.', creatorId: user1.id },
        ],
      },
    },
  });

  const deal4 = await prisma.deal.create({
    data: {
      id: uuidv4(),
      contactId: contact1.id,
      creatorId: user2.id,
      assigneeId: user2.id,
      stage: 'QUALIFIED',
      productInterest: 'Schulungen',
      potentialValue: 2800,
      notes: {
        create: [
          { content: 'Workshop-Termine abgestimmt.', creatorId: user2.id },
        ],
      },
      appointments: {
        create: [
          { datetime: new Date(), type: 'meeting', notes: 'Kundengespräch in Berlin.' },
        ],
      },
    },
  });

  console.log('Seed completed');
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });