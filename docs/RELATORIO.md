# Relatório Técnico — Sistema de Gestão de Biblioteca

**Disciplina:** INFC-0015 — Computação na Nuvem
**Estudante:** [O TEU NOME] · Nº [NÚMERO]
**Curso:** Licenciatura em Informática · 3.º Ano · UTDEG
**Data:** ____ / ____ / 2026

---

## a) Capa
(usar a página de rosto institucional da faculdade — verificar requisitos com o docente)

## b) Introdução

O presente trabalho consiste no desenvolvimento de um **Sistema de Gestão de Biblioteca** seguindo a arquitectura clássica de **três camadas** (Frontend, Backend e Base de Dados), com cada camada containerizada através de **Docker** e orquestrada via **Docker Compose**. O sistema permite ao utilizador realizar todas as operações **CRUD** (Create, Read, Update, Delete) sobre uma colecção de livros.

O objectivo central é aplicar na prática os conceitos abordados nas Semanas 1–6 da disciplina: virtualização leve via containers, isolamento de processos, redes virtuais privadas e implantação em plataformas de nuvem pública.

## c) Arquitectura do Sistema

### Diagrama das 3 camadas

```
   [ Utilizador ]
        │ HTTPS
        ▼
┌──────────────────────┐
│  CAMADA 1 — Frontend │  React 18 + Vite, build estático servido por Nginx
│  Container: web      │  Porta 8080 → 80
└──────────┬───────────┘
           │ HTTP /api/*  (proxy reverso Nginx)
           ▼
┌──────────────────────┐
│  CAMADA 2 — Backend  │  Node.js 20 + Express (API REST)
│  Container: api      │  Porta 3000
└──────────┬───────────┘
           │ TCP 5432  (driver pg)
           ▼
┌──────────────────────┐
│  CAMADA 3 — Base de  │  PostgreSQL 16 (Alpine)
│  Dados — Container db│  Volume Docker para persistência
└──────────────────────┘
```

### Justificação das escolhas tecnológicas

| Camada | Escolha | Justificação |
|--------|---------|--------------|
| Frontend | **React + Vite** | Stack mais procurada no mercado; Vite oferece arranque rápido e build optimizado |
| Backend | **Node.js + Express** | JavaScript em ambas as camadas reduz a curva cognitiva; Express é minimalista e bem documentado |
| BD | **PostgreSQL** | Relacional robusto, suporte ACID, imagem oficial pequena (Alpine ~80MB) |
| Web Server | **Nginx** | Standard da indústria para servir SPAs e fazer proxy reverso |

## d) Modelo de Dados

```sql
CREATE TABLE livros (
    id          SERIAL PRIMARY KEY,
    titulo      VARCHAR(200) NOT NULL,
    autor       VARCHAR(150) NOT NULL,
    ano         INTEGER CHECK (ano > 0 AND ano <= 2100),
    genero      VARCHAR(80),
    disponivel  BOOLEAN DEFAULT TRUE,
    criado_em   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | SERIAL | Chave primária auto-incrementada |
| titulo | VARCHAR(200) | Título do livro (obrigatório) |
| autor | VARCHAR(150) | Nome do autor (obrigatório) |
| ano | INTEGER | Ano de publicação (com CHECK) |
| genero | VARCHAR(80) | Categoria literária |
| disponivel | BOOLEAN | Indica se está disponível para empréstimo |
| criado_em | TIMESTAMP | Marca temporal de inserção |

## e) Containerização

### Dockerfile do Backend (linha a linha)

```dockerfile
FROM node:20-alpine        # Imagem base leve (~50MB) com Node 20
WORKDIR /app               # Define directório de trabalho dentro do container
COPY package.json ./       # Copiamos só este ficheiro primeiro…
RUN npm install --omit=dev # …para que o Docker possa fazer cache desta camada
COPY . .                   # Depois copiamos o restante código (muda mais vezes)
EXPOSE 3000                # Documenta a porta exposta
CMD ["node", "app.js"]     # Comando que arranca a aplicação
```

**Estratégia:** separar a instalação de dependências da cópia do código permite ao Docker reutilizar a camada de `npm install` quando só o código muda — builds passam de minutos a segundos.

### Dockerfile do Frontend (multi-stage)

Usei uma **build multi-stage** com dois propósitos:
1. **Stage 1 (`node:20-alpine`)** — instala dependências e gera os ficheiros estáticos com `npm run build`.
2. **Stage 2 (`nginx:alpine`)** — copia apenas o `dist/` para um Nginx, descartando todo o `node_modules`. Imagem final reduz-se de ~400MB para ~30MB.

### docker-compose.yml — análise

- **service `database`** — usa imagem oficial `postgres:16-alpine`. Define um `healthcheck` com `pg_isready` para que o backend só arranque quando a BD aceitar ligações. O ficheiro `init.sql` é montado em `/docker-entrypoint-initdb.d/`, executado automaticamente na primeira inicialização.
- **service `backend`** — construído a partir de `./backend`, depende do healthcheck da BD (`condition: service_healthy`). Recebe a configuração de BD por variáveis de ambiente.
- **service `frontend`** — construído a partir de `./frontend`. O Nginx tem proxy reverso `/api/* → backend:3000` — note-se que `backend` é resolvido pelo **DNS interno do Docker**, não precisa de IP.
- **volume `db_data`** — volume nomeado garante que os dados sobrevivem a `docker compose down`.
- **network `rede-app`** — rede bridge isola estes containers da rede pública; só portas explicitamente mapeadas (`8080`, `3000`) são acessíveis do host.

## f) Processo de Deploy

### Plataforma escolhida: **Railway**

Razões da escolha:
- Suporta `docker-compose.yml` directamente
- Não exige cartão de crédito Visa internacional
- Gera URL público automaticamente (`*.railway.app`)
- Plano gratuito de 500h/mês

### Passos seguidos
1. Criar conta em railway.app via login GitHub
2. Push do código para repositório GitHub
3. Railway → New Project → Deploy from GitHub
4. Configuração das variáveis de ambiente do backend
5. Generate Domain no serviço frontend
6. URL público obtido: `https://_____________.railway.app`

### Problemas encontrados e soluções
- **Problema:** [descrever um problema real que tiveste]
- **Solução:** [como resolveste]

## g) Capturas de Ecrã
1. App a correr em `localhost:8080` (formulário + lista)
2. Output de `docker compose ps` mostrando os 3 containers UP
3. Painel do Railway com os serviços online
4. URL público acessível do telemóvel

## h) Conclusão

[Reflexão pessoal: o que aprendeste sobre containers, redes Docker, deploy na nuvem, dificuldades superadas]

## i) Referências
- Docker Documentation — https://docs.docker.com
- PostgreSQL Docs — https://www.postgresql.org/docs/
- Express.js Guide — https://expressjs.com
- Railway Docs — https://docs.railway.app
- Material da disciplina INFC-0015, Semanas 1–6
