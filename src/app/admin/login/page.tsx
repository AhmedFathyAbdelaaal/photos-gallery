'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../../login/login.module.css'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, type: 'admin' }),
    })
    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      setError('wrong password')
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <p className={styles.wordmark}>admin</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="password"
          placeholder="admin password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className={styles.input}
          autoFocus
        />
        <button type="submit" disabled={loading} className={styles.btn}>
          {loading ? '...' : 'enter'}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  )
}
