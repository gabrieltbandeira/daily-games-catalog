import './Header.css'

export default function Header({ search, onSearchChange }) {
  return (
    <header className="header">
      <div className="container header__inner">
        <div className="header__brand">
          <h1 className="header__title">
            <span className="header__tile header__tile--green">D</span>
            <span className="header__tile header__tile--yellow">i</span>
            <span className="header__tile">á</span>
            <span className="header__tile header__tile--green">r</span>
            <span className="header__tile">i</span>
            <span className="header__tile header__tile--yellow">o</span>
            <span className="header__tile">s</span>
          </h1>
          <p className="header__tagline">Todos os jogos diários em um só lugar</p>
        </div>

        <div className="header__search-wrap">
          <label htmlFor="search-input" className="visually-hidden">Buscar jogos</label>
          <div className="header__search">
            <svg className="header__search-icon" aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8.5" cy="8.5" r="5.5" />
              <line x1="13" y1="13" x2="18" y2="18" strokeLinecap="round" />
            </svg>
            <input
              id="search-input"
              type="search"
              className="header__search-input"
              placeholder="Buscar jogos..."
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              autoComplete="off"
            />
            {search && (
              <button
                className="header__search-clear"
                onClick={() => onSearchChange('')}
                aria-label="Limpar busca"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
