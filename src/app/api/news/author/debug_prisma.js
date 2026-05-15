const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

console.log('Prisma Models:')
Object.keys(prisma).forEach(key => {
    if (typeof prisma[key] === 'object' && prisma[key] !== null && 'count' in prisma[key]) {
        console.log(`- ${key}`)
    }
})

prisma.$disconnect()
