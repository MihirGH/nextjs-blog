//libs
import Image from 'next/image'
import NextLink from 'next/link'

//resources
import { getPosts } from '~/app/lib/blogs'

//components
import { Link } from './ui/components/Link'
import { Posts } from './ui/components/posts'

export default async function Home() {
  const posts = await getPosts();
  
  return (
    <div className="flex flex-col">
      <section>
        <p className="text-3xl font-semibold">Hi, I&apos;m Mihir</p>
        <section className="flex flex-col mt-4 text-xl gap-1">
          <p>I am a Software Engineer with expertise in Frontend</p>
          <p>
            I mostly tinker around with TypeScript, NextJS, React and GraphQL.
          </p>
          <p>I like watching Anime and listening to music.</p>
          <p className="text-sm text-gray-500">
            You can find my music logs{' '}
            <Link
              href="https://twitter.com/MihirsMusicLog"
              className="text-blue-400"
            >
              here
            </Link>{' '}
            and here&apos;s the{' '}
            <Link
              href="https://myanimelist.net/profile/MihirGH"
              className="text-blue-400"
            >
              link
            </Link>{' '}
            to my MAL profile
          </p>
        </section>
      </section>
      <section className="mt-10 flex flex-col">
        <p className="text-3xl font-bold">Blogs</p>
        <Posts posts={posts} />
      </section>
    </div>
  )
}
