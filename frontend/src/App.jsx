import { useEffect, useMemo, useState } from "react";

const API = "https://backend-biblioteca-lisboa.up.railway.app/api/livros";

export default function App() {
  // LOGIN ADMIN
  const [logado, setLogado] = useState(false);
  const [login, setLogin] = useState({ usuario: "", senha: "" });

  // DADOS
  const [livros, setLivros] = useState([]);
  const [form, setForm] = useState({
    titulo: "",
    autor: "",
    ano: "",
    genero: "",
  });

  const [editandoId, setEditandoId] = useState(null);
  const [erro, setErro] = useState("");

  // PESQUISA E FILTRO
  const [pesquisa, setPesquisa] = useState("");
  const [filtroGenero, setFiltroGenero] = useState("Todos");

  // HISTÓRICO
  const [historico, setHistorico] = useState([]);

  const entrar = (e) => {
    e.preventDefault();

    if (login.usuario === "admin" && login.senha === "1234") {
      setLogado(true);
      setErro("");
    } else {
      setErro("Utilizador ou senha inválidos");
    }
  };

  const sair = () => {
    setLogado(false);
    setLogin({ usuario: "", senha: "" });
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

  const submeter = async (e) => {
    e.preventDefault();
    setErro("");

    const metodo = editandoId ? "PUT" : "POST";
    const url = editandoId ? `${API}/${editandoId}` : API;

    const r = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        ano: form.ano ? parseInt(form.ano) : null,
        disponivel: true,
      }),
}
