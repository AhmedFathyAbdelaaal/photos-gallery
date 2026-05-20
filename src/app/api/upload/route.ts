import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/db'

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? '/data/uploads'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const files = formData.getAll('photos') as File[]

    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    await mkdir(UPLOAD_DIR, { recursive: true })

    const results = []

    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Unique filename
      const ext = path.extname(file.name)
      const base = path.basename(file.name, ext).replace(/[^a-z0-9]/gi, '-').toLowerCase()
      const filename = `${Date.now()}-${base}${ext}`
      const filePath = path.join(UPLOAD_DIR, filename)

      await writeFile(filePath, buffer)

      // Extract EXIF server-side using exifr
      let exif: Record<string, unknown> = {}
      try {
        const { default: exifr } = await import('exifr')
        exif = (await exifr.parse(buffer, {
          pick: ['Make', 'Model', 'LensModel', 'FocalLength', 'FNumber', 'ExposureTime', 'ISO', 'DateTimeOriginal'],
        })) ?? {}
      } catch {
        // EXIF extraction is best-effort
      }

      // Get image dimensions via sharp
      let width: number | undefined
      let height: number | undefined
      try {
        const sharp = (await import('sharp')).default
        const meta = await sharp(buffer).metadata()
        width = meta.width
        height = meta.height
      } catch {
        // dimensions are optional
      }

      const photo = await prisma.photo.create({
        data: {
          filename,
          path: filePath,
          width: width ?? null,
          height: height ?? null,
          size: file.size,
          mimeType: file.type,
          camera: exif.Make && exif.Model ? `${exif.Make} ${exif.Model}` : (exif.Model as string) ?? null,
          lens: (exif.LensModel as string) ?? null,
          focalLength: exif.FocalLength ? `${exif.FocalLength}mm` : null,
          aperture: exif.FNumber ? `f/${exif.FNumber}` : null,
          shutterSpeed: exif.ExposureTime ? `1/${Math.round(1 / (exif.ExposureTime as number))}s` : null,
          iso: exif.ISO ? `ISO ${exif.ISO}` : null,
          takenAt: exif.DateTimeOriginal ? new Date(exif.DateTimeOriginal as string) : null,
        },
      })

      results.push(photo)
    }

    return NextResponse.json({ uploaded: results })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}


