import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const photos = await prisma.photo.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      filename: true,
      width: true,
      height: true,
      camera: true,
      lens: true,
      focalLength: true,
      aperture: true,
      shutterSpeed: true,
      iso: true,
      takenAt: true,
      createdAt: true,
    },
  })
  return NextResponse.json(photos)
}
