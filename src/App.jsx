import gamesData from './data/games.json'
import Header from './components/Header'
import GameCard from './components/GameCard'
import './styles/global.css'
import './App.css'

export default function App() {
  const { games, categories } = gamesData

  return (
    <div className="app">
      <Header />

      <main className="main">
        <div className="container">
          <section aria-label="Jogos diários">
            <div className="section-header">
              <h2 className="section-title">Jogos do dia</h2>
              <span className="section-count">{games.length} jogos</span>
            </div>

            <div className="games-grid">
              {games.map(game => (
                <GameCard key={game.id} game={game} categories={categories} />
              ))}
            </div>
          </section>
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
