export function filterGames(games, { categories = [], tags = [], lang = [], search = '' }) {
  const query = search.trim().toLowerCase()

  return games.filter(game => {
    if (categories.length > 0 && !categories.includes(game.category)) return false
    if (tags.length > 0 && !tags.some(t => game.tags.includes(t))) return false
    if (lang.length > 0 && !lang.includes(game.lang)) return false

    if (query) {
      const haystack = [game.name, game.description, ...game.tags].join(' ').toLowerCase()
      if (!haystack.includes(query)) return false
    }

    return true
  })
}

export function sortGames(games) {
  return [...games].sort((a, b) => {
    if (a.popular !== b.popular) return a.popular ? -1 : 1
    return a.name.localeCompare(b.name, 'pt-BR')
  })
}
