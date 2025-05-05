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
  const [filtroData, setFiltroData] = useState("");
  const [reservaEditada, setReservaEditada] = useState(null);
  const [isCadastro, setIsCadastro] = useState(false);

  useEffect(() => {
    const reservasSalvas = localStorage.getItem("reservas");
    if (reservasSalvas) {
      setReservas(JSON.parse(reservasSalvas));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("reservas", JSON.stringify(reservas));
  }, [reservas]);

  const adicionarReserva = (reserva) => {
    setReservas([...reservas, reserva]);
  };

  const editarReserva = (novaReserva) => {
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
    if (usuarioSalvo && usuarioSalvo === password) {
      setIsLoggedIn(true);
    } else {
      alert("Usuário ou senha incorretos.");
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
    localStorage.setItem(cadastroUsername, cadastroPassword);
    alert("Cadastro realizado com sucesso!");
    setIsCadastro(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
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
          <button onClick={handleLogout}>Sair</button>
          <input
            type="date"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
          />

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
            excluirReserva={excluirReserva}
            editarReserva={(reserva) => setReservaEditada(reserva)}
          />
        </>
      )}
    </div>
  );
}

export default App;
