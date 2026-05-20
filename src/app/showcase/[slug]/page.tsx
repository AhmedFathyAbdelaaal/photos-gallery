import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import ShowcaseClient from './ShowcaseClient'

export const dynamic = 'force-dynamic'

type PhotoRow = {
  id: string
  filename: string
  width: number | null
  height: number | null
  camera: string | null
  lens: string | null
  focalLength: string | null
  aperture: string | null
  shutterSpeed: string | null
  iso: string | null
  takenAt: Date | null
}

export default async function ShowcasePage({ params }: { params: { slug: string } }) {
  const [showcase, showcases] = await Promise.all([
    prisma.showcase.findUnique({
      where: { slug: params.slug },
      include: {
        photos: {
          orderBy: { order: 'asc' },
          include: {
            photo: {
              select: {
                id: true, filename: true, width: true, height: true,
                camera: true, lens: true, focalLength: true,
                aperture: true, shutterSpeed: true, iso: true, takenAt: true,
              },
            },
          },
        },
      },
    }),
    prisma.showcase.findMany({ select: { slug: true }, orderBy: { createdAt: 'desc' } }),
  ])

  if (!showcase) notFound()

  const photos = showcase.photos.map(sp => ({
    ...(sp.photo as PhotoRow),
    takenAt: (sp.photo as PhotoRow).takenAt?.toISOString() ?? null,
  }))

  const slugs = showcases.map(s => s.slug)

  return (
    <ShowcaseClient
      title={showcase.title}
      caption={showcase.caption}
      photos={photos}
      showcaseSlugs={slugs}
    />
  )
}
