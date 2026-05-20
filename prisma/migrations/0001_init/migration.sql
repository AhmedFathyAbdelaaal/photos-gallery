-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "size" INTEGER,
    "mimeType" TEXT,
    "camera" TEXT,
    "lens" TEXT,
    "focalLength" TEXT,
    "aperture" TEXT,
    "shutterSpeed" TEXT,
    "iso" TEXT,
    "takenAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Showcase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "caption" TEXT,
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ShowcasePhoto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "showcaseId" TEXT NOT NULL,
    "photoId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ShowcasePhoto_showcaseId_fkey" FOREIGN KEY ("showcaseId") REFERENCES "Showcase" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ShowcasePhoto_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Photo_filename_key" ON "Photo"("filename");
CREATE UNIQUE INDEX "Showcase_slug_key" ON "Showcase"("slug");
CREATE UNIQUE INDEX "ShowcasePhoto_showcaseId_photoId_key" ON "ShowcasePhoto"("showcaseId", "photoId");
