import React, { useState, useEffect } from "react";

function ConfiguracoesAdmin({ reservas }) {
  const [numMesas, setNumMesas] = useState(() => {
    return parseInt(localStorage.getItem("numMesas")) || 0;
  });
  const [horarios, setHorarios] = useState(() => {
    return localStorage.getItem("horarios") || "";
  });

  useEffect(() => {
    localStorage.setItem("numMesas", numMesas);
  }, [numMesas]);

  useEffect(() => {
    localStorage.setItem("horarios", horarios);
  }, [horarios]);

  const mesasReservadasHoje = reservas.filter(r => {
    const hoje = new Date().toISOString().split("T")[0];
    return r.data === hoje;
  }).length;

  const mesasDisponiveis = numMesas - mesasReservadasHoje;

  return (
    <div className="configuracoes-admin">
      <h3>Configurações Administrativas</h3>

      <div>
        <label>Definir número de mesas disponíveis para hoje:</label>
        <input
          type="number"
          value={numMesas}
          onChange={(e) => setNumMesas(parseInt(e.target.value) || 0)}
        />
        <p>Mesas já reservadas hoje: {mesasReservadasHoje}</p>
        <p>Mesas disponíveis restantes: {mesasDisponiveis >= 0 ? mesasDisponiveis : 0}</p>
      </div>

      <div>
        <label>Horários de funcionamento (ex: 10:00-22:00):</label>
        <input
          type="text"
          value={horarios}
          onChange={(e) => setHorarios(e.target.value)}
        />
      </div>
    </div>
  );
}

export default ConfiguracoesAdmin;

