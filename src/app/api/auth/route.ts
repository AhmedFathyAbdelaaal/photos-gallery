import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { password, type } = await req.json()

  if (type === 'site') {
    if (password !== process.env.SITE_PASSWORD) {
      return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
    }
    const res = NextResponse.json({ ok: true })
    res.cookies.set('cp_site_auth', password, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })
    return res
  }

  if (type === 'admin') {
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
    }
    const res = NextResponse.json({ ok: true })
    res.cookies.set('cp_admin_auth', password, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return res
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}
