import React, { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  Clock,
  Users,
  Timer,
  Save,
  AlertCircle,
  Loader2,
  Info,
  Shield,
  RefreshCcw,
} from "lucide-react";
import { configApi } from "../../services/api";
import type { Config } from "../../types/config";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";

import { Container as LayoutContainer } from "../../components/Layout/Container";
import { useToast } from "../../components/Toast";
import { PageWrapper } from "../../components/Layout/PageWrapper";
import { FixedActionBar } from "../../components/Layout/FixedActionBar";
import {
  HeaderSection,
  HeaderContent,
  TitleSection,
  Title,
  Subtitle,
  Content,
  ConfigCard,
  ConfigSection,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  ToggleContainer,
  ToggleSwitch,
  ToggleLabel,
  ToggleSlider,
  FieldsContainer,
  FieldGroup,
  HelpText,
  LoadingContainer,
  LoadingSpinner,
  LoadingText,
  ErrorContainer,
  ErrorIcon,
  ErrorContent,
  ErrorTitle,
  ErrorDescription,
  MessageContainer,
  MessageIcon,
  MessageText,
} from "./styles";
import { useAdminConfigContext } from "../../components/AdminConfigProvider";

export function Settings() {
  const toast = useToast();
  const { config, isLoading: loading, error, refetch } = useAdminConfigContext();
  const [formConfig, setFormConfig] = useState<Config | null>(null);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalConfig, setOriginalConfig] = useState<Config | null>(null);

  // Sincronizar config do contexto com o estado local do formulário
  useEffect(() => {
    if (config) {
      setFormConfig(config);
      setOriginalConfig(config);
      setHasChanges(false);
    }
  }, [config]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormConfig((prev) => {
      if (!prev) return prev;
      const newConfig = {
        ...prev,
        [name]: newValue,
      };
      if (originalConfig) {
        setHasChanges(
          JSON.stringify(newConfig) !== JSON.stringify(originalConfig)
        );
      }
      return newConfig;
    });
  }

  function handleReset() {
    if (originalConfig) {
      setFormConfig(originalConfig);
      setHasChanges(false);
      toast.info("Configurações restauradas");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    // Não limpar erro global do contexto

    try {
      if (!formConfig) return;
      const payload = {
        maxReservationsPerUser: Number(formConfig.maxReservationsPerUser),
        reservationLimitHours: Number(formConfig.reservationLimitHours),
        minIntervalBetweenReservations: Number(
          formConfig.minIntervalBetweenReservations
        ),
        openingHour: formConfig.openingHour,
        closingHour: formConfig.closingHour,
        isReservationLimitEnabled: formConfig.isReservationLimitEnabled,
        isIntervalEnabled: formConfig.isIntervalEnabled,
        isOpeningHoursEnabled: formConfig.isOpeningHoursEnabled,
      };

      await configApi.updateConfig(payload);
      setOriginalConfig(formConfig);
      setHasChanges(false);
      toast.success("Configurações salvas com sucesso!");
      refetch();
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.error || "Erro ao salvar configurações";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  }

  if (loading || !formConfig) {
    return (
      <PageWrapper>
        <LayoutContainer>
          <LoadingContainer>
            <LoadingSpinner>
              <Loader2 size={40} />
            </LoadingSpinner>
            <LoadingText>Carregando configurações...</LoadingText>
          </LoadingContainer>
        </LayoutContainer>
      </PageWrapper>
    );
  }

  if (error && !formConfig) {
    return (
      <PageWrapper>
        <LayoutContainer>
          <ErrorContainer>
            <ErrorIcon>
              <AlertCircle size={64} />
            </ErrorIcon>
            <ErrorContent>
              <ErrorTitle>Erro ao carregar configurações</ErrorTitle>
              <ErrorDescription>
                Não foi possível carregar as configurações do sistema. Verifique
                sua conexão e tente novamente.
              </ErrorDescription>
              <Button
                variant="primary"
                onClick={refetch}
                leftIcon={<RefreshCcw size={18} />}
              >
                Tentar Novamente
              </Button>
            </ErrorContent>
          </ErrorContainer>
        </LayoutContainer>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <LayoutContainer>
        <HeaderSection>
          <HeaderContent>
            <TitleSection>
              <Title>
                <SettingsIcon size={32} />
                Configurações do Sistema
              </Title>
              <Subtitle>
                Configure os parâmetros operacionais do sistema de reservas
              </Subtitle>
            </TitleSection>
          </HeaderContent>
        </HeaderSection>

        <Content>
          <form id="settings-form" onSubmit={handleSubmit}>
            {/* Horários de Funcionamento */}
            <ConfigCard>
              <ConfigSection>
                <SectionHeader>
                  <SectionTitle>
                    <Clock size={20} />
                    Horários de Funcionamento
                  </SectionTitle>
                  <SectionDescription>
                    Configure os horários de abertura e fechamento do
                    restaurante
                  </SectionDescription>
                </SectionHeader>

                <ToggleContainer
                  onClick={() => {
                    const event = {
                      target: {
                        name: "isOpeningHoursEnabled",
                        type: "checkbox",
                        checked: !formConfig?.isOpeningHoursEnabled,
                        value: !formConfig?.isOpeningHoursEnabled,
                      },
                    } as any;
                    handleChange(event);
                  }}
                >
                  <ToggleSwitch>
                    <input
                      type="checkbox"
                      id="isOpeningHoursEnabled"
                      name="isOpeningHoursEnabled"
                      checked={formConfig?.isOpeningHoursEnabled}
                      onChange={handleChange}
                      style={{
                        position: "absolute",
                        opacity: 0,
                        pointerEvents: "none",
                      }}
                    />
                    <ToggleSlider checked={formConfig?.isOpeningHoursEnabled} />
                  </ToggleSwitch>
                  <ToggleLabel>
                    <Shield size={16} />
                    Ativar restrição de horários
                  </ToggleLabel>
                </ToggleContainer>

                {formConfig?.isOpeningHoursEnabled && (
                  <FieldsContainer>
                    <FieldGroup>
                      <Input
                        label="Horário de abertura"
                        type="time"
                        name="openingHour"
                        value={formConfig?.openingHour}
                        onChange={handleChange}
                        required
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <Input
                        label="Horário de fechamento"
                        type="time"
                        name="closingHour"
                        value={formConfig?.closingHour}
                        onChange={handleChange}
                        required
                      />
                    </FieldGroup>
                  </FieldsContainer>
                )}
              </ConfigSection>
            </ConfigCard>

            {/* Tempo de Confirmação */}
            <ConfigCard>
              <ConfigSection>
                <SectionHeader>
                  <SectionTitle>
                    <Timer size={20} />
                    Tempo de Confirmação
                  </SectionTitle>
                  <SectionDescription>
                    Defina o tempo para confirmação automática das reservas
                  </SectionDescription>
                </SectionHeader>

                <ToggleContainer
                  onClick={() => {
                    const event = {
                      target: {
                        name: "isIntervalEnabled",
                        type: "checkbox",
                        checked: !formConfig?.isIntervalEnabled,
                        value: !formConfig?.isIntervalEnabled,
                      },
                    } as any;
                    handleChange(event);
                  }}
                >
                  <ToggleSwitch>
                    <input
                      type="checkbox"
                      id="isIntervalEnabled"
                      name="isIntervalEnabled"
                      checked={formConfig?.isIntervalEnabled}
                      onChange={handleChange}
                      style={{
                        position: "absolute",
                        opacity: 0,
                        pointerEvents: "none",
                      }}
                    />
                    <ToggleSlider checked={formConfig?.isIntervalEnabled} />
                  </ToggleSwitch>
                  <ToggleLabel>
                    <Timer size={16} />
                    Ativar confirmação automática
                  </ToggleLabel>
                </ToggleContainer>

                {formConfig?.isIntervalEnabled && (
                  <FieldsContainer>
                    <FieldGroup style={{ gridColumn: "1 / -1" }}>
                      <Input
                        label="Tempo até confirmação automática (minutos)"
                        type="number"
                        name="minIntervalBetweenReservations"
                        min={1}
                        max={120}
                        value={formConfig?.minIntervalBetweenReservations}
                        onChange={handleChange}
                        required
                      />
                      <HelpText>
                        <Info size={14} />
                        Reservas ficam pendentes por este tempo, permitindo
                        cancelamento pelo cliente. Após o tempo definido, são
                        confirmadas automaticamente.
                      </HelpText>
                    </FieldGroup>
                  </FieldsContainer>
                )}
              </ConfigSection>
            </ConfigCard>

            {/* Limite de Reservas */}
            <ConfigCard>
              <ConfigSection>
                <SectionHeader>
                  <SectionTitle>
                    <Users size={20} />
                    Limite de Reservas por Usuário
                  </SectionTitle>
                  <SectionDescription>
                    Configure quantas reservas cada usuário pode fazer por
                    período
                  </SectionDescription>
                </SectionHeader>

                <ToggleContainer
                  onClick={() => {
                    const event = {
                      target: {
                        name: "isReservationLimitEnabled",
                        type: "checkbox",
                        checked: !formConfig?.isReservationLimitEnabled,
                        value: !formConfig?.isReservationLimitEnabled,
                      },
                    } as any;
                    handleChange(event);
                  }}
                >
                  <ToggleSwitch>
                    <input
                      type="checkbox"
                      id="isReservationLimitEnabled"
                      name="isReservationLimitEnabled"
                      checked={formConfig?.isReservationLimitEnabled}
                      onChange={handleChange}
                      style={{
                        position: "absolute",
                        opacity: 0,
                        pointerEvents: "none",
                      }}
                    />
                    <ToggleSlider
                      checked={formConfig?.isReservationLimitEnabled}
                    />
                  </ToggleSwitch>
                  <ToggleLabel>
                    <Users size={16} />
                    Ativar limite de reservas
                  </ToggleLabel>
                </ToggleContainer>

                {formConfig?.isReservationLimitEnabled && (
                  <FieldsContainer>
                    <FieldGroup>
                      <Input
                        label="Máximo de reservas por usuário"
                        type="number"
                        name="maxReservationsPerUser"
                        min={1}
                        max={20}
                        value={formConfig?.maxReservationsPerUser}
                        onChange={handleChange}
                        required
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <Input
                        label="Período de limitação (horas)"
                        type="number"
                        name="reservationLimitHours"
                        min={1}
                        max={168}
                        value={formConfig?.reservationLimitHours}
                        onChange={handleChange}
                        required
                      />
                    </FieldGroup>
                    <FieldGroup style={{ gridColumn: "1 / -1" }}>
                      <HelpText>
                        <Info size={14} />
                        Por exemplo: {formConfig?.maxReservationsPerUser}{" "}
                        reservas a cada {formConfig?.reservationLimitHours}{" "}
                        horas. O usuário só poderá fazer mais reservas após o
                        período definido.
                      </HelpText>
                    </FieldGroup>
                  </FieldsContainer>
                )}
              </ConfigSection>
            </ConfigCard>

            {typeof error === "string" && error && (
              <MessageContainer $variant="error">
                <MessageIcon $variant="error">
                  <AlertCircle size={20} />
                </MessageIcon>
                <MessageText>{error}</MessageText>
              </MessageContainer>
            )}
          </form>
        </Content>
      </LayoutContainer>

      <FixedActionBar>
        <Button
          type="submit"
          variant="primary"
          disabled={saving || !hasChanges}
          leftIcon={saving ? <Loader2 size={18} /> : <Save size={18} />}
          form="settings-form"
        >
          {saving ? "Salvando..." : "Salvar Configurações"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={saving || !hasChanges}
          leftIcon={<RefreshCcw size={18} />}
        >
          Restaurar
        </Button>
      </FixedActionBar>
    </PageWrapper>
  );
}
