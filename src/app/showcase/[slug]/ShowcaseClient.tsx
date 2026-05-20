'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Lightbox from '@/components/Lightbox'
import styles from './showcase.module.css'

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

export default function ShowcaseClient({
  title,
  caption,
  photos,
  showcaseSlugs,
}: {
  title: string
  caption?: string | null
  photos: Photo[]
  showcaseSlugs: string[]
}) {
  const [selected, setSelected] = useState<Photo | null>(null)

  return (
    <>
      <Navbar showcaseSlugs={showcaseSlugs} />
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          {caption && <p className={styles.caption}>{caption}</p>}
        </header>
        <div className={styles.grid}>
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              className={`${styles.photoWrap} ${i % 5 === 2 ? styles.wide : ''}`}
              onClick={() => setSelected(photo)}
              style={{
                aspectRatio: photo.width && photo.height
                  ? `${photo.width} / ${photo.height}`
                  : '3/4',
              }}
            >
              <img
                src={`/api/photos/${photo.filename}`}
                alt=""
                className={styles.photo}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </main>
      {selected && <Lightbox photo={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
