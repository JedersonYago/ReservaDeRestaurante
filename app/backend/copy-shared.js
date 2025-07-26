const fs = require("fs");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "shared", "dist");
const targetDir = path.join(__dirname, "dist", "shared");

// Criar diretório de destino se não existir
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Função para copiar recursivamente
function copyRecursive(src, dest) {
  const stats = fs.statSync(src);

  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const files = fs.readdirSync(src);
    files.forEach((file) => {
      copyRecursive(path.join(src, file), path.join(dest, file));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

try {
  if (fs.existsSync(sourceDir)) {
    copyRecursive(sourceDir, targetDir);
    console.log("✅ Arquivos do shared copiados com sucesso!");
  } else {
    console.log("⚠️  Diretório shared/dist não encontrado. Pulando cópia.");
  }
} catch (error) {
  console.error("❌ Erro ao copiar arquivos do shared:", error.message);
  process.exit(1);
}
