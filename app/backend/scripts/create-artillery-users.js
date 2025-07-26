const fs = require("fs");
const path = require("path");
const axios = require("axios");
const csv = require("csv-parse/sync");

const csvPath = path.join(
  __dirname,
  "../src/__tests__/artillery/artillery-users.csv"
);
const apiUrl = "http://localhost:3001/api/auth/register";
const senha = "Senha123!";

async function main() {
  console.log("Iniciando criação de usuários para testes...");
  console.log("Caminho do CSV:", csvPath);

  try {
    const csvContent = fs.readFileSync(csvPath, "utf-8");
    console.log("Arquivo CSV lido com sucesso");

    const records = csv.parse(csvContent, { columns: true });
    console.log(`Encontrados ${records.length} usuários para criar`);

    for (const user of records) {
      try {
        console.log(`Tentando criar usuário: ${user.username}`);
        const res = await axios.post(apiUrl, {
          name: user.username,
          email: user.email,
          username: user.username,
          password: senha,
          confirmPassword: senha,
        });
        console.log(`✅ Usuário ${user.username} criado:`, res.status);
      } catch (err) {
        if (err.response && err.response.status === 400) {
          console.log(`ℹ️ Usuário ${user.username} já existe.`);
        } else {
          console.error(`❌ Erro ao criar ${user.username}:`, err.message);
        }
      }
    }

    console.log("Processo finalizado!");
  } catch (error) {
    console.error("Erro ao ler arquivo CSV:", error.message);
  }
}

main();
