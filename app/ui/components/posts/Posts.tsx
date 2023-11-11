//libs
import NextLink from 'next/link'

export const Posts = ({ posts }: { posts: BlogPost[] }) => {
  return (
    <ul className="mt-4 flex flex-col gap-4">
      {posts.map((post) => (
        <li
          key={post.slug}
          className="flex flex-col gap-1 transform transition hover:scale-[1.005]"
        >
          <NextLink href={`/blogs/${post.slug}`} className="group">
            <p className="text-xl font-semibold group-hover:text-blue-400 group-hover:underline">
              {post.title}
            </p>
            <p className="font-light">{post.spoiler}</p>
            <p className="font-light text-gray-400">
              {new Intl.DateTimeFormat('en-GB', {
                dateStyle: 'full',
              }).format(Date.parse(post.date))}
            </p>
          </NextLink>
        </li>
      ))}
    </ul>
  )
}
