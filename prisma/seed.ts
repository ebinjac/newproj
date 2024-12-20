import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Delete existing data
    console.log('Deleting existing data...')
    await prisma.application.deleteMany()
    await prisma.team.deleteMany()
    await prisma.user.deleteMany()

    console.log('Creating teams...')
    // Create teams
    const team1 = await prisma.team.create({
      data: {
        slug: 'team1',
        teamName: 'Team One',
        prcGroup: 'team1-prc',
        vpName: 'John Doe',
        directorName: 'Jane Smith',
        email: 'team1@example.com',
        slack: '#team1-channel',
        requestedBy: 'user1@example.com',
        approved: true,
        applications: {
          create: [
            {
              appName: 'App 1',
              carId: 'CAR123',
              description: 'First application for Team One',
              vp: 'John Doe',
              dir: 'Jane Smith',
              engDir: 'Bob Wilson',
              slack: '#app1-channel',
              email: 'app1@example.com',
              snowGroup: 'app1-snow'
            }
          ]
        }
      }
    })

    const team2 = await prisma.team.create({
      data: {
        slug: 'team2',
        teamName: 'Team Two',
        prcGroup: 'team2-prc',
        vpName: 'Sarah Johnson',
        directorName: 'Mike Brown',
        email: 'team2@example.com',
        slack: '#team2-channel',
        requestedBy: 'user2@example.com',
        approved: true,
        applications: {
          create: [
            {
              appName: 'App 2',
              carId: 'CAR456',
              description: 'First application for Team Two',
              vp: 'Sarah Johnson',
              dir: 'Mike Brown',
              engDir: 'Alice Green',
              slack: '#app2-channel',
              email: 'app2@example.com',
              snowGroup: 'app2-snow'
            }
          ]
        }
      }
    })

    // Create test user with access to both teams
    console.log('Creating test user...')
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        groups: ['team1-prc', 'team2-prc']
      }
    })

    console.log('Seed data created successfully:', {
      team1,
      team2,
      testUser
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

main()
  .then(async () => {
    console.log('Seeding completed. Disconnecting...')
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
