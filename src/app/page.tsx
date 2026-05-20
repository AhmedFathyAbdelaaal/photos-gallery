import { prisma } from '@/lib/db'
import HomeClient from './HomeClient'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [photos, showcases] = await Promise.all([
    prisma.photo.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, filename: true, width: true, height: true,
        camera: true, lens: true, focalLength: true,
        aperture: true, shutterSpeed: true, iso: true, takenAt: true,
      },
    }),
    prisma.showcase.findMany({ select: { slug: true }, orderBy: { createdAt: 'desc' } }),
  ])

  return <HomeClient photos={photos} showcaseSlugs={showcases.map(s => s.slug)} />
}
