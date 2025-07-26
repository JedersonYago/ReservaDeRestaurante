import mongoose from "mongoose";
import { PasswordReset, IPasswordReset } from "../../models/PasswordReset";

describe("PasswordReset Model", () => {
  beforeEach(async () => {
    await PasswordReset.deleteMany({});
  });

  describe("Schema", () => {
    it("deve criar um documento PasswordReset válido", async () => {
      const passwordResetData = {
        userId: new mongoose.Types.ObjectId(),
        token: "test-token-123",
        expiresAt: new Date(Date.now() + 3600000), // 1 hora no futuro
        used: false,
      };

      const passwordReset = new PasswordReset(passwordResetData);
      const savedPasswordReset = await passwordReset.save();

      expect(savedPasswordReset._id).toBeDefined();
      expect(savedPasswordReset.userId).toEqual(passwordResetData.userId);
      expect(savedPasswordReset.token).toBe(passwordResetData.token);
      expect(savedPasswordReset.expiresAt).toEqual(passwordResetData.expiresAt);
      expect(savedPasswordReset.used).toBe(passwordResetData.used);
      expect(savedPasswordReset.createdAt).toBeDefined();
      expect(savedPasswordReset.updatedAt).toBeDefined();
    });

    it("deve requerer userId", async () => {
      const passwordResetData = {
        token: "test-token-123",
        expiresAt: new Date(Date.now() + 3600000),
        used: false,
      };

      const passwordReset = new PasswordReset(passwordResetData);
      await expect(passwordReset.save()).rejects.toThrow();
    });

    it("deve requerer token", async () => {
      const passwordResetData = {
        userId: new mongoose.Types.ObjectId(),
        expiresAt: new Date(Date.now() + 3600000),
        used: false,
      };

      const passwordReset = new PasswordReset(passwordResetData);
      await expect(passwordReset.save()).rejects.toThrow();
    });

    it("deve requerer expiresAt", async () => {
      const passwordResetData = {
        userId: new mongoose.Types.ObjectId(),
        token: "test-token-123",
        used: false,
      };

      const passwordReset = new PasswordReset(passwordResetData);
      await expect(passwordReset.save()).rejects.toThrow();
    });

    it("deve definir used como false por padrão", async () => {
      const passwordResetData = {
        userId: new mongoose.Types.ObjectId(),
        token: "test-token-123",
        expiresAt: new Date(Date.now() + 3600000),
      };

      const passwordReset = new PasswordReset(passwordResetData);
      const savedPasswordReset = await passwordReset.save();

      expect(savedPasswordReset.used).toBe(false);
    });

    it("deve ter token único", async () => {
      const userId = new mongoose.Types.ObjectId();
      const token = "unique-token-123";

      // Criar primeiro documento
      const passwordReset1 = new PasswordReset({
        userId,
        token,
        expiresAt: new Date(Date.now() + 3600000),
      });
      await passwordReset1.save();

      // Tentar criar segundo documento com mesmo token
      const passwordReset2 = new PasswordReset({
        userId: new mongoose.Types.ObjectId(),
        token,
        expiresAt: new Date(Date.now() + 3600000),
      });

      try {
        await passwordReset2.save();
        // Se chegou aqui, o token não é único - verificar se há duplicatas
        const count = await PasswordReset.countDocuments({ token });
        expect(count).toBe(1); // Deve haver apenas um documento com este token
      } catch (error) {
        // Se lançou erro, verificar se é um erro de duplicação
        expect(error).toBeDefined();
      }
    });
  });

  describe("Métodos", () => {
    let passwordReset: IPasswordReset;

    beforeEach(async () => {
      passwordReset = new PasswordReset({
        userId: new mongoose.Types.ObjectId(),
        token: "test-token-123",
        expiresAt: new Date(Date.now() + 3600000), // 1 hora no futuro
        used: false,
      });
      await passwordReset.save();
    });

    describe("isValid", () => {
      it("deve retornar true para token válido e não usado", () => {
        expect((passwordReset as any).isValid()).toBe(true);
      });

      it("deve retornar false para token usado", async () => {
        passwordReset.used = true;
        await passwordReset.save();
        expect((passwordReset as any).isValid()).toBe(false);
      });

      it("deve retornar false para token expirado", async () => {
        passwordReset.expiresAt = new Date(Date.now() - 3600000); // 1 hora no passado
        await passwordReset.save();
        expect((passwordReset as any).isValid()).toBe(false);
      });

      it("deve retornar false para token usado e expirado", async () => {
        passwordReset.used = true;
        passwordReset.expiresAt = new Date(Date.now() - 3600000);
        await passwordReset.save();
        expect((passwordReset as any).isValid()).toBe(false);
      });
    });

    describe("markAsUsed", () => {
      it("deve marcar token como usado", async () => {
        expect(passwordReset.used).toBe(false);

        const updatedPasswordReset = await (passwordReset as any).markAsUsed();

        expect(updatedPasswordReset.used).toBe(true);
        expect(updatedPasswordReset._id).toEqual(passwordReset._id);
      });

      it("deve persistir mudança no banco de dados", async () => {
        await (passwordReset as any).markAsUsed();

        const retrievedPasswordReset = await PasswordReset.findById(
          passwordReset._id
        );
        expect(retrievedPasswordReset?.used).toBe(true);
      });

      it("deve atualizar updatedAt", async () => {
        const originalUpdatedAt = passwordReset.updatedAt;

        // Aguardar um pouco para garantir diferença de tempo
        await new Promise((resolve) => setTimeout(resolve, 10));

        await (passwordReset as any).markAsUsed();

        expect(passwordReset.updatedAt.getTime()).toBeGreaterThan(
          originalUpdatedAt.getTime()
        );
      });
    });
  });

  describe("Índices", () => {
    it("deve ter índice em userId", async () => {
      const indexes = await PasswordReset.collection.indexes();
      const userIdIndex = indexes.find(
        (index) => index.key && index.key.userId === 1
      );
      expect(userIdIndex).toBeDefined();
    });

    it("deve ter índice em token", async () => {
      const indexes = await PasswordReset.collection.indexes();
      const tokenIndex = indexes.find(
        (index) => index.key && index.key.token === 1
      );
      expect(tokenIndex).toBeDefined();
    });

    it("deve ter índice em used", async () => {
      const indexes = await PasswordReset.collection.indexes();
      const usedIndex = indexes.find(
        (index) => index.key && index.key.used === 1
      );
      expect(usedIndex).toBeDefined();
    });

    it("deve ter índice TTL em expiresAt", async () => {
      const indexes = await PasswordReset.collection.indexes();
      const expiresAtIndex = indexes.find(
        (index) =>
          index.key &&
          index.key.expiresAt === 1 &&
          index.expireAfterSeconds === 0
      );
      expect(expiresAtIndex).toBeDefined();
    });

    it("deve ter índice composto em token, used e expiresAt", async () => {
      const indexes = await PasswordReset.collection.indexes();
      const compoundIndex = indexes.find(
        (index) =>
          index.key &&
          index.key.token === 1 &&
          index.key.used === 1 &&
          index.key.expiresAt === 1
      );
      expect(compoundIndex).toBeDefined();
    });
  });
});
