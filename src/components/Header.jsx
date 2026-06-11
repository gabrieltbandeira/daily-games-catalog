import './Header.css'

export default function Header() {
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
      </div>
    </header>
  )
}
