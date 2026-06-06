# 🗺️ Guia de Viagens

Aplicação web para registar destinos de viagem, experiências e fotos num mapa pessoal. Permite partilhar destinos publicamente e ver estatísticas das tuas viagens.

## 🚀 Demo

- **Frontend:** https://tpguiaviagens-production-34f4.up.railway.app
- **Backend:** https://tpguiaviagens-production.up.railway.app

---

## 🛠️ Tecnologias

**Frontend**
- React + Vite

**Backend**
- Node.js + Express
- Prisma ORM
- JWT para autenticação
- Multer para upload de fotos

**Base de dados**
- PostgreSQL

**Deploy**
- Railway (frontend + backend)

---

## 📦 Instalação e Execução Local

### Passo 1 — Instalar o Node.js

1. Vai a https://nodejs.org
2. Clica em **"LTS"** e faz download
3. Instala normalmente (Next → Next → Finish)
4. Para confirmar que ficou instalado, abre o terminal e corre:

```bash
node -v
npm -v
```

Devem aparecer números de versão (ex: `v20.11.0`).

---

### Passo 2 — Instalar o PostgreSQL

1. Vai a https://www.postgresql.org/download
2. Escolhe o teu sistema operativo e faz download
3. Durante a instalação:
   - Define uma password para o utilizador `postgres` — **guarda-a bem!**
   - Deixa a porta como **5432**
   - Clica Next até terminar

Para confirmar que ficou instalado, abre o terminal e corre:

```bash
psql --version
```

---

### Passo 3 — Criar a base de dados

Abre o terminal e corre:

```bash
psql -U postgres
```

Vai pedir a password que definiste na instalação. Depois corre:

```sql
CREATE DATABASE guia_viagens;
\q
```

---

### Passo 4 — Clonar o repositório

```bash
git clone https://github.com/nunogoncalves1301/TP_guia_viagens.git
cd TP_guia_viagens/projeto-18-guia-viagens
```

> Se não tiver Git instalado, vai a https://git-scm.com/downloads e instala primeiro.

---

### Passo 5 — Configurar o Backend

```bash
cd backend
npm install
```

Cria um ficheiro chamado `.env` dentro da pasta `backend/` com este conteúdo:

```env
SERVER_PORT=4242
JWT_SECRET=guia_viagens_jwt_secret_dev_2026
DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/guia_viagens"
DIRECT_URL="postgresql://postgres:PASSWORD@localhost:5432/guia_viagens"
UPLOAD_DIR=uploads
```

> ⚠️ Substitui `PASSWORD` pela password que definiste na instalação do PostgreSQL.

Aplica o schema da base de dados:

```bash
npx prisma db push
```

Arranca o servidor:

```bash
npm run dev
```

Deves ver a mensagem: `Servidor a correr em http://localhost:4242`

---

### Passo 6 — Configurar o Frontend

Abre um **novo terminal** (mantém o backend a correr no anterior) e:

```bash
cd TP_guia_viagens/projeto-18-guia-viagens/frontend
npm install
```

Cria um ficheiro chamado `.env` dentro da pasta `frontend/` com este conteúdo:

```env
VITE_API_URL=http://localhost:4242/api
```

Arranca o frontend:

```bash
npm run dev
```

Deves ver algo como: `Local: http://localhost:5173`

---

### Passo 7 — Abrir a aplicação

Abre o browser e vai a: **http://localhost:5173**

A aplicação está pronta a usar! Cria uma conta e começa a registar os teus destinos.

---

## 📡 API — Endpoints

### Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register` | Criar conta |
| POST | `/api/auth/login` | Fazer login |
| GET | `/api/auth/me` | Ver perfil |

### Destinos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/destinations` | Listar os meus destinos |
| GET | `/api/destinations/:id` | Ver destino |
| POST | `/api/destinations` | Criar destino |
| PUT | `/api/destinations/:id` | Editar destino |
| DELETE | `/api/destinations/:id` | Apagar destino |

### Experiências

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/experiences/destination/:id` | Listar experiências |
| POST | `/api/experiences/destination/:id` | Criar experiência |
| DELETE | `/api/experiences/:id` | Apagar experiência |

### Fotos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/photos/destination/:id` | Listar fotos |
| POST | `/api/photos/destination/:id` | Fazer upload de fotos |
| DELETE | `/api/photos/:id` | Apagar foto |

### Feed & Stats

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/feed` | Ver destinos públicos |
| GET | `/api/feed/:id` | Ver destino público |
| GET | `/api/stats` | Ver estatísticas |

> Todos os endpoints (exceto register e login) requerem o header `Authorization: Bearer <token>`.

---

## 🗂️ Estrutura do Projeto

```
projeto-18-guia-viagens/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   └── routes/
│   │       ├── auth.js
│   │       ├── destinations.js
│   │       ├── experiences.js
│   │       ├── photos.js
│   │       ├── feed.js
│   │       └── stats.js
│   ├── uploads/
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api.js
    │   └── ...
    └── vite.config.js
```

---

## 👤 Autor

Nuno Gonçalves — [@nunogoncalves1301](https://github.com/nunogoncalves1301)