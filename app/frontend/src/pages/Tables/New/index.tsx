import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { eachDayOfInterval } from "date-fns/eachDayOfInterval";
import { parseISO } from "date-fns/parseISO";
import { Container, Title } from "../styles";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Select } from "../../../components/Select";
import { useTables } from "../../../hooks/useTables";
import { useConfig } from "../../../hooks/useConfig";
import {
  isPastDate,
  isPastTime,
  getTodayString,
  getCurrentTimeString,
} from "../../../utils/dateValidation";
import {
  validateTimeIntervalAgainstBusinessHours,
  validateMultipleTimeIntervals,
} from "../../../utils/timeValidation";

type TimeInterval = {
  startTime: string;
  endTime: string;
};

type AvailabilityItem = {
  date: string;
  intervals: TimeInterval[];
};

type AvailabilityMode = "by_period" | "custom";

export function NewTable() {
  const navigate = useNavigate();
  const { createTable, tables } = useTables();
  const { config } = useConfig();

  // Campos básicos
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");

  // Campos de disponibilidade
  const [availabilityMode, setAvailabilityMode] =
    useState<AvailabilityMode>("by_period");

  // Campos para modo "by_period"
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timeIntervals, setTimeIntervals] = useState<TimeInterval[]>([]);
  const [currentStartTime, setCurrentStartTime] = useState("");
  const [currentEndTime, setCurrentEndTime] = useState("");

  // Campos para modo "custom"
  const [customDate, setCustomDate] = useState("");
  const [customAvailability, setCustomAvailability] = useState<
    AvailabilityItem[]
  >([]);

  const [isSaving, setIsSaving] = useState(false);
  const startTimeRef = useRef<HTMLInputElement | null>(null);
  const [nameError, setNameError] = useState("");
  const [capacityError, setCapacityError] = useState("");
  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [businessHoursWarning, setBusinessHoursWarning] = useState("");

  const handleAddTimeInterval = () => {
    if (!currentStartTime || !currentEndTime) {
      toast.error("Preencha os horários de início e fim");
      return;
    }
    if (isPastDate(startDate) || isPastDate(endDate)) {
      setDateError("Não é permitido selecionar datas anteriores ao dia atual.");
      return;
    } else {
      setDateError("");
    }
    if (
      isPastTime(startDate, currentStartTime) ||
      isPastTime(endDate, currentEndTime)
    ) {
      setTimeError("Não é permitido selecionar horários anteriores ao atual.");
      return;
    } else {
      setTimeError("");
    }
    if (currentStartTime >= currentEndTime) {
      toast.error("O horário de início deve ser menor que o horário de fim");
      return;
    }
    if (
      timeIntervals.some(
        (i) => i.startTime === currentStartTime && i.endTime === currentEndTime
      )
    ) {
      toast.error("Esse intervalo já foi adicionado");
      return;
    }

    // Validação de horário de funcionamento é feita individualmente na exibição

    setTimeIntervals([
      ...timeIntervals,
      { startTime: currentStartTime, endTime: currentEndTime },
    ]);
    setCurrentStartTime("");
    setCurrentEndTime("");
    setTimeout(() => startTimeRef.current?.focus(), 100);
  };

  const handleRemoveTimeInterval = (index: number) => {
    setTimeIntervals(timeIntervals.filter((_, i) => i !== index));
  };

  const handleAddCustomAvailability = () => {
    if (!customDate || !currentStartTime || !currentEndTime) {
      toast.error("Preencha todos os campos");
      return;
    }
    if (isPastDate(customDate)) {
      setDateError("Não é permitido selecionar datas anteriores ao dia atual.");
      return;
    } else {
      setDateError("");
    }
    if (isPastTime(customDate, currentStartTime)) {
      setTimeError("Não é permitido selecionar horários anteriores ao atual.");
      return;
    } else {
      setTimeError("");
    }
    if (currentStartTime >= currentEndTime) {
      toast.error("O horário de início deve ser menor que o horário de fim");
      return;
    }
    if (
      customAvailability.some(
        (item) =>
          item.date === customDate &&
          item.intervals.some(
            (i) =>
              i.startTime === currentStartTime && i.endTime === currentEndTime
          )
      )
    ) {
      toast.error("Esse horário já foi adicionado para essa data");
      return;
    }
    const existing = customAvailability.find(
      (item) => item.date === customDate
    );
    if (
      existing &&
      existing.intervals.some(
        (i) => currentStartTime < i.endTime && currentEndTime > i.startTime
      )
    ) {
      toast.error("Horário sobreposto para essa data");
      return;
    }
    // Validação de horário de funcionamento é feita individualmente na exibição

    const newInterval = {
      startTime: currentStartTime,
      endTime: currentEndTime,
    };
    setCustomAvailability((prev) => {
      const existingDate = prev.find((item) => item.date === customDate);
      if (existingDate) {
        return prev.map((item) =>
          item.date === customDate
            ? { ...item, intervals: [...item.intervals, newInterval] }
            : item
        );
      }
      return [...prev, { date: customDate, intervals: [newInterval] }];
    });
    setCurrentStartTime("");
    setCurrentEndTime("");
    setTimeout(() => startTimeRef.current?.focus(), 100);
  };

  const handleRemoveCustomAvailability = (
    date: string,
    intervalIndex: number
  ) => {
    setCustomAvailability(
      (prev) =>
        prev
          .map((item) => {
            if (item.date === date) {
              const newIntervals = item.intervals.filter(
                (_, i) => i !== intervalIndex
              );
              return newIntervals.length > 0
                ? { ...item, intervals: newIntervals }
                : null;
            }
            return item;
          })
          .filter(Boolean) as AvailabilityItem[]
    );
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (value.length > 20) {
      setNameError("O nome deve ter no máximo 20 caracteres.");
    } else if (
      tables?.some((t) => t.name.toLowerCase() === value.trim().toLowerCase())
    ) {
      setNameError("Já existe uma mesa com esse nome.");
    } else {
      setNameError("");
    }
  };

  const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCapacity(value);
    if (!value || isNaN(Number(value)) || Number(value) <= 0) {
      setCapacityError("A capacidade deve ser um número positivo.");
    } else {
      setCapacityError("");
    }
  };

  // Obter data e hora atuais para validações
  const todayStr = getTodayString();
  const currentTimeStr = getCurrentTimeString();

  // Função para verificar se um horário específico está fora do funcionamento
  const getBusinessHoursWarningForInterval = (
    startTime: string,
    endTime: string
  ) => {
    const validation = validateTimeIntervalAgainstBusinessHours(
      startTime,
      endTime,
      config || null
    );
    return validation.isValid ? null : validation.warning;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !capacity) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    let availability: AvailabilityItem[] = [];
    if (availabilityMode === "by_period") {
      if (!startDate || !endDate || timeIntervals.length === 0) {
        toast.error("Preencha todos os campos de disponibilidade");
        return;
      }
      const dates = eachDayOfInterval({
        start: parseISO(startDate),
        end: parseISO(endDate),
      });
      availability = dates.map((date: Date) => ({
        date: format(date, "yyyy-MM-dd"),
        intervals: timeIntervals,
      }));
    } else {
      if (customAvailability.length === 0) {
        toast.error("Adicione pelo menos uma disponibilidade");
        return;
      }
      availability = customAvailability;
    }
    setIsSaving(true);
    try {
      await createTable({
        name,
        capacity: parseInt(capacity),
        availability: availability.map(({ date, intervals }) => ({
          date,
          times: intervals.map(
            (interval) => `${interval.startTime}-${interval.endTime}`
          ),
        })),
      });
      setName("");
      setCapacity("");
      setStartDate("");
      setEndDate("");
      setTimeIntervals([]);
      setCustomDate("");
      setCustomAvailability([]);
      setCurrentStartTime("");
      setCurrentEndTime("");
      navigate("/tables");
    } catch (error: any) {
      console.error("Erro ao criar mesa:", error);
      toast.error(error.response?.data?.error || "Erro ao criar mesa");
    }
    setIsSaving(false);
  };

  return (
    <Container>
      <Title>Nova Mesa</Title>
      <Button $variant="secondary" onClick={() => navigate("/tables")}>
        Voltar
      </Button>

      <form onSubmit={handleSubmit}>
        <Input
          label="Nome da Mesa"
          value={name}
          onChange={handleNameChange}
          required
          maxLength={20}
        />
        {nameError && (
          <div style={{ color: "red", marginTop: 4 }}>{nameError}</div>
        )}

        <Input
          label="Capacidade"
          type="number"
          value={capacity}
          onChange={handleCapacityChange}
          required
          min={1}
        />
        {capacityError && (
          <div style={{ color: "red", marginTop: 4 }}>{capacityError}</div>
        )}

        <div style={{ margin: "2rem 0" }}>
          <h3>Disponibilidade</h3>

          <Select
            label="Modo de Disponibilidade"
            value={availabilityMode}
            onChange={(e) =>
              setAvailabilityMode(e.target.value as AvailabilityMode)
            }
          >
            <option value="by_period">Por Período</option>
            <option value="custom">Personalizado</option>
          </Select>

          {availabilityMode === "by_period" ? (
            <div style={{ marginTop: "1rem" }}>
              <Input
                label="Data Inicial"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                min={todayStr}
              />

              <Input
                label="Data Final"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                min={startDate || todayStr}
              />
              {dateError && (
                <div style={{ color: "red", marginTop: 4 }}>{dateError}</div>
              )}

              <div style={{ marginTop: "1rem" }}>
                <h4>Intervalos de Horário</h4>
                <div
                  style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
                >
                  <Input
                    label="Horário Inicial"
                    type="time"
                    value={currentStartTime}
                    onChange={(e) => setCurrentStartTime(e.target.value)}
                    min={startDate === todayStr ? currentTimeStr : undefined}
                  />
                  <Input
                    label="Horário Final"
                    type="time"
                    value={currentEndTime}
                    onChange={(e) => setCurrentEndTime(e.target.value)}
                    min={
                      currentStartTime ||
                      (startDate === todayStr ? currentTimeStr : undefined)
                    }
                  />
                  <Button
                    type="button"
                    onClick={handleAddTimeInterval}
                    style={{ marginTop: "1.5rem" }}
                  >
                    Adicionar
                  </Button>
                </div>
                {timeError && (
                  <div style={{ color: "red", marginTop: 4 }}>{timeError}</div>
                )}

                {timeIntervals.length === 0 && (
                  <div style={{ color: "#888" }}>
                    Nenhum intervalo adicionado.
                  </div>
                )}

                {timeIntervals.map((interval, index) => {
                  const warning = getBusinessHoursWarningForInterval(
                    interval.startTime,
                    interval.endTime
                  );
                  return (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <span>
                        {interval.startTime} - {interval.endTime}
                      </span>
                      <Button
                        type="button"
                        $variant="danger"
                        onClick={() => handleRemoveTimeInterval(index)}
                      >
                        Remover
                      </Button>
                      {warning && (
                        <span
                          style={{
                            color: "#ff9800",
                            fontSize: "0.75rem",
                            fontWeight: "500",
                          }}
                          title="Este horário está fora do funcionamento. Clientes não poderão fazer reservas."
                        >
                          ⚠️ Fora do funcionamento
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ marginTop: "1rem" }}>
              <Input
                label="Data"
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                required
                min={todayStr}
              />
              {dateError && (
                <div style={{ color: "red", marginTop: 4 }}>{dateError}</div>
              )}

              <div
                style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
              >
                <Input
                  label="Horário Inicial"
                  type="time"
                  value={currentStartTime}
                  onChange={(e) => setCurrentStartTime(e.target.value)}
                  min={customDate === todayStr ? currentTimeStr : undefined}
                />
                <Input
                  label="Horário Final"
                  type="time"
                  value={currentEndTime}
                  onChange={(e) => setCurrentEndTime(e.target.value)}
                  min={
                    currentStartTime ||
                    (customDate === todayStr ? currentTimeStr : undefined)
                  }
                />
                <Button
                  type="button"
                  onClick={handleAddCustomAvailability}
                  style={{ marginTop: "1.5rem" }}
                >
                  Adicionar
                </Button>
              </div>
              {timeError && (
                <div style={{ color: "red", marginTop: 4 }}>{timeError}</div>
              )}

              {customAvailability.length === 0 && (
                <div style={{ color: "#888" }}>
                  Nenhuma disponibilidade adicionada.
                </div>
              )}

              {customAvailability.map((item, dateIndex) => (
                <div key={dateIndex} style={{ marginBottom: "1rem" }}>
                  <h4>Data: {item.date}</h4>
                  {item.intervals.length === 0 && (
                    <div style={{ color: "#888" }}>
                      Nenhum horário adicionado.
                    </div>
                  )}
                  {item.intervals.map((interval, intervalIndex) => {
                    const warning = getBusinessHoursWarningForInterval(
                      interval.startTime,
                      interval.endTime
                    );
                    return (
                      <div
                        key={intervalIndex}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <span>
                          {interval.startTime} - {interval.endTime}
                        </span>
                        <Button
                          type="button"
                          $variant="danger"
                          onClick={() =>
                            handleRemoveCustomAvailability(
                              item.date,
                              intervalIndex
                            )
                          }
                        >
                          Remover
                        </Button>
                        {warning && (
                          <span
                            style={{
                              color: "#ff9800",
                              fontSize: "0.75rem",
                              fontWeight: "500",
                            }}
                            title="Este horário está fora do funcionamento. Clientes não poderão fazer reservas."
                          >
                            ⚠️ Fora do funcionamento
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={
            isSaving ||
            !!nameError ||
            !!capacityError ||
            !!dateError ||
            !!timeError
          }
        >
          Criar Mesa
        </Button>
      </form>
    </Container>
  );
}
