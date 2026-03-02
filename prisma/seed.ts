import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  // Création d'un Administrateur
  const admin = await prisma.user.upsert({
    where: { email: 'admin@medicare.com' },
    update: {},
    create: {
      email: 'admin@medicare.com',
      name: 'Admin Principal',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  // Création d'un Médecin
  const doctor = await prisma.user.upsert({
    where: { email: 'doctor@medicare.com' },
    update: {},
    create: {
      email: 'doctor@medicare.com',
      name: 'Dr. Smith',
      password: hashedPassword,
      role: 'MEDECIN',
      specialite: 'Cardiologie',
    },
  })

  console.log({ admin, doctor })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })