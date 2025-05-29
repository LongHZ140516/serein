import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'serein',
  description:
    'serein',
  href: 'https://astro-erudite.vercel.app',
  author: 'serein',
  locale: 'en-US',
  featuredPostCount: 2,
  postsPerPage: 3,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/blog',
    label: 'blog',
  },
  {
    href: '/authors',
    label: 'authors',
  },
  {
    href: '/uses',
    label: 'uses',
  },
  // {
  //   href: '/about',
  //   label: 'about',
  // },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/LongHZ140516',
    label: 'GitHub',
  },
  {
    href: 'https://x.com/HSerein15170',
    label: 'Twitter',
  },
  {
    href: 'mailto:huangzlong5@mail2.sysu.edu.cn',
    label: 'Email',
  },
  {
    href: '/rss.xml',
    label: 'RSS',
  },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  Twitter: 'lucide:twitter',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
}
