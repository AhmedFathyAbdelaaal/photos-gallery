'use client'
import { useEffect, useRef } from 'react'
import styles from './DriftingGrid.module.css'

type Photo = {
  id: string
  filename: string
  width: number | null
  height: number | null
}

// Each column drifts at a different speed and direction
const COLUMN_CONFIG = [
  { speed: 18, direction: 1 },   // slow, up
  { speed: 28, direction: -1 },  // medium, down
  { speed: 22, direction: 1 },   // medium-slow, up
  { speed: 35, direction: -1 },  // faster, down
  { speed: 15, direction: 1 },   // slowest, up
]

function splitIntoColumns<T>(arr: T[], n: number): T[][] {
  const cols: T[][] = Array.from({ length: n }, () => [])
  arr.forEach((item, i) => cols[i % n].push(item))
  return cols
}

export default function DriftingGrid({ photos, onPhotoClick }: {
  photos: Photo[]
  onPhotoClick: (photo: Photo) => void
}) {
  const colCount = Math.min(COLUMN_CONFIG.length, Math.max(2, Math.floor(photos.length / 2)))
  const columns = splitIntoColumns(photos, colCount)
  const colRefs = useRef<(HTMLDivElement | null)[]>([])
  const posRef = useRef<number[]>(COLUMN_CONFIG.map(() => -200))
  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  useEffect(() => {
    const animate = (time: number) => {
      const dt = lastTimeRef.current ? (time - lastTimeRef.current) / 1000 : 0
      lastTimeRef.current = time

      colRefs.current.forEach((col, i) => {
        if (!col) return
        const cfg = COLUMN_CONFIG[i] ?? COLUMN_CONFIG[0]
        posRef.current[i] = (posRef.current[i] ?? 0) + cfg.speed * cfg.direction * dt

        // Loop: when column scrolls fully, reset
        const totalH = col.scrollHeight / 2
        if (cfg.direction === 1 && posRef.current[i] > totalH) {
          posRef.current[i] -= totalH
        } else if (cfg.direction === -1 && posRef.current[i] < -totalH) {
          posRef.current[i] += totalH
        }

        col.style.transform = `translateY(${posRef.current[i]}px)`
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  if (!photos.length) {
    return (
      <div className={styles.empty}>
        <p>no photographs yet</p>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {columns.map((col, ci) => (
        <div key={ci} className={styles.column}>
          {/* Duplicate for seamless loop */}
          <div
            ref={el => { colRefs.current[ci] = el }}
            className={styles.columnInner}
          >
            {[...col, ...col].map((photo, pi) => (
              <button
                key={`${photo.id}-${pi}`}
                className={styles.photoWrap}
                onClick={() => onPhotoClick(photo)}
                style={{
                  aspectRatio: photo.width && photo.height
                    ? `${photo.width} / ${photo.height}`
                    : '3 / 4',
                }}
              >
                <img
                  src={`/api/thumbs/${photo.filename}`}
                  alt=""
                  className={styles.photo}
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className={styles.topFade} />
      <div className={styles.bottomFade} />
    </div>
  )
}
