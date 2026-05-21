type Rule = {
  required: () => Rule;
  max: (n: number) => Rule;
  min: (n: number) => Rule;
};

export const authorSchema = {
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string", validation: (rule: Rule) => rule.required() },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule: Rule) => rule.required(),
    },
    { name: "bio", title: "Bio", type: "text" },
    { name: "credentials", title: "Credentials", type: "string" },
    { name: "expertise", title: "Areas of Expertise", type: "array", of: [{ type: "string" }] },
    {
      name: "social",
      title: "Social Links",
      type: "object",
      fields: [
        { name: "x", title: "X", type: "url" },
        { name: "linkedin", title: "LinkedIn", type: "url" },
        { name: "website", title: "Website", type: "url" },
      ],
    },
    { name: "email", title: "Contact Email", type: "string" },
    { name: "photo", title: "Photo", type: "image", options: { hotspot: true } },
  ],
};

export const postSchema = {
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (rule: Rule) => rule.required() },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule: Rule) => rule.required(),
    },
    { name: "seoTitle", title: "SEO Title", type: "string", validation: (rule: Rule) => rule.max(60) },
    { name: "metaDescription", title: "Meta Description", type: "string", validation: (rule: Rule) => rule.max(160) },
    { name: "featuredImageAlt", title: "Featured Image Alt", type: "string" },
    { name: "tldr", title: "TL;DR", type: "text" },
    { name: "starRating", title: "Star Rating", type: "number", validation: (rule: Rule) => rule.min(0).max(5) },
    {
      name: "faq",
      title: "FAQ",
      type: "array",
      of: [
        {
          name: "faqItem",
          title: "FAQ Item",
          type: "object",
          fields: [
            { name: "question", title: "Question", type: "string" },
            { name: "answer", title: "Answer", type: "text" },
          ],
        },
      ],
    },
    { name: "affiliateDisclosure", title: "Affiliate Disclosure", type: "text" },
    { name: "lastTested", title: "Last Tested", type: "date" },
    { name: "primaryKeyword", title: "Primary Keyword", type: "string" },
    { name: "category", title: "Category", type: "string" },
    { name: "publishedAt", title: "Published At", type: "datetime", validation: (rule: Rule) => rule.required() },
    { name: "author", title: "Author", type: "reference", to: [{ type: "author" }] },
    { name: "isAutoPublished", title: "Auto Published", type: "boolean", initialValue: true },
    {
      name: "body",
      title: "Body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
          ],
          lists: [{ title: "Bullet", value: "bullet" }],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [{ name: "href", title: "URL", type: "url" }],
              },
            ],
          },
        },
      ],
    },
  ],
};
