import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const showcases = await prisma.showcase.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      photos: {
        orderBy: { order: 'asc' },
        include: {
          photo: {
            select: {
              id: true,
              filename: true,
              width: true,
              height: true,
            },
          },
        },
      },
    },
  })
  return NextResponse.json(showcases)
}

export async function POST(req: NextRequest) {
  const { title, caption, slug, photoIds } = await req.json()

  if (!title || !slug) {
    return NextResponse.json({ error: 'title and slug required' }, { status: 400 })
  }

  const showcase = await prisma.showcase.create({
    data: {
      title,
      caption: caption ?? null,
      slug,
      publishedAt: new Date(),
      photos: {
        create: (photoIds as string[]).map((photoId: string, i: number) => ({
          photoId,
          order: i,
        })),
      },
    },
    include: { photos: true },
  })

  return NextResponse.json(showcase)
}
