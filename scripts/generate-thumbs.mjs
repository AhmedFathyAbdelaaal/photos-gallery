import { readdir, mkdir } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

const UPLOAD_DIR = '/data/captionato/uploads'
const THUMB_DIR = path.join(UPLOAD_DIR, 'thumbs')

await mkdir(THUMB_DIR, { recursive: true })

const files = await readdir(UPLOAD_DIR)
const images = files.filter(f => !f.startsWith('.') && f !== 'thumbs')

console.log(`Generating thumbs for ${images.length} images...`)

for (const file of images) {
  const src = path.join(UPLOAD_DIR, file)
  const dest = path.join(THUMB_DIR, file)
  try {
    await sharp(src)
      .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 70 })
      .toFile(dest)
    console.log(`✓ ${file}`)
  } catch (err) {
    console.error(`✗ ${file}:`, err.message)
  }
}

console.log('Done!')