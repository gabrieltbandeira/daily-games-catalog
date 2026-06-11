# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`daily-games-catalog` — site front-end agregador de jogos diários estilo Wordle (Termo, Wordle, Globle, etc.). Links para os originais, sem hospedar nenhum jogo.

**Stack**: Vite + React + CSS customizado (sem Tailwind) + Zod (validação do catálogo)

## Getting started

```bash
# Requer Node.js 22+ (instalado via nvm em ~/.nvm)
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"

npm install       # instalar dependências
npm run dev       # servidor de desenvolvimento (http://localhost:5173)
npm run build     # build de produção (roda validação Zod antes)
npm run preview   # prévia do build de produção
npm run lint      # linter ESLint
```

## Validação do catálogo

```bash
node src/data/validateGames.mjs   # valida games.json manualmente
```

O script roda automaticamente no `prebuild`. O build **falha** se `games.json` violar o schema.

## Docker

```bash
docker compose up -d        # sobe em produção na porta 80
PORT=3000 docker compose up -d   # porta customizada
docker compose down         # para e remove o container
docker compose logs -f web  # acompanhar logs
```

## Estrutura

```
src/
  components/   # GameCard, Header, FilterBar, ThemeToggle, ExtrasSection
  lib/          # filters.js, urlState.js, storage.js
  styles/       # tokens.css (CSS vars light/dark), global.css
  data/
    games.json          # catálogo de jogos (source of truth)
    validateGames.mjs   # validação Zod
```

## Adicionar um jogo ao catálogo

Edite `src/data/games.json` adicionando uma entrada em `games[]`:

```json
{
  "id": "kebab-case-unico",
  "name": "Nome do Jogo",
  "url": "https://...",
  "description": "Descrição curta em pt-BR, máx 90 caracteres.",
  "lang": "pt-BR|en|multi",
  "category": "palavras|geografia|cinema-tv|musica|games-geek|logica-numeros|conhecimentos|esportes",
  "tags": ["tag1", "tag2"],
  "popular": false,
  "frequency": "daily"
}
```

O build valida automaticamente. Tags e categorias devem existir no JSON.

## Melhorias futuras

### Presets Compartilhados (Fase 8)

Permitir que usuários salvem e compartilhem combinações de filtros via link.

- **Backend**: Node.js + Hono + SQLite (ou JSON) em `server/`
  - `GET /api/presets` — lista presets da comunidade
  - `POST /api/presets { name, filters }` — cria preset (rate limit + sanitização)
- **Frontend**: seção "Presets da Comunidade" aparece só se a API responder (graceful degradation)
- **Docker**: adicionar serviço `api` no `docker-compose.yml`

### Outras ideias
- **PWA**: `manifest.json` + service worker para instalação no celular
- **Estatísticas locais**: streak de visitas diárias (localStorage)
- **Widget de ofertas**: integração com CheapShark API (top 5-10 deals, fallback para links estáticos)
- **Página de jogo**: modal ou página dedicada com descrição expandida e histórico de "jogado"
