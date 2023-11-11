//libs
import NextLink from 'next/link'

//components
import { Link } from '~/app/ui/components/Link'

export const Navbar = () => {
  return (
    <div className="flex justify-between items-center py-6 mx-auto max-w-2xl">
      <NextLink href="/">
        <span className="text-xl font-bold hover:text-blue-400 hover:underline">
          Mihir Shah
        </span>
      </NextLink>
      <div className="flex gap-4">
        <NextLink href="/blogs">
          <span className="hover:text-blue-400 hover:underline">Blogs</span>
        </NextLink>
        <Link href="https://twitter.com/__mihirs15__">Twitter</Link>
        <Link href="https://github.com/MihirGH">Github</Link>
      </div>
    </div>
  )
}
