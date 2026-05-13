import { useEffect, useState } from "react";

const API = "https://backend-biblioteca-lisboa.up.railway.app/api/livros";

export default function App() {
  // LOGIN
  const [logado, setLogado] = useState(false);
  const [login, setLogin] = useState({ usuario: "", senha: "" });
  const [erro, setErro] = useState("");

  // MENU
  const [menu, setMenu] = useState("livros");

  // DADOS
  const [livros, setLivros] = useState([]);
  const [form, setForm] = useState({
    titulo: "",
    autor: "",
    ano: "",
    genero: "",
  });

  const [editandoId, setEditandoId] = useState(null);

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

  const sair = () => {
    setLogado(false);
    setLogin({ usuario: "", senha: "" });
  };

  // CARREGAR LIVROS
  const carregar = async () => {
    const r = await fetch(API);
    const data = await r.json();
    setLivros(data);
  };

  useEffect(() => {
    if (logado) carregar();
  }, [logado]);

  // SUBMIT LIVRO
  const submeter = async (e) => {
    e.preventDefault();

    const metodo = editandoId ? "PUT" : "POST";
    const url = editandoId ? `${API}/${editandoId}` : API;

    await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        ano: form.ano ? parseInt(form.ano) : null,
      }),
    });

    setForm({ titulo: "", autor: "", ano: "", genero: "" });
    setEditandoId(null);
    carregar();
    setMenu("livros");
  };

  // LOGIN SCREEN
  if (!logado) {
    return (
      <div className="login-container">
        <div className="card">
          <h1>📚 Biblioteca - Lisboa Cossa</h1>
          <p>Acesso restrito</p>

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

            <button type="submit">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  // SISTEMA PRINCIPAL
  return (
    <div className="layout">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>📚 Biblioteca</h2>

        <button onClick={() => setMenu("livros")}>Livros</button>
        <button onClick={() => setMenu("cadastro")}>Cadastrar</button>
        <button onClick={() => setMenu("historico")}>Histórico</button>

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

            {livros.length === 0 && (
              <p className="vazio">Nenhum livro encontrado</p>
            )}

            {livros.map((l) => (
              <div className="livro" key={l.id}>
                <div>
                  <strong>{l.titulo}</strong>
                  <small>{l.autor} • {l.ano}</small>
                </div>

                <button
                  onClick={() => {
                    setForm(l);
                    setEditandoId(l.id);
                    setMenu("cadastro");
                  }}
                >
                  Editar
                </button>
              </div>
            ))}
          </div>
        )}

        {/* CADASTRO */}
        {menu === "cadastro" && (
          <div className="card">
            <h2>{editandoId ? "Editar Livro" : "Cadastrar Livro"}</h2>

            <form onSubmit={submeter}>
              <input
                placeholder="Título"
                value={form.titulo}
                onChange={(e) =>
                  setForm({ ...form, titulo: e.target.value })
                }
              />

              <input
                placeholder="Autor"
                value={form.autor}
                onChange={(e) =>
                  setForm({ ...form, autor: e.target.value })
                }
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

              <button type="submit">
                {editandoId ? "Atualizar" : "Salvar"}
              </button>
            </form>
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
    </div>
  );
}
