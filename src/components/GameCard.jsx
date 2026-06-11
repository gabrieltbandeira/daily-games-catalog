import { useState } from 'react'
import { getPlayedToday, setPlayedToday, clearPlayedToday, isFavorite, toggleFavorite } from '../lib/storage'
import './GameCard.css'

function getFaviconUrl(url) {
  try {
    const domain = new URL(url).hostname
    return `https://icons.duckduckgo.com/ip3/${domain}.ico`
  } catch {
    return null
  }
}

function getAvatarColor(id) {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash)
  return `hsl(${Math.abs(hash) % 360}, 60%, 50%)`
}

function GameThumbnail({ game }) {
  const [step, setStep] = useState(0)
  const faviconUrl = getFaviconUrl(game.url)
  const avatarColor = getAvatarColor(game.id)
  const initial = game.name.charAt(0).toUpperCase()

  if (step === 0 && game.logo) {
    return (
      <img
        className="game-card__thumb"
        src={`/logos/${game.logo}`}
        alt={game.name}
        onError={() => setStep(1)}
        loading="lazy"
      />
    )
  }

  if (step <= 1 && faviconUrl) {
    return (
      <img
        className="game-card__thumb"
        src={faviconUrl}
        alt={game.name}
        onError={() => setStep(2)}
        loading="lazy"
      />
    )
  }

  return (
    <div
      className="game-card__avatar"
      style={{ backgroundColor: avatarColor }}
      aria-hidden="true"
    >
      {initial}
    </div>
  )
}

const LANG_LABEL = { 'pt-BR': 'PT', en: 'EN', multi: '🌐' }

export default function GameCard({ game, categories, onStateChange }) {
  const [played, setPlayed] = useState(() => getPlayedToday(game.id))
  const [favorited, setFavorited] = useState(() => isFavorite(game.id))
  const [flipping, setFlipping] = useState(false)
  const category = categories.find(c => c.id === game.category)

  function handlePlayedClick(e) {
    e.preventDefault()
    e.stopPropagation()
    if (played) {
      clearPlayedToday(game.id)
      setPlayed(false)
    } else {
      setPlayedToday(game.id)
      setPlayed(true)
    }
    onStateChange?.()
  }

  function handleFavoriteClick(e) {
    e.preventDefault()
    e.stopPropagation()
    const next = toggleFavorite(game.id)
    setFavorited(next)
    setFlipping(true)
    onStateChange?.()
  }

  return (
    <a
      href={game.url}
      target="_blank"
      rel="noopener noreferrer"
      role="listitem"
      className={`game-card${played ? ' game-card--played' : ''}`}
      aria-label={`Jogar ${game.name} (abre em nova aba)`}
    >
      <div className="game-card__thumb-wrap">
        <GameThumbnail game={game} />

        <div className="game-card__actions">
          <button
            className={`game-card__btn game-card__btn--fav${favorited ? ' is-active' : ''}`}
            onClick={handleFavoriteClick}
            aria-label={favorited ? `Remover ${game.name} dos favoritos` : `Favoritar ${game.name}`}
            aria-pressed={favorited}
            title={favorited ? 'Remover dos favoritos' : 'Favoritar'}
          >
            <span
              className={`fav-icon${flipping ? ' fav-icon--flip' : ''}`}
              onAnimationEnd={() => setFlipping(false)}
              aria-hidden="true"
            >
              {favorited ? '★' : '☆'}
            </span>
          </button>

          <button
            className={`game-card__btn game-card__btn--played${played ? ' is-active' : ''}`}
            onClick={handlePlayedClick}
            aria-label={played ? `Desmarcar ${game.name} como jogado hoje` : `Marcar ${game.name} como jogado hoje`}
            aria-pressed={played}
            title={played ? 'Desmarcar' : 'Joguei hoje'}
          >
            {played ? '✓' : '○'}
          </button>
        </div>
      </div>

      <div className="game-card__body">
        <div className="game-card__header">
          <span className="game-card__name">{game.name}</span>
          <span className="game-card__lang">{LANG_LABEL[game.lang]}</span>
        </div>

        <p className="game-card__desc">{game.description}</p>

        <div className="game-card__tags">
          {game.tags.slice(0, 3).map(tagId => (
            <span
              key={tagId}
              className="game-card__tag"
              style={category ? { '--tag-color': category.color } : {}}
            >
              {tagId.replace(/-/g, ' ')}
            </span>
          ))}
        </div>
      </div>
    </a>
  )
}
