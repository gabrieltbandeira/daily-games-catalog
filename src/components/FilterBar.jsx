import { useEffect, useRef, useState } from 'react'
import './FilterBar.css'

const LANG_OPTIONS = [
  { id: 'pt-BR', label: 'PT-BR' },
  { id: 'en',    label: 'English' },
  { id: 'multi', label: '🌐 Multi' },
]

export default function FilterBar({ categories, tags, filters, onFiltersChange, resultCount, totalCount, viewMode, onViewModeChange }) {
  const { categories: selCats, tags: selTags, lang: selLang } = filters
  const hasFilters = selCats.length > 0 || selTags.length > 0 || selLang.length > 0
  const sentinelRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  function toggle(key, value) {
    const current = filters[key]
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    onFiltersChange({ ...filters, [key]: next })
  }

  function clear() {
    onFiltersChange({ categories: [], tags: [], lang: [], search: filters.search })
  }

  return (
    <>
      <div ref={sentinelRef} className="filter-bar__sentinel" aria-hidden="true" />
      <div className={`filter-bar${scrolled ? ' filter-bar--scrolled' : ''}`}>
      <div className="container filter-bar__inner">

        <div className="filter-group">
          <span className="filter-group__label">Categoria</span>
          <div className="filter-chips" role="group" aria-label="Filtrar por categoria">
            {categories.map(cat => {
              const active = selCats.includes(cat.id)
              return (
                <button
                  key={cat.id}
                  className={`chip${active ? ' chip--active' : ''}`}
                  onClick={() => toggle('categories', cat.id)}
                  aria-pressed={active}
                >
                  <span aria-hidden="true">{cat.emoji}</span> {cat.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-group__label">Idioma</span>
          <div className="filter-chips" role="group" aria-label="Filtrar por idioma">
            {LANG_OPTIONS.map(opt => {
              const active = selLang.includes(opt.id)
              return (
                <button
                  key={opt.id}
                  className={`chip${active ? ' chip--active' : ''}`}
                  onClick={() => toggle('lang', opt.id)}
                  aria-pressed={active}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="filter-bar__footer">
          <span className="filter-bar__count">
            {resultCount === totalCount
              ? `${totalCount} jogos`
              : `${resultCount} de ${totalCount} jogos`}
          </span>
          {hasFilters && (
            <button className="chip chip--clear" onClick={clear}>
              Limpar ×
            </button>
          )}
          <div className="view-toggle" role="group" aria-label="Modo de visualização">
            <button
              className={`view-toggle__btn${viewMode === 'grid' ? ' is-active' : ''}`}
              onClick={() => onViewModeChange('grid')}
              aria-pressed={viewMode === 'grid'}
              title="Grade"
            >
              <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="1" width="6" height="6" rx="1"/>
                <rect x="9" y="1" width="6" height="6" rx="1"/>
                <rect x="1" y="9" width="6" height="6" rx="1"/>
                <rect x="9" y="9" width="6" height="6" rx="1"/>
              </svg>
            </button>
            <button
              className={`view-toggle__btn${viewMode === 'list' ? ' is-active' : ''}`}
              onClick={() => onViewModeChange('list')}
              aria-pressed={viewMode === 'list'}
              title="Lista"
            >
              <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="2" width="14" height="2" rx="1"/>
                <rect x="1" y="7" width="14" height="2" rx="1"/>
                <rect x="1" y="12" width="14" height="2" rx="1"/>
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
    </>
  )
}
