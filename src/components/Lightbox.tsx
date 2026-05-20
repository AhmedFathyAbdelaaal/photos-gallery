'use client'
import { useEffect, useCallback } from 'react'
import styles from './Lightbox.module.css'

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

export default function Lightbox({ photo, onClose }: { photo: Photo; onClose: () => void }) {
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  const exifItems = [
    photo.camera && ['camera', photo.camera],
    photo.lens && ['lens', photo.lens],
    photo.focalLength && ['focal', photo.focalLength],
    photo.aperture && ['aperture', photo.aperture],
    photo.shutterSpeed && ['shutter', photo.shutterSpeed],
    photo.iso && ['iso', photo.iso],
    photo.takenAt && ['date', new Date(photo.takenAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })],
  ].filter(Boolean) as [string, string][]

  return (
    <div className={styles.overlay} onClick={onClose}>
      <button className={styles.close} onClick={onClose} aria-label="close">×</button>
      <div className={styles.inner} onClick={e => e.stopPropagation()}>
        <div className={styles.imgWrap}>
          <img
            src={`/api/photos/${photo.filename}`}
            alt=""
            className={styles.img}
          />
        </div>
        {exifItems.length > 0 && (
          <div className={styles.exif}>
            {exifItems.map(([label, value]) => (
              <div key={label} className={styles.exifRow}>
                <span className={styles.exifLabel}>{label}</span>
                <span className={styles.exifValue}>{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
