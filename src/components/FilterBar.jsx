import './FilterBar.css'

const LANG_OPTIONS = [
  { id: 'pt-BR', label: 'PT-BR' },
  { id: 'en',    label: 'English' },
  { id: 'multi', label: '🌐 Multi' },
]

export default function FilterBar({ categories, tags, filters, onFiltersChange, resultCount, totalCount }) {
  const { categories: selCats, tags: selTags, lang: selLang } = filters
  const hasFilters = selCats.length > 0 || selTags.length > 0 || selLang.length > 0

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
    <div className="filter-bar">
      <div className="container filter-bar__inner">

        <div className="filter-group">
          <span className="filter-group__label">Categoria</span>
          <div className="filter-chips" role="group" aria-label="Filtrar por categoria">
            {categories.map(cat => {
              const active = selCats.includes(cat.id)
              return (
                <button
                  key={cat.id}
                  className={`chip ${active ? 'chip--active' : ''}`}
                  style={{ '--chip-color': cat.color }}
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
                  className={`chip ${active ? 'chip--active' : ''}`}
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
              Limpar filtros ×
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
