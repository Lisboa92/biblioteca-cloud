// API REST — Biblioteca · INFC-0015 · UTDEG
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

// ── CONFIGURAÇÃO DA BASE DE DADOS
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ── CRIAR TABELA AUTOMATICAMENTE (AUTO-SETUP)
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS livros (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(200) NOT NULL,
        autor VARCHAR(150) NOT NULL,
        ano INTEGER,
        genero VARCHAR(80),
        disponivel BOOLEAN DEFAULT TRUE,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✔ Tabela 'livros' pronta");
  } catch (e) {
    console.error("❌ Erro ao criar tabela:", e.message);
  }
}

// ── TESTE DE SAÚDE
app.get("/api/health", async (_, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "connected" });
  } catch (e) {
    res.status(500).json({
      status: "error",
      db: "not connected",
      erro: e.message
    });
  }
});

// ── READ — listar livros
app.get("/api/livros", async (_, res) => {
  try {
    const r = await pool.query(
      "SELECT * FROM livros ORDER BY id DESC"
    );
    res.json(r.rows);
  } catch (e) {
    console.error("ERRO LISTAR:", e.message);
    res.status(500).json({ erro: e.message });
  }
});

// ── CREATE — inserir livro
app.post("/api/livros", async (req, res) => {
  const { titulo, autor, ano, genero } = req.body;

  if (!titulo || !autor) {
    return res.status(400).json({
      erro: "Título e autor são obrigatórios"
    });
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
    console.error("ERRO CRIAR:", e.message);
    res.status(500).json({ erro: e.message });
  }
});

// ── UPDATE
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
    console.error("ERRO UPDATE:", e.message);
    res.status(500).json({ erro: e.message });
  }
});

// ── DELETE
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
    console.error("ERRO DELETE:", e.message);
    res.status(500).json({ erro: e.message });
  }
});

// ── ARRANQUE DO SERVIDOR
const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await initDB(); // garante BD pronta antes de subir API

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 API a correr em :${PORT}`);
    });

  } catch (err) {
    console.error("❌ Erro ao iniciar servidor:", err.message);
    process.exit(1);
  }
};

start();
