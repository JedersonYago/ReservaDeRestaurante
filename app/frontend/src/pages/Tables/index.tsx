import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  FilterX,
  Utensils,
  Users,
  Eye,
  Edit2,
  AlertTriangle,
} from "lucide-react";
import { useTables } from "../../hooks/useTables";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/Button";
import { ActionButton } from "../../components/Button/ActionButton";
import { DeleteButton } from "../../components/Button/DeleteButton";
import { Input } from "../../components/Input";
import { StatusBadge } from "../../components/StatusBadge";
import { Container as LayoutContainer } from "../../components/Layout/Container";
import { ConfirmationModal } from "../../components/Modal/ConfirmationModal";
import { PageWrapper } from "../../components/Layout/PageWrapper";
import {
  Header,
  HeaderContent,
  TitleSection,
  Title,
  Subtitle,
  HeaderActions,
  FiltersSection,
  FiltersHeader,
  FiltersTitle,
  FiltersGrid,
  SearchContainer,
  FilterContainer,
  Select,
  ClearFiltersButton,
  ContentSection,
  TablesGrid,
  TableCard,
  CardHeader,
  TableInfo,
  StatusBadgeContainer,
  CardContent,
  CapacityInfo,
  WarningInfo,
  CardActions,
  EmptyState,
  EmptyStateIcon,
  EmptyStateContent,
  EmptyTitle,
  EmptyDescription,
  ResultsCounter,
} from "./styles";

// Removido: agora usando sistema padronizado do StatusBadge

export function Tables() {
  const { tables, isLoading, deleteTable } = useTables();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(
    user?.role === "client" ? "available" : "all"
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<{
    id: string;
    name: string;
    hasReservations: boolean;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdmin = user?.role === "admin";
  const hasActiveFilters = isAdmin
    ? searchTerm !== "" || statusFilter !== "all"
    : searchTerm !== "";

  const clearFilters = () => {
    setSearchTerm("");
    if (isAdmin) {
      setStatusFilter("all");
    }
  };

  const filteredTables = useMemo(() => {
    if (!tables) return [];

    // Definir prioridade de status para ordenação
    const statusPriority: Record<string, number> = {
      available: 1, // Prioridade máxima - disponível para uso
      reserved: 2, // Ocupada mas funcional
      pending: 3, // Em progresso
      confirmed: 4, // Confirmada
      maintenance: 5, // Indisponível temporariamente
      cancelled: 6, // Cancelada
      expired: 7, // Prioridade mínima - expirada
    };

    return tables
      .filter((table) => {
        // Para clientes, aplicar busca apenas no nome (sem filtros de status)
        if (!isAdmin) {
          const matchesSearch = table.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

          // Clientes só veem mesas disponíveis
          const isAvailable = table.status === "available";

          return matchesSearch && isAvailable;
        }

        // Para admins, usar a lógica completa de filtros
        const matchesSearch = table.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || table.status === statusFilter;

        // Para admins, mostrar todas as mesas conforme filtros (incluindo expiradas)
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        // Ordenar por prioridade de status (menor número = maior prioridade)
        const priorityA = statusPriority[a.status] || 99;
        const priorityB = statusPriority[b.status] || 99;

        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }

        // Se status igual, ordenar por nome
        return a.name.localeCompare(b.name);
      });
  }, [tables, searchTerm, statusFilter, isAdmin]);

  const handleDeleteClick = (id: string) => {
    const table = tables?.find((t) => t._id === id);
    const hasActiveReservations = (table?.reservations?.length ?? 0) > 0;

    setTableToDelete({
      id,
      name: table?.name || "",
      hasReservations: hasActiveReservations,
    });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!tableToDelete) return;

    setIsDeleting(true);
    try {
      await deleteTable(tableToDelete.id);
      setShowDeleteModal(false);
      setTableToDelete(null);
      // Toast já é exibido pelo hook useTables
    } catch (error: any) {
      // Toast de erro já é exibido pelo hook
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setTableToDelete(null);
    setIsDeleting(false);
  };

  // Removido: agora usando funções helper padronizadas do StatusBadge

  if (isLoading) {
    return (
      <PageWrapper>
        <LayoutContainer>
          <div>Carregando mesas...</div>
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
                Mesas
              </Title>
              <Subtitle>
                {isAdmin
                  ? "Gerencie todas as mesas do restaurante"
                  : "Escolha uma mesa para fazer sua reserva"}
              </Subtitle>
            </TitleSection>
            <HeaderActions>
              {isAdmin && (
                <Button
                  variant="primary"
                  onClick={() => navigate("/tables/new")}
                  leftIcon={<Plus size={18} />}
                >
                  Nova Mesa
                </Button>
              )}
            </HeaderActions>
          </HeaderContent>
        </Header>

        <FiltersSection>
          <FiltersHeader>
            <Filter size={20} />
            <FiltersTitle>Filtros de Busca</FiltersTitle>
          </FiltersHeader>

          <FiltersGrid>
            <SearchContainer>
              <label htmlFor="tables-search">
                <Search size={16} />
                Buscar mesas
              </label>
              <div className="input-wrapper">
                <Search size={18} />
                <Input
                  id="tables-search"
                  type="text"
                  placeholder="Nome da mesa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </SearchContainer>

            {isAdmin && (
              <FilterContainer>
                <label htmlFor="table-status-filter">
                  <Filter size={16} />
                  Status
                </label>
                <Select
                  id="table-status-filter"
                  value={statusFilter}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setStatusFilter(e.target.value)
                  }
                >
                  <option value="all">Todos os status</option>
                  <option value="available">Disponível</option>
                  <option value="reserved">Reservada</option>
                  <option value="maintenance">Em Manutenção</option>
                  <option value="expired">Expirada</option>
                </Select>
              </FilterContainer>
            )}

            <ClearFiltersButton
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              title="Limpar todos os filtros"
            >
              <FilterX size={16} />
              Limpar
            </ClearFiltersButton>
          </FiltersGrid>
        </FiltersSection>

        <ContentSection>
          {filteredTables?.length > 0 ? (
            <>
              {hasActiveFilters && (
                <ResultsCounter>
                  <strong>{filteredTables.length}</strong> mesa
                  {filteredTables.length !== 1 ? "s" : ""} encontrada
                  {filteredTables.length !== 1 ? "s" : ""}
                </ResultsCounter>
              )}
              <TablesGrid>
                {filteredTables.map((table) => {
                  const hasActiveReservations =
                    (table.reservations?.length ?? 0) > 0;

                  return (
                    <TableCard key={table._id}>
                      <CardHeader>
                        <TableInfo>
                          <Utensils size={18} />
                          <span>{table.name}</span>
                        </TableInfo>
                        <StatusBadgeContainer>
                          <StatusBadge status={table.status as any} size="md" />
                        </StatusBadgeContainer>
                      </CardHeader>

                      <CardContent>
                        <CapacityInfo>
                          <div>
                            <Users size={16} />
                            <span>Capacidade: {table.capacity} pessoas</span>
                          </div>
                        </CapacityInfo>

                        {hasActiveReservations && isAdmin && (
                          <WarningInfo>
                            <AlertTriangle size={16} />
                            <span>
                              {table.reservations?.length ?? 0} reserva(s)
                              ativa(s)
                            </span>
                          </WarningInfo>
                        )}
                      </CardContent>

                      <div style={{ marginTop: "auto" }}>
                        <CardActions>
                          <ActionButton
                            onClick={() => navigate(`/tables/${table._id}`)}
                            variant="secondary"
                            title="Ver detalhes da mesa"
                            leftIcon={<Eye size={16} />}
                          >
                            Detalhes
                          </ActionButton>
                          
                          {isAdmin ? (
                            <>
                              <ActionButton
                                onClick={() =>
                                  navigate(`/tables/${table._id}/edit`)
                                }
                                variant="secondary"
                                title="Editar mesa"
                                leftIcon={<Edit2 size={16} />}
                              >
                                Editar
                              </ActionButton>
                              <DeleteButton
                                onClick={() => handleDeleteClick(table._id)}
                                title="Excluir mesa"
                                leftIcon={<AlertTriangle size={16} />}
                              >
                                Excluir
                              </DeleteButton>
                            </>
                          ) : (
                            <ActionButton
                              onClick={() =>
                                navigate(
                                  `/reservations/new?tableId=${table._id}`
                                )
                              }
                              variant="primary"
                              title="Fazer reserva nesta mesa"
                              disabled={table.status !== "available"}
                              leftIcon={<Plus size={16} />}
                            >
                              Reservar
                            </ActionButton>
                          )}
                        </CardActions>
                      </div>
                    </TableCard>
                  );
                })}
              </TablesGrid>
            </>
          ) : (
            <EmptyState>
              <EmptyStateIcon>
                <Utensils size={64} />
              </EmptyStateIcon>
              <EmptyStateContent>
                <EmptyTitle>
                  {searchTerm
                    ? "Nenhuma mesa encontrada"
                    : isAdmin
                    ? "Nenhuma mesa ainda"
                    : "Nenhuma mesa disponível"}
                </EmptyTitle>
                <EmptyDescription>
                  {searchTerm
                    ? "Tente ajustar os filtros de busca"
                    : isAdmin
                    ? "Comece criando sua primeira mesa"
                    : "Tente novamente mais tarde ou entre em contato conosco"}
                </EmptyDescription>
                {!searchTerm && statusFilter === "all" && isAdmin && (
                  <Button
                    onClick={() => navigate("/tables/new")}
                    variant="primary"
                    leftIcon={<Plus size={18} />}
                  >
                    Nova Mesa
                  </Button>
                )}
              </EmptyStateContent>
            </EmptyState>
          )}
        </ContentSection>

        {isAdmin && (
          <ConfirmationModal
            isOpen={showDeleteModal}
            onClose={handleCancelDelete}
            onConfirm={handleConfirmDelete}
            type="danger"
            title="Excluir Mesa"
            message={
              tableToDelete?.hasReservations
                ? `Tem certeza que deseja excluir a mesa "${tableToDelete.name}"? Esta mesa possui reservas ativas que serão canceladas.`
                : `Tem certeza que deseja excluir a mesa "${tableToDelete?.name}"?`
            }
            confirmText="Sim, Excluir"
            cancelText="Cancelar"
            isLoading={isDeleting}
          />
        )}
      </LayoutContainer>
    </PageWrapper>
  );
}
