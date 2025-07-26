const fs = require("fs");
const path = require("path");

function generatePerformanceReport(reportPath = "report.json") {
  try {
    const reportData = JSON.parse(fs.readFileSync(reportPath, "utf8"));

    console.log("📊 RELATÓRIO DE PERFORMANCE");
    console.log("=".repeat(50));

    // Métricas gerais
    const metrics = reportData.metrics;
    console.log("\n🎯 MÉTRICAS GERAIS:");
    console.log(`Total de requisições: ${metrics.http.requests}`);
    console.log(`Taxa de requisições: ${metrics.http.request_rate}/seg`);
    console.log(
      `Bytes baixados: ${(metrics.http.downloaded_bytes / 1024).toFixed(2)} KB`
    );

    // Códigos de status
    console.log("\n📈 CÓDIGOS DE STATUS:");
    Object.entries(metrics.http.codes).forEach(([code, count]) => {
      const percentage = ((count / metrics.http.requests) * 100).toFixed(1);
      console.log(`  ${code}: ${count} (${percentage}%)`);
    });

    // Tempo de resposta
    const responseTime = metrics.http.response_time;
    console.log("\n⏱️ TEMPO DE RESPOSTA (ms):");
    console.log(`  Mínimo: ${responseTime.min}`);
    console.log(`  Máximo: ${responseTime.max}`);
    console.log(`  Média: ${responseTime.mean.toFixed(2)}`);
    console.log(`  Mediana: ${responseTime.median.toFixed(2)}`);
    console.log(`  P95: ${responseTime.p95.toFixed(2)}`);
    console.log(`  P99: ${responseTime.p99.toFixed(2)}`);

    // Usuários virtuais
    console.log("\n👥 USUÁRIOS VIRTUAIS:");
    console.log(`  Criados: ${metrics.vusers.created}`);
    console.log(`  Completados: ${metrics.vusers.completed}`);
    console.log(`  Falharam: ${metrics.vusers.failed}`);
    console.log(
      `  Taxa de sucesso: ${(
        (metrics.vusers.completed / metrics.vusers.created) *
        100
      ).toFixed(1)}%`
    );

    // Erros
    if (metrics.errors && Object.keys(metrics.errors).length > 0) {
      console.log("\n❌ ERROS:");
      Object.entries(metrics.errors).forEach(([error, count]) => {
        console.log(`  ${error}: ${count}`);
      });
    }

    // Análise de performance
    console.log("\n🔍 ANÁLISE:");
    const successRate =
      (metrics.vusers.completed / metrics.vusers.created) * 100;
    const avgResponseTime = responseTime.mean;

    if (successRate >= 90) {
      console.log("✅ Taxa de sucesso EXCELENTE");
    } else if (successRate >= 80) {
      console.log("⚠️ Taxa de sucesso BOA");
    } else {
      console.log("❌ Taxa de sucesso BAIXA - precisa de otimização");
    }

    if (avgResponseTime < 1000) {
      console.log("✅ Tempo de resposta EXCELENTE");
    } else if (avgResponseTime < 3000) {
      console.log("⚠️ Tempo de resposta ACEITÁVEL");
    } else {
      console.log("❌ Tempo de resposta LENTO - precisa de otimização");
    }

    console.log("\n💡 RECOMENDAÇÕES:");
    if (metrics.http.codes["429"]) {
      console.log("- Considerar ajustar rate limits");
    }
    if (metrics.errors?.ETIMEDOUT) {
      console.log("- Verificar timeout do servidor");
    }
    if (successRate < 80) {
      console.log("- Investigar causas dos falhas");
    }
  } catch (error) {
    console.error("❌ Erro ao gerar relatório:", error.message);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const reportPath = process.argv[2] || "report.json";
  generatePerformanceReport(reportPath);
}

module.exports = { generatePerformanceReport };
