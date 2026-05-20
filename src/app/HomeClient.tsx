'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import DriftingGrid from '@/components/DriftingGrid'
import Lightbox from '@/components/Lightbox'

type Photo = {
  id: string
  filename: string
  width: number | null
  height: number | null
  camera?: string | null
  lens?: string | null
  focalLength?: string | null
  aperture?: string | null
  shutterSpeed?: string | null
  iso?: string | null
  takenAt?: string | null
}

export default function HomeClient({
  photos,
  showcaseSlugs,
}: {
  photos: Photo[]
  showcaseSlugs: string[]
}) {
  const [selected, setSelected] = useState<Photo | null>(null)

  return (
    <>
      <Navbar showcaseSlugs={showcaseSlugs} />
      <DriftingGrid photos={photos} onPhotoClick={setSelected} />
      {selected && <Lightbox photo={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
