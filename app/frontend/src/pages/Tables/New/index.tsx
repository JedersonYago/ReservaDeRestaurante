import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../components/Toast";
import { format } from "date-fns";
import { eachDayOfInterval } from "date-fns/eachDayOfInterval";
import { parseISO } from "date-fns/parseISO";
import {
  ArrowLeft,
  Plus,
  Trash2,
  AlertTriangle,
  Calendar,
  Clock,
  Users,
  Settings2,
  Save,
  Utensils,
} from "lucide-react";

import { Button } from "../../../components/Button";
import { CancelButton } from "../../../components/Button/CancelButton";
import { Input } from "../../../components/Input";
import { Container as LayoutContainer } from "../../../components/Layout/Container";
import { PageWrapper } from "../../../components/Layout/PageWrapper";
import { FixedActionBar } from "../../../components/Layout/FixedActionBar";
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
  checkTimeIntervalOverlap,
} from "../../../utils/timeValidation";

import {
  Header,
  HeaderContent,
  TitleSection,
  Title,
  Subtitle,
  HeaderActions,
  Content,
  FormSection,
  SectionTitle,
  SectionDescription,
  FormGrid,
  FormGroup,
  ErrorMessage,
  AvailabilityModeSelector,
  ModeOption,
  AvailabilityBlock,
  BlockHeader,
  BlockActions,
  TimeInputContainer,
  TimeSlot,
  TimeSlotActions,
  WarningBadge,
  EmptyTimeSlots,
  TimeIntervalsGrid,
  AddActionButton,
} from "./styles";

type TimeInterval = {
  startTime: string;
  endTime: string;
};

type AvailabilityItem = {
  date: string;
  intervals: TimeInterval[];
};

type AvailabilityMode = "by_period" | "custom";

const todayStr = getTodayString();
const currentTimeStr = getCurrentTimeString();

export function NewTable() {
  const navigate = useNavigate();
  const toast = useToast();
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
  const [timeError] = useState("");

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
      toast.error("Não é permitido selecionar horários anteriores ao atual.");
      return;
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

    // Verificar sobreposição com intervalos existentes
    const overlapCheck = checkTimeIntervalOverlap(
      currentStartTime,
      currentEndTime,
      timeIntervals
    );
    if (overlapCheck.hasOverlap) {
      toast.error(
        `Este horário se sobrepõe com o intervalo ${overlapCheck.overlappingInterval}. Ajuste os horários para evitar conflitos.`
      );
      return;
    }

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
      toast.error("Não é permitido selecionar horários anteriores ao atual.");
      return;
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

    if (existing) {
      setCustomAvailability((prev) =>
        prev.map((item) =>
          item.date === customDate
            ? {
                ...item,
                intervals: [
                  ...item.intervals,
                  { startTime: currentStartTime, endTime: currentEndTime },
                ],
              }
            : item
        )
      );
    } else {
      setCustomAvailability((prev) => [
        ...prev,
        {
          date: customDate,
          intervals: [{ startTime: currentStartTime, endTime: currentEndTime }],
        },
      ]);
    }
    setCurrentStartTime("");
    setCurrentEndTime("");
  };

  const handleRemoveCustomAvailability = (
    date: string,
    intervalIndex: number
  ) => {
    setCustomAvailability((prev) => {
      const updated = prev
        .map((item) => {
          if (item.date === date) {
            const newIntervals = item.intervals.filter(
              (_, i) => i !== intervalIndex
            );
            return { ...item, intervals: newIntervals };
          }
          return item;
        })
        .filter((item) => item.intervals.length > 0);
      return updated;
    });
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
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    if (nameError || capacityError || dateError || timeError) {
      toast.error("Corrija os erros antes de salvar");
      return;
    }

    let availability: { date: string; times: string[] }[] = [];

    if (availabilityMode === "by_period") {
      if (!startDate || !endDate || timeIntervals.length === 0) {
        toast.error("Preencha todos os campos de disponibilidade");
        return;
      }

      const dates = eachDayOfInterval({
        start: parseISO(startDate),
        end: parseISO(endDate),
      });
      availability = dates.map((date) => ({
        date: format(date, "yyyy-MM-dd"),
        times: timeIntervals.map(
          (interval) => `${interval.startTime}-${interval.endTime}`
        ),
      }));
    } else {
      if (customAvailability.length === 0) {
        toast.error("Adicione pelo menos uma disponibilidade");
        return;
      }
      availability = customAvailability.map((item) => ({
        date: item.date,
        times: item.intervals.map(
          (interval) => `${interval.startTime}-${interval.endTime}`
        ),
      }));
    }

    setIsSaving(true);
    try {
      await createTable({
        name,
        capacity: parseInt(capacity),
        availability,
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
    <PageWrapper>
      <LayoutContainer>
        <Header>
          <HeaderContent>
            <TitleSection>
              <Title>
                <Utensils size={32} />
                Nova Mesa
              </Title>
              <Subtitle>
                Crie uma nova mesa e configure sua disponibilidade
              </Subtitle>
            </TitleSection>
            <HeaderActions>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/tables")}
                leftIcon={<ArrowLeft size={16} />}
              >
                Voltar
              </Button>
            </HeaderActions>
          </HeaderContent>
        </Header>

        <Content id="create-table-form" onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>
              <Users size={20} />
              Informações Básicas
            </SectionTitle>
            <SectionDescription>
              Defina o nome e capacidade da mesa
            </SectionDescription>

            <FormGrid>
              <FormGroup>
                <Input
                  label="Nome da Mesa"
                  value={name}
                  onChange={handleNameChange}
                  required
                  maxLength={20}
                  placeholder="Ex: Mesa 01, Mesa VIP, etc."
                />
                {nameError && <ErrorMessage>{nameError}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Input
                  label="Capacidade"
                  type="number"
                  value={capacity}
                  onChange={handleCapacityChange}
                  required
                  min={1}
                  placeholder="Número de pessoas"
                />
                {capacityError && <ErrorMessage>{capacityError}</ErrorMessage>}
              </FormGroup>
            </FormGrid>
          </FormSection>

          <FormSection>
            <SectionTitle>
              <Calendar size={20} />
              Disponibilidade
            </SectionTitle>
            <SectionDescription>
              Configure quando a mesa estará disponível para reservas
            </SectionDescription>

            <AvailabilityModeSelector>
              <ModeOption
                type="button"
                $active={availabilityMode === "by_period"}
                onClick={() => setAvailabilityMode("by_period")}
              >
                <Settings2 size={16} />
                Por Período
              </ModeOption>
              <ModeOption
                type="button"
                $active={availabilityMode === "custom"}
                onClick={() => setAvailabilityMode("custom")}
              >
                <Calendar size={16} />
                Personalizado
              </ModeOption>
            </AvailabilityModeSelector>

            {availabilityMode === "by_period" ? (
              <>
                <FormGrid>
                  <FormGroup>
                    <Input
                      label="Data Inicial"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      min={todayStr}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Input
                      label="Data Final"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      min={startDate || todayStr}
                    />
                    {dateError && <ErrorMessage>{dateError}</ErrorMessage>}
                  </FormGroup>
                </FormGrid>

                <TimeInputContainer>
                  <SectionTitle>
                    <Clock size={18} />
                    Horários Disponíveis
                  </SectionTitle>

                  <TimeSlot>
                    <Input
                      label="Horário Inicial"
                      type="time"
                      value={currentStartTime}
                      onChange={(e) => setCurrentStartTime(e.target.value)}
                      min={startDate === todayStr ? currentTimeStr : undefined}
                      disabled={!startDate || !endDate}
                      placeholder={
                        !startDate || !endDate
                          ? "Selecione as datas primeiro"
                          : undefined
                      }
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
                      disabled={!startDate || !endDate}
                      placeholder={
                        !startDate || !endDate
                          ? "Selecione as datas primeiro"
                          : undefined
                      }
                    />
                  </TimeSlot>

                  <TimeSlotActions>
                    <AddActionButton
                      type="button"
                      onClick={handleAddTimeInterval}
                      disabled={!startDate || !endDate}
                    >
                      <Plus size={14} />
                      Adicionar Horário
                    </AddActionButton>
                  </TimeSlotActions>

                  {timeError && <ErrorMessage>{timeError}</ErrorMessage>}

                  {timeIntervals.length === 0 ? (
                    <EmptyTimeSlots>
                      <Clock size={24} />
                      Nenhum horário adicionado
                    </EmptyTimeSlots>
                  ) : (
                    <TimeIntervalsGrid>
                      {timeIntervals.map((interval, index) => {
                        const hasWarning = getBusinessHoursWarningForInterval(
                          interval.startTime,
                          interval.endTime
                        );

                        return (
                          <AvailabilityBlock key={index}>
                            <BlockHeader>
                              <div>
                                <Clock size={16} />
                                <span>
                                  {interval.startTime} - {interval.endTime}
                                  {hasWarning && (
                                    <WarningBadge>
                                      <AlertTriangle size={12} />
                                      Fora do funcionamento
                                    </WarningBadge>
                                  )}
                                </span>
                              </div>
                              <BlockActions>
                                <Button
                                  type="button"
                                  variant="danger"
                                  size="sm"
                                  onClick={() =>
                                    handleRemoveTimeInterval(index)
                                  }
                                >
                                  <Trash2 size={12} />
                                </Button>
                              </BlockActions>
                            </BlockHeader>
                          </AvailabilityBlock>
                        );
                      })}
                    </TimeIntervalsGrid>
                  )}
                </TimeInputContainer>
              </>
            ) : (
              <>
                <FormGrid>
                  <FormGroup>
                    <Input
                      label="Data"
                      type="date"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      required
                      min={todayStr}
                    />
                    {dateError && <ErrorMessage>{dateError}</ErrorMessage>}
                  </FormGroup>
                </FormGrid>

                <TimeInputContainer>
                  <SectionTitle>
                    <Clock size={18} />
                    Horários Disponíveis
                  </SectionTitle>

                  <TimeSlot>
                    <Input
                      label="Horário Inicial"
                      type="time"
                      value={currentStartTime}
                      onChange={(e) => setCurrentStartTime(e.target.value)}
                      min={customDate === todayStr ? currentTimeStr : undefined}
                      disabled={!customDate}
                      placeholder={
                        !customDate ? "Selecione a data primeiro" : undefined
                      }
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
                      disabled={!customDate}
                      placeholder={
                        !customDate ? "Selecione a data primeiro" : undefined
                      }
                    />
                  </TimeSlot>

                  <TimeSlotActions>
                    <AddActionButton
                      type="button"
                      onClick={handleAddCustomAvailability}
                      disabled={!customDate}
                    >
                      <Plus size={14} />
                      Adicionar Horário
                    </AddActionButton>
                  </TimeSlotActions>

                  {timeError && <ErrorMessage>{timeError}</ErrorMessage>}

                  {customAvailability.length === 0 ? (
                    <EmptyTimeSlots>
                      <Clock size={24} />
                      Nenhuma disponibilidade adicionada
                    </EmptyTimeSlots>
                  ) : (
                    <div>
                      {customAvailability.map((item, dateIndex) => (
                        <div key={dateIndex}>
                          <SectionTitle>
                            <Calendar size={16} />
                            {format(parseISO(item.date), "dd/MM/yyyy")}
                          </SectionTitle>

                          <TimeIntervalsGrid>
                            {item.intervals.map((interval, intervalIndex) => {
                              const hasWarning =
                                getBusinessHoursWarningForInterval(
                                  interval.startTime,
                                  interval.endTime
                                );

                              return (
                                <AvailabilityBlock key={intervalIndex}>
                                  <BlockHeader>
                                    <div>
                                      <Clock size={16} />
                                      <span>
                                        {interval.startTime} -{" "}
                                        {interval.endTime}
                                        {hasWarning && (
                                          <WarningBadge>
                                            <AlertTriangle size={12} />
                                            Fora do funcionamento
                                          </WarningBadge>
                                        )}
                                      </span>
                                    </div>
                                    <BlockActions>
                                      <Button
                                        type="button"
                                        variant="danger"
                                        size="sm"
                                        onClick={() =>
                                          handleRemoveCustomAvailability(
                                            item.date,
                                            intervalIndex
                                          )
                                        }
                                      >
                                        <Trash2 size={12} />
                                      </Button>
                                    </BlockActions>
                                  </BlockHeader>
                                </AvailabilityBlock>
                              );
                            })}
                          </TimeIntervalsGrid>
                        </div>
                      ))}
                    </div>
                  )}
                </TimeInputContainer>
              </>
            )}
          </FormSection>
        </Content>
      </LayoutContainer>

      <FixedActionBar>
        <Button
          type="submit"
          variant="primary"
          disabled={isSaving}
          leftIcon={isSaving ? undefined : <Save size={18} />}
          form="create-table-form"
        >
          {isSaving ? "Criando Mesa..." : "Criar Mesa"}
        </Button>
        <CancelButton onClick={() => navigate("/tables")}>
          Cancelar
        </CancelButton>
      </FixedActionBar>
    </PageWrapper>
  );
}
