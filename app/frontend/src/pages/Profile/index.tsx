import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  profileService,
  type UpdateProfileData,
} from "../../services/profileService";
import { changePasswordSchema } from "../../schemas/auth";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Header } from "../../components/Header";

export function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    username: user?.username || "",
    currentPassword: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

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
      if (formData.username !== user.username)
        updateData.username = formData.username;
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

      const response = await profileService.updateProfile(
        user.username,
        updateData
      );

      // Atualizar dados do usuário no contexto
      const updatedUser = {
        ...user,
        name: updateData.name || user.name,
        email: updateData.email || user.email,
        username: updateData.username || user.username,
      };

      updateUser(updatedUser);

      // Mostrar informações sobre limites se disponível
      if (response.user) {
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
      }

      toast.success("Perfil atualizado com sucesso!");
      setFormData((prev) => ({ ...prev, currentPassword: "" }));
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao atualizar perfil");
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
      // Validação completa usando Yup
      await changePasswordSchema.validate(passwordData, { abortEarly: false });

      // Verificação adicional de senha atual não pode ser igual à nova
      if (passwordData.currentPassword === passwordData.newPassword) {
        toast.error("A nova senha deve ser diferente da senha atual");
        setPasswordLoading(false);
        return;
      }

      await profileService.changePassword(user.username, passwordData);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setIsChangingPassword(false);
      toast.success("Senha alterada com sucesso!");
    } catch (error: any) {
      if (error.name === "ValidationError") {
        // Erros de validação do Yup
        const firstError = error.errors[0];
        toast.error(firstError);
      } else {
        // Erros da API
        toast.error(error.response?.data?.message || "Erro ao alterar senha");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePasswordCancel = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setIsChangingPassword(false);
  };

  if (!user) {
    return (
      <>
        <Header />
        <Container>
          <ErrorMessage>Usuário não encontrado</ErrorMessage>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container>
        <ProfileCard>
          <ProfileHeader>
            <h1>Meu Perfil</h1>
            {!isEditing && !isChangingPassword && (
              <HeaderButtonGroup>
                <Button onClick={() => setIsEditing(true)}>
                  Editar Perfil
                </Button>
                <Button
                  $variant="secondary"
                  onClick={() => setIsChangingPassword(true)}
                >
                  Alterar Senha
                </Button>
              </HeaderButtonGroup>
            )}
          </ProfileHeader>

          {isChangingPassword ? (
            <form onSubmit={handlePasswordSubmit}>
              <FormGroup>
                <Input
                  label="Senha Atual"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInputChange}
                  required
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
                />
                {passwordData.newPassword && (
                  <PasswordStrength>
                    {(() => {
                      const { checks, score } = checkPasswordStrength(
                        passwordData.newPassword
                      );
                      const strengthLevel =
                        score === 5 ? "strong" : score >= 3 ? "medium" : "weak";

                      return (
                        <>
                          <StrengthBar level={strengthLevel}>
                            <StrengthFill level={strengthLevel} score={score} />
                          </StrengthBar>
                          <StrengthText level={strengthLevel}>
                            {score === 5
                              ? "🟢 Senha forte"
                              : score >= 3
                              ? "🟡 Senha média"
                              : "🔴 Senha fraca"}
                          </StrengthText>
                          <CheckList>
                            <CheckItem valid={checks.length}>
                              {checks.length ? "✅" : "❌"} Mínimo 8 caracteres
                            </CheckItem>
                            <CheckItem valid={checks.uppercase}>
                              {checks.uppercase ? "✅" : "❌"} Letra maiúscula
                            </CheckItem>
                            <CheckItem valid={checks.lowercase}>
                              {checks.lowercase ? "✅" : "❌"} Letra minúscula
                            </CheckItem>
                            <CheckItem valid={checks.number}>
                              {checks.number ? "✅" : "❌"} Número
                            </CheckItem>
                            <CheckItem valid={checks.special}>
                              {checks.special ? "✅" : "❌"} Caractere especial
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
                  name="confirmNewPassword"
                  type="password"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordInputChange}
                  required
                />
              </FormGroup>

              <ButtonGroup>
                <Button type="submit" disabled={passwordLoading}>
                  {passwordLoading ? "Alterando..." : "Alterar Senha"}
                </Button>
                <Button
                  type="button"
                  $variant="secondary"
                  onClick={handlePasswordCancel}
                >
                  Cancelar
                </Button>
              </ButtonGroup>
            </form>
          ) : isEditing ? (
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Input
                  label="Nome"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
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
                />
                <FieldNote>
                  {user.usernameChanges?.remaining === 0 ? (
                    <>
                      🚫 Nome de usuário bloqueado.
                      {user.usernameChanges?.blockedUntil &&
                        ` Disponível em ${new Date(
                          user.usernameChanges.blockedUntil
                        ).toLocaleDateString("pt-BR")}.`}
                    </>
                  ) : (
                    <>
                      ⚠️ Você pode alterar o nome de usuário{" "}
                      {user.usernameChanges?.remaining || 2} vez(es).
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
                />
                <FieldNote>
                  {user.emailChanges?.remaining === 0 ? (
                    <>
                      🚫 Email bloqueado.
                      {user.emailChanges?.blockedUntil &&
                        ` Disponível em ${new Date(
                          user.emailChanges.blockedUntil
                        ).toLocaleDateString("pt-BR")}.`}
                    </>
                  ) : (
                    <>
                      ⚠️ Você pode alterar o email{" "}
                      {user.emailChanges?.remaining || 2} vez(es).
                    </>
                  )}
                </FieldNote>
              </FormGroup>

              {(formData.email !== user.email ||
                formData.username !== user.username) && (
                <FormGroup>
                  <Input
                    label="Senha Atual"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    required
                    placeholder="Digite sua senha atual para confirmar as alterações"
                  />
                  <FieldNote>
                    🔒 Senha obrigatória para alterar email ou nome de usuário
                  </FieldNote>
                </FormGroup>
              )}

              <ButtonGroup>
                <Button type="submit" disabled={loading}>
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
                <Button
                  type="button"
                  $variant="secondary"
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
              </ButtonGroup>
            </form>
          ) : (
            <ProfileInfo>
              <InfoItem>
                <InfoLabel>Nome:</InfoLabel>
                <InfoValue>{user.name}</InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>Nome de usuário:</InfoLabel>
                <InfoValue>{user.username}</InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>Email:</InfoLabel>
                <InfoValue>{user.email}</InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>Tipo de conta:</InfoLabel>
                <InfoValue>
                  <RoleBadge role={user.role}>
                    {user.role === "admin" ? "Administrador" : "Cliente"}
                  </RoleBadge>
                </InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>Membro desde:</InfoLabel>
                <InfoValue>
                  {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                </InfoValue>
              </InfoItem>
            </ProfileInfo>
          )}
        </ProfileCard>
      </Container>
    </>
  );
}

const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 2rem;
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;

  h1 {
    color: #333;
    margin: 0;
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const InfoLabel = styled.span`
  font-weight: 500;
  color: #666;
  min-width: 140px;
`;

const InfoValue = styled.span`
  color: #333;
`;

const RoleBadge = styled.span<{ role: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${(props) => (props.role === "admin" ? "#e3f2fd" : "#f3e5f5")};
  color: ${(props) => (props.role === "admin" ? "#1565c0" : "#7b1fa2")};
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const HeaderButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #d32f2f;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FieldNote = styled.div`
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
  border-left: 3px solid #ff9800;
`;

const PasswordStrength = styled.div`
  margin-top: 0.5rem;
`;

const StrengthBar = styled.div<{ level: string }>`
  width: 100%;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const StrengthFill = styled.div<{ level: string; score: number }>`
  height: 100%;
  width: ${(props) => (props.score / 5) * 100}%;
  background: ${(props) =>
    props.level === "strong"
      ? "#4caf50"
      : props.level === "medium"
      ? "#ff9800"
      : "#f44336"};
  transition: all 0.3s ease;
`;

const StrengthText = styled.div<{ level: string }>`
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${(props) =>
    props.level === "strong"
      ? "#4caf50"
      : props.level === "medium"
      ? "#ff9800"
      : "#f44336"};
`;

const CheckList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const CheckItem = styled.div<{ valid: boolean }>`
  font-size: 0.75rem;
  color: ${(props) => (props.valid ? "#4caf50" : "#666")};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
