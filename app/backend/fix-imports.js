const fs = require("fs");
const path = require("path");

// Função para substituir imports em um arquivo
function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");

    // Substituir @shared/ por caminho relativo
    content = content.replace(
      /require\("@shared\/([^"]+)"\)/g,
      'require("../../../shared/$1")'
    );

    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Fixed imports in: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

// Função para processar todos os arquivos .js recursivamente
function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith(".js")) {
      fixImportsInFile(filePath);
    }
  });
}

// Processar o diretório dist
const distPath = path.join(__dirname, "dist");
if (fs.existsSync(distPath)) {
  console.log("🔧 Fixing imports in compiled files...");
  processDirectory(distPath);
  console.log("✅ All imports fixed!");
} else {
  console.log("❌ dist directory not found");
}
