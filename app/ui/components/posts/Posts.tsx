//libs
import NextLink from 'next/link'

export const Posts = ({ posts }: { posts: BlogPost[] }) => {
  return (
    <ul className="mt-4 flex flex-col gap-4">
      {posts.map((post, index) => (
        <li
          key={post.slug}
        >
          <NextLink
            href={`/blogs/${post.slug}`}
            className="group block border-b border-border py-8 first:pt-0 last:border-b-0 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-sm text-muted-foreground">
                {new Intl.DateTimeFormat('en-GB', {
                  dateStyle: 'medium',
                }).format(Date.parse(post.date))}
              </span>
              <span className="text-muted-foreground/30">·</span>
              <div className="flex gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="font-mono text-xs bg-tag text-tag-foreground px-2 py-0.5 rounded-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
              {post.title}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {post.spoiler}
            </p>
          </NextLink>
        </li>
      ))}
    </ul>
  )
}
