import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useTableById, useTables } from "../../../hooks/useTables";
import { useReservationsByTable } from "../../../hooks/useReservations";
import { Button } from "../../../components/Button";
import { ActionButton } from "../../../components/Button/ActionButton";
import { CancelButton } from "../../../components/Button/CancelButton";
import { BackButton } from "../../../components/Button/BackButton";
import { DeleteButton } from "../../../components/Button/DeleteButton";
import { tableService } from "../../../services/tableService";
import { toYMD } from "../../../utils/dateUtils";
import { formatDate, formatTime } from "../../../utils/dateUtils";
import { StatusBadge, type BadgeStatus } from "../../../components/StatusBadge";
import { useAuth } from "../../../hooks/useAuth";
import { useReservations } from "../../../hooks/useReservations";
import { Container as LayoutContainer } from "../../../components/Layout/Container";
import { PageWrapper, PageWrapperWithFixedActionBar } from "../../../components/Layout/PageWrapper";
import { FixedActionBar } from "../../../components/Layout/FixedActionBar";
import { ConfirmationModal } from "../../../components/Modal/ConfirmationModal";
import {
  ArrowLeft,
  Utensils,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  ChevronDown,
  ChevronUp,
  Hash,
  User,
  Mail,
} from "lucide-react";
import {
  Header,
  HeaderContent,
  TitleSection,
  Title,
  Subtitle,
  HeaderActions,
  Content,
  MainGrid,
  InfoCard,
  SectionTitle,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  StatusSection,
  DateSelector,
  AvailabilitySection,
  Legend,
  LegendItem,
  AvailabilityGrid,
  AvailabilityBlock,
  AvailabilityDate,
  AvailabilityTimes,
  AvailabilityTime,
  EmptyAvailability,
  ReservationsSection,
  ReservationsGrid,
  ReservationCard,
  ReservationHeader,
  ReservationNumber,
  ReservationStatus,
  ReservationInfo,
  CustomerInfo,
  DateTimeInfo,
  ReservationActions,
  EmptyReservations,
  LoadingContainer,
  LoadingSpinner,
  LoadingText,
  NotFoundContainer,
  NotFoundIcon,
  NotFoundContent,
  NotFoundTitle,
  NotFoundDescription,
  AvailabilityHeader,
  CollapseButton,
  AvailabilityPreview,
} from "./styles";

// Removido: agora usando sistema padronizado do StatusBadge

export function TableDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { deleteReservation, confirmReservation, cancelReservation } =
    useReservations();
  const { data: table, isLoading } = useTableById(id);
  const {
    reservations,
    loading: loadingReservations,
    refetch: refetchReservations,
  } = useReservationsByTable(id || "");
  const [selectedDate, setSelectedDate] = useState("");
  const [dynamicStatus, setDynamicStatus] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [collapsedBlocks, setCollapsedBlocks] = useState<
    Record<number, boolean>
  >({});
  const [showDeleteReservationModal, setShowDeleteReservationModal] =
    useState(false);
  const [showDeleteTableModal, setShowDeleteTableModal] = useState(false);
  const [showReservationActionModal, setShowReservationActionModal] =
    useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<string | null>(
    null
  );
  const [reservationActionConfig, setReservationActionConfig] = useState<{
    type: "confirm" | "cancel";
    reservationId: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isProcessingReservation, setIsProcessingReservation] = useState(false);
  const { deleteTable } = useTables();

  // Função para gerar número da reserva amigável
  const getReservationNumber = (id: string) => {
    const lastChars = id.slice(-6);
    const num = parseInt(lastChars, 16) % 999999;
    return num.toString().padStart(6, "0");
  };

  // Datas disponíveis (que têm horários cadastrados)
  const availableDates = useMemo(() => {
    if (!table?.availability) return [];
    return table.availability.map((block) => block.date).sort();
  }, [table]);

  // Inicializar blocos como recolhidos
  useEffect(() => {
    if (table?.availability) {
      const initialCollapsed: Record<number, boolean> = {};
      table.availability.forEach((_, idx) => {
        initialCollapsed[idx] = true; // Começar todos recolhidos
      });
      setCollapsedBlocks(initialCollapsed);
    }
  }, [table?.availability]);

  useEffect(() => {
    if (table && !selectedDate && availableDates.length > 0) {
      const today = toYMD(new Date());
      const defaultDate = availableDates.includes(today)
        ? today
        : availableDates[0];
      setSelectedDate(defaultDate);
    }
  }, [table, availableDates]);

  // Fetch status geral da data
  useEffect(() => {
    const fetchStatus = async () => {
      if (id && selectedDate) {
        setLoadingStatus(true);
        try {
          const res = await tableService.getStatus(id, selectedDate);
          setDynamicStatus(res.status);
        } catch {
          setDynamicStatus(null);
        }
        setLoadingStatus(false);
      }
    };
    fetchStatus();
  }, [id, selectedDate]);

  // Calcula status global e estatísticas em tempo real baseado nas reservas
  const globalTableStats = useMemo(() => {
    if (!table || table.status === "maintenance") {
      return {
        status: table?.status || "available",
        availableSlots: 0,
        reservedSlots: 0,
        totalSlots: 0,
      };
    }

    // Se não há horários cadastrados, usa status da mesa
    if (!table.availability || table.availability.length === 0) {
      return {
        status: table.status,
        availableSlots: 0,
        reservedSlots: 0,
        totalSlots: 0,
      };
    }

    // Se não há reservas, mesa está disponível
    if (!reservations || reservations.length === 0) {
      const totalSlots = table.availability.reduce((acc, block) => {
        const today = toYMD(new Date());
        return block.date >= today ? acc + block.times.length : acc;
      }, 0);

      return {
        status: "available",
        availableSlots: totalSlots,
        reservedSlots: 0,
        totalSlots,
      };
    }

    const today = toYMD(new Date());

    // Conta total de horários disponíveis para hoje ou datas futuras
    let totalSlotsAvailable = 0;
    let totalSlotsReserved = 0;

    table.availability.forEach((block) => {
      // Considera apenas blocos de hoje ou futuros
      if (block.date >= today) {
        block.times.forEach((timeRange) => {
          const [startTime] = timeRange.split("-");

          // Verifica se este horário específico tem reserva ativa
          const hasActiveReservation = reservations.some((reservation) => {
            // Normaliza as datas para comparação (remove possíveis diferenças de formato)
            const reservationDate = reservation.date;
            const blockDate = block.date;
            const reservationTime = reservation.time;

            return (
              reservationDate === blockDate &&
              reservationTime === startTime &&
              reservation.status !== "cancelled"
            );
          });

          if (hasActiveReservation) {
            totalSlotsReserved++;
          } else {
            totalSlotsAvailable++;
          }
        });
      }
    });

    const totalSlots = totalSlotsAvailable + totalSlotsReserved;

    // Se não há horários para hoje ou futuro, considera disponível
    if (totalSlots === 0) {
      return {
        status: "available",
        availableSlots: 0,
        reservedSlots: 0,
        totalSlots: 0,
      };
    }

    // Se todos os horários estão reservados, mesa está reservada
    const status = totalSlotsAvailable === 0 ? "reserved" : "available";

    return {
      status,
      availableSlots: totalSlotsAvailable,
      reservedSlots: totalSlotsReserved,
      totalSlots,
    };
  }, [table, reservations]);

  const globalTableStatus = globalTableStats.status;

  // Invalida queries da mesa quando o status global muda para atualizar em tempo real
  useEffect(() => {
    if (table && globalTableStatus !== table.status) {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      queryClient.invalidateQueries({ queryKey: ["table", id] });
    }
  }, [globalTableStatus, table?.status, id, queryClient]);

  // Calcula status dos horários de forma otimizada
  const timeSlotStatuses = useMemo(() => {
    if (!table?.availability || !reservations) return {};

    const statuses: Record<string, Record<string, string>> = {};

    for (const block of table.availability) {
      const dateStatuses: Record<string, string> = {};

      for (const timeRange of block.times) {
        const [startTime] = timeRange.split("-");

        const hasReservation = reservations.some(
          (reservation) =>
            reservation.date === block.date &&
            reservation.time === startTime &&
            reservation.status !== "cancelled"
        );

        dateStatuses[timeRange] = hasReservation ? "reserved" : "available";
      }

      statuses[block.date] = dateStatuses;
    }

    return statuses;
  }, [table?.availability, reservations]);

  const handleConfirmClick = (reservationId: string) => {
    setReservationActionConfig({
      type: "confirm",
      reservationId,
    });
    setShowReservationActionModal(true);
  };

  const handleCancelClick = (reservationId: string) => {
    setReservationActionConfig({
      type: "cancel",
      reservationId,
    });
    setShowReservationActionModal(true);
  };

  const handleConfirmReservationAction = async () => {
    if (!reservationActionConfig) return;

    setIsProcessingReservation(true);
    try {
      if (reservationActionConfig.type === "confirm") {
        await confirmReservation.mutateAsync(
          reservationActionConfig.reservationId
        );
      } else {
        await cancelReservation.mutateAsync(
          reservationActionConfig.reservationId
        );
      }
      refetchReservations();
      setShowReservationActionModal(false);
      setReservationActionConfig(null);
    } catch (error) {
      // Toast de erro já é exibido pelo hook
    } finally {
      setIsProcessingReservation(false);
    }
  };

  const handleCancelReservationAction = () => {
    setShowReservationActionModal(false);
    setReservationActionConfig(null);
    setIsProcessingReservation(false);
  };

  const handleDeleteClick = (reservationId: string) => {
    setReservationToDelete(reservationId);
    setShowDeleteReservationModal(true);
  };

  const handleConfirmDeleteReservation = async () => {
    if (!reservationToDelete) return;

    setIsDeleting(true);
    try {
      await deleteReservation.mutateAsync(reservationToDelete);
      refetchReservations();
      setShowDeleteReservationModal(false);
      setReservationToDelete(null);
    } catch (error) {
      // Toast de erro já é exibido pelo hook
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDeleteReservation = () => {
    setShowDeleteReservationModal(false);
    setReservationToDelete(null);
    setIsDeleting(false);
  };

  const handleDeleteTableClick = () => {
    if (!table) return;
    setShowDeleteTableModal(true);
  };

  const handleConfirmDeleteTable = async () => {
    if (!table) return;

    setIsDeleting(true);
    try {
      await deleteTable(table._id);
      navigate("/tables");
    } catch (error) {
      // Toast de erro já é exibido pelo hook
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDeleteTable = () => {
    setShowDeleteTableModal(false);
    setIsDeleting(false);
  };

  // Função para alternar colapso de um bloco
  const toggleBlockCollapse = (blockIdx: number) => {
    setCollapsedBlocks((prev) => ({
      ...prev,
      [blockIdx]: !prev[blockIdx],
    }));
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <LayoutContainer>
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Carregando detalhes da mesa...</LoadingText>
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
                A mesa solicitada não existe ou foi removida.
              </NotFoundDescription>
              <Button
                variant="primary"
                onClick={() => navigate("/tables")}
                leftIcon={<ArrowLeft size={18} />}
              >
                Voltar para Mesas
              </Button>
            </NotFoundContent>
          </NotFoundContainer>
        </LayoutContainer>
      </PageWrapper>
    );
  }

  // Removido: agora usando sistema padronizado do StatusBadge

  return (
    <PageWrapperWithFixedActionBar>
      <LayoutContainer>
        <Header>
          <HeaderContent>
            <TitleSection>
              <Title>
                <Utensils size={32} />
                {table.name}
              </Title>
              <Subtitle>
                {user?.role === "admin"
                  ? "Detalhes e reservas da mesa"
                  : "Informações da mesa e disponibilidade"}
              </Subtitle>
            </TitleSection>
            <HeaderActions>
              <StatusBadge status={table.status} size="lg" />
            </HeaderActions>
          </HeaderContent>
        </Header>

        <Content>
          <MainGrid>
            <InfoCard>
              <SectionTitle>
                <Utensils size={20} />
                Informações da Mesa
              </SectionTitle>

              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Nome da Mesa</InfoLabel>
                  <InfoValue>{table.name}</InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>Capacidade</InfoLabel>
                  <InfoValue>
                    <Users size={16} />
                    {table.capacity} pessoas
                  </InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>Status Global</InfoLabel>
                  <InfoValue>
                    <StatusBadge
                      status={globalTableStatus as BadgeStatus}
                      size="sm"
                    />
                    {globalTableStats.totalSlots > 0 && (
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#6b7280",
                          marginTop: "4px",
                          display: "flex",
                          gap: "8px",
                          alignItems: "center",
                        }}
                      >
                        <span>{globalTableStats.availableSlots} livres</span>
                        <span>•</span>
                        <span>{globalTableStats.reservedSlots} ocupados</span>
                        <span>•</span>
                        <span>{globalTableStats.totalSlots} total</span>
                      </div>
                    )}
                  </InfoValue>
                </InfoItem>
              </InfoGrid>

              <StatusSection>
                <InfoLabel>Status para Data Específica</InfoLabel>
                <div>
                  <DateSelector
                    value={selectedDate}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setSelectedDate(e.target.value)
                    }
                  >
                    <option value="">Selecione uma data</option>
                    {availableDates.map((date) => (
                      <option key={date} value={date}>
                        {formatDate(date)}
                      </option>
                    ))}
                  </DateSelector>
                  {loadingStatus ? (
                    <span>Carregando...</span>
                  ) : (
                    dynamicStatus && (
                      <StatusBadge
                        status={dynamicStatus as BadgeStatus}
                        size="sm"
                      />
                    )
                  )}
                </div>
              </StatusSection>
            </InfoCard>

            <AvailabilitySection>
              <SectionTitle>
                <Calendar size={20} />
                Horários de Disponibilidade
              </SectionTitle>

              <Legend>
                <LegendItem>
                  <StatusBadge status="available" size="sm">
                    Livre
                  </StatusBadge>
                  <span>Horário livre para reserva</span>
                </LegendItem>
                <LegendItem>
                  <StatusBadge status="reserved" size="sm">
                    Reservado
                  </StatusBadge>
                  <span>Horário já ocupado</span>
                </LegendItem>
              </Legend>

              {table.availability && table.availability.length > 0 ? (
                <AvailabilityGrid>
                  {table.availability.map((block, idx) => {
                    const isCollapsed = collapsedBlocks[idx];
                    const timesCount = block.times.length;

                    return (
                      <AvailabilityBlock key={idx}>
                        <AvailabilityHeader>
                          <AvailabilityDate>
                            <Calendar size={16} />
                            <strong>{formatDate(block.date)}</strong>
                          </AvailabilityDate>
                          <CollapseButton
                            onClick={() => toggleBlockCollapse(idx)}
                            type="button"
                          >
                            {isCollapsed ? (
                              <>
                                <span>Expandir</span>
                                <ChevronDown size={16} />
                              </>
                            ) : (
                              <>
                                <span>Recolher</span>
                                <ChevronUp size={16} />
                              </>
                            )}
                          </CollapseButton>
                        </AvailabilityHeader>

                        {isCollapsed ? (
                          <AvailabilityPreview>
                            <span>
                              {timesCount} horário{timesCount !== 1 ? "s" : ""}
                            </span>
                            {block.times
                              .slice(0, 2)
                              .map((timeRange, timeIdx) => {
                                const status =
                                  timeSlotStatuses[block.date]?.[timeRange] ||
                                  "available";
                                const isAvailable = status === "available";
                                return (
                                  <StatusBadge
                                    key={timeIdx}
                                    status={
                                      isAvailable ? "available" : "reserved"
                                    }
                                    size="sm"
                                  >
                                    {timeRange}
                                  </StatusBadge>
                                );
                              })}
                            {timesCount > 2 && (
                              <span>... e mais {timesCount - 2}</span>
                            )}
                          </AvailabilityPreview>
                        ) : (
                          <AvailabilityTimes>
                            {block.times.map((timeRange, timeIdx) => {
                              const status =
                                timeSlotStatuses[block.date]?.[timeRange] ||
                                "available";
                              const isAvailable = status === "available";
                              return (
                                <AvailabilityTime
                                  key={timeIdx}
                                  $available={isAvailable}
                                >
                                  <Clock size={14} />
                                  <span>{timeRange}</span>
                                  <StatusBadge
                                    status={
                                      isAvailable ? "available" : "reserved"
                                    }
                                    size="sm"
                                  >
                                    {isAvailable ? "Livre" : "Reservado"}
                                  </StatusBadge>
                                </AvailabilityTime>
                              );
                            })}
                          </AvailabilityTimes>
                        )}
                      </AvailabilityBlock>
                    );
                  })}
                </AvailabilityGrid>
              ) : (
                <EmptyAvailability>
                  <Calendar size={48} />
                  <div>
                    <h4>Nenhuma disponibilidade cadastrada</h4>
                    <p>Configure os horários disponíveis para esta mesa</p>
                  </div>
                </EmptyAvailability>
              )}
            </AvailabilitySection>
          </MainGrid>

          {user?.role === "admin" && (
            <ReservationsSection>
              <SectionTitle>
                <Calendar size={20} />
                Reservas da Mesa
                {reservations.length > 0 && (
                  <span>({reservations.length})</span>
                )}
              </SectionTitle>

              {loadingReservations ? (
                <LoadingContainer>
                  <LoadingSpinner />
                  <LoadingText>Carregando reservas...</LoadingText>
                </LoadingContainer>
              ) : reservations.length > 0 ? (
                <ReservationsGrid>
                  {reservations.map((reservation) => (
                    <ReservationCard key={reservation._id}>
                      <ReservationHeader>
                        <ReservationNumber>
                          <Hash size={16} />#
                          {getReservationNumber(reservation._id)}
                        </ReservationNumber>
                        <ReservationStatus>
                          <StatusBadge
                            status={reservation.status as BadgeStatus}
                            size="sm"
                          />
                        </ReservationStatus>
                      </ReservationHeader>

                      <ReservationInfo>
                        <CustomerInfo>
                          <div>
                            <User size={16} />
                            <span>{reservation.customerName}</span>
                          </div>
                          <div>
                            <Mail size={16} />
                            <span>{reservation.customerEmail}</span>
                          </div>
                        </CustomerInfo>

                        <DateTimeInfo>
                          <div>
                            <Calendar size={16} />
                            <span>{formatDate(reservation.date)}</span>
                          </div>
                          <div>
                            <Clock size={16} />
                            <span>{formatTime(reservation.time)}</span>
                          </div>
                        </DateTimeInfo>
                      </ReservationInfo>

                      <ReservationActions>
                        <ActionButton
                          onClick={() =>
                            navigate(`/reservations/${reservation._id}`)
                          }
                          variant="secondary"
                          leftIcon={<Eye size={16} />}
                        >
                          Detalhes
                        </ActionButton>

                        {reservation.status === "pending" &&
                          user?.role === "admin" && (
                            <ActionButton
                              onClick={() =>
                                handleConfirmClick(reservation._id)
                              }
                              variant="success"
                              leftIcon={<CheckCircle size={16} />}
                            >
                              Confirmar
                            </ActionButton>
                          )}

                        {reservation.status !== "cancelled" && (
                          <CancelButton
                            onClick={() => handleCancelClick(reservation._id)}
                            leftIcon={<XCircle size={16} />}
                          >
                            Cancelar
                          </CancelButton>
                        )}

                        {user?.role === "admin" && (
                          <DeleteButton
                            onClick={() => handleDeleteClick(reservation._id)}
                          >
                            Excluir
                          </DeleteButton>
                        )}
                      </ReservationActions>
                    </ReservationCard>
                  ))}
                </ReservationsGrid>
              ) : (
                <EmptyReservations>
                  <Calendar size={64} />
                  <div>
                    <h4>Nenhuma reserva encontrada</h4>
                    <p>Esta mesa ainda não possui reservas</p>
                  </div>
                </EmptyReservations>
              )}
            </ReservationsSection>
          )}
        </Content>

        {user?.role === "admin" && (
          <>
            <ConfirmationModal
              isOpen={showDeleteReservationModal}
              onClose={handleCancelDeleteReservation}
              onConfirm={handleConfirmDeleteReservation}
              type="danger"
              title="Excluir Reserva"
              message="Tem certeza que deseja excluir esta reserva? Esta ação não pode ser desfeita."
              confirmText="Sim, Excluir"
              cancelText="Cancelar"
              isLoading={isDeleting}
            />

            <ConfirmationModal
              isOpen={showDeleteTableModal}
              onClose={handleCancelDeleteTable}
              onConfirm={handleConfirmDeleteTable}
              type="danger"
              title="Excluir Mesa"
              message={
                reservations.length > 0
                  ? `Esta mesa possui ${reservations.length} reserva(s). Ao excluí-la, todas as reservas serão canceladas. Deseja continuar?`
                  : "Tem certeza que deseja excluir esta mesa? Esta ação não pode ser desfeita."
              }
              confirmText="Sim, Excluir"
              cancelText="Cancelar"
              isLoading={isDeleting}
            />

            <ConfirmationModal
              isOpen={showReservationActionModal}
              onClose={handleCancelReservationAction}
              onConfirm={handleConfirmReservationAction}
              type={
                reservationActionConfig?.type === "confirm"
                  ? "success"
                  : "warning"
              }
              title={
                reservationActionConfig?.type === "confirm"
                  ? "Confirmar Reserva"
                  : "Cancelar Reserva"
              }
              message={
                reservationActionConfig?.type === "confirm"
                  ? "Tem certeza que deseja confirmar esta reserva?"
                  : "Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita."
              }
              confirmText={
                reservationActionConfig?.type === "confirm"
                  ? "Sim, Confirmar"
                  : "Sim, Cancelar"
              }
              cancelText="Não"
              isLoading={isProcessingReservation}
            />
          </>
        )}
      </LayoutContainer>

      <FixedActionBar>
        <BackButton
          onClick={() => navigate("/tables")}
          leftIcon={<ArrowLeft size={18} />}
        >
          Voltar
        </BackButton>
        {user?.role === "admin" ? (
          <>
            <Button
              variant="primary"
              onClick={() => navigate(`/tables/${table._id}/edit`)}
              leftIcon={<Edit size={16} />}
            >
              Editar Mesa
            </Button>
            <DeleteButton
              onClick={handleDeleteTableClick}
            >
              Excluir Mesa
            </DeleteButton>
          </>
        ) : (
          <Button
            variant="primary"
            onClick={() =>
              navigate(`/reservations/new?tableId=${table._id}`)
            }
            leftIcon={<Calendar size={16} />}
            disabled={table.status !== "available"}
          >
            Reservar Mesa
          </Button>
        )}
      </FixedActionBar>
    </PageWrapperWithFixedActionBar>
  );
}
