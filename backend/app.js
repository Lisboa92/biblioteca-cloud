// API REST — Biblioteca · INFC-0015 · UTDEG
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

// ── CONFIGURAÇÃO DA BASE DE DADOS (PRODUÇÃO)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ── TESTE DE SAÚDE (não bloqueia arranque)
app.get("/api/health", (_, res) => {
  res.json({ status: "ok" });
});

// ── READ — listar livros
app.get("/api/livros", async (_, res) => {
  try {
    const r = await pool.query("SELECT * FROM livros ORDER BY id DESC");
    res.json(r.rows);
  } catch (e) {
    console.error("ERRO LISTAR:", e);
    res.status(500).json({ erro: e.message });
  }
});

// ── CREATE — inserir livro
app.post("/api/livros", async (req, res) => {
  const { titulo, autor, ano, genero } = req.body;

  if (!titulo || !autor) {
    return res.status(400).json({ erro: "Título e autor são obrigatórios" });
  }

  try {
    const r = await pool.query(
      `INSERT INTO livros (titulo, autor, ano, genero)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [titulo, autor, ano || null, genero || null]
    );

    res.status(201).json(r.rows[0]);
  } catch (e) {
    console.error("ERRO CRIAR:", e);
    res.status(500).json({ erro: e.message });
  }
});

// ── UPDATE — atualizar livro
app.put("/api/livros/:id", async (req, res) => {
  const { titulo, autor, ano, genero, disponivel } = req.body;

  try {
    const r = await pool.query(
      `UPDATE livros
       SET titulo=$1, autor=$2, ano=$3, genero=$4, disponivel=$5
       WHERE id=$6
       RETURNING *`,
      [titulo, autor, ano, genero, disponivel, req.params.id]
    );

    if (!r.rows.length) {
      return res.status(404).json({ erro: "Livro não encontrado" });
    }

    res.json(r.rows[0]);
  } catch (e) {
    console.error("ERRO UPDATE:", e);
    res.status(500).json({ erro: e.message });
  }
});

// ── DELETE — apagar livro
app.delete("/api/livros/:id", async (req, res) => {
  try {
    const r = await pool.query(
      "DELETE FROM livros WHERE id=$1 RETURNING *",
      [req.params.id]
    );

    if (!r.rows.length) {
      return res.status(404).json({ erro: "Livro não encontrado" });
    }

    res.json({
      mensagem: "Livro apagado",
      livro: r.rows[0]
    });
  } catch (e) {
    console.error("ERRO DELETE:", e);
    res.status(500).json({ erro: e.message });
  }
});

// ── ARRANQUE DO SERVIDOR (NÃO BLOQUEIA BD)
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API a correr em :${PORT}`);
});
