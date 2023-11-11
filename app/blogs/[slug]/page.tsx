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

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string }
}) => {
  const { title, spoiler } = await getPost({ slug: params.slug })
  return { title, description: spoiler }
}

export default async function BlogPage({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const { title, spoiler, content, date } = await getPost({ slug })

  return (
    <article>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-2 text-md text-gray-400 ">
        Published:{' '}
        {new Date(date).toLocaleDateString('en', {
          dateStyle: 'full',
        })}
      </p>
      <section className="prose mt-10">
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
    </article>
  )
}
