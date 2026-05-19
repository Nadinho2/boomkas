import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://boomkas.com'

  const staticRoutes = [
    '',
    '/tools',
    '/blog',
    '/compare',
    '/alternatives',
    '/guides',
    '/use-cases',
    '/about',
  ]

  // Placeholder async functions for fetching slugs from the database
  const getToolSlugs = async () => ['example-tool']
  const getBlogSlugs = async () => ['example-blog-post']
  const getCompareSlugs = async () => ['tool-a-vs-tool-b']
  const getAlternativeSlugs = async () => ['tool-a-alternatives']
  const getGuideSlugs = async () => ['example-guide']
  const getUseCaseSlugs = async () => ['example-use-case']

  const [toolSlugs, blogSlugs, compareSlugs, alternativeSlugs, guideSlugs, useCaseSlugs] = await Promise.all([
    getToolSlugs(),
    getBlogSlugs(),
    getCompareSlugs(),
    getAlternativeSlugs(),
    getGuideSlugs(),
    getUseCaseSlugs(),
  ])

  const dynamicRoutes = [
    ...toolSlugs.map(slug => `/tools/${slug}`),
    ...blogSlugs.map(slug => `/blog/${slug}`),
    ...compareSlugs.map(slug => `/compare/${slug}`),
    ...alternativeSlugs.map(slug => `/alternatives/${slug}`),
    ...guideSlugs.map(slug => `/guides/${slug}`),
    ...useCaseSlugs.map(slug => `/use-cases/${slug}`),
  ]

  const allRoutes = [...staticRoutes, ...dynamicRoutes]

  const sitemapEntries: MetadataRoute.Sitemap = allRoutes.map((route) => {
    let priority = 0.8
    let changeFrequency: 'daily' | 'weekly' | 'always' | 'hourly' | 'monthly' | 'yearly' | 'never' = 'weekly'

    if (route === '') {
      priority = 1.0
      changeFrequency = 'daily'
    } else if (route.startsWith('/compare')) {
      priority = 0.9
    }

    const url = `${baseUrl}${route}`

    return {
      url,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: {
        languages: {
          'en-US': url,
          'en-GB': url,
          'en-CA': url,
          'en-AU': url,
          'en-IN': url,
          'en-SG': url,
        },
      },
    }
  })

  return sitemapEntries
}
