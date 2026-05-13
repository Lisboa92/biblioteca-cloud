<<<<<<< HEAD
# 📚 Sistema de Gestão de Biblioteca — Lisboa

Trabalho prático individual · UTDEG · Licenciatura em Informática · 4.º Ano · 2026

Sistema de informação **em três camadas**, totalmente containerizado com **Docker** e preparado para deploy em nuvem (Railway / Render).

---

## 🏛 Arquitectura

```
┌─────────────────┐     HTTP      ┌──────────────┐    SQL    ┌────────────┐
│  Frontend       │ ────────────► │  Backend     │ ────────► │ PostgreSQL │
│  React + Nginx  │ ◄──── JSON ── │  Node/Express│ ◄──────── │  (volume)  │
│  porta 8080     │               │  porta 3000  │           │  porta 5432│
└─────────────────┘               └──────────────┘           └────────────┘
        Camada 1                       Camada 2                  Camada 3
```

| Camada | Tecnologia | Containerização |
|--------|-----------|-----------------|
| Frontend | React 18 + Vite + Nginx | ✅ Sim (bónus) |
| Backend | Node.js 20 + Express | ✅ Obrigatória |
| Base de Dados | PostgreSQL 16 + volume | ✅ Obrigatória |

## 🚀 Como executar localmente

### Pré-requisitos
- Docker Desktop instalado ([docker.com/get-started](https://www.docker.com/get-started))
- Git

### Passos
```bash
git clone <o-teu-repositorio>
cd biblioteca-cloud
docker compose up --build
```

Aguarda ~1 minuto enquanto as imagens são construídas. Depois abre:
- **Aplicação:** http://localhost:8080
- **API REST:** http://localhost:3000/api/livros

### Comandos úteis
```bash
docker compose ps                 # estado dos containers
docker compose logs -f backend    # ver logs do backend
docker compose down               # parar containers
docker compose down -v            # parar E apagar a BD (reset)
```

## 🌐 Deploy no Railway (passo a passo)

1. Criei conta em [railway.app](https://railway.app) (login com GitHub)
2. Fiz `git push` deste projeto para um repositório teu no GitHub
3. No Railway: **New Project → Deploy from GitHub repo**
4. Railway deteta o `docker-compose.yml` e cria os 3 serviços
5. Em cada serviço, defini as variáveis de ambiente (já estão no compose)
6. Em **Settings → Networking → Generate Domain** no serviço `frontend`
7. Obtive e personalizei um URL público para `(https://biblioteca-lisboa.up.railway.app/)`
8. Credenciais: usuario: admin / senha: 1234

## 📋 Funcionalidades (CRUD completo)

- ✅ **CREATE** — formulário para adicionar livros
- ✅ **READ** — lista todos os livros em tempo real
- ✅ **UPDATE** — botão "Editar" em cada livro
- ✅ **DELETE** — botão "Apagar" com confirmação

## 🗄 Modelo de Dados

```sql
CREATE TABLE livros (
    id          SERIAL PRIMARY KEY,
    titulo      VARCHAR(200) NOT NULL,
    autor       VARCHAR(150) NOT NULL,
    ano         INTEGER,
    genero      VARCHAR(80),
    disponivel  BOOLEAN DEFAULT TRUE,
    criado_em   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔌 API REST

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET    | `/api/livros`     | Lista todos os livros |
| POST   | `/api/livros`     | Cria um novo livro |
| PUT    | `/api/livros/:id` | Actualiza um livro |
| DELETE | `/api/livros/:id` | Apaga um livro |
| GET    | `/api/health`     | Healthcheck |

## 📁 Estrutura do projeto

```
biblioteca-cloud/
├── docker-compose.yml          ← Orquestra os 3 containers
├── README.md
├── docs/
│   └── RELATORIO.md            ← Esqueleto do relatório técnico
├── database/
│   └── init.sql                ← Schema + dados iniciais
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── app.js                  ← API REST Express
└── frontend/
    ├── Dockerfile              ← Multi-stage (build + Nginx)
    ├── nginx.conf              ← Proxy reverso /api → backend
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx             ← Componente principal CRUD
        └── styles.css
```

## 👤 Autor
**[Lisboa Paulo Cossa]** · 4º Ano · Licenciatura em Informática · UTDEG
=======
# biblioteca-cloud
Trabalho da disciplina de Computacao na Nuvem (UTDEG - 2026)
>>>>>>> f5a63f6d44dbcb970c83bd84ad77653a53a2419a
