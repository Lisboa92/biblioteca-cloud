import { useEffect, useState } from "react";

const API = "https://backend-biblioteca-lisboa.up.railway.app/api/livros";

export default function App() {
  const [logado, setLogado] = useState(false);
  const [login, setLogin] = useState({ usuario: "", senha: "" });
  const [erro, setErro] = useState("");

  const [menu, setMenu] = useState("livros");
  const [livros, setLivros] = useState([]);
  const [pesquisa, setPesquisa] = useState("");

  const [form, setForm] = useState({
    titulo: "",
    autor: "",
    ano: "",
    genero: "",
  });

  const [editandoId, setEditandoId] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const [historico, setHistorico] = useState([]);

  const entrar = (e) => {
    e.preventDefault();

    if (login.usuario === "admin" && login.senha === "1234") {
      setLogado(true);
      setErro("");
    } else {
      setErro("Usuário ou senha inválidos");
    }
  };

  const sair = () => {
    const confirmar = window.confirm("Deseja realmente sair do sistema?");

    if (confirmar) {
      setLogado(false);
      setLogin({ usuario: "", senha: "" });
    }
  };

  const carregar = async () => {
    try {
      const r = await fetch(API);
      const data = await r.json();
      setLivros(data);
    } catch {
      setErro("Erro ao carregar livros");
    }
  };

  useEffect(() => {
    if (logado) carregar();
  }, [logado]);

  const novoLivro = () => {
    setForm({ titulo: "", autor: "", ano: "", genero: "" });
    setEditandoId(null);
    setMostrarModal(true);
  };

  const editar = (livro) => {
    setForm({
      titulo: livro.titulo,
      autor: livro.autor,
      ano: livro.ano || "",
      genero: livro.genero || "",
    });

    setEditandoId(livro.id);
    setMostrarModal(true);
  };

  const submeter = async (e) => {
    e.preventDefault();

    const confirmar = window.confirm(
      editandoId
        ? "Deseja atualizar este livro?"
        : "Deseja cadastrar este livro?"
    );

    if (!confirmar) return;

    const metodo = editandoId ? "PUT" : "POST";
    const url = editandoId ? `${API}/${editandoId}` : API;

    await fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        ano: form.ano ? parseInt(form.ano) : null,
      }),
    });

    setHistorico((prev) => [
      {
        titulo: form.titulo,
        autor: form.autor,
        acao: editandoId ? "Editado" : "Cadastrado",
        data: new Date().toLocaleString(),
      },
      ...prev,
    ]);

    alert(
      editandoId
        ? "Livro atualizado com sucesso!"
        : "Livro cadastrado com sucesso!"
    );

    setForm({ titulo: "", autor: "", ano: "", genero: "" });
    setEditandoId(null);
    setMostrarModal(false);
    carregar();
  };

  const apagar = async (id, titulo, autor) => {
    const confirmar = window.confirm(
      "Deseja realmente apagar este livro?"
    );

    if (!confirmar) return;

    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    setHistorico((prev) => [
      {
        titulo,
        autor,
        acao: "Apagado",
        data: new Date().toLocaleString(),
      },
      ...prev,
    ]);

    alert("Livro apagado com sucesso!");
    carregar();
  };

  const livrosFiltrados = livros.filter((l) =>
    l.titulo.toLowerCase().includes(pesquisa.toLowerCase()) ||
    l.autor.toLowerCase().includes(pesquisa.toLowerCase()) ||
    (l.genero || "").toLowerCase().includes(pesquisa.toLowerCase())
  );

  if (!logado) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>📚 Biblioteca Lisboa Cossa</h1>
          <p>Sistema Administrativo de Gestão de Livros</p>

          {erro && <div className="erro">{erro}</div>}

          <form onSubmit={entrar}>
            <input
              placeholder="Usuário"
              value={login.usuario}
              onChange={(e) =>
                setLogin({ ...login, usuario: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Senha"
              value={login.senha}
              onChange={(e) =>
                setLogin({ ...login, senha: e.target.value })
              }
            />

            <button type="submit" className="login-btn">
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>📚 Biblioteca</h2>

        <button onClick={() => setMenu("livros")}>
          Lista de Livros
        </button>

        <button onClick={novoLivro}>
          Cadastrar Livro
        </button>

        <button onClick={() => setMenu("historico")}>
          Histórico
        </button>

        <button onClick={sair} className="danger">
          Sair
        </button>
      </aside>

      <main className="content">
        {menu === "livros" && (
          <div className="card">
            <h2>Lista de Livros</h2>

            <div className="top-actions">
              <div className="search-box">
                <input
                  placeholder="Pesquisar por título, autor ou género..."
                  value={pesquisa}
                  onChange={(e) => setPesquisa(e.target.value)}
                />
              </div>

              <button className="novo-btn" onClick={novoLivro}>
                + Novo Livro
              </button>
            </div>

            {livrosFiltrados.length === 0 && (
              <p className="vazio">Nenhum livro encontrado</p>
            )}

            {livrosFiltrados.map((l) => (
              <div className="livro" key={l.id}>
                <div>
                  <strong>{l.titulo}</strong>
                  <small>
                    {l.autor}
                    {l.ano ? ` • ${l.ano}` : ""}
                    {l.genero ? ` • ${l.genero}` : ""}
                  </small>
                </div>

                <div className="livro-acoes">
                  <button
                    className="btn-edit"
                    onClick={() => editar(l)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn-danger"
                    onClick={() => apagar(l.id, l.titulo, l.autor)}
                  >
                    Apagar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {menu === "historico" && (
          <div className="card">
            <h2>📜 Histórico do Sistema</h2>

            {historico.length === 0 ? (
              <p className="vazio">
                Ainda não existem registos no sistema.
              </p>
            ) : (
              historico.map((item, index) => (
                <div className="livro" key={index}>
                  <div>
                    <strong>{item.titulo}</strong>
                    <small>
                      {item.autor} • {item.acao}
                    </small>
                    <br />
                    <small>{item.data}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {mostrarModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>
              {editandoId ? "✏️ Editar Livro" : "➕ Cadastrar Livro"}
            </h2>

            <form onSubmit={submeter}>
              <input
                placeholder="Título"
                value={form.titulo}
                onChange={(e) =>
                  setForm({ ...form, titulo: e.target.value })
                }
                required
              />

              <input
                placeholder="Autor"
                value={form.autor}
                onChange={(e) =>
                  setForm({ ...form, autor: e.target.value })
                }
                required
              />

              <input
                placeholder="Ano"
                value={form.ano}
                onChange={(e) =>
                  setForm({ ...form, ano: e.target.value })
                }
              />

              <input
                placeholder="Gênero"
                value={form.genero}
                onChange={(e) =>
                  setForm({ ...form, genero: e.target.value })
                }
              />

              <div className="modal-actions">
                <button type="submit">
                  {editandoId ? "Atualizar" : "Salvar"}
                </button>

                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => setMostrarModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="footer">
        Desenvolvido por Lisboa Paulo Cossa
      </footer>
    </div>
  );
}
