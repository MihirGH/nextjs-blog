type BlogPost = {
  slug: string;
  title: string;
  spoiler: string;
  date: string;
};

type BlogPostWithContent = BlogPost & { content: string };
