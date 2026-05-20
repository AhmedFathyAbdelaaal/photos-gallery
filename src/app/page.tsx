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
}).then((photos: { id: string; filename: string; width: number | null; height: number | null; camera: string | null; lens: string | null; focalLength: string | null; aperture: string | null; shutterSpeed: string | null; iso: string | null; takenAt: Date | null }[]) =>
  photos.map(p => ({
    ...p,
    takenAt: p.takenAt?.toISOString() ?? null,
  }))
),
    prisma.showcase.findMany({ select: { slug: true }, orderBy: { createdAt: 'desc' } }),
  ])

  return <HomeClient photos={photos} showcaseSlugs={showcases.map((s: { slug: string }) => s.slug)} />
}
