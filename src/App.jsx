import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import gamesData from './data/games.json'
import Header from './components/Header'
import FilterBar from './components/FilterBar'
import GameCard from './components/GameCard'
import { filterGames, sortGames } from './lib/filters'
import { readFiltersFromURL, writeFiltersToURL } from './lib/urlState'
import './styles/global.css'
import './App.css'

const { games: ALL_GAMES, categories, tags } = gamesData
const SORTED_GAMES = sortGames(ALL_GAMES)

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

export default function App() {
  const [filters, setFilters] = useState(() => readFiltersFromURL())
  const searchRef = useRef(filters.search)
  const debouncedSearch = useDebounce(filters.search, 300)

  const activeFilters = useMemo(() => ({
    ...filters,
    search: debouncedSearch,
  }), [filters, debouncedSearch])

  useEffect(() => {
    writeFiltersToURL(activeFilters)
  }, [activeFilters])

  const filteredGames = useMemo(
    () => filterGames(SORTED_GAMES, activeFilters),
    [activeFilters]
  )

  const handleFiltersChange = useCallback((next) => {
    setFilters(next)
  }, [])

  const handleSearchChange = useCallback((value) => {
    setFilters(prev => ({ ...prev, search: value }))
  }, [])

  return (
    <div className="app">
      <Header search={filters.search} onSearchChange={handleSearchChange} />

      <FilterBar
        categories={categories}
        tags={tags}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        resultCount={filteredGames.length}
        totalCount={ALL_GAMES.length}
      />

      <main className="main">
        <div className="container">
          {filteredGames.length > 0 ? (
            <section aria-label="Jogos diários">
              <div className="games-grid">
                {filteredGames.map(game => (
                  <GameCard key={game.id} game={game} categories={categories} />
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

      <footer className="footer">
        <div className="container">
          <p>Diários — nenhum jogo hospedado aqui, apenas links para os originais.</p>
        </div>
      </footer>
    </div>
  )
}
