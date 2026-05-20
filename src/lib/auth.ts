import { cookies } from 'next/headers'

const SITE_COOKIE = 'cp_site_auth'
const ADMIN_COOKIE = 'cp_admin_auth'

export function isSiteAuthed(): boolean {
  const c = cookies().get(SITE_COOKIE)
  return c?.value === process.env.SITE_PASSWORD
}

export function isAdminAuthed(): boolean {
  const c = cookies().get(ADMIN_COOKIE)
  return c?.value === process.env.ADMIN_PASSWORD
}

export function setSiteCookie(res: Response, password: string) {
  res.headers.append(
    'Set-Cookie',
    `${SITE_COOKIE}=${password}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`
  )
}

export function setAdminCookie(res: Response, password: string) {
  res.headers.append(
    'Set-Cookie',
    `${ADMIN_COOKIE}=${password}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
  )
}

export const COOKIE_NAMES = { SITE_COOKIE, ADMIN_COOKIE }
