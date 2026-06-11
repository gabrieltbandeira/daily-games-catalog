import { readFileSync } from 'fs'
import { z } from 'zod'

const CategorySchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  emoji: z.string().min(1),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
})

const TagSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
})

const GameSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  url: z.string().url(),
  description: z.string().min(1).max(90),
  lang: z.enum(['pt-BR', 'en', 'multi']),
  category: z.string().min(1),
  tags: z.array(z.string()).min(1).max(3),
  logo: z.string().optional(),
  popular: z.boolean(),
  frequency: z.enum(['daily', 'weekly', 'unlimited']),
})

const RootSchema = z.object({
  categories: z.array(CategorySchema).min(1),
  tags: z.array(TagSchema).min(1),
  games: z.array(GameSchema).min(1),
})

const raw = JSON.parse(readFileSync(new URL('./games.json', import.meta.url), 'utf-8'))
const result = RootSchema.safeParse(raw)

if (!result.success) {
  console.error('games.json validation failed:')
  for (const issue of result.error.issues) {
    console.error(`  [${issue.path.join('.')}] ${issue.message}`)
  }
  process.exit(1)
}

const categoryIds = new Set(result.data.categories.map(c => c.id))
const tagIds = new Set(result.data.tags.map(t => t.id))
let hasError = false

for (const game of result.data.games) {
  if (!categoryIds.has(game.category)) {
    console.error(`  game "${game.id}": unknown category "${game.category}"`)
    hasError = true
  }
  for (const tag of game.tags) {
    if (!tagIds.has(tag)) {
      console.error(`  game "${game.id}": unknown tag "${tag}"`)
      hasError = true
    }
  }
}

if (hasError) process.exit(1)

console.log(`games.json OK — ${result.data.games.length} games, ${result.data.categories.length} categories, ${result.data.tags.length} tags`)
