import React, { useEffect, useState } from "react";
import { configApi } from "../../services/api";
import type { Config } from "../../types/config";
import styled from "styled-components";
import { Header } from "../../components/Header";

const defaultConfig: Config = {
  maxReservationsPerUser: 5,
  reservationLimitHours: 24,
  minIntervalBetweenReservations: 30,
  openingHour: "11:00",
  closingHour: "23:00",
  isReservationLimitEnabled: true,
  isIntervalEnabled: true,
  isOpeningHoursEnabled: true,
};

export function Settings() {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    configApi
      .getConfig()
      .then((data) => {
        setConfig(data as Config);
        setLoading(false);
      })
      .catch(() => {
        setError("Erro ao carregar configurações");
        setLoading(false);
      });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        maxReservationsPerUser: Number(config.maxReservationsPerUser),
        reservationLimitHours: Number(config.reservationLimitHours),
        minIntervalBetweenReservations: Number(
          config.minIntervalBetweenReservations
        ),
        openingHour: config.openingHour,
        closingHour: config.closingHour,
        isReservationLimitEnabled: config.isReservationLimitEnabled,
        isIntervalEnabled: config.isIntervalEnabled,
        isOpeningHoursEnabled: config.isOpeningHoursEnabled,
      };

      console.log("🚀 Enviando payload:", payload);
      await configApi.updateConfig(payload);
      setSuccess("Configurações salvas com sucesso!");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Carregando...</div>;

  return (
    <>
      <Header />
      <Container>
        <h2>Configurações do Sistema</h2>
        <form onSubmit={handleSubmit}>
          <ConfigSection>
            <h3>Horários de Funcionamento</h3>
            <SwitchContainer>
              <label>
                <input
                  type="checkbox"
                  name="isOpeningHoursEnabled"
                  checked={config.isOpeningHoursEnabled}
                  onChange={handleChange}
                />
                Ativar restrição de horários
              </label>
            </SwitchContainer>
            {config.isOpeningHoursEnabled && (
              <>
                <div>
                  <label>Horário de abertura:</label>
                  <input
                    type="time"
                    name="openingHour"
                    value={config.openingHour}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Horário de fechamento:</label>
                  <input
                    type="time"
                    name="closingHour"
                    value={config.closingHour}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}
          </ConfigSection>

          <ConfigSection>
            <h3>Tempo de Confirmação</h3>
            <SwitchContainer>
              <label>
                <input
                  type="checkbox"
                  name="isIntervalEnabled"
                  checked={config.isIntervalEnabled}
                  onChange={handleChange}
                />
                Ativar tempo de confirmação automática
              </label>
            </SwitchContainer>
            {config.isIntervalEnabled && (
              <div>
                <label>Tempo até confirmação automática (minutos):</label>
                <input
                  type="number"
                  name="minIntervalBetweenReservations"
                  min={1}
                  max={120}
                  value={config.minIntervalBetweenReservations}
                  onChange={handleChange}
                  required
                />
                <small
                  style={{ display: "block", color: "#666", marginTop: "4px" }}
                >
                  Reservas ficam pendentes por este tempo, permitindo
                  cancelamento pelo cliente. Após o tempo definido, são
                  confirmadas automaticamente.
                </small>
              </div>
            )}
          </ConfigSection>

          <ConfigSection>
            <h3>Limite de Reservas por Usuário</h3>
            <SwitchContainer>
              <label>
                <input
                  type="checkbox"
                  name="isReservationLimitEnabled"
                  checked={config.isReservationLimitEnabled}
                  onChange={handleChange}
                />
                Ativar limite de reservas por usuário
              </label>
            </SwitchContainer>
            {config.isReservationLimitEnabled && (
              <>
                <div>
                  <label>Máximo de reservas por usuário:</label>
                  <input
                    type="number"
                    name="maxReservationsPerUser"
                    min={1}
                    max={20}
                    value={config.maxReservationsPerUser}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Período de limitação (horas):</label>
                  <input
                    type="number"
                    name="reservationLimitHours"
                    min={1}
                    max={168}
                    value={config.reservationLimitHours}
                    onChange={handleChange}
                    required
                  />
                  <small
                    style={{
                      display: "block",
                      color: "#666",
                      marginTop: "4px",
                    }}
                  >
                    Por exemplo: 5 reservas a cada 24 horas. O usuário só poderá
                    fazer mais reservas após o período definido.
                  </small>
                </div>
              </>
            )}
          </ConfigSection>

          <button type="submit" disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </button>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
        </form>
      </Container>
    </>
  );
}

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;

  h2 {
    margin-bottom: 2rem;
    color: #333;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
`;

const ConfigSection = styled.section`
  background: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;

  h3 {
    margin-bottom: 1rem;
    color: #333;
  }

  > div {
    margin-bottom: 1rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #666;
    }

    input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;

      &[type="number"] {
        width: 150px;
      }
    }
  }
`;

const SwitchContainer = styled.div`
  margin-bottom: 1rem;

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  input[type="checkbox"] {
    width: auto;
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  margin-top: 1rem;
  padding: 0.5rem;
  background: #ffebee;
  border-radius: 4px;
`;

const SuccessMessage = styled.div`
  color: #2e7d32;
  margin-top: 1rem;
  padding: 0.5rem;
  background: #e8f5e9;
  border-radius: 4px;
`;
