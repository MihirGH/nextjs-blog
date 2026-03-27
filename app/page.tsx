//resources
import { getPosts } from '~/app/lib/blogs'

//components
import { Posts } from './ui/components/posts'

export default async function Home() {
  const posts = await getPosts()

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold tracking-tight mb-3">
        Hey, I&apos;m Mihir<span className="text-muted-foreground">.</span>
      </h1>
      <p className="text-muted-foreground leading-relaxed max-w-xl">
        Software Engineer focused on Frontend. I tinker with TypeScript,
        Next.js, React & GraphQL. When I&apos;m not coding, I&apos;m watching
        anime or listening to music.
      </p>

      <section className="mt-16">
        <h2 className="font-mono text-sm text-muted-foreground uppercase tracking-widest mb-8">
          Blogs
        </h2>
        <Posts posts={posts} />
      </section>
    </div>
  )
}
