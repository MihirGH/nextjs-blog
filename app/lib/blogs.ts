//libs
import { readdir, readFile } from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'public', 'blogs')

export async function getAllPostSlugs() {
  const dirContents = await readdir(postsDirectory, { withFileTypes: true })
  const postDirectories = dirContents
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)

  return postDirectories.map((name) => {
    return {
      slug: name,
    }
  })
}

export async function getPost({
  slug,
}: {
  slug: string
}): Promise<BlogPostWithContent> {
  const filePath = path.join(postsDirectory, slug, 'index.md')
  const fileContents = await readFile(filePath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const { content, data } = matter(fileContents)

  // Combine the data with the id and contentHtml
  return {
    slug,
    content,
    title: data.title,
    spoiler: data.spoiler,
    date: data.date,
  }
}

export async function getPosts() {
  const postSlugs = (await getAllPostSlugs()).map(({ slug }) => slug)

  const fileContents = await Promise.all(
    postSlugs.map((slug) =>
      readFile(path.join(postsDirectory, slug, 'index.md'), 'utf8')
    )
  )

  const posts: BlogPost[] = postSlugs.map((slug, i) => {
    const fileContent = fileContents[i]

    const { data } = matter(fileContent)

    return { slug, title: data.title, spoiler: data.spoiler, date: data.date }
  })

  posts.sort((a, b) => {
    return Date.parse(a.date) < Date.parse(b.date) ? 1 : -1
  })

  return posts
}
