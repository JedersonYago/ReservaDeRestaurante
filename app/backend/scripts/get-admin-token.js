const axios = require("axios");

const apiUrl = "http://localhost:3001/api/auth/login";
const adminCredentials = {
  username: "admin", // ou o username do seu admin
  password: "@Admin123", // ou a senha do seu admin
};

async function getAdminToken() {
  try {
    console.log("🔐 Obtendo token de admin...");

    const response = await axios.post(apiUrl, adminCredentials);

    if (response.data.accessToken) {
      console.log("✅ Token de admin obtido com sucesso!");
      console.log("📋 Token:", response.data.accessToken);
      console.log("\n💡 Use este token no script create-test-tables.js");
      console.log("🔧 Substitua SEU_TOKEN_ADMIN_AQUI pelo token acima");

      return response.data.accessToken;
    } else {
      console.log("❌ Token não encontrado na resposta");
      return null;
    }
  } catch (error) {
    if (error.response?.status === 401) {
      console.log("❌ Credenciais de admin inválidas");
      console.log("💡 Verifique se você tem um usuário admin criado");
      console.log("📝 Para criar um admin, use:");
      console.log("   POST /api/auth/register");
      console.log(
        '   { "name": "Admin", "username": "admin", "email": "admin@test.com", "password": "Admin123!", "role": "admin", "adminCode": "admin123" }'
      );
    } else {
      console.error("❌ Erro ao obter token:", error.message);
    }
    return null;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  getAdminToken();
}

module.exports = { getAdminToken };
