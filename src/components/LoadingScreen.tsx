'use client'
import { useEffect, useState } from 'react'
import styles from './LoadingScreen.module.css'
import LoadingScreen from '@/components/LoadingScreen'

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + (100 / 70), 100))
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.wrap}>
      <p className={styles.wordmark}>captionato</p>
      <div className={styles.bar}>
        <div className={styles.fill} style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}