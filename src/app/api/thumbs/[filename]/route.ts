import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/db'

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? '/data/uploads'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: { filename: string } }
) {
  const { filename } = params
  const photo = await prisma.photo.findUnique({ where: { filename } })
  if (!photo) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const thumbPath = path.join(UPLOAD_DIR, 'thumbs', filename)
  try {
    const buffer = await readFile(thumbPath)
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    // Fallback to original if thumb doesn't exist
    const buffer = await readFile(path.join(UPLOAD_DIR, filename))
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': photo.mimeType ?? 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  }
}