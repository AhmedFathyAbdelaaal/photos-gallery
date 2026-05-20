import { NextRequest, NextResponse } from 'next/server'
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

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  
  const photo = await prisma.photo.findUnique({ where: { id } })
  if (!photo) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Delete file from disk
  try {
    const { unlink } = await import('fs/promises')
    await unlink(photo.path)
  } catch {
    // File might already be gone, continue anyway
  }

  await prisma.photo.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}