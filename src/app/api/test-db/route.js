import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Testing database connection...')
    
    // Test basic connection
    await prisma.$connect()
    console.log('Database connection successful')
    
    // Test query
    const userCount = await prisma.user.count()
    console.log('User count:', userCount)
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      message: 'Database connection successful',
      userCount
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      { 
        error: 'Database connection failed',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
