import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  User,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { useTables } from "../../../hooks/useTables";
import { useReservations } from "../../../hooks/useReservations";
import { useAuth } from "../../../hooks/useAuth";
import { useConfig } from "../../../hooks/useConfig";
import { Button, CancelButton } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Select } from "../../../components/Select";
import { Container as LayoutContainer } from "../../../components/Layout/Container";
import { PageWrapper } from "../../../components/Layout/PageWrapper";
import { useToast } from "../../../components/Toast";
import { isPastDate, isPastTime } from "../../../utils/dateValidation";
import {
  Header,
  HeaderContent,
  TitleSection,
  Title,
  Subtitle,
  HeaderActions,
  Content,
  InfoCard,
  InfoIcon,
  InfoContent,
  InfoTitle,
  InfoDescription,
  FormSection,
  SectionTitle,
  SectionDescription,
  FormGrid,
  FormGroup,
  ErrorMessage,
  TextAreaGroup,
  TextAreaContainer,
  CharCounter,
  TimeSlotSelector,
  TimeSlotGrid,
  TimeSlotItem,
  LoadingContainer,
  EmptyState,
  ActionButtons,
} from "./styles";

export function NewReservation() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedTableId = searchParams.get("tableId");
  const toast = useToast();
  const { tables } = useTables();
  const { createReservation } = useReservations();
  const { config } = useConfig();
  const [selectedTable, setSelectedTable] = useState<string>(
    preSelectedTableId || ""
  );
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
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Validar se a mesa pré-selecionada existe e está disponível
  useEffect(() => {
    if (preSelectedTableId && tables) {
      const table = tables.find((t) => t._id === preSelectedTableId);
      if (!table) {
        toast.error("Mesa não encontrada");
        setSelectedTable("");
      } else if (table.status !== "available") {
        toast.error("Mesa não está disponível para reserva");
        setSelectedTable("");
      }
    }
  }, [preSelectedTableId, tables, toast]);

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

  const handleTimeChange = (timeValue: string) => {
    setFormData((prev) => ({ ...prev, time: timeValue }));
    if (isPastTime(formData.date, timeValue)) {
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
      setIsSubmitting(true);
      await createReservation.mutateAsync(reservationData);
      // Toast já é exibido pelo hook useReservations
      navigate("/reservations");
    } catch (error: any) {
      console.error("[NewReservation] Erro ao criar reserva:", error);
      // Toast de erro já é exibido pelo hook useReservations
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/reservations");
  };

  const selectedTableData = tables?.find((t) => t._id === selectedTable);

  const hasErrors = nameError || emailError || dateError || timeError;
  const isFormValid =
    selectedTable &&
    formData.date &&
    formData.time &&
    formData.customerName &&
    formData.customerEmail &&
    !hasErrors;

  return (
    <PageWrapper>
      <LayoutContainer>
        <Header>
          <HeaderContent>
            <TitleSection>
              <Title>
                <Calendar size={32} />
                Nova Reserva
              </Title>
              <Subtitle>
                Faça sua reserva e garante seu lugar no restaurante
              </Subtitle>
            </TitleSection>
            <HeaderActions>
              <Button
                variant="outline"
                onClick={() => navigate("/reservations")}
                leftIcon={<ArrowLeft size={18} />}
              >
                Voltar
              </Button>
            </HeaderActions>
          </HeaderContent>
        </Header>

        <Content>
          {/* Card informativo sobre o processo */}
          {config && config.isIntervalEnabled && (
            <InfoCard>
              <InfoIcon>
                <Info size={24} />
              </InfoIcon>
              <InfoContent>
                <InfoTitle>Como funciona sua reserva</InfoTitle>
                <InfoDescription>
                  Sua reserva ficará{" "}
                  <strong>
                    pendente por {config.minIntervalBetweenReservations} minutos
                  </strong>{" "}
                  após a criação. Durante este período, você pode cancelá-la se
                  necessário. Após {config.minIntervalBetweenReservations}{" "}
                  minutos, ela será <strong>confirmada automaticamente</strong>.
                </InfoDescription>
              </InfoContent>
            </InfoCard>
          )}

          <form onSubmit={handleSubmit} style={{ display: "contents" }}>
            {/* Seleção de Mesa */}
            <FormSection>
              <SectionTitle>
                <Users size={20} />
                Escolha da Mesa
              </SectionTitle>
              <SectionDescription>
                Selecione a mesa desejada para sua reserva
              </SectionDescription>

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
            </FormSection>

            {/* Data e Horário */}
            <FormSection>
              <SectionTitle>
                <Clock size={20} />
                Data e Horário
              </SectionTitle>
              <SectionDescription>
                Escolha quando você gostaria de fazer sua reserva
              </SectionDescription>

              <FormGrid>
                <FormGroup>
                  <Input
                    label="Data"
                    type="date"
                    value={formData.date}
                    onChange={handleDateChange}
                    min={dateLimits.min}
                    max={dateLimits.max}
                    required
                    disabled={!selectedTable}
                    list="available-dates"
                  />
                  <datalist id="available-dates">
                    {selectedTable &&
                      tables &&
                      getAvailableDates(
                        tables.find((t) => t._id === selectedTable)
                      )?.map((date: string) => (
                        <option key={date} value={date} />
                      ))}
                  </datalist>
                  {dateError && <ErrorMessage>{dateError}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  {!formData.date ? (
                    <EmptyState>
                      <Clock size={24} />
                      <span>Selecione uma data primeiro</span>
                    </EmptyState>
                  ) : loadingHours ? (
                    <LoadingContainer>
                      <div className="spinner" />
                      <span>Carregando horários...</span>
                    </LoadingContainer>
                  ) : availableHours.length === 0 ? (
                    <EmptyState>
                      <AlertCircle size={24} />
                      <span>Nenhum horário disponível para esta data</span>
                    </EmptyState>
                  ) : (
                    <TimeSlotSelector>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "16px",
                          paddingBottom: "8px",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        <Clock size={16} />
                        <span
                          style={{
                            fontWeight: "500",
                            color: "#374151",
                            fontSize: "0.875rem",
                          }}
                        >
                          Horários Disponíveis
                        </span>
                        <span
                          style={{
                            backgroundColor: "#f3f4f6",
                            color: "#6b7280",
                            fontSize: "0.75rem",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontWeight: "500",
                          }}
                        >
                          {availableHours.length} disponível
                          {availableHours.length !== 1 ? "is" : ""}
                        </span>
                      </div>
                      <TimeSlotGrid>
                        {availableHours.map((hour, index) => (
                          <TimeSlotItem
                            key={index}
                            type="button"
                            $selected={formData.time === hour.start}
                            $disabled={isPastTime(formData.date, hour.start)}
                            onClick={() => {
                              if (!isPastTime(formData.date, hour.start)) {
                                handleTimeChange(hour.start);
                              }
                            }}
                          >
                            <Clock size={14} />
                            <span>
                              {hour.start} - {hour.end}
                            </span>
                          </TimeSlotItem>
                        ))}
                      </TimeSlotGrid>
                    </TimeSlotSelector>
                  )}
                  {timeError && <ErrorMessage>{timeError}</ErrorMessage>}
                </FormGroup>
              </FormGrid>
            </FormSection>

            {/* Informações do Cliente */}
            <FormSection>
              <SectionTitle>
                <User size={20} />
                Suas Informações
              </SectionTitle>
              <SectionDescription>
                Confirme ou atualize suas informações de contato
              </SectionDescription>

              <FormGrid>
                <FormGroup>
                  <Input
                    label="Nome"
                    value={formData.customerName}
                    onChange={handleNameChange}
                    required
                    maxLength={40}
                    autoComplete="name"
                    placeholder="Seu nome completo"
                  />
                  {nameError && <ErrorMessage>{nameError}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Input
                    label="Email"
                    type="email"
                    value={formData.customerEmail}
                    onChange={handleEmailChange}
                    required
                    autoComplete="email"
                    placeholder="seu@email.com"
                  />
                  {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
                </FormGroup>
              </FormGrid>

              <TextAreaGroup>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  <MessageSquare size={16} />
                  Observações (opcional)
                </label>
                <TextAreaContainer>
                  <textarea
                    value={formData.observations}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        observations: e.target.value.slice(0, 50),
                      })
                    }
                    placeholder="Alguma observação especial? (alergia, comemoração, etc.)"
                    maxLength={50}
                  />
                  <CharCounter>
                    {formData.observations.length}/50 caracteres
                  </CharCounter>
                </TextAreaContainer>
              </TextAreaGroup>
            </FormSection>

            {/* Resumo da Reserva */}
            {selectedTableData && formData.date && formData.time && (
              <InfoCard>
                <InfoIcon>
                  <CheckCircle size={24} />
                </InfoIcon>
                <InfoContent>
                  <InfoTitle>Resumo da Reserva</InfoTitle>
                  <InfoDescription>
                    <strong>Mesa:</strong> {selectedTableData.name} (até{" "}
                    {selectedTableData.capacity} pessoas)
                    <br />
                    <strong>Data:</strong>{" "}
                    {new Date(formData.date + "T00:00:00").toLocaleDateString(
                      "pt-BR"
                    )}
                    <br />
                    <strong>Horário:</strong> {formData.time}
                    <br />
                    <strong>Cliente:</strong> {formData.customerName}
                  </InfoDescription>
                </InfoContent>
              </InfoCard>
            )}

            {/* Ações */}
            <ActionButtons>
              <Button
                type="submit"
                variant="primary"
                disabled={!isFormValid || isSubmitting}
                leftIcon={isSubmitting ? undefined : <CheckCircle size={18} />}
              >
                {isSubmitting ? "Criando Reserva..." : "Fazer Reserva"}
              </Button>
              <CancelButton
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </CancelButton>
            </ActionButtons>
          </form>
        </Content>
      </LayoutContainer>
    </PageWrapper>
  );
}
