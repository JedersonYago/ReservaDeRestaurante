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

// Configuração padrão centralizada - valores sincronizados com shared/constants/time.ts
const defaultConfig: Config = {
  maxReservationsPerUser: 5,
  reservationLimitHours: 24,
  minIntervalBetweenReservations: 10, // Sincronizado com backend (corrigido de 30 para 10)
  openingHour: "11:00",
  closingHour: "23:00",
  isReservationLimitEnabled: true,
  isIntervalEnabled: true,
  isOpeningHoursEnabled: true,
};

export function Settings() {
  const toast = useToast();
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalConfig, setOriginalConfig] = useState<Config>(defaultConfig);

  useEffect(() => {
    configApi
      .getConfig()
      .then((data) => {
        setConfig(data as Config);
        setOriginalConfig(data as Config);
        setLoading(false);
      })
      .catch(() => {
        setError("Erro ao carregar configurações");
        setLoading(false);
      });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setConfig((prev) => {
      const newConfig = {
        ...prev,
        [name]: newValue,
      };

      // Verificar se há mudanças comparando com a configuração original
      setHasChanges(
        JSON.stringify(newConfig) !== JSON.stringify(originalConfig)
      );

      return newConfig;
    });
  }

  function handleReset() {
    setConfig(originalConfig);
    setHasChanges(false);
    toast.info("Configurações restauradas");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        maxReservationsPerUser: Number(config.maxReservationsPerUser),
        reservationLimitHours: Number(config.reservationLimitHours),
        minIntervalBetweenReservations: Number(
          config.minIntervalBetweenReservations
        ),
        openingHour: config.openingHour,
        closingHour: config.closingHour,
        isReservationLimitEnabled: config.isReservationLimitEnabled,
        isIntervalEnabled: config.isIntervalEnabled,
        isOpeningHoursEnabled: config.isOpeningHoursEnabled,
      };

      await configApi.updateConfig(payload);
      setOriginalConfig(config);
      setHasChanges(false);
      toast.success("Configurações salvas com sucesso!");
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.error || "Erro ao salvar configurações";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
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

  if (error && !config) {
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
                onClick={() => window.location.reload()}
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
                        checked: !config.isOpeningHoursEnabled,
                        value: !config.isOpeningHoursEnabled,
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
                      checked={config.isOpeningHoursEnabled}
                      onChange={handleChange}
                      style={{
                        position: "absolute",
                        opacity: 0,
                        pointerEvents: "none",
                      }}
                    />
                    <ToggleSlider checked={config.isOpeningHoursEnabled} />
                  </ToggleSwitch>
                  <ToggleLabel>
                    <Shield size={16} />
                    Ativar restrição de horários
                  </ToggleLabel>
                </ToggleContainer>

                {config.isOpeningHoursEnabled && (
                  <FieldsContainer>
                    <FieldGroup>
                      <Input
                        label="Horário de abertura"
                        type="time"
                        name="openingHour"
                        value={config.openingHour}
                        onChange={handleChange}
                        required
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <Input
                        label="Horário de fechamento"
                        type="time"
                        name="closingHour"
                        value={config.closingHour}
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
                        checked: !config.isIntervalEnabled,
                        value: !config.isIntervalEnabled,
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
                      checked={config.isIntervalEnabled}
                      onChange={handleChange}
                      style={{
                        position: "absolute",
                        opacity: 0,
                        pointerEvents: "none",
                      }}
                    />
                    <ToggleSlider checked={config.isIntervalEnabled} />
                  </ToggleSwitch>
                  <ToggleLabel>
                    <Timer size={16} />
                    Ativar confirmação automática
                  </ToggleLabel>
                </ToggleContainer>

                {config.isIntervalEnabled && (
                  <FieldsContainer>
                    <FieldGroup style={{ gridColumn: "1 / -1" }}>
                      <Input
                        label="Tempo até confirmação automática (minutos)"
                        type="number"
                        name="minIntervalBetweenReservations"
                        min={1}
                        max={120}
                        value={config.minIntervalBetweenReservations}
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
                        checked: !config.isReservationLimitEnabled,
                        value: !config.isReservationLimitEnabled,
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
                      checked={config.isReservationLimitEnabled}
                      onChange={handleChange}
                      style={{
                        position: "absolute",
                        opacity: 0,
                        pointerEvents: "none",
                      }}
                    />
                    <ToggleSlider checked={config.isReservationLimitEnabled} />
                  </ToggleSwitch>
                  <ToggleLabel>
                    <Users size={16} />
                    Ativar limite de reservas
                  </ToggleLabel>
                </ToggleContainer>

                {config.isReservationLimitEnabled && (
                  <FieldsContainer>
                    <FieldGroup>
                      <Input
                        label="Máximo de reservas por usuário"
                        type="number"
                        name="maxReservationsPerUser"
                        min={1}
                        max={20}
                        value={config.maxReservationsPerUser}
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
                        value={config.reservationLimitHours}
                        onChange={handleChange}
                        required
                      />
                    </FieldGroup>
                    <FieldGroup style={{ gridColumn: "1 / -1" }}>
                      <HelpText>
                        <Info size={14} />
                        Por exemplo: {config.maxReservationsPerUser} reservas a
                        cada {config.reservationLimitHours} horas. O usuário só
                        poderá fazer mais reservas após o período definido.
                      </HelpText>
                    </FieldGroup>
                  </FieldsContainer>
                )}
              </ConfigSection>
            </ConfigCard>

            {error && (
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
