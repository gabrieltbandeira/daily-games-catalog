const KEY = 'diarios_state'

function today() {
  return new Date().toISOString().slice(0, 10) // "YYYY-MM-DD"
}

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? { playedAt: {}, favorites: [] }
  } catch {
    return { playedAt: {}, favorites: [] }
  }
}

function save(state) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function getPlayedToday(gameId) {
  return load().playedAt[gameId] === today()
}

export function setPlayedToday(gameId) {
  const state = load()
  state.playedAt[gameId] = today()
  save(state)
}

export function clearPlayedToday(gameId) {
  const state = load()
  delete state.playedAt[gameId]
  save(state)
}

export function isFavorite(gameId) {
  return load().favorites.includes(gameId)
}

export function toggleFavorite(gameId) {
  const state = load()
  const idx = state.favorites.indexOf(gameId)
  if (idx === -1) state.favorites.push(gameId)
  else state.favorites.splice(idx, 1)
  save(state)
  return idx === -1
}

export function getAllPlayed() {
  const { playedAt } = load()
  const t = today()
  return Object.keys(playedAt).filter(id => playedAt[id] === t)
}

export function getAllFavorites() {
  return load().favorites
}
