# SPEC — "Diários" · Agregador de Jogos Diários

> Documento de especificação para desenvolvimento via Claude Code.
> Idioma da interface: **Português (Brasil)**. Conteúdo pode incluir jogos em inglês.
> Ambiente de deploy: **homelab pessoal (Docker)**.

---

## 1. Visão Geral

Uma página web simples, bonita e rápida que consolida links de **jogos diários** (estilo Wordle/Termo: um desafio novo por dia, igual para todo mundo, jogável no navegador, sem login). Cada jogo aparece como um **card com thumbnail** (logo/favicon do site), nome, descrição curta e de **1 a 3 tags**. Um sistema de **filtros por categoria/tag** permite encontrar rapidamente o que jogar (ex.: filtrar "Geografia" + "Mapa").

O produto é, essencialmente, uma "homepage matinal": abrir, ver o que ainda não jogou hoje, clicar e jogar.

### Objetivos
- Consolidar links de jogos diários em uma única página, organizada e filtrável.
- UI limpa, bonita, interativa e **totalmente responsiva** (mobile-first — muita gente joga no celular).
- **Leve**: precisa rodar tranquilamente em um homelab (container Docker pequeno, baixo consumo).
- **Sem login** para nenhuma funcionalidade.
- Seção "Extras" com links permanentes (Board Game Arena, agregadores de ofertas Steam/lojas).

### Não-objetivos
- Não hospedar os jogos em si — apenas links externos (abrir em nova aba).
- Não rastrear usuários, sem analytics invasivo, sem contas.
- Não fazer scraping de conteúdo dos jogos (apenas favicons/logos como thumbnail).

---

## 2. Stack Técnica (recomendada)

**Princípio: o mais simples que entregue a experiência.**

- **Frontend**: SPA estática com **Vite + React** (ou Svelte, a critério do dev) **OU** Astro com ilha interativa. Sem framework de UI pesado; CSS próprio (CSS vars + utilitários leves) ou Tailwind.
- **Dados dos jogos**: arquivo estático `games.json` versionado no repositório (fonte da verdade). Preferir servir o JSON cru e ler em runtime, para permitir editar o catálogo sem rebuild.
- **Backend (opcional, Fase 2)**: micro-API em **Node (Hono/Fastify) ou Go** com **SQLite** ou arquivo JSON em disco, apenas para o recurso de "presets de filtros compartilhados" (§5.4). Sem backend, o app deve funcionar 100%.
- **Deploy**: imagem Docker com **nginx** (ou Caddy) servindo os estáticos. `docker-compose.yml` incluso, pensado para homelab (porta configurável, healthcheck, restart unless-stopped). Tamanho alvo da imagem: < 50 MB.
- **Performance alvo**: Lighthouse ≥ 95 em Performance/Acessibilidade; carga inicial < 200 KB de JS gzipado.

### Thumbnails
- Estratégia padrão: favicon do domínio via serviço público, ex.:
  - `https://www.google.com/s2/favicons?domain={dominio}&sz=128`
  - fallback: `https://icons.duckduckgo.com/ip3/{dominio}.ico`
- Fallback final: avatar gerado com a inicial do jogo sobre uma cor derivada do nome (hash → hue), para nunca exibir imagem quebrada.
- Campo opcional `logo` no JSON para sobrescrever com imagem local (`/public/logos/...`) quando o favicon for ruim.
- Lazy-loading (`loading="lazy"`) em todas as imagens.

---

## 3. Modelo de Dados (`games.json`)

```jsonc
{
  "categories": [
    { "id": "palavras", "label": "Palavras", "emoji": "🔤", "color": "#6C5CE7" },
    { "id": "geografia", "label": "Geografia", "emoji": "🌍", "color": "#00B894" }
    // ...
  ],
  "tags": [
    { "id": "mapa", "label": "Mapa" },
    { "id": "bandeiras", "label": "Bandeiras" }
    // ...
  ],
  "games": [
    {
      "id": "termo",
      "name": "Termo",
      "url": "https://term.ooo",
      "description": "Adivinhe a palavra de 5 letras em 6 tentativas. O Wordle brasileiro.",
      "lang": "pt-BR",               // "pt-BR" | "en" | "multi"
      "category": "palavras",        // categoria principal (exatamente 1)
      "tags": ["adivinhar-palavra"], // 1 a 3 tags
      "logo": null,                  // opcional, sobrescreve favicon
      "popular": true,               // destaca o card / ordena primeiro
      "frequency": "daily"           // "daily" | "unlimited" | "weekly"
    }
  ]
}
```

Regras:
- Todo jogo tem **exatamente 1 categoria** e **1–3 tags**.
- `lang` exibe um pequeno badge no card (🇧🇷 / 🇺🇸 / 🌐).
- O schema deve ser validado em build/CI (zod ou JSON Schema) para evitar JSON quebrado em produção.

---

## 4. UI / UX

### Layout
1. **Header compacto**: nome do site + tagline ("Seus jogos diários em um só lugar"), toggle de tema claro/escuro, busca.
2. **Barra de filtros (sticky)**:
   - Chips de **categoria** (com emoji e cor) — multi-seleção.
   - Chips de **tags** — multi-seleção; a combinação funciona como **E** entre grupos e **OU** dentro do grupo (ex.: categoria Geografia E (tag Mapa OU tag Bandeiras)).
   - Filtro de idioma (🇧🇷 / 🇺🇸 / todos).
   - Botão "Limpar filtros" e contagem de resultados ("23 jogos").
3. **Grid de cards responsivo**: CSS Grid `auto-fill, minmax(~160px, 1fr)`; 2 colunas no mobile, até 5–6 no desktop.
4. **Seção Extras** ao final (visual distinto, ver §6).
5. **Footer**: link do repositório, aviso "todos os jogos pertencem aos seus criadores".

### Card de jogo
- Thumbnail (favicon 64–128px), nome, descrição de 1 linha (truncada), badges de tags (máx. 3), badge de idioma.
- Clique no card inteiro abre o jogo em **nova aba** (`rel="noopener noreferrer"`).
- Hover/focus: elevação suave + leve zoom no logo; estados de foco visíveis para teclado.
- **Check de "jogado hoje"**: pequeno botão ✓ no card que marca o jogo como concluído no dia (persistido em `localStorage`, reseta automaticamente à meia-noite local). Jogos marcados ficam esmaecidos ou vão para o fim da lista (preferência configurável). Esse é o detalhe que transforma a página em ritual diário.
- **Favoritar** ⭐ (localStorage): favoritos sobem para uma faixa "Seus favoritos" no topo.

### Estética
- Tema claro e escuro (respeitar `prefers-color-scheme`, com toggle manual persistido).
- Personalidade visual lúdica mas disciplinada: usar a linguagem visual dos próprios jogos (tiles verde/amarelo do Wordle/Termo) como inspiração — ex.: micro-animação de "tiles virando" no título do header, ou chips de filtro com visual de teclas/tiles. **Um** elemento assinatura; o resto sóbrio.
- Tipografia com personalidade no display (fonte geométrica/arredondada) + fonte neutra de leitura no corpo. Evitar o visual genérico "template de dashboard".
- Animações curtas (≤200ms), respeitando `prefers-reduced-motion`.
- Acessibilidade: contraste AA, navegação completa por teclado, `aria-pressed` nos chips de filtro.

### Busca
- Campo de busca client-side (nome, descrição e tags), com debounce, combinável com os filtros.

---

## 5. Funcionalidades

### 5.1 Filtros (núcleo)
Multi-seleção de categorias, tags e idioma + busca textual. Estado refletido na **URL via querystring** (ex.: `?cat=geografia&tag=mapa,bandeiras`), permitindo compartilhar um filtro por link mesmo sem backend.

### 5.2 Jogado hoje / Favoritos
Persistência local (`localStorage`), sem conta. Estrutura: `{ playedAt: { gameId: "2026-06-10" }, favorites: ["gameId"] }`.

### 5.3 Ordenação
Padrão: favoritos → populares → alfabético. Alternativas no UI: A–Z, por categoria.

### 5.4 Presets de filtros compartilhados (Fase 2, opcional)
Requisito: salvar combinações de filtros e disponibilizá-las **para todos os usuários**, sem login.
- Micro-API: `GET /api/presets` e `POST /api/presets { name, filters }`.
- Armazenamento: SQLite ou JSON em volume Docker.
- Proteções mínimas (já que não há auth): limite de tamanho/quantidade, rate limit por IP, sanitização do nome. Presets aparecem como chips em "Presets da comunidade".
- O frontend deve detectar a ausência da API e simplesmente ocultar a seção (graceful degradation).

---

## 6. Seção "Extras" (não é o foco, mas deve existir)

Bloco separado ao final da página, com cards maiores e visual próprio:

1. **Board Game Arena** — `https://boardgamearena.com` — "Centenas de jogos de tabuleiro online, em tempo real ou por turnos." Tag: `tabuleiro`.
2. **Ofertas de jogos (consolidado)** — cards para agregadores que já consolidam Steam + outras lojas:
   - **GG.deals** — `https://gg.deals` — compara preços entre Steam, Epic, GOG e keyshops.
   - **IsThereAnyDeal** — `https://isthereanydeal.com` — histórico de preços e alertas.
   - **SteamDB Sales** — `https://steamdb.info/sales/` — todas as promoções ativas da Steam.
   - *(Opcional, Fase 3)*: mini-widget "ofertas em destaque" consumindo a **API gratuita do CheapShark** (`https://apps.cheapshark.com/api`) client-side, exibindo 5–10 deals com desconto e loja. Se a API falhar, exibir apenas os links estáticos.

---

## 7. Catálogo inicial (seed)

> Lista compilada a partir de varredura em agregadores conhecidos (Listdle, DLE.games, The Dles, Puzzle Index, adoryvo/lists e listas brasileiras). **O Claude Code deve verificar cada URL antes de incluir no seed** — jogos "dle" mudam de domínio ou são descontinuados com frequência (ex.: o Heardle original foi descontinuado). URLs marcadas com ⚠️ exigem verificação/correção; itens sem URL exigem pesquisa.

### Categorias propostas

| id | Label | Emoji |
|---|---|---|
| `palavras` | Palavras | 🔤 |
| `geografia` | Geografia | 🌍 |
| `cinema-tv` | Cinema & TV | 🎬 |
| `musica` | Música | 🎵 |
| `games-geek` | Games & Geek | 🎮 |
| `logica-numeros` | Lógica & Números | 🧮 |
| `conhecimentos` | Conhecimentos Gerais | 🧠 |
| `esportes` | Esportes | ⚽ |

### Tags propostas
`adivinhar-palavra`, `semantico`, `letras`, `cruzadas`, `agrupamento` (estilo Connections), `mapa`, `bandeiras`, `paises`, `foto`, `frame-imagem`, `audio`, `trivia`, `matematica`, `logica`, `deducao`, `linha-do-tempo`, `preco`, `anime`, `pokemon`, `futebol`, `tabuleiro`, `ilimitado`

### Palavras — pt-BR 🇧🇷
| Jogo | URL | Tags | Descrição |
|---|---|---|---|
| Termo | https://term.ooo | adivinhar-palavra | O Wordle brasileiro; inclui modos Dueto e Quarteto |
| Letreco | ⚠️ https://www.gabtoschi.com/letreco/ | adivinhar-palavra | Variante BR do Wordle |
| Palavra do Dia | ⚠️ https://palavra-do-dia.pt | adivinhar-palavra | Wordle em português (PT) |
| Charada | ⚠️ https://charada.vercel.app | adivinhar-palavra | Variante BR |
| Contexto | https://contexto.me | semantico | Acerte a palavra pela proximidade semântica (BR, viralizou no mundo) |
| Palavrês | ⚠️ pesquisar URL | adivinhar-palavra | Variante BR citada em listas |
| Soletra (g1) | ⚠️ https://g1.globo.com/jogos/soletra/ | letras | Forme palavras com 7 letras (estilo Spelling Bee) |
| Racha Cuca (diários) | https://rachacuca.com.br | letras, ilimitado | Portal BR com vários passatempos atualizados diariamente |

### Palavras — inglês 🇺🇸
| Jogo | URL | Tags | Descrição |
|---|---|---|---|
| Wordle | https://www.nytimes.com/games/wordle | adivinhar-palavra | O original que começou tudo |
| Connections (NYT) | https://www.nytimes.com/games/connections | agrupamento | Agrupe 16 palavras em 4 grupos |
| Strands (NYT) | ⚠️ https://www.nytimes.com/games/strands | letras | Caça-palavras temático |
| Spelling Bee (NYT) | https://www.nytimes.com/puzzles/spelling-bee | letras | Forme palavras com 7 letras |
| Mini Crossword (NYT) | https://www.nytimes.com/crosswords/game/mini | cruzadas | Palavras cruzadas rápidas |
| Quordle | ⚠️ https://www.merriam-webster.com/games/quordle | adivinhar-palavra | 4 Wordles ao mesmo tempo |
| Octordle | ⚠️ pesquisar URL | adivinhar-palavra | 8 Wordles ao mesmo tempo |
| Waffle | https://wafflegame.net | adivinhar-palavra, logica | Troque letras na grade de waffle |
| Semantle | ⚠️ https://semantle.com | semantico | A versão original do conceito do Contexto |
| Redactle | ⚠️ pesquisar URL | deducao | Descubra o artigo da Wikipédia censurado |
| Squaredle | https://squaredle.com | letras | Encontre palavras na grade |

### Geografia 🌍
| Jogo | URL | Tags | Descrição |
|---|---|---|---|
| Globle | https://globle-game.com | paises, mapa | Acerte o país pelo "quente/frio" no globo |
| Worldle | https://worldle.teuteuf.fr | paises, mapa | Acerte o país pela silhueta |
| Flagle | https://www.flagle.io | bandeiras | Acerte a bandeira revelada aos poucos |
| Tradle | ⚠️ https://games.oec.world/en/tradle/ | paises, trivia | Acerte o país pelas exportações |
| Travle | https://travle.earth | paises, mapa | Conecte dois países por caminho terrestre |
| Countryle | ⚠️ https://countryle.com | paises, deducao | Acerte o país por atributos (hemisfério, população…) |
| TimeGuessr | https://timeguessr.com | foto, linha-do-tempo | Acerte onde E quando a foto foi tirada |
| Statele | ⚠️ pesquisar URL | mapa | Worldle de estados/subdivisões |
| GeoGrid | ⚠️ https://www.geogridgame.com | paises, logica | Grade 3x3 de países por critérios |
| Globle: Capitals | ⚠️ pesquisar URL | paises | Variante de capitais |
| City Guesser | ⚠️ https://virtualvacation.us | foto, mapa | Acerte a cidade por vídeo de rua |

### Cinema & TV 🎬
| Jogo | URL | Tags | Descrição |
|---|---|---|---|
| Framed | https://framed.wtf | frame-imagem | Acerte o filme por 6 frames |
| Moviedle | ⚠️ pesquisar URL | frame-imagem | O filme inteiro em 1 segundo |
| Actorle | ⚠️ https://actorle.com | trivia | Acerte o ator pela filmografia |
| Episode | ⚠️ pesquisar URL | frame-imagem | Acerte a série pelo frame |
| Box Office Game | ⚠️ https://boxofficega.me | trivia | Acerte os filmes do top de bilheteria |
| Cine2Nerdle | ⚠️ https://www.cinenerdle2.app | agrupamento | Conecte filmes por atores |
| Plotwords | ⚠️ pesquisar URL | deducao | Acerte o filme por palavras-chave do enredo |

### Música 🎵
| Jogo | URL | Tags | Descrição |
|---|---|---|---|
| Bandle | https://bandle.app | audio | Acerte a música instrumento por instrumento |
| Spotle | ⚠️ https://spotle.io | trivia, audio | Acerte o artista do dia |
| Harmonies | ⚠️ https://harmonies.io | agrupamento | Connections musical |
| Lyricle | ⚠️ pesquisar URL | audio | Acerte a música pela letra |
| Musicle | ⚠️ pesquisar URL | audio | Variante citada em listas brasileiras |

### Games & Geek 🎮
| Jogo | URL | Tags | Descrição |
|---|---|---|---|
| GuessThe.Game | https://guessthe.game | frame-imagem | Framed de videogames |
| Gamedle | ⚠️ https://www.gamedle.wtf | frame-imagem, trivia | Acerte o jogo (vários modos) |
| LoLdle | ⚠️ https://loldle.net | trivia | Wordle de League of Legends |
| Pokedle | ⚠️ pesquisar URL | pokemon, deducao | Acerte o Pokémon por atributos |
| Squirdle | ⚠️ https://squirdle.fireblend.com | pokemon, deducao | Pokémon por geração/tipo/peso |
| Onepiecedle | ⚠️ pesquisar URL | anime, deducao | Wordle de One Piece |
| Narutodle | ⚠️ pesquisar URL | anime, deducao | Wordle de Naruto |
| Smashdle | ⚠️ pesquisar URL | trivia | Wordle de Super Smash Bros |

### Lógica & Números 🧮
| Jogo | URL | Tags | Descrição |
|---|---|---|---|
| Nerdle | https://nerdlegame.com | matematica | Wordle de equações |
| Mathler | ⚠️ https://www.mathler.com | matematica | Encontre a conta que dá o resultado do dia |
| Queens (LinkedIn) | https://www.linkedin.com/games/queens | logica | Posicione rainhas sem conflito |
| Tango (LinkedIn) | ⚠️ https://www.linkedin.com/games/tango | logica | Grade binária sol/lua |
| Zip (LinkedIn) | ⚠️ pesquisar URL | logica | Conecte os números em sequência |
| Pips (NYT) | ⚠️ https://www.nytimes.com/games/pips | logica | Quebra-cabeça de dominós |
| Murdle | https://murdle.com | deducao, logica | Mini-mistério de assassinato diário |
| Sudoku (NYT) | https://www.nytimes.com/puzzles/sudoku | logica | Clássico diário |
| Cell Tower | ⚠️ https://www.andrewt.net/puzzles/cell-tower | letras, logica | Divida a grade em palavras |

### Conhecimentos Gerais 🧠
| Jogo | URL | Tags | Descrição |
|---|---|---|---|
| Chronophoto | ⚠️ https://www.chronophoto.app | foto, linha-do-tempo | Acerte o ano da foto |
| Wikitrivia | ⚠️ https://wikitrivia.tomjwatson.com | linha-do-tempo, trivia | Ordene eventos históricos na timeline |
| Thrice | ⚠️ https://thrice.geekswhodrink.com | trivia | 5 perguntas, 3 dicas cada |
| Costcodle | ⚠️ https://costcodle.com | preco | Acerte o preço do produto |
| FoodGuessr | ⚠️ https://www.foodguessr.com | foto, trivia | Acerte o país pelo prato típico |
| Juxtastat | ⚠️ https://urbanstats.org | trivia | Compare estatísticas urbanas |

### Esportes ⚽
| Jogo | URL | Tags | Descrição |
|---|---|---|---|
| Who Are Ya? | ⚠️ https://playfootball.games/who-are-ya/ | futebol, deducao | Acerte o jogador pela foto borrada |
| Missing 11 | ⚠️ https://missing11.com | futebol, trivia | Complete a escalação histórica |
| Immaculate Grid | ⚠️ https://www.immaculategrid.com | trivia | Grade 3x3 de jogadores (várias ligas) |
| Equivalentes BR de futebol | ⚠️ pesquisar | futebol | Buscar "dle" brasileiros de futebol ativos |

> **Fontes para expandir o catálogo depois** (linkar no README): listdle.com, dle.games, dles.aukspot.com, puzzle-index.com, adoryvo.github.io/lists/dailies.html.

---

## 8. Estrutura do Projeto (sugestão)

```
daily-games/
├── public/
│   └── logos/              # logos locais opcionais
├── src/
│   ├── data/games.json     # fonte da verdade do catálogo
│   ├── components/         # Card, FilterBar, SearchBox, ThemeToggle, ExtrasSection
│   ├── lib/                # filtros, persistência localStorage, favicon helper
│   └── styles/
├── server/                 # Fase 2: micro-API de presets (opcional)
├── Dockerfile
├── docker-compose.yml
└── README.md               # instruções de homelab + como adicionar um jogo
```

---

## 9. Fases de Entrega

**Fase 1 (MVP)** — página estática completa: catálogo via JSON, cards com favicon, filtros por categoria/tag/idioma, busca, tema claro/escuro, jogado-hoje + favoritos (localStorage), filtros refletidos na URL, seção Extras com links estáticos, Docker + compose.

**Fase 2** — micro-API de presets de filtros compartilhados (graceful degradation se ausente).

**Fase 3 (opcional)** — widget de ofertas via CheapShark API; PWA (instalável no celular, ícone na home); estatísticas locais ("streak" de dias visitados).

---

## 10. Critérios de Aceitação

1. Abrir a página no celular e no desktop: grid se adapta sem scroll horizontal.
2. Selecionar "Geografia" + tag "Mapa" filtra corretamente e a URL reflete o filtro; abrir a URL copiada em outra aba reproduz o filtro.
3. Marcar um jogo como "jogado hoje" persiste após refresh e reseta no dia seguinte.
4. Nenhuma imagem quebrada: fallback de avatar funciona quando o favicon falha.
5. Todos os links externos abrem em nova aba com `rel="noopener noreferrer"`.
6. `docker compose up -d` sobe o site no homelab sem nenhuma configuração extra.
7. Sem cookies, sem login, sem chamadas externas além de favicons (e CheapShark, se Fase 3).
8. Funciona com presets/CheapShark indisponíveis (degradação graciosa).
9. Build falha se `games.json` violar o schema (jogo sem tag, mais de 3 tags, categoria inexistente).

---

## 11. Notas para o Claude Code

- **Verifique as URLs marcadas com ⚠️** (fetch HEAD/GET) antes de colocar no seed; jogos "dle" mudam de domínio ou são descontinuados com frequência. Remova mortos, corrija redirecionamentos, pesquise os itens "pesquisar URL".
- Descrições devem ser curtas (≤ 90 caracteres), em pt-BR, em tom de convite ("Acerte o país pela silhueta").
- O catálogo vai crescer: o fluxo de adicionar um jogo deve ser *editar 5 linhas de JSON*, documentado no README.
- Priorize a sensação de "abrir e jogar": carregamento instantâneo, zero fricção, nada de splash screen ou loader.
