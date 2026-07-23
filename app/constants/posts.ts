import type { PostDto } from '~/types/post'

/* Raw feed data as the forum-api would return it (snake_case wire shape).
   Content mirrors the design system feed (../forum-design-system TS_FEED).
   usePosts maps this into the `Post` view type. */
export const postExample: PostDto[] = [
  {
    id: '1',
    content:
      'We just closed our first soil-carbon pilot with three regenerative farms in Oregon. Early measurements point to a 12% improvement in retention over the control plots. Not raising yet — just sharing the numbers as they come in.',
    image_url: null,
    created_at: '2026-07-22T06:00:00Z',
    updated_at: null,
    reaction_counts: 73,
    reactions: {
      back: 30,
      watch: 15,
      signal: 12,
      celebrate: 10,
      insight: 6,
    },
    comments_count: 14,
    shares_count: 6,
    author: {
      id: 'a1',
      name: 'Lena Ostrander',
      accountType: 'startup',
      stage: 'pre_seed',
      headline: 'Founder · Cardamom',
      avatar: null,
    },
  },
  {
    id: '2',
    content:
      'I left a type foundry after six years to build Halen Type — a typeface manager for small studios. Private beta opens in July. If you run a studio and want in, follow along here.',
    image_url: null,
    created_at: '2026-07-21T08:00:00Z',
    updated_at: null,
    reaction_counts: 34,
    reactions: {
      back: 12,
      watch: 8,
      signal: 6,
      celebrate: 5,
      insight: 3,
    },
    comments_count: 8,
    shares_count: 3,
    author: {
      id: 'a2',
      name: 'Renzo Vance',
      accountType: 'startup',
      stage: 'seed',
      headline: 'Founder · Halen Type',
      avatar: null,
    },
  },
  {
    id: '3',
    content:
      'We\'re reading in climate hardware this quarter. North Bench writes first checks between $50k and $200k and prefers technical founders. Open to introductions through the platform.',
    image_url: null,
    created_at: '2026-07-20T08:00:00Z',
    updated_at: null,
    reaction_counts: 101,
    reactions: {
      back: 40,
      watch: 25,
      signal: 18,
      celebrate: 12,
      insight: 6,
    },
    comments_count: 22,
    shares_count: 18,
    author: {
      id: 'a3',
      name: 'North Bench Capital',
      accountType: 'investor',
      headline: 'Angel syndicate · Climate',
      avatar: null,
    },
  },
  {
    id: '4',
    content:
      'Second progress note: our diagnostic panel now runs in under nine minutes, down from fourteen. Two clinical advisors joined the company this month. Slow and steady.',
    image_url: null,
    created_at: '2026-07-19T08:00:00Z',
    updated_at: null,
    reaction_counts: 53,
    reactions: {
      back: 20,
      watch: 12,
      signal: 10,
      celebrate: 7,
      insight: 4,
    },
    comments_count: 11,
    shares_count: 4,
    author: {
      id: 'a4',
      name: 'Priya Adeyemi',
      accountType: 'startup',
      stage: 'series_a',
      headline: 'Founder · Marrow',
      avatar: null,
    },
  },
]
