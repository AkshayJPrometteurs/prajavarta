const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function main() {
  const filePath = path.join(process.cwd(), 'public', 'admin', 'settings.json')
  if (!fs.existsSync(filePath)) {
    console.log('No settings.json found at', filePath)
    return
  }
  const raw = fs.readFileSync(filePath, 'utf8')
  const data = JSON.parse(raw || '{}')

  const upsert = await prisma.setting.upsert({
    where: { id: 1 },
    create: { ...data },
    update: { ...data },
  })

  console.log('Upserted settings:', upsert)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
