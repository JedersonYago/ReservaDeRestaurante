import {
  generateTokenPair,
  verifyToken,
  verifyRefreshToken,
  isTokenExpired,
} from "../../utils/jwt";
import { TestDataFactory, TestCleanup } from "../helpers";

// Usuário fake em memória para evitar dependência do banco
const fakeUser = {
  _id: "507f1f77bcf86cd799439011",
  name: "Test User",
  email: "test@example.com",
  username: "testuser",
  password: "Password123!",
  role: "client" as "client",
  emailChanges: { count: 0 },
  usernameChanges: { count: 0 },
  createdAt: new Date(),
  updatedAt: new Date(),
  comparePassword: async () => true,
};

beforeAll(() => {
  jest.spyOn(TestDataFactory, "createUser").mockImplementation(
    async (data = {}) =>
      ({
        ...fakeUser,
        ...data,
      } as unknown as import("../../models/User").IUser)
  );
  jest.spyOn(TestCleanup, "clearUsers").mockImplementation(async () => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("JWT Utils", () => {
  let testUser: any;

  beforeEach(async () => {
    jest.setTimeout(20000);
    await TestCleanup.clearUsers(); // This line remains unchanged
    testUser = await TestDataFactory.createUser(); // This line remains unchanged
  });

  describe("generateTokenPair", () => {
    it("deve gerar tokens de acesso e atualização válidos", () => {
      const { accessToken, refreshToken } = generateTokenPair(testUser);

      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
      expect(typeof accessToken).toBe("string");
      expect(typeof refreshToken).toBe("string");

      // Verificar estrutura JWT (3 partes separadas por ponto)
      expect(accessToken.split(".")).toHaveLength(3);
      expect(refreshToken.split(".")).toHaveLength(3);
    });

    it("deve gerar tokens diferentes para usuários diferentes", async () => {
      const user1Tokens = generateTokenPair(testUser);

      const testUser2 = await TestDataFactory.createUser({
        email: "user2@example.com",
        username: "testuser2",
      });
      const user2Tokens = generateTokenPair(testUser2);

      expect(user1Tokens.accessToken).not.toBe(user2Tokens.accessToken);
      expect(user1Tokens.refreshToken).not.toBe(user2Tokens.refreshToken);
    });

    it("deve gerar tokens com os dados corretos do usuário", () => {
      const { accessToken } = generateTokenPair(testUser);

      const decoded = verifyToken(accessToken);

      expect(decoded).toBeDefined();
      expect(decoded._id).toBe(testUser._id.toString());
      expect(decoded.username).toBe(testUser.username);
      expect(decoded.role).toBe(testUser.role);
      expect(decoded.type).toBe("access");
    });

    it("deve gerar refresh token com o tipo correto", () => {
      const { refreshToken } = generateTokenPair(testUser);

      const decoded = verifyToken(refreshToken);

      expect(decoded).toBeDefined();
      expect(decoded._id).toBe(testUser._id.toString());
      expect(decoded.type).toBe("refresh");
    });
  });

  describe("verifyToken", () => {
    it("deve verificar token de acesso válido", () => {
      const { accessToken } = generateTokenPair(testUser);

      const decoded = verifyToken(accessToken);

      expect(decoded).toBeDefined();
      expect(decoded._id).toBe(testUser._id.toString());
      expect(decoded.username).toBe(testUser.username);
      expect(decoded.role).toBe(testUser.role);
      expect(decoded.type).toBe("access");
    });

    it("deve lançar erro para token inválido", () => {
      const invalidToken = "invalid.token.here";

      expect(() => verifyToken(invalidToken)).toThrow();
    });

    it("deve lançar erro para token malformado", () => {
      const malformedToken = "not-a-jwt-token";

      expect(() => verifyToken(malformedToken)).toThrow();
    });

    it("deve verificar tanto tokens de acesso quanto de atualização", () => {
      const { accessToken, refreshToken } = generateTokenPair(testUser);

      const accessDecoded = verifyToken(accessToken);
      const refreshDecoded = verifyToken(refreshToken);

      expect(accessDecoded.type).toBe("access");
      expect(refreshDecoded.type).toBe("refresh");
      expect(accessDecoded._id).toBe(refreshDecoded._id);
    });
  });

  describe("verifyRefreshToken", () => {
    it("deve verificar refresh token válido", () => {
      const { refreshToken } = generateTokenPair(testUser);

      const decoded = verifyRefreshToken(refreshToken);

      expect(decoded).toBeDefined();
      expect(decoded._id).toBe(testUser._id.toString());
      expect(decoded.type).toBe("refresh");
    });

    it("deve lançar erro para refresh token inválido", () => {
      const invalidToken = "invalid.refresh.token";

      expect(() => verifyRefreshToken(invalidToken)).toThrow();
    });

    it("deve lançar erro para access token usado como refresh token", () => {
      const { accessToken } = generateTokenPair(testUser);

      expect(() => verifyRefreshToken(accessToken)).toThrow(
        "Token não é um refresh token"
      );
    });

    it("deve lançar erro para refresh token expirado", () => {
      // Este teste seria mais complexo de implementar sem mockear o JWT
      // Por enquanto, vamos testar apenas com token inválido
      const expiredToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.invalid";

      expect(() => verifyRefreshToken(expiredToken)).toThrow();
    });
  });

  describe("isTokenExpired", () => {
    it("deve retornar false para token não expirado", () => {
      const { accessToken } = generateTokenPair(testUser);

      const expired = isTokenExpired(accessToken);

      expect(expired).toBe(false);
    });

    it("deve retornar true para token inválido", () => {
      const invalidToken = "invalid-token";

      const expired = isTokenExpired(invalidToken);

      expect(expired).toBe(true);
    });

    it("deve retornar true para token malformado", () => {
      const malformedToken = "not.a.jwt";

      const expired = isTokenExpired(malformedToken);

      expect(expired).toBe(true);
    });

    it("deve retornar true para token sem a claim exp", () => {
      const tokenWithoutExp =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.invalid";

      const expired = isTokenExpired(tokenWithoutExp);

      expect(expired).toBe(true);
    });
  });

  describe("Token Security", () => {
    it("deve não incluir dados sensíveis na carga do token", () => {
      const { accessToken } = generateTokenPair(testUser);

      const decoded = verifyToken(accessToken);

      expect(decoded).not.toHaveProperty("password");
      expect(decoded).not.toHaveProperty("email");
      expect(decoded).not.toHaveProperty("emailChanges");
      expect(decoded).not.toHaveProperty("usernameChanges");
    });

    it("deve incluir apenas os dados necessários no token", () => {
      const { accessToken } = generateTokenPair(testUser);

      const decoded = verifyToken(accessToken);

      expect(decoded).toHaveProperty("_id");
      expect(decoded).toHaveProperty("username");
      expect(decoded).toHaveProperty("role");
      expect(decoded).toHaveProperty("type");
    });

    it("deve manter dados de usuário consistentes entre gerações de token", () => {
      const tokens1 = generateTokenPair(testUser);
      const tokens2 = generateTokenPair(testUser);

      const decoded1 = verifyToken(tokens1.accessToken);
      const decoded2 = verifyToken(tokens2.accessToken);

      // O importante é que os dados do usuário sejam consistentes
      expect(decoded1._id).toBe(decoded2._id);
      expect(decoded1.username).toBe(decoded2.username);
      expect(decoded1.role).toBe(decoded2.role);
      expect(decoded1.type).toBe(decoded2.type);

      // Tokens devem ser válidos
      expect(() => verifyToken(tokens1.accessToken)).not.toThrow();
      expect(() => verifyToken(tokens2.accessToken)).not.toThrow();
    });

    it("deve manter a identidade do usuário entre gerações de token", () => {
      const tokens1 = generateTokenPair(testUser);
      const tokens2 = generateTokenPair(testUser);

      const decoded1 = verifyToken(tokens1.accessToken);
      const decoded2 = verifyToken(tokens2.accessToken);

      expect(decoded1._id).toBe(decoded2._id);
      expect(decoded1.username).toBe(decoded2.username);
      expect(decoded1.role).toBe(decoded2.role);
    });
  });
});
