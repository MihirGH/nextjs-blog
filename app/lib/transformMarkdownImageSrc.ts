//libs
import { visit, BuildVisitor } from 'unist-util-visit'

export function transformImgSrc({ slug }: { slug: string }) {
  return (tree: any, file: any) => {
    visit(tree, 'paragraph', ((node) => {
      // @ts-ignore
      const image = node.children.find((child) => child.type === 'image')

      if (image) {
        const fileName = image.url.replace('./', '')
        image.url = `/blogs/${slug}/${fileName}`
      }
    }) as BuildVisitor)
  }
}
