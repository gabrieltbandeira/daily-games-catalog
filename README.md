# Diários — Jogos do dia

> Todos os seus jogos diários favoritos em um só lugar.

Agregador de links para jogos diários estilo Wordle: uma lista curada com Termo, Wordle, Globle, Contexto e mais de 70 outros jogos organizados por categoria, com filtros, busca e persistência local — sem conta, sem rastreamento.

## Funcionalidades

- **72 jogos** organizados em 8 categorias (Palavras, Geografia, Cinema & TV, Música, Games & Geek, Lógica & Números, Conhecimentos, Esportes)
- **Filtros combinados** por categoria, idioma (PT-BR / EN / Multi) e busca textual — estado refletido na URL para links compartilháveis
- **"Joguei hoje"** — marque os jogos concluídos no dia; reset automático à meia-noite
- **Favoritos** — fixe seus jogos preferidos no topo da página; persiste entre sessões
- **Tema escuro/claro** com detecção automática do sistema (`prefers-color-scheme`)
- **Extras** — links para Board Game Arena, GG.deals, IsThereAnyDeal e SteamDB Sales
- Sem cookies, sem login, sem rastreamento externo

## Tecnologias

- [Vite](https://vitejs.dev/) + [React 19](https://react.dev/)
- CSS customizado com variáveis (sem Tailwind)
- [Zod](https://zod.dev/) para validação do catálogo no build
- [nginx](https://nginx.org/) + Docker para deploy

## Rodando localmente

```bash
# Requer Node.js 22+
npm install
npm run dev       # http://localhost:5173
npm run build     # build de produção (valida o catálogo antes)
```

## Docker

```bash
docker compose up -d        # http://localhost
PORT=3000 docker compose up -d   # porta customizada
```

## Adicionando um jogo

Edite `src/data/games.json` e adicione uma entrada em `games[]`. O build falha automaticamente se o schema for violado. Veja o formato completo em [CLAUDE.md](./CLAUDE.md).
