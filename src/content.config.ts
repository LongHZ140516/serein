import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      image: image().optional(),
      tags: z.array(z.string()).optional(),
      authors: z.array(z.string()).optional(),
      draft: z.boolean().optional(),
    }),
})

const authors = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    pronouns: z.string().optional(),
    avatar: z.string().url().or(z.string().startsWith('/')),
    bio: z.string().optional(),
    mail: z.string().email().optional(),
    website: z.string().url().optional(),
    twitter: z.string().url().optional(),
    github: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    discord: z.string().url().optional(),
  }),
})

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      tags: z.array(z.string()),
      image: image(),
      link: z.string().url(),
      githubRepo: z.string().optional(), // e.g., "LongHZ140516/KokoroMate"
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
    }),
})

// Media collection for books, movies, TV series, anime, music, games
const media = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/media' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      type: z.enum(['book', 'movie', 'tv', 'anime', 'music', 'game']),
      cover: z.string().url().or(image()), // Accept URL or local image
      rating: z.number().min(0).max(10).optional(),
      year: z.number().optional(),
      url: z.string().url().optional(),
      comment: z.string().optional(),
    }),
})

// Publications collection for academic papers
const publications = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/publications' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      venue: z.string(), // e.g., "CVPR 2024", "NeurIPS 2023"
      venueColor: z.string().optional(), // Custom badge color, e.g., "#4285f4"
      authors: z.array(z.string()),
      image: z.string().url().or(image()).optional(), // Accept URL or local image
      paperUrl: z.string().url().optional(),
      githubUrl: z.string().url().optional(),
      projectUrl: z.string().url().optional(),
      date: z.coerce.date(),
      highlight: z.boolean().optional(), // Whether to highlight this paper
    }),
})
// Profile collection for About page configuration
const profile = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/profile' }),
  schema: z.object({
    name: z.string(),
    avatar: z.string(),
    bio: z.string(),
    tags: z.array(z.string()).optional(),
    socials: z.array(z.object({
      href: z.string().url(),
      label: z.string(),
      icon: z.string(),
    })).optional(),
    timeline: z.array(z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      dateRange: z.string(),
      logo: z.string().optional(),
      description: z.string().optional(),
    })).optional(),
    news: z.array(z.object({
      date: z.string(),
      content: z.string(),
    })).optional(),
  }),
})

export const collections = { blog, authors, projects, media, publications, profile }
