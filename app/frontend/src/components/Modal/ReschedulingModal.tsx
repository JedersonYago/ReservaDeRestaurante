import React, { useState } from "react";
import styled from "styled-components";
import {
  AlertTriangle,
  Users,
  Calendar,
  Clock,
  ArrowRight,
  X,
} from "lucide-react";
import { Button } from "../Button";
import { CancelButton } from "../Button/CancelButton";
import { Select } from "../Select";
import { Card } from "../Card";
import { useRescheduling } from "../../hooks/useRescheduling";
import { useQueryClient } from "@tanstack/react-query";
import { tableService } from "../../services/tableService";
import type { Reservation, Table } from "../../types";

interface ReschedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  affectedReservations: Reservation[];
  tableId: string;
  tableName: string;
}

interface ReschedulingAction {
  reservationId: string;
  action: "reschedule" | "cancel";
  newTableId?: string;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const WarningIcon = styled(AlertTriangle)`
  color: #f59e0b;
  flex-shrink: 0;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
`;

const ModalSubtitle = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
`;

const ReservationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ReservationItem = styled(Card)`
  padding: 1.5rem;
`;

const ReservationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: between;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ReservationInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CustomerName = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
`;

const ReservationDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
`;

const ActionSection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ActionButton = styled.button<{ $isActive: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${(props) => (props.$isActive ? "#3b82f6" : "#d1d5db")};
  background: ${(props) => (props.$isActive ? "#3b82f6" : "white")};
  color: ${(props) => (props.$isActive ? "white" : "#374151")};
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.$isActive ? "#2563eb" : "#f9fafb")};
  }
`;

const ReschedulingSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const ArrowIcon = styled(ArrowRight)`
  color: #6b7280;
  flex-shrink: 0;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const FooterLeft = styled.div`
  display: flex;
  gap: 1rem;
`;

const FooterRight = styled.div`
  display: flex;
  gap: 1rem;
`;

export function ReschedulingModal({
  isOpen,
  onClose,
  affectedReservations,
  tableId,
  tableName,
}: ReschedulingModalProps) {
  const queryClient = useQueryClient();
  const {
    getAvailableTablesForRescheduling,
    processRescheduling,
    cancelAllAndMaintenance,
  } = useRescheduling();

  const [actions, setActions] = useState<Record<string, ReschedulingAction>>(
    {}
  );
  const [availableTables, setAvailableTables] = useState<
    Record<string, Table[]>
  >({});

  // Carregar mesas disponíveis para cada reserva
  React.useEffect(() => {
    if (isOpen && affectedReservations.length > 0) {
      const loadAvailableTables = async () => {
        for (const reservation of affectedReservations) {
          try {
            // Buscar informações da reserva para usar capacidade da mesa original
            const tables = await tableService.getAvailableForRescheduling(
              reservation.date,
              reservation.time,
              1, // Capacidade mínima (qualquer mesa serve para remanejamento)
              tableId
            );
            setAvailableTables((prev) => ({
              ...prev,
              [reservation._id]: tables,
            }));
          } catch (error) {
            console.error("Erro ao carregar mesas para remanejamento:", error);
          }
        }
      };

      loadAvailableTables();
    }
  }, [isOpen, affectedReservations, tableId]);

  const handleActionChange = (
    reservationId: string,
    action: "reschedule" | "cancel"
  ) => {
    setActions((prev) => ({
      ...prev,
      [reservationId]: {
        reservationId,
        action,
        newTableId:
          action === "reschedule" ? prev[reservationId]?.newTableId : undefined,
      },
    }));
  };

  const handleTableChange = (reservationId: string, newTableId: string) => {
    setActions((prev) => ({
      ...prev,
      [reservationId]: {
        ...prev[reservationId],
        newTableId,
      },
    }));
  };

  const handleProcessRescheduling = async () => {
    const actionsList = Object.values(actions);

    if (actionsList.length !== affectedReservations.length) {
      return; // Ainda há reservas sem ação definida
    }

    await processRescheduling.mutateAsync({
      tableId,
      actions: actionsList,
    });

    // Invalidar queries relevantes
    queryClient.invalidateQueries({ queryKey: ["tables"] });
    queryClient.invalidateQueries({ queryKey: ["reservations"] });

    onClose();
  };

  const handleCancelAll = async () => {
    await cancelAllAndMaintenance.mutateAsync(tableId);

    // Invalidar queries relevantes
    queryClient.invalidateQueries({ queryKey: ["tables"] });
    queryClient.invalidateQueries({ queryKey: ["reservations"] });

    onClose();
  };

  const canProcess =
    Object.keys(actions).length === affectedReservations.length;
  const hasRescheduling = Object.values(actions).some(
    (action) => action.action === "reschedule"
  );

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <WarningIcon size={24} />
          <div>
            <ModalTitle>Mesa em Manutenção</ModalTitle>
            <ModalSubtitle>
              A mesa "{tableName}" tem {affectedReservations.length} reserva(s)
              ativa(s) que precisam ser remanejadas
            </ModalSubtitle>
          </div>
        </ModalHeader>

        <ReservationList>
          {affectedReservations.map((reservation) => (
            <ReservationItem key={reservation._id}>
              <ReservationHeader>
                <ReservationInfo>
                  <CustomerName>{reservation.customerName}</CustomerName>
                  <ReservationDetails>
                    <DetailItem>
                      <Calendar size={16} />
                      {new Date(reservation.date).toLocaleDateString("pt-BR")}
                    </DetailItem>
                    <DetailItem>
                      <Clock size={16} />
                      {reservation.time}
                    </DetailItem>
                    <DetailItem>
                      <Users size={16} />
                      {reservation.customerEmail}
                    </DetailItem>
                  </ReservationDetails>
                </ReservationInfo>
              </ReservationHeader>

              <ActionSection>
                <ActionButtons>
                  <ActionButton
                    $isActive={
                      actions[reservation._id]?.action === "reschedule"
                    }
                    onClick={() =>
                      handleActionChange(reservation._id, "reschedule")
                    }
                  >
                    Remanejar
                  </ActionButton>
                  <ActionButton
                    $isActive={actions[reservation._id]?.action === "cancel"}
                    onClick={() =>
                      handleActionChange(reservation._id, "cancel")
                    }
                  >
                    Cancelar
                  </ActionButton>
                </ActionButtons>

                {actions[reservation._id]?.action === "reschedule" && (
                  <ReschedulingSection>
                    <span>{tableName}</span>
                    <ArrowIcon size={16} />
                    <Select
                      value={actions[reservation._id]?.newTableId || ""}
                      onChange={(e) =>
                        handleTableChange(reservation._id, e.target.value)
                      }
                    >
                      <option value="">Selecione uma mesa</option>
                      {availableTables[reservation._id]?.map((table) => (
                        <option key={table._id} value={table._id}>
                          {table.name} (Cap: {table.capacity})
                        </option>
                      ))}
                    </Select>
                  </ReschedulingSection>
                )}
              </ActionSection>
            </ReservationItem>
          ))}
        </ReservationList>

        <ModalFooter>
          <FooterLeft>
            <Button
              variant="danger"
              onClick={handleCancelAll}
              disabled={cancelAllAndMaintenance.isPending}
            >
              Cancelar Todas
            </Button>
          </FooterLeft>

          <FooterRight>
            <CancelButton onClick={onClose}>Fechar</CancelButton>
            <Button
              onClick={handleProcessRescheduling}
              disabled={!canProcess || processRescheduling.isPending}
            >
              {hasRescheduling
                ? "Processar Remanejamento"
                : "Confirmar Cancelamentos"}
            </Button>
          </FooterRight>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
}
