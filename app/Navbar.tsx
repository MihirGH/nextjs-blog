//libs
import NextLink from 'next/link'
import { Github, Twitter, Music, Tv } from 'lucide-react'

//components
import { Link } from '~/app/ui/components/Link'

export const Navbar = () => {
  return (
    <nav className="border-b border-border py-5">
      <div className="container mx-auto flex items-center justify-between px-6 max-w-3xl">
        <NextLink
          href="/"
          className="font-mono text-lg font-semibold text-foreground tracking-tight hover:text-primary transition-colors"
        >
          mihir.
        </NextLink>
        <div className="flex items-center gap-5">
          <NextLink
            href="/blogs"
            className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            blogs
          </NextLink>
          <Link href="https://x.com/MihirsMusicLog" ariaLabel="Music Log">
            <Music size={18} />
          </Link>
          <Link
            href="https://myanimelist.net/profile/MihirGH"
            ariaLabel="MyAnimeList"
          >
            <Tv size={18} />
          </Link>
          <Link href="https://github.com/MihirGH" ariaLabel="GitHub">
            <Github size={18} />
          </Link>
          <Link href="https://x.com/__mihirs15__" ariaLabel="Twitter">
            <Twitter size={18} />
          </Link>
        </div>
      </div>
    </nav>
  )
}
