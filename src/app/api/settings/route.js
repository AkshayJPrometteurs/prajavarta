import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const data = await prisma.setting.findFirst()
    const appLogo = data?.appLogo || ''
    const appLogoUrl = appLogo
      ? (typeof appLogo === 'string'
          ? appLogo.startsWith('http')
              ? appLogo
              : appLogo.startsWith('/') || appLogo.startsWith('uploads/')
                  ? (appLogo.startsWith('/') ? appLogo : `/${appLogo}`)
                  : appLogo
          : null)
      : null
    return NextResponse.json({ success: true, data: { ...(data || {}), appLogoUrl } })
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
