type BlogPost = {
  slug: string;
  title: string;
  spoiler: string;
  date: string;
  tags: string[];
};

type BlogPostWithContent = BlogPost & { content: string };
