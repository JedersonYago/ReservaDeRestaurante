import React, { useState, useEffect } from "react";

function FormularioReserva({
  adicionarReserva,
  editarReserva,
  reservaEditada,
  reservas,
}) {
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [quantidadePessoas, setQuantidadePessoas] = useState("");

  useEffect(() => {
    if (reservaEditada) {
      setNome(reservaEditada.nome);
      setData(reservaEditada.data);
      setHora(reservaEditada.hora);
      setQuantidadePessoas(reservaEditada.quantidadePessoas);
    }
  }, [reservaEditada]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome || !data || !hora || !quantidadePessoas) {
      alert("Preencha todos os campos!");
      return;
    }

    const conflito = reservas.find(
      (r) =>
        r.data === data &&
        r.hora === hora &&
        (!reservaEditada || r.id !== reservaEditada.id)
    );
    if (conflito) {
      alert("Já existe uma reserva para esse horário.");
      return;
    }

    const novaReserva = {
      id: reservaEditada ? reservaEditada.id : Date.now(),
      nome,
      data,
      hora,
      quantidadePessoas,
    };

    reservaEditada ? editarReserva(novaReserva) : adicionarReserva(novaReserva);

    setNome("");
    setData("");
    setHora("");
    setQuantidadePessoas("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{reservaEditada ? "Editar" : "Nova"} Reserva</h2>
      <input
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <input
        type="date"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
      <input
        type="time"
        value={hora}
        onChange={(e) => setHora(e.target.value)}
      />
      <input
        type="number"
        placeholder="Número de pessoas"
        value={quantidadePessoas}
        onChange={(e) => setQuantidadePessoas(e.target.value)}
        min={1}
      />
      <button type="submit">Salvar</button>
    </form>
  );
}

export default FormularioReserva;
