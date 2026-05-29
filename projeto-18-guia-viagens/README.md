# Projeto 18 — Guia de Viagens

Aplicação web para registar destinos visitados, fotografias, experiências pessoais e visualizar viagens num mapa interativo.

**Stack:** Node.js + Express · React + Vite · JWT · PostgreSQL · Leaflet

## Funcionalidades

| Área | Descrição |
|------|-----------|
| Autenticação | Registo e login com JWT |
| Destinos | CRUD com país, cidade, data, descrição, classificação |
| Fotos | Upload de até 4 imagens por destino |
| Experiências | Atividades, restaurantes e outros por destino |
| Mapa | Marcadores Leaflet para cada destino |
| Privacidade | Destinos públicos ou privados |
| Feed social | Lista de destinos públicos de outros utilizadores |
| Estatísticas | Países, continentes, destinos e evolução por ano |

## Estrutura

```
projeto-18-guia-viagens/
├── backend/          # API Express
├── frontend/         # React + Vite
└── README.md
```

## Requisitos

- [Node.js](https://nodejs.org/) 18+
- PostgreSQL instalado localmente

## Instalação

### 1. Base de dados (PostgreSQL local)

Garante que tens um servidor PostgreSQL a correr (porta típica `5432`) e cria a base de dados `guia_viagens` (ou altera o `DATABASE_URL`).

### 2. Backend

```bash
cd backend
copy .env.example .env    # Windows — ou cp no Linux/Mac
npm install
npx prisma migrate dev
npm run dev
```

API disponível em `http://localhost:4242`

### Prisma + Postgres

- **Schema Prisma**: `backend/prisma/schema.prisma`
- **Cliente Prisma**: `backend/src/db/prisma.js`

#### Nota sobre migrations

O esquema da base de dados é gerido pelo Prisma (`npx prisma migrate dev`).

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App disponível em `http://localhost:5173`

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register` | Registo |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Utilizador atual |
| GET/POST | `/api/destinations` | Listar / criar destinos |
| GET/PUT/DELETE | `/api/destinations/:id` | Detalhe / editar / apagar |
| GET/POST | `/api/experiences/destination/:id` | Experiências |
| POST | `/api/photos/destination/:id` | Upload de fotos (multipart) |
| GET | `/api/feed` | Feed público |
| GET | `/api/stats` | Estatísticas pessoais |

## Critérios de avaliação (Projeto 18)

- CRUD destinos e experiências — 25%
- Mapa Leaflet com marcadores — 25%
- Upload múltiplo de fotos — 20%
- Lógica público/privado — 15%
- Design e responsividade — 15%

## Autor

Projeto académico — IPVC ESTG · CTeSP TPSI · Programação Web
