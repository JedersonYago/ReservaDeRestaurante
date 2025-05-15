import React from "react";

function ListaReservas({ reservas, excluirReserva, editarReserva }) {
  return (
    <div>
      <h2>Reservas</h2>
      <ul>
        {reservas.map((reserva) => (
          <li key={reserva.id}>
            {reserva.nome} - {reserva.data} às {reserva.hora} (
            {reserva.quantidadePessoas} pessoas)
            <button onClick={() => editarReserva(reserva)}>Editar</button>
            <button
              onClick={() => {
                if (
                  window.confirm("Tem certeza que deseja excluir esta reserva?")
                ) {
                  excluirReserva(reserva.id);
                }
              }}
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaReservas;
