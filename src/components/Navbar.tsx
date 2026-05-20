'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Navbar.module.css'

export default function Navbar({ showcaseSlugs }: { showcaseSlugs: string[] }) {
  const pathname = usePathname()

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.wordmark}>captionato</Link>
      <div className={styles.links}>
        <Link href="/" className={pathname === '/' ? styles.active : ''}>gallery</Link>
        {showcaseSlugs.map(slug => (
          <Link
            key={slug}
            href={`/showcase/${slug}`}
            className={pathname === `/showcase/${slug}` ? styles.active : ''}
          >
            {slug.replace(/-/g, ' ')}
          </Link>
        ))}
      </div>
    </nav>
  )
}
