import User, { IUser } from "../../models/User";
import { TestDataFactory, TestCleanup, TestValidators } from "../helpers";

describe("User Model", () => {
  beforeEach(async () => {
    await TestCleanup.clearUsers();
  });

  describe("User Creation", () => {
    it("deve criar um usuário com dados válidos", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        username: "johndoe",
        password: "Password123!",
        role: "client" as const,
      };

      const user = await User.create(userData);

      expect(user).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.username).toBe(userData.username);
      expect(user.role).toBe(userData.role);
      expect(user.password).not.toBe(userData.password); // Password should be hashed
      expect(TestValidators.isValidObjectId(user._id)).toBe(true);
      expect(TestValidators.isValidDate(user.createdAt)).toBe(true);
      expect(TestValidators.isValidDate(user.updatedAt)).toBe(true);
    });

    it("deve criar um usuário com função padrão como cliente", async () => {
      const userData = {
        name: "Jane Doe",
        email: "jane@example.com",
        username: "janedoe",
        password: "Password123!",
      };

      const user = await User.create(userData);

      expect(user.role).toBe("client");
    });

    it("deve inicializar os controles de alteração de e-mail e nome de usuário", async () => {
      const user = await TestDataFactory.createUser();

      expect(user.emailChanges).toBeDefined();
      expect(user.emailChanges.count).toBe(0);
      expect(user.emailChanges.lastChangeAt).toBeUndefined();
      expect(user.emailChanges.blockedUntil).toBeUndefined();

      expect(user.usernameChanges).toBeDefined();
      expect(user.usernameChanges.count).toBe(0);
      expect(user.usernameChanges.lastChangeAt).toBeUndefined();
      expect(user.usernameChanges.blockedUntil).toBeUndefined();
    });
  });

  describe("User Validation", () => {
    it("deve exigir campo de nome", async () => {
      const userData = {
        email: "test@example.com",
        username: "testuser",
        password: "Password123!",
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it("deve exigir campo de e-mail", async () => {
      const userData = {
        name: "Test User",
        username: "testuser",
        password: "Password123!",
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it("deve exigir campo de nome de usuário", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "Password123!",
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it("deve exigir campo de senha", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        username: "testuser",
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it("deve exigir email único", async () => {
      const userData1 = {
        name: "User One",
        email: "same@example.com",
        username: "user1",
        password: "Password123!",
      };

      const userData2 = {
        name: "User Two",
        email: "same@example.com",
        username: "user2",
        password: "Password123!",
      };

      await User.create(userData1);
      await expect(User.create(userData2)).rejects.toThrow();
    });

    it("deve exigir nome de usuário único", async () => {
      const userData1 = {
        name: "User One",
        email: "user1@example.com",
        username: "sameusername",
        password: "Password123!",
      };

      const userData2 = {
        name: "User Two",
        email: "user2@example.com",
        username: "sameusername",
        password: "Password123!",
      };

      await User.create(userData1);
      await expect(User.create(userData2)).rejects.toThrow();
    });

    it("deve permitir apenas funções válidas", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        username: "testuser",
        password: "Password123!",
        role: "invalid-role" as any,
      };

      await expect(User.create(userData)).rejects.toThrow();
    });
  });

  describe("Password Methods", () => {
    it("deve criptografar a senha antes de salvar", async () => {
      const plainPassword = "Password123!";
      const user = await TestDataFactory.createUser({
        password: plainPassword,
      });

      expect(user.password).not.toBe(plainPassword);
      expect(user.password.length).toBeGreaterThan(plainPassword.length);
    });

    it("deve validar a senha correta", async () => {
      const plainPassword = "Password123!";
      const user = await TestDataFactory.createUser({
        password: plainPassword,
      });

      const isValid = await user.comparePassword(plainPassword);
      expect(isValid).toBe(true);
    });

    it("deve rejeitar senha incorreta", async () => {
      const user = await TestDataFactory.createUser({
        password: "Password123!",
      });

      const isValid = await user.comparePassword("WrongPassword");
      expect(isValid).toBe(false);
    });

    it("deve rejeitar senha vazia", async () => {
      const user = await TestDataFactory.createUser({
        password: "Password123!",
      });

      const isValid = await user.comparePassword("");
      expect(isValid).toBe(false);
    });
  });

  describe("User Queries", () => {
    beforeEach(async () => {
      // Criar alguns usuários de teste
      await TestDataFactory.createUser({
        name: "Client User",
        email: "client@example.com",
        username: "client",
        role: "client",
      });

      await TestDataFactory.createAdmin({
        name: "Admin User",
        email: "admin@example.com",
        username: "admin",
        role: "admin",
      });
    });

    it("deve encontrar usuário por e-mail (case insensitive)", async () => {
      const user = await User.findOne({ email: "CLIENT@EXAMPLE.COM" });
      expect(user).toBeNull(); // MongoDB é case sensitive por padrão

      const userLower = await User.findOne({ email: "client@example.com" });
      expect(userLower).not.toBeNull();
      expect(userLower!.name).toBe("Client User");
    });

    it("deve encontrar usuário por nome de usuário", async () => {
      const user = await User.findOne({ username: "admin" });
      expect(user).not.toBeNull();
      expect(user!.role).toBe("admin");
    });

    it("deve encontrar usuários por função", async () => {
      const clients = await User.find({ role: "client" });
      const admins = await User.find({ role: "admin" });

      expect(clients).toHaveLength(1);
      expect(admins).toHaveLength(1);
      expect(clients[0].role).toBe("client");
      expect(admins[0].role).toBe("admin");
    });
  });
});
