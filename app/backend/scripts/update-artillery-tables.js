const { getAdminToken } = require("./get-admin-token");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const apiUrl = "http://localhost:3001/api/tables";

async function updateArtilleryWithExistingTables() {
  console.log("🔍 Buscando mesas existentes...");

  // 1. Obter token de admin
  const adminToken = await getAdminToken();
  if (!adminToken) {
    console.log("❌ Não foi possível obter o token de admin");
    return;
  }

  // 2. Buscar todas as mesas
  try {
    const response = await axios.get(apiUrl, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    const tables = response.data;
    console.log(`📋 Encontradas ${tables.length} mesas:`);

    const tableIds = tables.map((table) => table._id);
    tableIds.forEach((id, index) => {
      console.log(`  Mesa ${index + 1}: ${id}`);
    });

    // 3. Atualizar arquivo Artillery
    const artilleryPath = path.join(__dirname, "../artillery-reservas.yml");
    let artilleryContent = fs.readFileSync(artilleryPath, "utf8");

    // Atualizar as tabelas no arquivo
    const tablesString = JSON.stringify(tableIds);
    artilleryContent = artilleryContent.replace(
      /tables: \[.*?\]/,
      `tables: ${tablesString}`
    );

    fs.writeFileSync(artilleryPath, artilleryContent);
    console.log("\n✅ Arquivo artillery-reservas.yml atualizado!");

    console.log("\n🎉 Configuração concluída!");
    console.log("\n📋 Próximos passos:");
    console.log("   1. npm run test:smoke     (verificação rápida)");
    console.log("   2. npm run test:performance  (teste de carga)");
  } catch (error) {
    console.error("❌ Erro ao buscar mesas:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  updateArtilleryWithExistingTables();
}

module.exports = { updateArtilleryWithExistingTables };
