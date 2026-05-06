import { useEffect, useState } from "react";

//const API = "https://biblioteca-lisboa.up.railway.app/api/livros";
const API = "https://backend-biblioteca-lisboa.up.railway.app/api/livros";

export default function App() {
  const [livros, setLivros] = useState([]);
  const [form, setForm] = useState({ titulo: "", autor: "", ano: "", genero: "" });
  const [editandoId, setEditandoId] = useState(null);
  const [erro, setErro] = useState("");

  const carregar = async () => {
    try {
      const r = await fetch(API);
      setLivros(await r.json());
    } catch (e) { setErro("Erro ao carregar livros"); }
  };

  useEffect(() => { carregar(); }, []);

  const submeter = async (e) => {
    e.preventDefault();
    setErro("");
    const metodo = editandoId ? "PUT" : "POST";
    const url = editandoId ? `${API}/${editandoId}` : API;
    const r = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, ano: form.ano ? parseInt(form.ano) : null, disponivel: true }),
    });
    if (!r.ok) { setErro((await r.json()).erro || "Erro"); return; }
    setForm({ titulo: "", autor: "", ano: "", genero: "" });
    setEditandoId(null);
    carregar();
  };

  const editar = (l) => {
    setForm({ titulo: l.titulo, autor: l.autor, ano: l.ano || "", genero: l.genero || "" });
    setEditandoId(l.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const apagar = async (id) => {
    if (!confirm("Apagar este livro?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    carregar();
  };

  return (
    <div className="container">
      <h1>📚 Biblioteca UTDEG</h1>
      <p className="subtitulo">Sistema de gestão de livros — INFC-0015 · Computação na Nuvem</p>

      <div className="card">
        <h2>{editandoId ? "✏️ Editar livro" : "➕ Adicionar livro"}</h2>
        {erro && <div className="erro">{erro}</div>}
        <form onSubmit={submeter}>
          <input placeholder="Título *" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required />
          <input placeholder="Autor *" value={form.autor} onChange={(e) => setForm({ ...form, autor: e.target.value })} required />
          <input placeholder="Ano" type="number" value={form.ano} onChange={(e) => setForm({ ...form, ano: e.target.value })} />
          <input placeholder="Género" value={form.genero} onChange={(e) => setForm({ ...form, genero: e.target.value })} />
          <button type="submit">{editandoId ? "Guardar alterações" : "Adicionar livro"}</button>
        </form>
      </div>

      <div className="card">
        <h2>📖 Livros registados ({livros.length})</h2>
        {livros.length === 0 ? (
          <div className="vazio">Ainda não há livros. Adiciona o primeiro acima.</div>
        ) : livros.map((l) => (
          <div key={l.id} className="livro">
            <div className="livro-info">
              <strong>{l.titulo}</strong>
              <small>{l.autor}{l.ano ? ` · ${l.ano}` : ""}{l.genero ? ` · ${l.genero}` : ""}</small>
            </div>
            <div className="livro-acoes">
              <button onClick={() => editar(l)}>Editar</button>
              <button className="danger" onClick={() => apagar(l.id)}>Apagar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
