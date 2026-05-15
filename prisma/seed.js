require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { PrismaMariaDb } = require('@prisma/adapter-mariadb')

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.error('❌ DATABASE_URL is not set in .env file')
  process.exit(1)
}

const adapter = new PrismaMariaDb(databaseUrl)
const prisma = new PrismaClient({
  adapter,
})

async function authorSeeder() {
    try {
        const authors = [
            {
                name: 'अक्षय पाटील',
                nameEnglish: 'Akshay Patil',
                role: 'Senior Editor',
                experience: '8 Years',
                bio: 'राजकारण आणि स्थानिक बातम्यांमध्ये विशेष अनुभव असलेले वरिष्ठ संपादक.',
                image: '/uploads/admin/authors/akshay-patil.jpg',
                twitter: 'https://twitter.com/akshaypatil',
                linkedin: 'https://linkedin.com/in/akshaypatil',
                email: 'akshay@example.com',
                isActive: true,
            },
            {
                name: 'पूजा देशमुख',
                nameEnglish: 'Pooja Deshmukh',
                role: 'Crime Reporter',
                experience: '5 Years',
                bio: 'क्राईम आणि तपास पत्रकारितेमध्ये अनुभवी रिपोर्टर.',
                image: '/uploads/admin/authors/pooja-deshmukh.jpg',
                twitter: 'https://twitter.com/poojadeshmukh',
                linkedin: 'https://linkedin.com/in/poojadeshmukh',
                email: 'pooja@example.com',
                isActive: true,
            },
            {
                name: 'रोहित शिंदे',
                nameEnglish: 'Rohit Shinde',
                role: 'Sports Journalist',
                experience: '4 Years',
                bio: 'क्रीडा क्षेत्रातील बातम्या आणि विश्लेषणात विशेष प्राविण्य.',
                image: '/uploads/admin/authors/rohit-shinde.jpg',
                twitter: 'https://twitter.com/rohitshinde',
                linkedin: 'https://linkedin.com/in/rohitshinde',
                email: 'rohit@example.com',
                isActive: true,
            },
        ]

        for (const author of authors) {
            const exists = await prisma.author.findFirst({
                where: {
                    email: author.email,
                },
            })

            if (!exists) {
                await prisma.author.create({
                    data: author,
                })
                console.log(`Created author: ${author.name}`)
            } else {
                console.log(`Author already exists: ${author.name}`)
            }
        }

        console.log('✅ Author seeder completed')
    } catch (error) {
        console.error('❌ Seeder error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

authorSeeder()
