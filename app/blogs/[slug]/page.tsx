//libs
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkSmartpants from 'remark-smartypants'
import rehypePrettyCode from 'rehype-pretty-code'

//plugins
import { transformImgSrc } from '~/app/lib/transformMarkdownImageSrc'

//resources
import { getPost, getAllPostSlugs } from '~/app/lib/blogs'

export const generateStaticParams = async () => {
  return getAllPostSlugs()
}

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>
}) => {
  const { slug } = await props.params
  const { title, spoiler } = await getPost({ slug })
  return { title, description: spoiler }
}

export default async function BlogPage(props: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await props.params
  const { title, content, date, tags } = await getPost({ slug })

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

      <div className="flex items-center gap-3 mt-4">
        <span className="font-mono text-sm text-muted-foreground">
          {' '}
          {new Intl.DateTimeFormat('en-GB', {
            dateStyle: 'medium',
          }).format(Date.parse(date))}
        </span>
        <span className="text-muted-foreground/30">·</span>
        <div className="flex gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-xs bg-tag text-tag-foreground px-2 py-0.5 rounded-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <section className="prose prose-invert mt-8">
        <MDXRemote
          source={content}
          options={{
            mdxOptions: {
              remarkPlugins: [[transformImgSrc, { slug }], remarkSmartpants],
              rehypePlugins: [[rehypePrettyCode]],
            },
          }}
        />
      </section>
    </>
  )
}
