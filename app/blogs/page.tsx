//resources
import { getPosts } from '../lib/blogs'

//components
import { Posts } from '../ui/components/posts'

export default async function BlogsPage() {
  const posts = await getPosts()
  return <Posts posts={posts} />
}
