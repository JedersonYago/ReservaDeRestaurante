import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTables, useTableById } from "../../../hooks/useTables";
import { useConfig } from "../../../hooks/useConfig";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Container, Title, Form, FormGroup, ButtonGroup } from "../styles";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { validateTimeIntervalAgainstBusinessHours } from "../../../utils/timeValidation";

export function EditTable() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateTable, tables } = useTables();
  const { data: table, isLoading } = useTableById(id);
  const { config } = useConfig();

  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [availability, setAvailability] = useState<
    {
      date: string;
      times: string[];
    }[]
  >([]);
  // Estados auxiliares para inputs de horários e visibilidade
  const [timeInputs, setTimeInputs] = useState<
    { start: string; end: string }[]
  >([]);
  const [showTimeInput, setShowTimeInput] = useState<boolean[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const dateRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [nameError, setNameError] = useState("");
  const [capacityError, setCapacityError] = useState("");
  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [businessHoursWarning, setBusinessHoursWarning] = useState("");

  // Utilitário para data/hora atual no formato YYYY-MM-DD e HH:mm
  const now = new Date();
  const todayStr = format(now, "yyyy-MM-dd");
  const currentTimeStr = format(now, "HH:mm");

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

  const isPastDate = (date: string) => date && date < todayStr;
  const isPastTime = (date: string, time: string) => {
    if (!date || !time) return false;
    if (date > todayStr) return false;
    return time < currentTimeStr;
  };

  useEffect(() => {
    if (table) {
      setName(table.name);
      setCapacity(table.capacity.toString());
      setAvailability(table.availability || []);
      setTimeInputs(
        table.availability
          ? table.availability.map(() => ({ start: "", end: "" }))
          : []
      );
      setShowTimeInput(
        table.availability ? table.availability.map(() => false) : []
      );
    }
  }, [table]);

  const handleAddBlock = () => {
    setAvailability((prev) => [...prev, { date: "", times: [] }]);
    setTimeInputs((prev) => [...prev, { start: "", end: "" }]);
    setShowTimeInput((prev) => [...prev, false]);
    setTimeout(() => {
      if (dateRefs.current[availability.length]) {
        dateRefs.current[availability.length]?.focus();
      }
    }, 100);
  };

  const handleRemoveBlock = (idx: number) => {
    setAvailability((prev) => prev.filter((_, i) => i !== idx));
    setTimeInputs((prev) => prev.filter((_, i) => i !== idx));
    setShowTimeInput((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (value.length > 20) {
      setNameError("O nome deve ter no máximo 20 caracteres.");
    } else if (
      tables?.some(
        (t) =>
          t.name.toLowerCase() === value.trim().toLowerCase() && t._id !== id
      )
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

  const handleBlockChange = (idx: number, field: string, value: string) => {
    // Impedir datas duplicadas
    if (
      field === "date" &&
      availability.some((a, i) => a.date === value && i !== idx)
    ) {
      toast.error("Já existe um bloco para essa data");
      return;
    }
    // Impedir datas anteriores ao dia atual
    if (field === "date" && isPastDate(value)) {
      setDateError("Não é permitido selecionar datas anteriores ao dia atual.");
      return;
    } else {
      setDateError("");
    }
    setAvailability((prev) =>
      prev.map((a, i) => (i === idx ? { ...a, [field]: value } : a))
    );
  };

  // Novo: inputs controlados para horários
  const handleTimeInputChange = (
    blockIdx: number,
    field: "start" | "end",
    value: string
  ) => {
    setTimeInputs((prev) =>
      prev.map((t, i) => (i === blockIdx ? { ...t, [field]: value } : t))
    );
  };

  const handleShowTimeInput = (blockIdx: number) => {
    setShowTimeInput((prev) =>
      prev.map((show, i) => (i === blockIdx ? true : show))
    );
    setTimeout(() => {
      const input = document.querySelector(
        `#start-time-${blockIdx}`
      ) as HTMLInputElement;
      if (input) input.focus();
    }, 100);
  };

  const handleAddTime = (blockIdx: number) => {
    const { start, end } = timeInputs[blockIdx];
    if (!start || !end) {
      toast.error("Preencha o horário de início e fim");
      return;
    }
    if (isPastDate(availability[blockIdx].date)) {
      setDateError("Não é permitido selecionar datas anteriores ao dia atual.");
      return;
    } else {
      setDateError("");
    }
    if (isPastTime(availability[blockIdx].date, start)) {
      setTimeError("Não é permitido selecionar horários anteriores ao atual.");
      return;
    } else {
      setTimeError("");
    }
    if (start >= end) {
      toast.error("O horário de início deve ser menor que o de fim");
      return;
    }
    const interval = `${start}-${end}`;
    if (availability[blockIdx].times.includes(interval)) {
      toast.error("Esse intervalo já foi adicionado");
      return;
    }

    // Validação de horário de funcionamento é feita individualmente na exibição

    setAvailability((prev) =>
      prev.map((block, i) =>
        i === blockIdx ? { ...block, times: [...block.times, interval] } : block
      )
    );
    setTimeInputs((prev) =>
      prev.map((t, i) => (i === blockIdx ? { start: "", end: "" } : t))
    );
    setShowTimeInput((prev) =>
      prev.map((show, i) => (i === blockIdx ? false : show))
    );
  };

  const handleRemoveTime = (blockIdx: number, timeIdx: number) => {
    setAvailability((prev) =>
      prev.map((block, i) =>
        i === blockIdx
          ? { ...block, times: block.times.filter((_, j) => j !== timeIdx) }
          : block
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !capacity || availability.length === 0) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    if (nameError || capacityError || dateError || timeError) {
      toast.error("Corrija os erros antes de salvar");
      return;
    }
    if (
      availability.some(
        (a) => !a.date || a.times.length === 0 || a.times.some((t) => !t)
      )
    ) {
      toast.error("Preencha todas as datas e horários de disponibilidade");
      return;
    }
    setIsSaving(true);
    await updateTable(id!, {
      name,
      capacity: parseInt(capacity),
      availability: availability.map(({ date, times }) => ({ date, times })),
    });
    setIsSaving(false);
    toast.success("Mesa atualizada com sucesso!");
    navigate("/tables");
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!table) {
    return <div>Mesa não encontrada</div>;
  }

  return (
    <Container>
      <Title>Editar Mesa</Title>
      <Button $variant="secondary" onClick={() => navigate("/tables")}>
        Voltar
      </Button>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
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
        </FormGroup>
        <FormGroup>
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
        </FormGroup>
        <div style={{ margin: "2rem 0" }}>
          <h3>Disponibilidade</h3>
          {availability.length === 0 && (
            <div style={{ color: "#888", marginBottom: 16 }}>
              Nenhum bloco de disponibilidade cadastrado.
            </div>
          )}
          {availability.map((block, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: 16,
                borderBottom: "1px solid #eee",
                paddingBottom: 8,
              }}
            >
              <strong>Disponibilidade {idx + 1}</strong>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  marginTop: 4,
                }}
              >
                <Input
                  label="Data (YYYY-MM-DD)"
                  type="date"
                  value={block.date}
                  onChange={(e) =>
                    handleBlockChange(idx, "date", e.target.value)
                  }
                  required
                  style={{ width: 160 }}
                  min={todayStr}
                />
                <div>
                  <label>Horários:</label>
                  <ul
                    style={{
                      margin: "8px 0 0 0",
                      padding: 0,
                      listStyle: "none",
                    }}
                  >
                    {block.times.length === 0 && (
                      <li style={{ color: "#888" }}>
                        Nenhum horário cadastrado.
                      </li>
                    )}
                    {block.times.map((time, tIdx) => {
                      // Separar startTime e endTime do formato "HH:MM - HH:MM"
                      const [startTime, endTime] = time.split(" - ");
                      const warning = getBusinessHoursWarningForInterval(
                        startTime,
                        endTime
                      );

                      return (
                        <li
                          key={tIdx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            marginBottom: 2,
                          }}
                        >
                          <span>{time}</span>
                          <Button
                            type="button"
                            $variant="danger"
                            onClick={() => handleRemoveTime(idx, tIdx)}
                          >
                            -
                          </Button>
                          {warning && (
                            <span
                              style={{
                                color: "#ff9800",
                                fontSize: "0.7rem",
                                fontWeight: "500",
                                marginLeft: "4px",
                              }}
                              title="Este horário está fora do funcionamento. Clientes não poderão fazer reservas."
                            >
                              ⚠️ Fora do funcionamento
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  {showTimeInput[idx] ? (
                    <div
                      style={{
                        display: "flex",
                        gap: 4,
                        alignItems: "center",
                        marginTop: 4,
                      }}
                    >
                      <input
                        id={`start-time-${idx}`}
                        type="time"
                        value={timeInputs[idx]?.start || ""}
                        onChange={(e) =>
                          handleTimeInputChange(idx, "start", e.target.value)
                        }
                        required
                        min={
                          block.date === todayStr ? currentTimeStr : undefined
                        }
                      />
                      <span>até</span>
                      <input
                        type="time"
                        value={timeInputs[idx]?.end || ""}
                        onChange={(e) =>
                          handleTimeInputChange(idx, "end", e.target.value)
                        }
                        required
                        min={
                          timeInputs[idx]?.start ||
                          (block.date === todayStr ? currentTimeStr : undefined)
                        }
                      />
                      <Button
                        type="button"
                        $variant="secondary"
                        onClick={() => handleAddTime(idx)}
                      >
                        Adicionar
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      $variant="secondary"
                      onClick={() => handleShowTimeInput(idx)}
                      style={{ marginTop: 4 }}
                    >
                      + Horário
                    </Button>
                  )}
                  {dateError && (
                    <div style={{ color: "red", marginTop: 4 }}>
                      {dateError}
                    </div>
                  )}
                  {timeError && (
                    <div style={{ color: "red", marginTop: 4 }}>
                      {timeError}
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  $variant="danger"
                  onClick={() => handleRemoveBlock(idx)}
                >
                  - Disponibilidade
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" $variant="secondary" onClick={handleAddBlock}>
            + Disponibilidade
          </Button>
        </div>
        <ButtonGroup>
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
            Salvar Alterações
          </Button>
          <Button
            type="button"
            $variant="secondary"
            onClick={() => navigate("/tables")}
          >
            Cancelar
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
}
