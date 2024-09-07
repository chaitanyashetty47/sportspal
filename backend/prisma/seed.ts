// seed.ts

import { PrismaClient, TurfType} from '@prisma/client'
// import { process } from 'process';

const prisma = new PrismaClient()

async function main() {
  // Create a city
  const mumbai = await prisma.city.create({
    data: {
      name: 'Mumbai',
    },
  })

  // Create first playground
  const sportZone = await prisma.playground.create({
    data: {
      name: 'SportZone',
      address: 'Chembur, Mumbai',
      cityId: mumbai.id,
      startTime: '15:00',
      endTime: '22:00',
      turfs: {
        create: [
          {
            name: 'Cricket Turf',
            type: TurfType.CRICKET,
            hourlyRate: 950,
          },
          {
            name: 'Football Court 6x6',
            type: TurfType.FOOTBALL,
            hourlyRate: 950,
          },
        ],
      },
    },
    include: {
      turfs: true,
    },
  })

  // Create second playground
  const activeArena = await prisma.playground.create({
    data: {
      name: 'Active Arena',
      address: 'Malad, Mumbai',
      cityId: mumbai.id,
      startTime: '17:00',
      endTime: '22:00',
      turfs: {
        create: [
          {
            name: 'Badminton Court 1',
            type: TurfType.BADMINTON,
            hourlyRate: 1000,
          },
          {
            name: 'Badminton Court 2',
            type: TurfType.BADMINTON,
            hourlyRate: 1500,
          },
          {
            name: 'Cricket Net',
            type: TurfType.CRICKET,
            hourlyRate: 1200,
          },
        ],
      },
    },
    include: {
      turfs: true,
    },
  })

  // Create third playground
  const sportsComplex = await prisma.playground.create({
    data: {
      name: 'Mumbai Sports Complex',
      address: 'Andheri, Mumbai',
      cityId: mumbai.id,
      startTime: '15:00',
      endTime: '22:00',
      turfs: {
        create: [
          {
            name: 'Football Ground',
            type: TurfType.FOOTBALL,
            hourlyRate: 1000,
          },
          {
            name: 'Cricket turf',
            type: TurfType.CRICKET,
            hourlyRate: 1000,
          },
          {
            name: 'Indoor Badminton Court',
            type: TurfType.BADMINTON,
            hourlyRate: 1200,
          },
        ],
      },
    },
    include: {
      turfs: true,
    },
  })

  console.log('Seed data created:')
  console.log('City:', mumbai)
  console.log('Playgrounds:')
  console.log(sportZone)
  console.log(activeArena)
  console.log(sportsComplex)
}

main()
  .catch((e) => {
    console.error(e)
    // process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })