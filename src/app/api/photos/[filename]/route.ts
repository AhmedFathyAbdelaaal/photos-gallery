import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/db'

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? '/data/uploads'

export async function GET(
  _req: NextRequest,
  { params }: { params: { filename: string } }
) {
  const { filename } = params

  // Validate it's in our DB (no path traversal)
  const photo = await prisma.photo.findUnique({ where: { filename } })
  if (!photo) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const filePath = path.join(UPLOAD_DIR, filename)

  try {
    const buffer = await readFile(filePath)
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': photo.mimeType ?? 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': buffer.length.toString(),
      },
    })
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}
