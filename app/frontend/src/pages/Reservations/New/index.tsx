import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTables } from "../../../hooks/useTables";
import { useReservations } from "../../../hooks/useReservations";
import { useAuth } from "../../../hooks/useAuth";
import { useConfig } from "../../../hooks/useConfig";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Select } from "../../../components/Select";
import { toast } from "react-toastify";
import { Container, Title, Form, FormGroup, ButtonGroup } from "./styles";
import { isPastDate, isPastTime } from "../../../utils/dateValidation";

export function NewReservation() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { tables } = useTables();
  const { createReservation } = useReservations();
  const { config } = useConfig();
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [availableHours, setAvailableHours] = useState<
    { start: string; end: string; reserved: boolean }[]
  >([]);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    customerName: user?.name || "",
    customerEmail: user?.email || "",
    observations: "",
  });
  const [dateLimits, setDateLimits] = useState({ min: "", max: "" });
  const [loadingHours, setLoadingHours] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");

  useEffect(() => {
    if (!user) {
      toast.error("Você precisa estar logado para fazer uma reserva");
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  // Filtrar apenas mesas disponíveis
  const availableTables = tables?.filter(
    (table) => table.status === "available"
  );

  // Utilitário para obter datas que ainda têm horários disponíveis
  function getAvailableDates(table: any) {
    if (!table?.availability) return [];

    return table.availability
      .filter((block: any) => {
        // Verificar se a data tem pelo menos um horário disponível
        const reservedTimes = (table.reservations || [])
          .filter(
            (r: any) =>
              r.date === block.date &&
              ["pending", "confirmed"].includes(r.status)
          )
          .map((r: any) => r.time);

        // Contar quantos horários estão livres
        const availableTimes = block.times.filter((timeRange: string) => {
          const [start] = timeRange.split("-");
          return !reservedTimes.includes(start);
        });

        // Só incluir a data se houver pelo menos um horário disponível
        return availableTimes.length > 0;
      })
      .map((block: any) => block.date);
  }

  // Utilitário para obter horários disponíveis para uma data, filtrando horários já reservados
  function getAvailableTimes(table: any, date: string) {
    const block = table?.availability?.find((b: any) => b.date === date);
    if (!block) return [];
    // Se houver reservas para a data/mesa, filtrar horários já reservados
    const reservedTimes = (table.reservations || [])
      .filter(
        (r: any) =>
          r.date === date && ["pending", "confirmed"].includes(r.status)
      )
      .map((r: any) => r.time);
    return block.times
      .map((t: string) => {
        const [start, end] = t.split("-");
        return { start, end, reserved: reservedTimes.includes(start) };
      })
      .filter((h: any) => !h.reserved);
  }

  useEffect(() => {
    if (selectedTable) {
      const table = tables?.find((t) => t._id === selectedTable);
      if (table) {
        const dates = getAvailableDates(table);
        setDateLimits({
          min: dates.length > 0 ? dates[0] : "",
          max: dates.length > 0 ? dates[dates.length - 1] : "",
        });
        setAvailableHours([]);
        setFormData((prev) => ({ ...prev, date: "", time: "" }));
      }
    } else {
      setDateLimits({ min: "", max: "" });
      setAvailableHours([]);
      setFormData((prev) => ({ ...prev, date: "", time: "" }));
    }
  }, [selectedTable, tables]);

  useEffect(() => {
    if (formData.date && selectedTable) {
      setLoadingHours(true);
      const table = tables?.find((t) => t._id === selectedTable);
      if (table) {
        const times = getAvailableTimes(table, formData.date);
        setAvailableHours(times);
      }
      setLoadingHours(false);
    }
  }, [formData.date, selectedTable, tables]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, customerName: value }));
    if (!value) {
      setNameError("O nome é obrigatório.");
    } else if (value.length > 40) {
      setNameError("O nome deve ter no máximo 40 caracteres.");
    } else {
      setNameError("");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, customerEmail: value }));
    if (!value) {
      setEmailError("O e-mail é obrigatório.");
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
      setEmailError("E-mail inválido.");
    } else {
      setEmailError("");
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, date: value, time: "" }));
    if (isPastDate(value)) {
      setDateError("Não é permitido selecionar datas anteriores ao dia atual.");
    } else {
      setDateError("");
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, time: value }));
    if (isPastTime(formData.date, value)) {
      setTimeError("Não é permitido selecionar horários anteriores ao atual.");
    } else {
      setTimeError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Você precisa estar logado para fazer uma reserva");
      return;
    }
    if (!selectedTable) {
      toast.error("Selecione uma mesa");
      return;
    }

    const reservationData = {
      ...formData,
      tableId: selectedTable,
      userId: user._id,
    };

    try {
      await createReservation.mutateAsync(reservationData);
      const confirmationMessage =
        config && config.isIntervalEnabled
          ? `Reserva criada com sucesso! Ela ficará pendente por ${config.minIntervalBetweenReservations} minutos.`
          : "Reserva criada com sucesso!";
      toast.success(confirmationMessage);
      navigate("/reservations");
    } catch (error: any) {
      console.error("[NewReservation] Erro ao criar reserva:", error);
      toast.error(error.response?.data?.error || "Erro ao criar reserva");
    }
  };

  const handleCancel = () => {
    navigate("/reservations");
  };

  return (
    <Container>
      <Title>Nova Reserva</Title>

      {/* Seção informativa sobre o processo de confirmação */}
      {config && config.isIntervalEnabled && (
        <div
          style={{
            backgroundColor: "#e3f2fd",
            border: "1px solid #2196f3",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "24px",
          }}
        >
          <h4 style={{ margin: "0 0 8px 0", color: "#1976d2" }}>
            📅 Como funciona sua reserva
          </h4>
          <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.5" }}>
            Sua reserva ficará{" "}
            <strong>
              pendente por {config.minIntervalBetweenReservations} minutos
            </strong>{" "}
            após a criação. Durante este período, você pode cancelá-la se
            necessário. Após {config.minIntervalBetweenReservations} minutos,
            ela será <strong>confirmada automaticamente</strong>.
          </p>
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Select
            label="Mesa"
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            required
          >
            <option value="">Selecione uma mesa</option>
            {availableTables?.map((table) => (
              <option key={table._id} value={table._id}>
                Mesa {table.name} - Capacidade: {table.capacity} pessoas
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Input
            label="Data"
            type="date"
            value={formData.date}
            onChange={handleDateChange}
            min={dateLimits.min}
            max={dateLimits.max}
            required
            list="available-dates"
          />
          <datalist id="available-dates">
            {selectedTable &&
              tables &&
              getAvailableDates(
                tables.find((t) => t._id === selectedTable)
              )?.map((date: string) => <option key={date} value={date} />)}
          </datalist>
          {dateError && (
            <div style={{ color: "red", marginTop: 4 }}>{dateError}</div>
          )}
        </FormGroup>

        <FormGroup>
          {loadingHours ? (
            <div style={{ color: "#888" }}>Carregando horários...</div>
          ) : availableHours.length === 0 ? (
            <div style={{ color: "#888" }}>
              Nenhum horário disponível para esta data.
            </div>
          ) : (
            <Select
              label="Horário"
              value={formData.time}
              onChange={handleTimeChange}
              required
              disabled={loadingHours || !formData.date}
            >
              <option value="">Selecione um horário</option>
              {availableHours.map((hour, index) => (
                <option
                  key={index}
                  value={hour.start}
                  disabled={isPastTime(formData.date, hour.start)}
                >
                  {hour.start} - {hour.end}
                </option>
              ))}
            </Select>
          )}
          {timeError && (
            <div style={{ color: "red", marginTop: 4 }}>{timeError}</div>
          )}
        </FormGroup>

        <FormGroup>
          <Input
            label="Nome"
            value={formData.customerName}
            onChange={handleNameChange}
            required
            maxLength={40}
          />
          {nameError && (
            <div style={{ color: "red", marginTop: 4 }}>{nameError}</div>
          )}
        </FormGroup>

        <FormGroup>
          <Input
            label="Email"
            type="email"
            value={formData.customerEmail}
            onChange={handleEmailChange}
            required
          />
          {emailError && (
            <div style={{ color: "red", marginTop: 4 }}>{emailError}</div>
          )}
        </FormGroup>

        <FormGroup>
          <label style={{ display: "block", marginBottom: 4 }}>
            Observações
          </label>
          <textarea
            value={formData.observations}
            onChange={(e) =>
              setFormData({
                ...formData,
                observations: e.target.value.slice(0, 50),
              })
            }
            style={{ width: "100%", minHeight: 60, resize: "vertical" }}
            placeholder="Observações (opcional)"
            maxLength={50}
          />
          <div
            style={{
              textAlign: "right",
              fontSize: "0.8rem",
              color: "#666",
              marginTop: 4,
            }}
          >
            {formData.observations.length}/50 caracteres
          </div>
        </FormGroup>

        <ButtonGroup>
          <Button
            type="submit"
            disabled={!!nameError || !!emailError || !!dateError || !!timeError}
          >
            Fazer Reserva
          </Button>
          <Button type="button" $variant="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
}
