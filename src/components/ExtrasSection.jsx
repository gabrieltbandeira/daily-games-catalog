import './ExtrasSection.css'

const EXTRAS = [
  {
    group: 'Jogue com amigos',
    items: [
      {
        id: 'bga',
        name: 'Board Game Arena',
        url: 'https://boardgamearena.com',
        description: 'Centenas de jogos de tabuleiro online, grátis no browser.',
        icon: '🎲',
      },
    ],
  },
  {
    group: 'Ofertas de jogos',
    items: [
      {
        id: 'ggdeals',
        name: 'GG.deals',
        url: 'https://gg.deals',
        description: 'Comparador de preços para jogos PC e consoles.',
        icon: '💰',
      },
      {
        id: 'isthereanydeal',
        name: 'IsThereAnyDeal',
        url: 'https://isthereanydeal.com',
        description: 'Alertas de promoções e histórico de preços.',
        icon: '🔔',
      },
      {
        id: 'steamdb',
        name: 'SteamDB Sales',
        url: 'https://steamdb.info/sales/',
        description: 'Todas as promoções ativas na Steam agora.',
        icon: '🛒',
      },
      {
        id: 'comparajogos',
        name: 'ComparaJogos',
        url: 'https://www.comparajogos.com.br',
        description: 'Comparador de preços de jogos no Brasil.',
        icon: '♟️',
      },
      {
        id: 'dekudeals',
        name: 'DekuDeals',
        url: 'https://www.dekudeals.com',
        description: 'Histórico e alertas de promoções na Nintendo eShop.',
        icon: '🎮',
      },
    ],
  },
]

export default function ExtrasSection() {
  return (
    <section className="extras" aria-label="Extras">
      <div className="container">
        <h2 className="extras__title">Extras</h2>
        <div className="extras__groups">
          {EXTRAS.map(group => (
            <div key={group.group} className="extras__group">
              <h3 className="extras__group-label">{group.group}</h3>
              <div className="extras__cards">
                {group.items.map(item => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="extras__card"
                    aria-label={`${item.name} (abre em nova aba)`}
                  >
                    <span className="extras__card-icon" aria-hidden="true">{item.icon}</span>
                    <div className="extras__card-body">
                      <span className="extras__card-name">{item.name}</span>
                      <span className="extras__card-desc">{item.description}</span>
                    </div>
                    <span className="extras__card-arrow" aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
