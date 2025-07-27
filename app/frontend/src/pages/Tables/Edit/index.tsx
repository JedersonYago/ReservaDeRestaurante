import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Utensils,
  Users,
  Calendar,
  Clock,
  Plus,
  AlertTriangle,
  Save,
  Settings,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";
import { useTables, useTableById } from "../../../hooks/useTables";
import {
  useReservationsByTable,
  useReservations,
} from "../../../hooks/useReservations";
import { useConfig } from "../../../hooks/useConfig";
import { Button } from "../../../components/Button";
import { BackButton } from "../../../components/Button/BackButton";
import { SubmitButton } from "../../../components/Button/SubmitButton";
import { DeleteButton } from "../../../components/Button/DeleteButton";
import { ConfirmationModal } from "../../../components/Modal/ConfirmationModal";
import { ReschedulingModal } from "../../../components/Modal/ReschedulingModal";
import { Input } from "../../../components/Input";
import { Select } from "../../../components/Select";
import { Container as LayoutContainer } from "../../../components/Layout/Container";
import { PageWrapper } from "../../../components/Layout/PageWrapper";
import { FixedActionBar } from "../../../components/Layout/FixedActionBar";
import { useToast } from "../../../components/Toast";
import { format } from "date-fns";
import {
  validateTimeIntervalAgainstBusinessHours,
  checkTimeIntervalOverlapString,
} from "../../../utils/timeValidation";
import {
  Header,
  HeaderContent,
  TitleSection,
  Title,
  Subtitle,
  Content,
  FormSection,
  SectionTitle,
  SectionDescription,
  FormGrid,
  FormGroup,
  ErrorMessage,
  AvailabilitySection,
  AvailabilityGrid,
  AvailabilityBlock,
  BlockHeader,
  BlockContent,
  TimeSlotsList,
  TimeSlotItem,
  TimeSlotInfo,
  TimeSlotActions,
  TimeSlotRemoveButton,
  TimeInputContainer,
  TimeInputGroup,
  AddTimeButton,
  AddActionButton,
  EmptyTimeSlots,
  BlockActions,
  AddBlockButton,
  LoadingContainer,
  LoadingSpinner,
  LoadingText,
  NotFoundContainer,
  NotFoundIcon,
  NotFoundContent,
  NotFoundTitle,
  NotFoundDescription,
  WarningBadge,
  InfoMessage,
  ScrollIndicator,
  BlockInfoText,
  BlockTimePreview,
  ReservationBadge,
  DangerWarningBadge,
  TimeLabel,
  AffectedReservationsList,
  ModalWarningContainer,
  ModalWarningText,
} from "./styles";

export function EditTable() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { updateTable, tables } = useTables();
  const { data: table, isLoading } = useTableById(id);
  const { config } = useConfig();
  const { reservations } = useReservationsByTable(id || "");
  const { cancelReservation } = useReservations();

  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [status, setStatus] = useState<
    "available" | "reserved" | "maintenance" | "expired"
  >("available");
  const [availability, setAvailability] = useState<
    { date: string; times: string[] }[]
  >([{ date: "", times: [] }]);
  const [timeInputs, setTimeInputs] = useState<
    { start: string; end: string }[]
  >([{ start: "", end: "" }]);
  const [showTimeInput, setShowTimeInput] = useState<boolean[]>([false]);
  const [collapsedBlocks, setCollapsedBlocks] = useState<boolean[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const dateRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [nameError, setNameError] = useState("");
  const [capacityError, setCapacityError] = useState("");
  const [dateError, setDateError] = useState("");
  const [timeError] = useState("");

  // States para modal de confirmação de remoção
  const [showRemovalModal, setShowRemovalModal] = useState(false);
  const [removalConfig, setRemovalConfig] = useState<{
    type: "block" | "time";
    blockIdx: number;
    timeIdx?: number;
    affectedReservations: any[];
  } | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  // States para modal de remanejamento
  const [showReschedulingModal, setShowReschedulingModal] = useState(false);
  const [reschedulingData, setReschedulingData] = useState<{
    affectedReservations: any[];
    tableId: string;
    tableName: string;
  } | null>(null);

  // Estados para valores originais (para verificar se houve alterações)
  const [originalName, setOriginalName] = useState("");
  const [originalCapacity, setOriginalCapacity] = useState("");
  const [originalStatus, setOriginalStatus] = useState<
    "available" | "reserved" | "maintenance" | "expired"
  >("available");
  const [originalAvailability, setOriginalAvailability] = useState<
    { date: string; times: string[] }[]
  >([{ date: "", times: [] }]);

  const now = new Date();
  const todayStr = format(now, "yyyy-MM-dd");
  const currentTimeStr = format(now, "HH:mm");

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
      // Definir valores atuais
      setName(table.name);
      setCapacity(table.capacity.toString());
      setStatus(table.status);
      setAvailability(table.availability || [{ date: "", times: [] }]);

      // Armazenar valores originais
      setOriginalName(table.name);
      setOriginalCapacity(table.capacity.toString());
      setOriginalStatus(table.status);
      setOriginalAvailability(table.availability || [{ date: "", times: [] }]);

      setTimeInputs(
        table.availability
          ? table.availability.map(() => ({ start: "", end: "" }))
          : [{ start: "", end: "" }]
      );
      setShowTimeInput(
        table.availability ? table.availability.map(() => false) : [false]
      );
      setCollapsedBlocks(
        table.availability ? table.availability.map(() => true) : [true]
      );
    }
  }, [table]);

  const handleAddBlock = () => {
    setAvailability((prev) => [...prev, { date: "", times: [] }]);
    setTimeInputs((prev) => [...prev, { start: "", end: "" }]);
    setShowTimeInput((prev) => [...prev, false]);
    setCollapsedBlocks((prev) => [...prev, true]); // Novos blocos começam recolhidos
    setTimeout(() => {
      if (dateRefs.current[availability.length]) {
        dateRefs.current[availability.length]?.focus();
      }
    }, 100);
  };

  // Função para encontrar reservas afetadas pela remoção
  const getAffectedReservations = (blockIdx: number, timeIdx?: number) => {
    if (!reservations || !availability[blockIdx]) return [];

    const block = availability[blockIdx];

    if (timeIdx !== undefined) {
      // Removendo um horário específico
      const timeRange = block.times[timeIdx];
      if (!timeRange) return [];

      const [startTime] = timeRange.split("-");
      return reservations.filter(
        (reservation) =>
          reservation.date === block.date &&
          reservation.time === startTime &&
          reservation.status !== "cancelled"
      );
    } else {
      // Removendo o bloco inteiro
      return reservations.filter(
        (reservation) =>
          reservation.date === block.date && reservation.status !== "cancelled"
      );
    }
  };

  const handleRemoveBlock = (idx: number) => {
    const affectedReservations = getAffectedReservations(idx);

    if (affectedReservations.length > 0) {
      setRemovalConfig({
        type: "block",
        blockIdx: idx,
        affectedReservations,
      });
      setShowRemovalModal(true);
    } else {
      // Remove diretamente se não há reservas
      confirmRemoval(idx);
    }
  };

  const handleRemoveTime = (blockIdx: number, timeIdx: number) => {
    const affectedReservations = getAffectedReservations(blockIdx, timeIdx);

    if (affectedReservations.length > 0) {
      setRemovalConfig({
        type: "time",
        blockIdx,
        timeIdx,
        affectedReservations,
      });
      setShowRemovalModal(true);
    } else {
      // Remove diretamente se não há reservas
      confirmTimeRemoval(blockIdx, timeIdx);
    }
  };

  const confirmRemoval = (idx: number) => {
    setAvailability((prev) => prev.filter((_, i) => i !== idx));
    setTimeInputs((prev) => prev.filter((_, i) => i !== idx));
    setShowTimeInput((prev) => prev.filter((_, i) => i !== idx));
    setCollapsedBlocks((prev) => prev.filter((_, i) => i !== idx));
  };

  const confirmTimeRemoval = (blockIdx: number, timeIdx: number) => {
    setAvailability((prev) =>
      prev.map((block, i) =>
        i === blockIdx
          ? { ...block, times: block.times.filter((_, j) => j !== timeIdx) }
          : block
      )
    );
  };

  const toggleBlockCollapse = (idx: number) => {
    setCollapsedBlocks((prev) =>
      prev.map((collapsed, i) => (i === idx ? !collapsed : collapsed))
    );
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
    if (
      field === "date" &&
      availability.some((a, i) => a.date === value && i !== idx)
    ) {
      toast.error("Já existe um bloco para essa data");
      return;
    }
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
      toast.error("Não é permitido selecionar horários anteriores ao atual.");
      return;
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

    // Verificar sobreposição com intervalos existentes neste bloco
    const existingTimes = availability[blockIdx].times;
    const overlapCheck = checkTimeIntervalOverlapString(
      interval,
      existingTimes
    );
    if (overlapCheck.hasOverlap) {
      toast.error(
        `Este horário se sobrepõe com o intervalo ${overlapCheck.overlappingInterval}. Ajuste os horários para evitar conflitos.`
      );
      return;
    }

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

  // Função para confirmar a remoção com cancelamento das reservas
  const handleConfirmRemoval = async () => {
    if (!removalConfig) return;

    setIsRemoving(true);
    try {
      // Cancela todas as reservas afetadas
      for (const reservation of removalConfig.affectedReservations) {
        await cancelReservation.mutateAsync(reservation._id);
      }

      // Remove a disponibilidade
      if (removalConfig.type === "block") {
        confirmRemoval(removalConfig.blockIdx);
      } else {
        confirmTimeRemoval(removalConfig.blockIdx, removalConfig.timeIdx!);
      }

      toast.success(
        `${removalConfig.type === "block" ? "Bloco" : "Horário"} removido e ${
          removalConfig.affectedReservations.length
        } reserva(s) cancelada(s)`
      );

      setShowRemovalModal(false);
      setRemovalConfig(null);
    } catch (error) {
      toast.error("Erro ao remover disponibilidade");
    } finally {
      setIsRemoving(false);
    }
  };

  const handleCancelRemoval = () => {
    setShowRemovalModal(false);
    setRemovalConfig(null);
    setIsRemoving(false);
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

    try {
      await updateTable(id!, {
        name,
        capacity: parseInt(capacity),
        status,
        availability: availability.map(({ date, times }) => ({ date, times })),
      });

      // Toast já é exibido pelo hook useTables
      navigate("/tables");
    } catch (error: any) {
      if (error.response?.status === 409) {
        // Mesa tem reservas ativas que precisam ser remanejadas
        const { affectedReservations, tableId, tableName } =
          error.response.data;

        setReschedulingData({
          affectedReservations,
          tableId,
          tableName,
        });
        setShowReschedulingModal(true);
      } else {
        // Outros erros já são tratados pelo hook
        console.error("Erro ao atualizar mesa:", error);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <LayoutContainer>
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Carregando dados da mesa...</LoadingText>
          </LoadingContainer>
        </LayoutContainer>
      </PageWrapper>
    );
  }

  if (!table) {
    return (
      <PageWrapper>
        <LayoutContainer>
          <NotFoundContainer>
            <NotFoundIcon>
              <Utensils size={64} />
            </NotFoundIcon>
            <NotFoundContent>
              <NotFoundTitle>Mesa não encontrada</NotFoundTitle>
              <NotFoundDescription>
                A mesa que você está tentando editar não existe ou foi removida.
              </NotFoundDescription>
              <Button
                variant="primary"
                onClick={() => navigate("/tables")}
                leftIcon={<ArrowLeft size={16} />}
              >
                Voltar para Mesas
              </Button>
            </NotFoundContent>
          </NotFoundContainer>
        </LayoutContainer>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <LayoutContainer>
        <Header>
          <HeaderContent>
            <TitleSection>
              <Title>
                <Utensils size={32} />
                Editar Mesa
              </Title>
              <Subtitle>Atualize as informações da mesa {table.name}</Subtitle>
            </TitleSection>
          </HeaderContent>
        </Header>

        <Content>
          <form id="edit-table-form" onSubmit={handleSubmit}>
            {/* Informações Básicas */}
            <FormSection>
              <SectionTitle>
                <Users size={20} />
                Informações Básicas
              </SectionTitle>
              <SectionDescription>
                Configure o nome e capacidade da mesa
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
                  {capacityError && (
                    <ErrorMessage>{capacityError}</ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Select
                    label="Status da Mesa"
                    value={status}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setStatus(
                        e.target.value as
                          | "available"
                          | "reserved"
                          | "maintenance"
                          | "expired"
                      )
                    }
                    required
                  >
                    <option value="available">Disponível</option>
                    <option value="reserved">Reservada</option>
                    <option value="maintenance">Em Manutenção</option>
                    {/* Opção "expired" removida - controlada automaticamente pelo sistema */}
                    {status === "expired" && (
                      <option value="expired">
                        Expirada (Somente Leitura)
                      </option>
                    )}
                  </Select>
                  {status === "maintenance" && (
                    <InfoMessage>
                      <Settings size={14} />
                      <span>
                        Mesa em manutenção não aparecerá para novas reservas.
                        Todas as reservas ativas serão canceladas
                        automaticamente.
                      </span>
                    </InfoMessage>
                  )}
                  {status === "expired" && (
                    <InfoMessage>
                      <AlertTriangle size={14} />
                      <span>
                        Mesa expirada (controlada automaticamente pelo sistema).
                        Adicione novos horários de disponibilidade para
                        reativar.
                      </span>
                    </InfoMessage>
                  )}
                </FormGroup>
              </FormGrid>
            </FormSection>

            {/* Disponibilidade */}
            <AvailabilitySection>
              <SectionTitle>
                <Calendar size={20} />
                Horários de Disponibilidade
              </SectionTitle>
              <SectionDescription>
                Configure quando a mesa estará disponível para reservas
              </SectionDescription>

              {availability.length === 0 ? (
                <EmptyTimeSlots>
                  <Calendar size={48} />
                  <div>
                    <h4>Nenhuma disponibilidade cadastrada</h4>
                    <p>Adicione pelo menos um período de disponibilidade</p>
                  </div>
                </EmptyTimeSlots>
              ) : (
                <AvailabilityGrid>
                  {availability.map((block, idx) => (
                    <AvailabilityBlock key={idx}>
                      <BlockHeader>
                        <div>
                          <Calendar size={18} />
                          <span>
                            {block.date
                              ? format(
                                  new Date(block.date + "T00:00:00"),
                                  "dd/MM/yyyy"
                                )
                              : `Disponibilidade ${idx + 1}`}
                            {block.times.length > 0 && (
                              <BlockInfoText>
                                {" "}
                                • {block.times.length} horário
                                {block.times.length !== 1 ? "s" : ""}
                                {collapsedBlocks[idx] &&
                                  block.times.length > 0 && (
                                    <BlockTimePreview>
                                      (
                                      {block.times
                                        .slice(0, 2)
                                        .map((time) => time.replace("-", " - "))
                                        .join(", ")}
                                      {block.times.length > 2 &&
                                        ` +${block.times.length - 2} mais`}
                                      )
                                    </BlockTimePreview>
                                  )}
                              </BlockInfoText>
                            )}
                            {(() => {
                              const blockReservations =
                                getAffectedReservations(idx);
                              return (
                                blockReservations.length > 0 && (
                                  <ReservationBadge
                                    title={`${blockReservations.length} reserva(s) ativa(s) nesta data`}
                                  >
                                    {blockReservations.length} reserva(s)
                                  </ReservationBadge>
                                )
                              );
                            })()}
                          </span>
                        </div>
                        <BlockActions>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleBlockCollapse(idx)}
                            leftIcon={
                              collapsedBlocks[idx] ? (
                                <ChevronDown size={14} />
                              ) : (
                                <ChevronUp size={14} />
                              )
                            }
                          >
                            {collapsedBlocks[idx] ? "Expandir" : "Recolher"}
                          </Button>
                          <DeleteButton
                            type="button"
                            onClick={() => handleRemoveBlock(idx)}
                            title={(() => {
                              const blockReservations =
                                getAffectedReservations(idx);
                              return blockReservations.length > 0
                                ? `Remover bloco (${blockReservations.length} reserva(s) será(ão) cancelada(s))`
                                : "Remover bloco de disponibilidade";
                            })()}
                          >
                            Remover
                          </DeleteButton>
                        </BlockActions>
                      </BlockHeader>

                      {!collapsedBlocks[idx] && (
                        <BlockContent>
                          <FormGroup>
                            <Input
                              label="Data"
                              type="date"
                              value={block.date}
                              onChange={(e) =>
                                handleBlockChange(idx, "date", e.target.value)
                              }
                              required
                              min={todayStr}
                            />
                            {dateError && (
                              <ErrorMessage>{dateError}</ErrorMessage>
                            )}
                          </FormGroup>

                          <div>
                            <TimeLabel>Horários</TimeLabel>

                            {block.times.length === 0 ? (
                              <EmptyTimeSlots style={{ margin: "12px 0" }}>
                                <Clock size={24} />
                                <span>Nenhum horário cadastrado</span>
                              </EmptyTimeSlots>
                            ) : (
                              <>
                                <TimeSlotsList>
                                  {block.times.map((time, tIdx) => {
                                    const [startTime, endTime] =
                                      time.split("-");
                                    const warning =
                                      getBusinessHoursWarningForInterval(
                                        startTime,
                                        endTime
                                      );

                                    // Verifica se há reservas para este horário
                                    const timeReservations =
                                      getAffectedReservations(idx, tIdx);
                                    const hasReservations =
                                      timeReservations.length > 0;

                                    return (
                                      <TimeSlotItem key={tIdx}>
                                        <TimeSlotInfo>
                                          <div className="time-display">
                                            <Clock size={14} />
                                            <span>
                                              {time.replace("-", " - ")}
                                            </span>
                                          </div>
                                          <div className="badges">
                                            {warning && (
                                              <WarningBadge title={warning}>
                                                <AlertTriangle size={10} />
                                                Fora do funcionamento
                                              </WarningBadge>
                                            )}
                                            {hasReservations && (
                                              <DangerWarningBadge
                                                title={`${timeReservations.length} reserva(s) ativa(s)`}
                                              >
                                                <Users size={10} />
                                                {timeReservations.length}{" "}
                                                reserva(s)
                                              </DangerWarningBadge>
                                            )}
                                          </div>
                                        </TimeSlotInfo>
                                        <TimeSlotActions>
                                          <TimeSlotRemoveButton
                                            type="button"
                                            onClick={() =>
                                              handleRemoveTime(idx, tIdx)
                                            }
                                            title={
                                              hasReservations
                                                ? `Remover horário (${timeReservations.length} reserva(s) será(ão) cancelada(s))`
                                                : "Remover horário"
                                            }
                                          >
                                            <Trash2 size={14} />
                                          </TimeSlotRemoveButton>
                                        </TimeSlotActions>
                                      </TimeSlotItem>
                                    );
                                  })}
                                </TimeSlotsList>
                                {block.times.length > 6 && (
                                  <ScrollIndicator>
                                    <ChevronDown size={12} />
                                    Role para ver mais horários
                                  </ScrollIndicator>
                                )}
                              </>
                            )}

                            {showTimeInput[idx] ? (
                              <TimeInputContainer>
                                <TimeInputGroup>
                                  <input
                                    id={`start-time-${idx}`}
                                    type="time"
                                    value={timeInputs[idx]?.start || ""}
                                    onChange={(e) =>
                                      handleTimeInputChange(
                                        idx,
                                        "start",
                                        e.target.value
                                      )
                                    }
                                    required
                                    min={
                                      block.date === todayStr
                                        ? currentTimeStr
                                        : undefined
                                    }
                                    disabled={!block.date}
                                    placeholder={
                                      !block.date
                                        ? "Selecione a data primeiro"
                                        : undefined
                                    }
                                  />
                                  <span>até</span>
                                  <input
                                    type="time"
                                    value={timeInputs[idx]?.end || ""}
                                    onChange={(e) =>
                                      handleTimeInputChange(
                                        idx,
                                        "end",
                                        e.target.value
                                      )
                                    }
                                    required
                                    min={
                                      timeInputs[idx]?.start ||
                                      (block.date === todayStr
                                        ? currentTimeStr
                                        : undefined)
                                    }
                                    disabled={!block.date}
                                    placeholder={
                                      !block.date
                                        ? "Selecione a data primeiro"
                                        : undefined
                                    }
                                  />
                                  <AddActionButton
                                    type="button"
                                    onClick={() => handleAddTime(idx)}
                                    disabled={!block.date}
                                  >
                                    <Plus size={14} />
                                    Adicionar
                                  </AddActionButton>
                                </TimeInputGroup>
                                {timeError && (
                                  <ErrorMessage>{timeError}</ErrorMessage>
                                )}
                              </TimeInputContainer>
                            ) : (
                              <AddTimeButton
                                type="button"
                                onClick={() => handleShowTimeInput(idx)}
                                disabled={!block.date}
                              >
                                <Plus size={16} />
                                Adicionar Horário
                              </AddTimeButton>
                            )}
                          </div>
                        </BlockContent>
                      )}
                    </AvailabilityBlock>
                  ))}
                </AvailabilityGrid>
              )}

              <AddBlockButton type="button" onClick={handleAddBlock}>
                <Plus size={18} />
                Adicionar Disponibilidade
              </AddBlockButton>
            </AvailabilitySection>
          </form>
        </Content>

        <FixedActionBar>
          <SubmitButton
            disabled={
              isSaving ||
              !name ||
              !capacity ||
              !!nameError ||
              !!capacityError ||
              !!dateError ||
              !!timeError ||
              (name === originalName &&
                capacity === originalCapacity &&
                status === originalStatus &&
                JSON.stringify(availability) ===
                  JSON.stringify(originalAvailability))
            }
            loading={isSaving}
            leftIcon={<Save size={18} />}
            form="edit-table-form"
          >
            Salvar Alterações
          </SubmitButton>
          <BackButton type="button" onClick={() => navigate("/tables")}>
            Voltar
          </BackButton>
        </FixedActionBar>

        {/* Modal de remanejamento */}
        {reschedulingData && (
          <ReschedulingModal
            isOpen={showReschedulingModal}
            onClose={() => {
              setShowReschedulingModal(false);
              setReschedulingData(null);
            }}
            affectedReservations={reschedulingData.affectedReservations}
            tableId={reschedulingData.tableId}
            tableName={reschedulingData.tableName}
          />
        )}

        {/* Modal de confirmação de remoção */}
        <ConfirmationModal
          isOpen={showRemovalModal}
          onClose={handleCancelRemoval}
          onConfirm={handleConfirmRemoval}
          type="danger"
          title={`Remover ${
            removalConfig?.type === "block" ? "Bloco de" : ""
          } Disponibilidade`}
          message={
            removalConfig ? (
              <div>
                <p>
                  {removalConfig.type === "block"
                    ? `Tem certeza que deseja remover todo o bloco de disponibilidade?`
                    : `Tem certeza que deseja remover este horário?`}
                </p>
                {removalConfig.affectedReservations.length > 0 && (
                  <ModalWarningContainer>
                    <ModalWarningText>
                      Atenção: {removalConfig.affectedReservations.length}{" "}
                      reserva(s) será(ão) cancelada(s):
                    </ModalWarningText>
                    <AffectedReservationsList>
                      {removalConfig.affectedReservations.map((reservation) => (
                        <li key={reservation._id}>
                          {reservation.customerName} - {reservation.date} às{" "}
                          {reservation.time}
                        </li>
                      ))}
                    </AffectedReservationsList>
                  </ModalWarningContainer>
                )}
              </div>
            ) : (
              "Confirma a remoção?"
            )
          }
          confirmText="Sim, Remover"
          cancelText="Cancelar"
          isLoading={isRemoving}
        />
      </LayoutContainer>
    </PageWrapper>
  );
}
