'use client'
import { useState, useRef, useCallback } from 'react'
import styles from './admin.module.css'

type Photo = {
  id: string
  filename: string
  width: number | null
  height: number | null
  camera: string | null
  createdAt: string
}

type UploadedResult = { id: string; filename: string }

export default function AdminPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loaded, setLoaded] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [selectedForShowcase, setSelectedForShowcase] = useState<string[]>([])
  const [showcaseTitle, setShowcaseTitle] = useState('')
  const [showcaseCaption, setShowcaseCaption] = useState('')
  const [showcaseSlug, setShowcaseSlug] = useState('')
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const loadPhotos = useCallback(async () => {
    const res = await fetch('/api/photos')
    const data = await res.json()
    setPhotos(data)
    setLoaded(true)
  }, [])

  useState(() => { loadPhotos() })

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    setUploadProgress(`uploading ${files.length} file${files.length > 1 ? 's' : ''}...`)

    const fd = new FormData()
    files.forEach(f => fd.append('photos', f))

    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()

    if (res.ok) {
      setUploadProgress(`uploaded ${(data.uploaded as UploadedResult[]).length} photo${data.uploaded.length > 1 ? 's' : ''}`)
      loadPhotos()
    } else {
      setUploadProgress('upload failed')
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  function toggleSelect(id: string) {
    setSelectedForShowcase(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function autoSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  async function createShowcase() {
    if (!showcaseTitle || !showcaseSlug || !selectedForShowcase.length) {
      setMessage('need a title, slug, and at least one photo')
      return
    }
    setCreating(true)
    const res = await fetch('/api/showcases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: showcaseTitle,
        caption: showcaseCaption,
        slug: showcaseSlug,
        photoIds: selectedForShowcase,
      }),
    })
    if (res.ok) {
      setMessage(`showcase "${showcaseTitle}" created at /showcase/${showcaseSlug}`)
      setShowcaseTitle('')
      setShowcaseCaption('')
      setShowcaseSlug('')
      setSelectedForShowcase([])
    } else {
      const err = await res.json()
      setMessage(`error: ${err.error}`)
    }
    setCreating(false)
  }

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.title}>admin</h1>
        <a href="/" className={styles.viewSite}>← view site</a>
      </header>

      {/* Upload */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>upload photos</h2>
        <div className={styles.uploadZone} onClick={() => fileRef.current?.click()}>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className={styles.fileInput}
          />
          <p>{uploading ? uploadProgress : 'click to select photos — no compression, ever'}</p>
        </div>
        {uploadProgress && !uploading && <p className={styles.msg}>{uploadProgress}</p>}
      </section>

      {/* Create showcase */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>create showcase</h2>
        <div className={styles.showcaseForm}>
          <input
            type="text"
            placeholder="title"
            value={showcaseTitle}
            onChange={e => {
              setShowcaseTitle(e.target.value)
              setShowcaseSlug(autoSlug(e.target.value))
            }}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="slug (auto-generated)"
            value={showcaseSlug}
            onChange={e => setShowcaseSlug(e.target.value)}
            className={styles.input}
          />
          <textarea
            placeholder="caption (optional)"
            value={showcaseCaption}
            onChange={e => setShowcaseCaption(e.target.value)}
            className={styles.textarea}
            rows={3}
          />
          <p className={styles.hint}>
            select photos below ({selectedForShowcase.length} selected)
          </p>
          <button onClick={createShowcase} disabled={creating} className={styles.btn}>
            {creating ? 'creating...' : 'create showcase'}
          </button>
          {message && <p className={styles.msg}>{message}</p>}
        </div>
      </section>

      {/* Photo grid */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          all photos ({photos.length})
        </h2>
        {!loaded && <p className={styles.hint}>loading...</p>}
        <div className={styles.photoGrid}>
          {photos.map(photo => (
            <button
              key={photo.id}
              className={`${styles.photoThumb} ${selectedForShowcase.includes(photo.id) ? styles.selected : ''}`}
              onClick={() => toggleSelect(photo.id)}
            >
              <img
                src={`/api/photos/${photo.filename}`}
                alt=""
                className={styles.thumbImg}
              />
              {selectedForShowcase.includes(photo.id) && (
                <div className={styles.checkmark}>
                  {selectedForShowcase.indexOf(photo.id) + 1}
                </div>
              )}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
