import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Plus,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Search,
  Filter,
  FilterX,
  Utensils,
} from "lucide-react";
import { useTables } from "../../hooks/useTables";
import { Button } from "../../components/Button";
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
  ActionButton,
  EmptyState,
  EmptyStateIcon,
  EmptyStateContent,
  EmptyTitle,
  EmptyDescription,
  ResultsCounter,
  DeleteButtonContainer,
  DeleteButton,
} from "./styles";

const statusConfig: Record<
  string,
  {
    label: string;
    icon: React.ComponentType<{ size?: number }>;
    status: string;
  }
> = {
  available: {
    label: "Disponível",
    icon: CheckCircle,
    status: "available",
  },
  reserved: {
    label: "Reservada",
    icon: Clock,
    status: "reserved",
  },
  maintenance: {
    label: "Em Manutenção",
    icon: Settings,
    status: "maintenance",
  },
};

export function Tables() {
  const { tables, isLoading, deleteTable } = useTables();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<{
    id: string;
    name: string;
    hasReservations: boolean;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const hasActiveFilters = searchTerm !== "" || statusFilter !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  const filteredTables = useMemo(() => {
    if (!tables) return [];

    return tables.filter((table) => {
      const matchesSearch = table.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || table.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tables, searchTerm, statusFilter]);

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

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status] || statusConfig.available;
    const StatusIcon = config.icon;
    return <StatusIcon size={16} />;
  };

  const getStatusText = (status: string) => {
    const config = statusConfig[status] || statusConfig.available;
    return config.label;
  };

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
              <Subtitle>Gerencie todas as mesas do restaurante</Subtitle>
            </TitleSection>
            <HeaderActions>
              <Button
                variant="primary"
                onClick={() => navigate("/tables/new")}
                leftIcon={<Plus size={18} />}
              >
                Nova Mesa
              </Button>
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
              <label>
                <Search size={16} />
                Buscar mesas
              </label>
              <div className="input-wrapper">
                <Search size={18} />
                <Input
                  type="text"
                  placeholder="Nome da mesa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </SearchContainer>

            <FilterContainer>
              <label>
                <Filter size={16} />
                Status
              </label>
              <Select
                value={statusFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setStatusFilter(e.target.value)
                }
              >
                <option value="all">Todos os status</option>
                <option value="available">Disponível</option>
                <option value="reserved">Reservada</option>
                <option value="maintenance">Em Manutenção</option>
              </Select>
            </FilterContainer>

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
                          <StatusBadge status={table.status} size="md">
                            {getStatusIcon(table.status)}
                            {getStatusText(table.status)}
                          </StatusBadge>
                        </StatusBadgeContainer>
                      </CardHeader>

                      <CardContent>
                        <CapacityInfo>
                          <div>
                            <Users size={16} />
                            <span>Capacidade: {table.capacity} pessoas</span>
                          </div>
                        </CapacityInfo>

                        {hasActiveReservations && (
                          <WarningInfo>
                            <AlertTriangle size={16} />
                            <span>
                              {table.reservations?.length ?? 0} reserva(s)
                              ativa(s)
                            </span>
                          </WarningInfo>
                        )}
                      </CardContent>

                      <CardActions>
                        <ActionButton
                          onClick={() => navigate(`/tables/${table._id}`)}
                          $variant="secondary"
                          title="Ver detalhes da mesa"
                        >
                          <Eye size={16} />
                          <span>Detalhes</span>
                        </ActionButton>
                        <ActionButton
                          onClick={() => navigate(`/tables/${table._id}/edit`)}
                          $variant="secondary"
                          title="Editar mesa"
                        >
                          <Edit size={16} />
                          <span>Editar</span>
                        </ActionButton>
                      </CardActions>

                      <DeleteButtonContainer>
                        <DeleteButton
                          onClick={() => handleDeleteClick(table._id)}
                          title="Excluir mesa"
                        >
                          <Trash2 size={16} />
                          <span>Excluir</span>
                        </DeleteButton>
                      </DeleteButtonContainer>
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
                  {searchTerm || statusFilter !== "all"
                    ? "Nenhuma mesa encontrada"
                    : "Nenhuma mesa ainda"}
                </EmptyTitle>
                <EmptyDescription>
                  {searchTerm || statusFilter !== "all"
                    ? "Tente ajustar os filtros de busca"
                    : "Comece criando sua primeira mesa"}
                </EmptyDescription>
                {!searchTerm && statusFilter === "all" && (
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
      </LayoutContainer>
    </PageWrapper>
  );
}
