import { useEffect, useState } from "react";

const API = "https://backend-biblioteca-lisboa.up.railway.app/api/livros";

export default function App() {
  // LOGIN
  const [logado, setLogado] = useState(false);
  const [login, setLogin] = useState({
    usuario: "",
    senha: "",
  });

  const [erro, setErro] = useState("");

  // MENU
  const [menu, setMenu] = useState("livros");

  // DADOS
  const [livros, setLivros] = useState([]);
  const [pesquisa, setPesquisa] = useState("");

  const [form, setForm] = useState({
    titulo: "",
    autor: "",
    ano: "",
    genero: "",
  });

  const [editandoId, setEditandoId] = useState(null);

  // POPUP
  const [mostrarModal, setMostrarModal] = useState(false);

  // LOGIN
  const entrar = (e) => {
    e.preventDefault();

    if (login.usuario === "admin" && login.senha === "1234") {
      setLogado(true);
      setErro("");
    } else {
      setErro("Usuário ou senha inválidos");
    }
  };

  // SAIR
  const sair = () => {
    const confirmar = window.confirm("Deseja realmente sair do sistema?");

    if (confirmar) {
      setLogado(false);
      setLogin({
        usuario: "",
        senha: "",
      });
    }
  };

  // CARREGAR LIVROS
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

  // ABRIR MODAL NOVO
  const novoLivro = () => {
    setForm({
      titulo: "",
      autor: "",
      ano: "",
      genero: "",
    });

    setEditandoId(null);
    setMostrarModal(true);
  };

  // EDITAR
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

  // SALVAR
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

    alert(
      editandoId
        ? "Livro atualizado com sucesso!"
        : "Livro cadastrado com sucesso!"
    );

    setForm({
      titulo: "",
      autor: "",
      ano: "",
      genero: "",
    });

    setEditandoId(null);
    setMostrarModal(false);
    carregar();
  };

  // APAGAR
  const apagar = async (id) => {
    const confirmar = window.confirm(
      "Deseja realmente apagar este livro?"
    );

    if (!confirmar) return;

    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    alert("Livro apagado com sucesso!");
    carregar();
  };

  // PESQUISA
  const livrosFiltrados = livros.filter((l) =>
    l.titulo.toLowerCase().includes(pesquisa.toLowerCase()) ||
    l.autor.toLowerCase().includes(pesquisa.toLowerCase()) ||
    (l.genero || "").toLowerCase().includes(pesquisa.toLowerCase())
  );

  // LOGIN SCREEN
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
                setLogin({
                  ...login,
                  usuario: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Senha"
              value={login.senha}
              onChange={(e) =>
                setLogin({
                  ...login,
                  senha: e.target.value,
                })
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

  // SISTEMA
  return (
    <div className="layout">

      {/* SIDEBAR */}
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

      {/* CONTEÚDO */}
      <main className="content">

        {/* LIVROS */}
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

              <button
                className="novo-btn"
                onClick={novoLivro}
              >
                + Novo Livro
              </button>
            </div>

            {livrosFiltrados.length === 0 && (
              <p className="vazio">
                Nenhum livro encontrado
              </p>
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
                    onClick={() => apagar(l.id)}
                  >
                    Apagar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* HISTÓRICO */}
        {menu === "historico" && (
          <div className="card">
            <h2>Histórico</h2>
            <p className="vazio">
              Sistema de histórico em desenvolvimento...
            </p>
          </div>
        )}
      </main>

      {/* MODAL CADASTRO / EDIÇÃO */}
      {mostrarModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>
              {editandoId
                ? "✏️ Editar Livro"
                : "➕ Cadastrar Livro"}
            </h2>

            <form onSubmit={submeter}>
              <input
                placeholder="Título"
                value={form.titulo}
                onChange={(e) =>
                  setForm({
                    ...form,
                    titulo: e.target.value,
                  })
                }
                required
              />

              <input
                placeholder="Autor"
                value={form.autor}
                onChange={(e) =>
                  setForm({
                    ...form,
                    autor: e.target.value,
                  })
                }
                required
              />

              <input
                placeholder="Ano"
                value={form.ano}
                onChange={(e) =>
                  setForm({
                    ...form,
                    ano: e.target.value,
                  })
                }
              />

              <input
                placeholder="Gênero"
                value={form.genero}
                onChange={(e) =>
                  setForm({
                    ...form,
                    genero: e.target.value,
                  })
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
    </div>
  );
}
