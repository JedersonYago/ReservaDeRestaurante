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
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: 16px;
  padding: 1.5rem;
  width: 100%;
  max-width: 600px;
  max-height: 85vh;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  position: relative;
  
  @media (max-width: 640px) {
    padding: 1rem;
    max-height: 95vh;
    border-radius: 12px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const WarningIcon = styled(AlertTriangle)`
  color: #f59e0b;
  flex-shrink: 0;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  
  @media (max-width: 640px) {
    font-size: 1.125rem;
  }
`;

const ModalSubtitle = styled.p`
  margin: 0.25rem 0 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
  line-height: 1.4;
`;

const ReservationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  max-height: 300px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.secondary};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.neutral[400]};
    border-radius: 3px;
  }
`;

const ReservationItem = styled(Card)`
  padding: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const ReservationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: between;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
  
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ReservationInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CustomerName = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ReservationDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  
  @media (max-width: 640px) {
    gap: 0.5rem;
  }
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.813rem;
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const ActionSection = styled.div`
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button<{ $isActive: boolean }>`
  padding: 0.5rem 0.75rem;
  border: 1px solid ${(props) => (props.$isActive ? "#3b82f6" : props.theme.colors.neutral[300])};
  background: ${(props) => (props.$isActive ? "#3b82f6" : props.theme.colors.background.secondary)};
  color: ${(props) => (props.$isActive ? "white" : props.theme.colors.text.primary)};
  border-radius: 8px;
  font-size: 0.813rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: fit-content;
  
  @media (max-width: 640px) {
    flex: 1;
    text-align: center;
  }

  &:hover {
    background: ${(props) => (props.$isActive ? "#2563eb" : props.theme.colors.background.tertiary)};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ReschedulingSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const ArrowIcon = styled(ArrowRight)`
  color: #6b7280;
  flex-shrink: 0;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  
  @media (max-width: 640px) {
    flex-direction: column-reverse;
    gap: 0.5rem;
  }
`;

const FooterLeft = styled.div`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 640px) {
    width: 100%;
    
    button {
      flex: 1;
    }
  }
`;

const FooterRight = styled.div`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 640px) {
    width: 100%;
    
    button {
      flex: 1;
    }
  }
`;

export function ReschedulingModal({
  isOpen,
  onClose,
  affectedReservations,
  tableId,
  tableName,
}: ReschedulingModalProps) {
  const queryClient = useQueryClient();
  const { processRescheduling, cancelAllAndMaintenance } = useRescheduling();

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
        <CloseButton onClick={onClose}>
          <X />
        </CloseButton>
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
