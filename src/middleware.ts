import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SITE_COOKIE = 'cp_site_auth'
const ADMIN_COOKIE = 'cp_admin_auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always allow the auth API and the login page assets
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  const siteCookie = request.cookies.get(SITE_COOKIE)
  const siteAuthed = siteCookie?.value === process.env.SITE_PASSWORD

  // Admin routes need admin password too
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/upload') || pathname.startsWith('/api/showcases') || pathname.startsWith('/api/photos')) {
    const adminCookie = request.cookies.get(ADMIN_COOKIE)
    const adminAuthed = adminCookie?.value === process.env.ADMIN_PASSWORD
    if (!adminAuthed) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // Everything else needs site password
  if (!siteAuthed) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
