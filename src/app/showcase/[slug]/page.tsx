import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import ShowcaseClient from './ShowcaseClient'

export const dynamic = 'force-dynamic'

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

  const photos = showcase.photos.map(sp => sp.photo)

  return (
    <ShowcaseClient
      title={showcase.title}
      caption={showcase.caption}
      photos={photos}
      showcaseSlugs={showcases.map(s => s.slug)}
    />
  )
}
