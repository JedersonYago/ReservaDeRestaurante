import { useParams, useNavigate } from "react-router-dom";
import { useTableById } from "../../../hooks/useTables";
import { useReservationsByTable } from "../../../hooks/useReservations";
import styled from "styled-components";
import { Button } from "../../../components/Button";
import { useState, useEffect, useMemo } from "react";
import { tableService } from "../../../services/tableService";
import { toYMD } from "../../../utils/dateUtils";
import { formatDate, formatTime } from "../../../utils/dateUtils";
import { StatusBadge } from "../../../components/StatusBadge";
import { useAuth } from "../../../hooks/useAuth";
import { useReservations } from "../../../hooks/useReservations";
import { getStatusText } from "../../../utils/textUtils";

export function TableDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  // Datas disponíveis (que têm horários cadastrados)
  const availableDates = useMemo(() => {
    if (!table?.availability) return [];
    return table.availability.map((block) => block.date).sort();
  }, [table]);

  useEffect(() => {
    if (table && !selectedDate && availableDates.length > 0) {
      // Define a primeira data disponível como padrão
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

  // Calcula status dos horários de forma otimizada
  const timeSlotStatuses = useMemo(() => {
    if (!table?.availability || !reservations) return {};

    const statuses: Record<string, Record<string, string>> = {};

    for (const block of table.availability) {
      const dateStatuses: Record<string, string> = {};

      for (const timeRange of block.times) {
        const [startTime] = timeRange.split("-");

        // Verifica se há reserva para este horário específico
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

  const handleConfirm = async (reservationId: string) => {
    try {
      await confirmReservation.mutateAsync(reservationId);
      refetchReservations();
    } catch (error) {
      // Toast de erro já é exibido pelo hook
    }
  };

  const handleCancel = async (reservationId: string) => {
    try {
      await cancelReservation.mutateAsync(reservationId);
      refetchReservations();
    } catch (error) {
      // Toast de erro já é exibido pelo hook
    }
  };

  const handleDelete = async (reservationId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta reserva?")) {
      try {
        await deleteReservation.mutateAsync(reservationId);
        refetchReservations();
      } catch (error) {
        // Toast de erro já é exibido pelo hook
      }
    }
  };

  if (isLoading) {
    return <Loading>Carregando...</Loading>;
  }

  if (!table) {
    return <NotFound>Mesa não encontrada</NotFound>;
  }

  return (
    <Container>
      <Header>
        <h1>Detalhes da Mesa {table.name}</h1>
        <Button $variant="secondary" onClick={() => navigate("/tables")}>
          Voltar
        </Button>
      </Header>

      <Content>
        <InfoCard>
          <h2>Informações</h2>
          <InfoItem>
            <Label>Nome:</Label>
            <Value>{table.name}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Capacidade:</Label>
            <Value>{table.capacity} pessoas</Value>
          </InfoItem>
          <InfoItem>
            <Label>Status global:</Label>
            <StatusBadge status={table.status}>
              {getStatusText(table.status)}
            </StatusBadge>
          </InfoItem>
          <InfoItem>
            <Label>Status para data:</Label>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
                  <StatusBadge status={dynamicStatus}>
                    {getStatusText(dynamicStatus)}
                  </StatusBadge>
                )
              )}
            </div>
          </InfoItem>
          <InfoItem>
            <Label>Disponibilidade:</Label>
            <AvailabilityContainer>
              <Legend>
                <LegendItem>
                  <StatusBadge status="available">Disponível</StatusBadge>
                  <span>Horário livre para reserva</span>
                </LegendItem>
                <LegendItem>
                  <StatusBadge status="reserved">Reservado</StatusBadge>
                  <span>Horário já reservado</span>
                </LegendItem>
              </Legend>

              {table.availability && table.availability.length > 0 ? (
                table.availability.map((block, idx) => (
                  <AvailabilityBlock key={idx}>
                    <AvailabilityDate>
                      📅 <strong>{formatDate(block.date)}</strong>
                    </AvailabilityDate>
                    <AvailabilityTimes>
                      {block.times.map((timeRange, timeIdx) => {
                        const status =
                          timeSlotStatuses[block.date]?.[timeRange] ||
                          "available";
                        return (
                          <AvailabilityTime key={timeIdx}>
                            <span>{timeRange}</span>
                            <StatusBadge status={status}>
                              {status === "available"
                                ? "Disponível"
                                : "Reservado"}
                            </StatusBadge>
                          </AvailabilityTime>
                        );
                      })}
                    </AvailabilityTimes>
                  </AvailabilityBlock>
                ))
              ) : (
                <EmptyAvailability>
                  📋 Nenhuma disponibilidade cadastrada
                </EmptyAvailability>
              )}
            </AvailabilityContainer>
          </InfoItem>
        </InfoCard>

        <ReservationsCard>
          <h2>Reservas</h2>
          {loadingReservations ? (
            <Loading>Carregando reservas...</Loading>
          ) : reservations.length > 0 ? (
            <ReservationsTable>
              <thead>
                <tr>
                  <TableHeader>Cliente</TableHeader>
                  <TableHeader>Data</TableHeader>
                  <TableHeader>Horário</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Ações</TableHeader>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation._id}>
                    <TableCell>
                      {reservation.customerName}
                      <br />
                      <small>{reservation.customerEmail}</small>
                    </TableCell>
                    <TableCell>{formatDate(reservation.date)}</TableCell>
                    <TableCell>{formatTime(reservation.time)}</TableCell>
                    <TableCell>
                      <StatusBadge status={reservation.status}>
                        {getStatusText(reservation.status)}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <ButtonGroup>
                        <Button
                          type="button"
                          onClick={() =>
                            navigate(`/reservations/${reservation._id}`)
                          }
                          $variant="secondary"
                        >
                          Detalhes
                        </Button>
                        {reservation.status === "pending" &&
                          user?.role === "admin" && (
                            <Button
                              type="button"
                              onClick={() => handleConfirm(reservation._id)}
                              $variant="secondary"
                            >
                              Confirmar
                            </Button>
                          )}
                        {reservation.status !== "cancelled" && (
                          <Button
                            type="button"
                            onClick={() => handleCancel(reservation._id)}
                            $variant="secondary"
                          >
                            Cancelar
                          </Button>
                        )}
                        {user?.role === "admin" && (
                          <Button
                            type="button"
                            onClick={() => handleDelete(reservation._id)}
                            $variant="danger"
                          >
                            Excluir
                          </Button>
                        )}
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </ReservationsTable>
          ) : (
            <EmptyMessage>
              Nenhuma reserva encontrada para esta mesa
            </EmptyMessage>
          )}
        </ReservationsCard>

        <ButtonGroup>
          <Button
            $variant="secondary"
            onClick={() => navigate(`/tables/${table._id}/edit`)}
          >
            Editar
          </Button>
        </ButtonGroup>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    color: #333;
  }
`;

const Content = styled.div`
  display: grid;
  gap: 2rem;
`;

const InfoCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h2 {
    color: #333;
    margin-bottom: 1.5rem;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.span`
  font-weight: 500;
  color: #666;
  width: 150px;
`;

const Value = styled.span`
  color: #333;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 1.2rem;
  color: #666;
`;

const NotFound = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 1.2rem;
  color: #666;
`;

const ReservationsCard = styled(InfoCard)`
  margin-top: 2rem;
`;

const ReservationsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const TableHeader = styled.th`
  padding: 12px;
  text-align: left;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
  color: #495057;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }

  &:hover {
    background-color: #f1f3f5;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
  color: #212529;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #666;
  margin: 2rem 0;
`;

const DateSelector = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  background: white;
  color: #333;
  font-size: 0.9rem;
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const AvailabilityContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
`;

const AvailabilityBlock = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  background: #fafafa;
`;

const AvailabilityDate = styled.div`
  font-size: 1rem;
  margin-bottom: 0.75rem;
  color: #333;

  strong {
    color: #007bff;
  }
`;

const AvailabilityTimes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const AvailabilityTime = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e0e0e0;

  span {
    font-weight: 500;
    color: #333;
    font-size: 0.9rem;
  }
`;

const EmptyAvailability = styled.div`
  text-align: center;
  color: #666;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  font-style: italic;
`;

const Legend = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    font-size: 0.875rem;
    color: #666;
  }
`;
