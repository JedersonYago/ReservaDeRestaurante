import React, { useState, useEffect } from "react";
import FormularioReserva from "./components/FormularioReserva";
import ListaReservas from "./components/ListaReservas";
import "./App.css";

function App() {
  const [reservas, setReservas] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cadastroUsername, setCadastroUsername] = useState("");
  const [cadastroPassword, setCadastroPassword] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("cliente");
  const [tipoLogado, setTipoLogado] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [reservaEditada, setReservaEditada] = useState(null);
  const [isCadastro, setIsCadastro] = useState(false);
  const [codigoEmpresa, setCodigoEmpresa] = useState(""); // NOVO
  const [dataInvalida, setDataInvalida] = useState(false); // Para armazenar o estado da data inválida

  const hoje = new Date().toISOString().split("T")[0]; // Data atual no formato YYYY-MM-DD

  useEffect(() => {
    const reservasSalvas = localStorage.getItem("reservas");
    if (reservasSalvas) {
      setReservas(JSON.parse(reservasSalvas));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("reservas", JSON.stringify(reservas));
  }, [reservas]);

  // Função para verificar se a data selecionada é válida
  const verificarData = (dataSelecionada) => {
    if (dataSelecionada < hoje) {
      setDataInvalida(true); // Marca a data como inválida
      return false; // Retorna falso, pois a data não é válida
    } else {
      setDataInvalida(false); // Marca a data como válida
      return true; // Retorna verdadeiro, pois a data é válida
    }
  };

  const adicionarReserva = (reserva) => {
    if (!verificarData(reserva.data)) {
      alert("Não é possível reservar para uma data anterior ao dia de hoje.");
      return; // Não adiciona a reserva se a data for inválida
    }
    setReservas([...reservas, reserva]);
  };

  const editarReserva = (novaReserva) => {
    if (!verificarData(novaReserva.data)) {
      alert("Não é possível editar para uma data anterior ao dia de hoje.");
      return; // Não edita a reserva se a data for inválida
    }
    const reservasAtualizadas = reservas.map((reserva) =>
      reserva.id === novaReserva.id ? novaReserva : reserva
    );
    setReservas(reservasAtualizadas);
    setReservaEditada(null);
  };

  const excluirReserva = (id) => {
    const novasReservas = reservas.filter((reserva) => reserva.id !== id);
    setReservas(novasReservas);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const usuarioSalvo = localStorage.getItem(username);
    if (usuarioSalvo) {
      const dados = JSON.parse(usuarioSalvo);
      if (dados.senha === password) {
        setIsLoggedIn(true);
        setTipoLogado(dados.tipo);
      } else {
        alert("Senha incorreta.");
      }
    } else {
      alert("Usuário não encontrado.");
    }
  };

  const handleCadastro = (e) => {
    e.preventDefault();
    if (!cadastroUsername.trim() || !cadastroPassword.trim()) {
      alert("Preencha todos os campos!");
      return;
    }
    if (cadastroPassword.length < 4) {
      alert("A senha deve ter pelo menos 4 caracteres.");
      return;
    }
    if (localStorage.getItem(cadastroUsername)) {
      alert("Este nome de usuário já está em uso.");
      return;
    }

    if (tipoUsuario === "admin" && codigoEmpresa !== "ADM2025") {
      alert("Código da empresa inválido para cadastro de administrador.");
      return;
    }

    const dadosUsuario = {
      senha: cadastroPassword,
      tipo: tipoUsuario,
    };

    localStorage.setItem(cadastroUsername, JSON.stringify(dadosUsuario));
    alert("Cadastro realizado com sucesso!");
    setIsCadastro(false);
    setCadastroUsername("");
    setCadastroPassword("");
    setCodigoEmpresa("");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setTipoLogado("");
  };

  const reservasFiltradas = reservas.filter((reserva) =>
    filtroData ? reserva.data === filtroData : true
  );

  const horarioMaisReservado = (() => {
    const contagem = {};
    reservasFiltradas.forEach((r) => {
      contagem[r.hora] = (contagem[r.hora] || 0) + 1;
    });
    const maisComum = Object.entries(contagem).sort((a, b) => b[1] - a[1])[0];
    return maisComum ? `${maisComum[0]} (${maisComum[1]} reservas)` : "N/A";
  })();

  return (
    <div className="App">
      <h1>Bem-vindo ao Restaurante Delícia</h1>

      {!isLoggedIn ? (
        isCadastro ? (
          <form onSubmit={handleCadastro}>
            <h2>Cadastro</h2>
            <input
              placeholder="Usuário"
              value={cadastroUsername}
              onChange={(e) => setCadastroUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Senha"
              value={cadastroPassword}
              onChange={(e) => setCadastroPassword(e.target.value)}
            />
            <select
              value={tipoUsuario}
              onChange={(e) => setTipoUsuario(e.target.value)}
            >
              <option value="cliente">Cliente</option>
              <option value="admin">Administrador</option>
            </select>

            {tipoUsuario === "admin" && (
              <input
                placeholder="Código da Empresa"
                value={codigoEmpresa}
                onChange={(e) => setCodigoEmpresa(e.target.value)}
              />
            )}

            <button type="submit">Cadastrar</button>
            <p>
              Já tem conta?{" "}
              <button type="button" onClick={() => setIsCadastro(false)}>
                Entrar
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Entrar</button>
            <p>
              Não tem conta?{" "}
              <button type="button" onClick={() => setIsCadastro(true)}>
                Cadastrar
              </button>
            </p>
          </form>
        )
      ) : (
        <>
          <p>
            Usuário logado: {username} ({tipoLogado})
          </p>
          <button onClick={handleLogout}>Sair</button>
          <input
            type="date"
            value={filtroData}
            onChange={(e) => {
              const dataSelecionada = e.target.value;
              setFiltroData(dataSelecionada);
              verificarData(dataSelecionada); // Verifica se a data é válida
            }}
            min={hoje} // Impede datas passadas
          />
          {dataInvalida && (
            <p style={{ color: "red" }}>Não é possível selecionar uma data anterior ao dia de hoje.</p>
          )}

          <div className="painel-resumo">
            <h3>Resumo do Dia</h3>
            <p>Total de reservas: {reservasFiltradas.length}</p>
            <p>Horário mais reservado: {horarioMaisReservado}</p>
          </div>

          <FormularioReserva
            adicionarReserva={adicionarReserva}
            editarReserva={editarReserva}
            reservaEditada={reservaEditada}
            reservas={reservas}
          />
          <ListaReservas
            reservas={reservasFiltradas}
            excluirReserva={tipoLogado === "admin" ? excluirReserva : null}
            editarReserva={
              tipoLogado === "admin"
                ? (reserva) => setReservaEditada(reserva)
                : null
            }
          />
        </>
      )}
    </div>
  );
}

export default App;
