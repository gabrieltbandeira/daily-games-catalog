import { useState, useMemo, useEffect, useCallback } from 'react'
import gamesData from './data/games.json'
import Header from './components/Header'
import FilterBar from './components/FilterBar'
import GameCard from './components/GameCard'
import { filterGames } from './lib/filters'
import { readFiltersFromURL, writeFiltersToURL } from './lib/urlState'
import { getAllFavorites, getAllPlayed } from './lib/storage'
import ExtrasSection from './components/ExtrasSection'
import './styles/global.css'
import './App.css'

const { games: ALL_GAMES, categories, tags } = gamesData

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

function sortWithState(games, favorites, played) {
  const favSet = new Set(favorites)
  const playedSet = new Set(played)
  return [...games].sort((a, b) => {
    const aPlayed = playedSet.has(a.id)
    const bPlayed = playedSet.has(b.id)
    if (aPlayed !== bPlayed) return aPlayed ? 1 : -1

    const aFav = favSet.has(a.id)
    const bFav = favSet.has(b.id)
    if (aFav !== bFav) return aFav ? -1 : 1

    if (a.popular !== b.popular) return a.popular ? -1 : 1

    return a.name.localeCompare(b.name, 'pt-BR')
  })
}

export default function App() {
  const [filters, setFilters] = useState(() => readFiltersFromURL())
  const [cardState, setCardState] = useState(0)
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('viewMode') ?? 'grid')
  const debouncedSearch = useDebounce(filters.search, 300)

  const activeFilters = useMemo(() => ({
    ...filters,
    search: debouncedSearch,
  }), [filters, debouncedSearch])

  useEffect(() => {
    writeFiltersToURL(activeFilters)
  }, [activeFilters])

  useEffect(() => {
    localStorage.setItem('viewMode', viewMode)
  }, [viewMode])

  const favorites = useMemo(() => getAllFavorites(), [cardState])
  const played = useMemo(() => getAllPlayed(), [cardState])

  const filteredGames = useMemo(
    () => filterGames(ALL_GAMES, activeFilters),
    [activeFilters]
  )

  const sortedGames = useMemo(
    () => sortWithState(filteredGames, favorites, played),
    [filteredGames, favorites, played]
  )

  const favoriteGames = useMemo(
    () => ALL_GAMES.filter(g => favorites.includes(g.id)),
    [favorites]
  )

  const handleFiltersChange = useCallback((next) => setFilters(next), [])
  const handleSearchChange = useCallback((value) => setFilters(prev => ({ ...prev, search: value })), [])
  const handleCardStateChange = useCallback(() => setCardState(n => n + 1), [])
  const handleViewModeChange = useCallback((mode) => setViewMode(mode), [])

  const noFiltersActive = activeFilters.categories.length === 0 &&
    activeFilters.tags.length === 0 &&
    activeFilters.lang.length === 0 &&
    !activeFilters.search

  const gridClass = `games-grid${viewMode === 'list' ? ' games-grid--list' : ''}`

  return (
    <div className="app">
      <a href="#main-content" className="skip-link">Pular para o conteúdo</a>
      <Header search={filters.search} onSearchChange={handleSearchChange} />

      <FilterBar
        categories={categories}
        tags={tags}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        resultCount={filteredGames.length}
        totalCount={ALL_GAMES.length}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />

      <main className="main" id="main-content">
        <div className="container">

          {noFiltersActive && favoriteGames.length > 0 && (
            <section className="section" aria-label="Seus favoritos">
              <div className="section-sep">
                <span className="section-sep__label">★ Seus Favoritos</span>
                <span className="section-sep__count">{favoriteGames.length}</span>
              </div>
              <div className={gridClass} role="list">
                {favoriteGames.map(game => (
                  <GameCard
                    key={game.id}
                    game={game}
                    categories={categories}
                    onStateChange={handleCardStateChange}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            </section>
          )}

          {sortedGames.length > 0 ? (
            <section className="section" aria-label="Jogos diários">
              {(noFiltersActive && favoriteGames.length > 0) && (
                <div className="section-sep">
                  <span className="section-sep__label">Todos os jogos</span>
                  <span className="section-sep__count">{sortedGames.length}</span>
                </div>
              )}
              <div className={gridClass} role="list">
                {sortedGames.map(game => (
                  <GameCard
                    key={game.id}
                    game={game}
                    categories={categories}
                    onStateChange={handleCardStateChange}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            </section>
          ) : (
            <div className="empty-state">
              <p className="empty-state__title">Nenhum jogo encontrado</p>
              <p className="empty-state__sub">Tente ajustar os filtros ou a busca.</p>
            </div>
          )}

        </div>
      </main>

      <ExtrasSection />

      <footer className="footer">
        <div className="container">
          <p className="footer__copy">© 2026 Gabriel Bandeira</p>
          <p className="footer__disclaimer">Os jogos e marcas pertencem aos seus respectivos criadores · Nenhum jogo é hospedado aqui</p>
        </div>
      </footer>
    </div>
  )
}
