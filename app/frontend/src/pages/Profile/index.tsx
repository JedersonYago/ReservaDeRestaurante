import React, { useState } from "react";
import {
  User,
  Edit,
  Key,
  Save,
  X,
  Check,
  Shield,
  ShieldAlert,
  ShieldX,
  AlertTriangle,
  Mail,
  Calendar,
  Crown,
  UserCircle,
  Trash2,
  Monitor,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import {
  profileService,
  type UpdateProfileData,
  type DeleteAccountData,
} from "../../services/profileService";
import { changePasswordSchema } from "../../schemas/auth";
import { useToast } from "../../components/Toast";
import { Button } from "../../components/Button";
import { BackButton } from "../../components/Button/BackButton";
import { SubmitButton } from "../../components/Button/SubmitButton";
import { DeleteButton } from "../../components/Button/DeleteButton";
import { Input } from "../../components/Input";
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
  Content,
  ProfileCard,
  ProfileSection,
  SectionTitle,
  SectionDescription,
  FormGrid,
  FormGroup,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  RoleBadge,
  FieldNote,
  PasswordStrength,
  StrengthBar,
  StrengthFill,
  StrengthText,
  CheckList,
  CheckItem,
  ActionButtons,
  NotFoundContainer,
  NotFoundIcon,
  NotFoundContent,
  NotFoundTitle,
  NotFoundDescription,
} from "./styles";

export function Profile() {
  const { user, updateUser, signOut, logoutAll, isLoading } = useAuth();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    username: user?.username || "",
    currentPassword: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showLogoutAllModal, setShowLogoutAllModal] = useState(false);

  // Função para verificar força da senha
  const checkPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.username) return;

    setLoading(true);
    try {
      const updateData: UpdateProfileData = {};
      const isChangingEmail = formData.email !== user.email;
      const isChangingUsername = formData.username !== user.username;
      const isChangingEmailOrUsername = isChangingEmail || isChangingUsername;

      // Verificar se campos estão bloqueados
      if (isChangingEmail && user.emailChanges?.remaining === 0) {
        toast.error("Email está bloqueado para alterações");
        setLoading(false);
        return;
      }

      if (isChangingUsername && user.usernameChanges?.remaining === 0) {
        toast.error("Nome de usuário está bloqueado para alterações");
        setLoading(false);
        return;
      }

      // Validação de senha para mudanças sensíveis
      if (isChangingEmailOrUsername && !formData.currentPassword) {
        toast.error(
          "Senha atual é obrigatória para alterar email ou nome de usuário"
        );
        setLoading(false);
        return;
      }

      if (formData.name !== user.name) updateData.name = formData.name;
      if (formData.email !== user.email) updateData.email = formData.email;
      if (formData.username !== user.username) {
        updateData.update = { newUsername: formData.username };
      }
      if (isChangingEmailOrUsername)
        updateData.currentPassword = formData.currentPassword;

      if (
        Object.keys(updateData).length === 0 ||
        (Object.keys(updateData).length === 1 && updateData.currentPassword)
      ) {
        toast.info("Nenhuma alteração foi feita");
        setIsEditing(false);
        return;
      }

      console.log("Dados para atualização:", {
        username: user.username,
        updateData: { ...updateData, currentPassword: "***" }
      });

      const response = await profileService.updateProfile(
        user.username,
        updateData
      );

      console.log("Resposta da API:", response);

      // Atualizar dados do usuário no contexto com os dados retornados pelo servidor
      if (response.user) {
        const updatedUser = {
          ...user,
          ...response.user,
          // Garantir que os campos básicos estão atualizados
          name: response.user.name || updateData.name || user.name,
          email: response.user.email || updateData.email || user.email,
          username:
            response.user.username || updateData.update?.newUsername || user.username,
        };

        updateUser(updatedUser);

        // Mostrar informações sobre limites se disponível
        const { emailChanges, usernameChanges } = response.user;
        if (emailChanges && emailChanges.remaining < 2) {
          toast.info(
            `Você ainda pode alterar o email ${emailChanges.remaining} vez(es)`
          );
        }
        if (usernameChanges && usernameChanges.remaining < 2) {
          toast.info(
            `Você ainda pode alterar o nome de usuário ${usernameChanges.remaining} vez(es)`
          );
        }
      } else {
        // Fallback se response.user não existir
        const updatedUser = {
          ...user,
          name: updateData.name || user.name,
          email: updateData.email || user.email,
          username: updateData.update?.newUsername || user.username,
        };
        updateUser(updatedUser);
      }

      toast.success("Perfil atualizado com sucesso!");
      setFormData((prev) => ({ ...prev, currentPassword: "" }));
      setIsEditing(false);
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);
      const errorMessage = error.response?.data?.message || "Erro ao atualizar perfil";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      username: user?.username || "",
      currentPassword: "",
    });
    setIsEditing(false);
  };

  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.username) return;

    setPasswordLoading(true);
    try {
      // Validação completa usando Zod
      const validatedData = changePasswordSchema.parse(passwordData);

      // Verificação adicional de senha atual não pode ser igual à nova
      if (passwordData.currentPassword === passwordData.newPassword) {
        toast.error("A nova senha deve ser diferente da senha atual");
        setPasswordLoading(false);
        return;
      }

      await profileService.changePassword(user.username, validatedData);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
      toast.success("Senha alterada com sucesso!");
    } catch (error: any) {
      if (error.name === "ZodError") {
        // Erros de validação do Zod
        const firstError = error.errors[0];
        toast.error(firstError.message);
      } else {
        // Erros da API
        const errorMessage =
          error.response?.data?.message || "Erro ao alterar senha";
        toast.error(errorMessage);
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePasswordCancel = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsChangingPassword(false);
  };

  const handleDeleteAccount = async () => {
    if (!user?.username || !deletePassword) return;

    setDeleteLoading(true);
    try {
      const data: DeleteAccountData = {
        currentPassword: deletePassword,
      };

      await profileService.deleteAccount(user.username, data);

      toast.success("Conta deletada com sucesso!");
      signOut(); // Fazer logout após deletar
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao deletar conta");
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setDeletePassword("");
    }
  };

  const handleDeleteCancel = () => {
    setDeletePassword("");
    setShowDeleteModal(false);
  };

  if (!user) {
    return (
      <PageWrapper>
        <LayoutContainer>
          <NotFoundContainer>
            <NotFoundIcon>
              <UserCircle size={64} />
            </NotFoundIcon>
            <NotFoundContent>
              <NotFoundTitle>Usuário não encontrado</NotFoundTitle>
              <NotFoundDescription>
                Não foi possível carregar as informações do seu perfil.
              </NotFoundDescription>
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
                <User size={32} />
                Meu Perfil
              </Title>
              <Subtitle>
                Gerencie suas informações pessoais e configurações de conta
              </Subtitle>
            </TitleSection>
            {!isEditing && !isChangingPassword && (
              <HeaderActions>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  leftIcon={<Edit size={18} />}
                >
                  Editar Perfil
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsChangingPassword(true)}
                  leftIcon={<Key size={18} />}
                >
                  Alterar Senha
                </Button>
              </HeaderActions>
            )}
          </HeaderContent>
        </Header>

        <Content>
          {isChangingPassword ? (
            <ProfileCard>
              <ProfileSection>
                <SectionTitle>
                  <Key size={20} />
                  Alterar Senha
                </SectionTitle>
                <SectionDescription>
                  Crie uma nova senha segura para sua conta
                </SectionDescription>

                <form onSubmit={handlePasswordSubmit}>
                  <FormGrid>
                    <FormGroup>
                      <Input
                        label="Senha Atual"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordInputChange}
                        required
                        autoComplete="current-password"
                        placeholder="Digite sua senha atual"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Input
                        label="Nova Senha"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordInputChange}
                        required
                        autoComplete="new-password"
                        placeholder="Digite sua nova senha"
                      />
                      {passwordData.newPassword && (
                        <PasswordStrength>
                          {(() => {
                            const { checks, score } = checkPasswordStrength(
                              passwordData.newPassword
                            );
                            const strengthLevel =
                              score === 5
                                ? "strong"
                                : score >= 3
                                ? "medium"
                                : "weak";

                            return (
                              <>
                                <StrengthBar level={strengthLevel}>
                                  <StrengthFill
                                    level={strengthLevel}
                                    score={score}
                                  />
                                </StrengthBar>
                                <StrengthText level={strengthLevel}>
                                  {score === 5 ? (
                                    <>
                                      <Shield size={16} /> Senha forte
                                    </>
                                  ) : score >= 3 ? (
                                    <>
                                      <ShieldAlert size={16} /> Senha média
                                    </>
                                  ) : (
                                    <>
                                      <ShieldX size={16} /> Senha fraca
                                    </>
                                  )}
                                </StrengthText>
                                <CheckList>
                                  <CheckItem valid={checks.length}>
                                    {checks.length ? (
                                      <Check size={12} />
                                    ) : (
                                      <X size={12} />
                                    )}{" "}
                                    Mínimo 8 caracteres
                                  </CheckItem>
                                  <CheckItem valid={checks.uppercase}>
                                    {checks.uppercase ? (
                                      <Check size={12} />
                                    ) : (
                                      <X size={12} />
                                    )}{" "}
                                    Letra maiúscula
                                  </CheckItem>
                                  <CheckItem valid={checks.lowercase}>
                                    {checks.lowercase ? (
                                      <Check size={12} />
                                    ) : (
                                      <X size={12} />
                                    )}{" "}
                                    Letra minúscula
                                  </CheckItem>
                                  <CheckItem valid={checks.number}>
                                    {checks.number ? (
                                      <Check size={12} />
                                    ) : (
                                      <X size={12} />
                                    )}{" "}
                                    Número
                                  </CheckItem>
                                  <CheckItem valid={checks.special}>
                                    {checks.special ? (
                                      <Check size={12} />
                                    ) : (
                                      <X size={12} />
                                    )}{" "}
                                    Caractere especial
                                  </CheckItem>
                                </CheckList>
                              </>
                            );
                          })()}
                        </PasswordStrength>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <Input
                        label="Confirmar Nova Senha"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordInputChange}
                        required
                        autoComplete="new-password"
                        placeholder="Confirme sua nova senha"
                      />
                    </FormGroup>
                  </FormGrid>

                  <ActionButtons>
                    <SubmitButton
                      disabled={
                        passwordLoading ||
                        !passwordData.currentPassword.trim() ||
                        !passwordData.newPassword.trim() ||
                        !passwordData.confirmPassword.trim() ||
                        passwordData.newPassword !==
                          passwordData.confirmPassword ||
                        passwordData.newPassword.length < 8
                      }
                      loading={passwordLoading}
                      leftIcon={<Save size={18} />}
                    >
                      Alterar Senha
                    </SubmitButton>
                    <BackButton
                      type="button"
                      onClick={handlePasswordCancel}
                      disabled={passwordLoading}
                      leftIcon={<ArrowLeft size={18} />}
                    >
                      Voltar
                    </BackButton>
                  </ActionButtons>
                </form>
              </ProfileSection>
            </ProfileCard>
          ) : isEditing ? (
            <ProfileCard>
              <ProfileSection>
                <SectionTitle>
                  <Edit size={20} />
                  Editar Perfil
                </SectionTitle>
                <SectionDescription>
                  Atualize suas informações pessoais
                </SectionDescription>

                <form onSubmit={handleSubmit}>
                  <FormGrid>
                    <FormGroup>
                      <Input
                        label="Nome"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        autoComplete="name"
                        placeholder="Seu nome completo"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Input
                        label="Nome de Usuário"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        disabled={user.usernameChanges?.remaining === 0}
                        autoComplete="username"
                        placeholder="Seu nome de usuário"
                      />
                      <FieldNote>
                        {user.usernameChanges?.remaining === 0 ? (
                          <>
                            <X size={16} /> Nome de usuário bloqueado.
                            {user.usernameChanges?.blockedUntil &&
                              ` Disponível em ${new Date(
                                user.usernameChanges.blockedUntil
                              ).toLocaleDateString("pt-BR")}.`}
                          </>
                        ) : (
                          <>
                            <AlertTriangle size={16} /> Você pode alterar o nome
                            de usuário {user.usernameChanges?.remaining ?? 2}{" "}
                            vez(es).
                          </>
                        )}
                      </FieldNote>
                    </FormGroup>

                    <FormGroup>
                      <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={user.emailChanges?.remaining === 0}
                        autoComplete="email"
                        placeholder="seu@email.com"
                      />
                      <FieldNote>
                        {user.emailChanges?.remaining === 0 ? (
                          <>
                            <X size={16} /> Email bloqueado.
                            {user.emailChanges?.blockedUntil &&
                              ` Disponível em ${new Date(
                                user.emailChanges.blockedUntil
                              ).toLocaleDateString("pt-BR")}.`}
                          </>
                        ) : (
                          <>
                            <AlertTriangle size={16} /> Você pode alterar o
                            email {user.emailChanges?.remaining ?? 2} vez(es).
                          </>
                        )}
                      </FieldNote>
                    </FormGroup>

                    {(formData.email !== user.email ||
                      formData.username !== user.username) && (
                      <FormGroup style={{ gridColumn: "1 / -1" }}>
                        <Input
                          label="Senha Atual"
                          name="currentPassword"
                          type="password"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          required
                          autoComplete="current-password"
                          placeholder="Digite sua senha atual para confirmar as alterações"
                        />
                        <FieldNote>
                          <Key size={16} /> Senha obrigatória para alterar email
                          ou nome de usuário
                        </FieldNote>
                      </FormGroup>
                    )}
                  </FormGrid>

                  <ActionButtons>
                    <SubmitButton
                      disabled={
                        loading ||
                        !formData.name.trim() ||
                        !formData.email.trim() ||
                        !formData.username.trim() ||
                        (formData.name === user?.name &&
                          formData.email === user?.email &&
                          formData.username === user?.username) ||
                        ((formData.email !== user?.email ||
                          formData.username !== user?.username) &&
                          !formData.currentPassword.trim())
                      }
                      loading={loading}
                      leftIcon={<Save size={18} />}
                    >
                      Salvar Alterações
                    </SubmitButton>
                    <BackButton
                      type="button"
                      onClick={handleCancel}
                      disabled={loading}
                      leftIcon={<ArrowLeft size={18} />}
                    >
                      Voltar
                    </BackButton>
                  </ActionButtons>
                </form>
              </ProfileSection>
            </ProfileCard>
          ) : (
            <>
              <ProfileCard>
                <ProfileSection>
                  <SectionTitle>
                    <UserCircle size={20} />
                    Informações do Perfil
                  </SectionTitle>
                  <SectionDescription>
                    Suas informações pessoais e configurações de conta
                  </SectionDescription>

                  <InfoGrid>
                    <InfoItem>
                      <InfoLabel>
                        <User size={16} />
                        Nome
                      </InfoLabel>
                      <InfoValue>{user.name}</InfoValue>
                    </InfoItem>

                    <InfoItem>
                      <InfoLabel>
                        <UserCircle size={16} />
                        Nome de usuário
                      </InfoLabel>
                      <InfoValue>@{user.username}</InfoValue>
                    </InfoItem>

                    <InfoItem>
                      <InfoLabel>
                        <Mail size={16} />
                        Email
                      </InfoLabel>
                      <InfoValue>{user.email}</InfoValue>
                    </InfoItem>

                    <InfoItem>
                      <InfoLabel>
                        <Crown size={16} />
                        Tipo de conta
                      </InfoLabel>
                      <InfoValue>
                        <RoleBadge $role={user.role}>
                          {user.role === "admin" ? "Administrador" : "Cliente"}
                        </RoleBadge>
                      </InfoValue>
                    </InfoItem>

                    <InfoItem style={{ gridColumn: "1 / -1" }}>
                      <InfoLabel>
                        <Calendar size={16} />
                        Membro desde
                      </InfoLabel>
                      <InfoValue>
                        {new Date(user.createdAt).toLocaleDateString("pt-BR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </InfoValue>
                    </InfoItem>
                  </InfoGrid>
                </ProfileSection>
              </ProfileCard>

              {/* Box de Segurança da Conta */}
              <ProfileCard>
                <ProfileSection>
                  <SectionTitle>
                    <Shield size={20} />
                    Segurança da Conta
                  </SectionTitle>
                  <SectionDescription>
                    Encerre todas as sessões abertas em outros dispositivos.
                    Útil caso você tenha perdido acesso a algum dispositivo ou
                    queira garantir sua segurança.
                  </SectionDescription>
                  <Button
                    variant="danger"
                    leftIcon={<Monitor size={18} />}
                    onClick={() => setShowLogoutAllModal(true)}
                    loading={isLoading}
                    style={{ marginTop: 16, maxWidth: 320 }}
                  >
                    Sair de todos os dispositivos
                  </Button>
                </ProfileSection>
              </ProfileCard>
            </>
          )}

          {/* Seção de Deletar Conta (apenas para não-admin) */}
          {!isEditing && !isChangingPassword && user.role !== "admin" && (
            <ProfileCard>
              <ProfileSection>
                <SectionTitle style={{ color: "#dc3545" }}>
                  <Trash2 size={20} />
                  Deletar Conta
                </SectionTitle>
                <SectionDescription>
                  Esta ação é irreversível. Todas as suas reservas serão
                  canceladas e seus dados serão permanentemente excluídos.
                </SectionDescription>

                <ActionButtons>
                  <DeleteButton
                    onClick={() => setShowDeleteModal(true)}
                    style={{
                      backgroundColor: "transparent",
                      color: "#dc3545",
                      border: "1px solid #dc3545",
                    }}
                  >
                    Excluir Conta
                  </DeleteButton>
                </ActionButtons>
              </ProfileSection>
            </ProfileCard>
          )}
        </Content>

        {/* Modal de Confirmação para Deletar Conta */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteAccount}
          type="danger"
          title="Excluir Conta Permanentemente"
          message={
            <div>
              <p style={{ margin: "0 0 16px 0" }}>
                Esta ação não pode ser desfeita. Todas as suas reservas serão
                canceladas e seus dados serão permanentemente excluídos.
              </p>
              <Input
                label="Digite sua senha para confirmar"
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Sua senha atual"
                required
              />
            </div>
          }
          confirmText="Sim, Excluir Conta"
          cancelText="Cancelar"
          isLoading={deleteLoading}
        />

        <ConfirmationModal
          isOpen={showLogoutAllModal}
          onClose={() => setShowLogoutAllModal(false)}
          onConfirm={() => {
            setShowLogoutAllModal(false);
            logoutAll();
          }}
          title="Sair de todos os dispositivos?"
          message="Isso irá encerrar sua sessão em todos os dispositivos conectados. Você precisará fazer login novamente em todos eles. Deseja continuar?"
          type="danger"
          confirmText="Sair de todos"
          cancelText="Cancelar"
          isLoading={isLoading}
        />
      </LayoutContainer>
    </PageWrapper>
  );
}
