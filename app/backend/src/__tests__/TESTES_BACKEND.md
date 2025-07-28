# 🧪 Testes do Backend - ReservaFácil

## 📋 Visão Geral

Este projeto inclui uma suíte completa de testes para garantir a qualidade e confiabilidade do sistema de reservas, incluindo testes unitários, de integração e de performance otimizados para **MongoDB Free Tier**.

## 🎯 Tipos de Testes

### 1. **Testes Unitários** 🔧

Testes isolados para funções, classes e módulos específicos.

#### **Execução:**

```bash
# Todos os testes unitários
npm test

# Testes específicos por categoria
npm run test:models
npm run test:controllers
npm run test:unit

# Com watch mode
npm run test:watch

# Com cobertura
npm run test:coverage
```

#### **Cobertura de Código:**

- **Global:** 70% (branches, functions, lines, statements)
- **Controllers:** 80% (componentes críticos)
- **Models:** 75% (lógica de negócio)
- **Utils:** 80% (utilitários)

### 2. **Testes de Integração** 🔗

Testes que verificam a interação entre diferentes componentes.

#### **Execução:**

```bash
npm run test:integration
```

#### **Cenários Testados:**

- Fluxo completo de usuário (login → reserva → consulta)
- Fluxo administrativo (configurações → dashboard)
- Recuperação de senha
- Autenticação e autorização

### 3. **Testes de Performance** ⚡

Testes de carga e stress para verificar performance sob diferentes cenários.

## 📊 Estrutura de Testes

### **Controllers/** 🎮

- `authController.test.ts` - Autenticação e registro
- `authController.additional.test.ts` - Casos adicionais de auth
- `authPasswordRecovery.test.ts` - Recuperação de senha
- `reservationController.test.ts` - Gestão de reservas
- `reservationConfirm.test.ts` - Confirmação de reservas
- `reservationCancel.test.ts` - Cancelamento de reservas
- `reservationClear.test.ts` - Limpeza de reservas
- `reservationDelete.test.ts` - Exclusão de reservas
- `reservationDetails.test.ts` - Detalhes de reservas
- `tableController.test.ts` - Gestão de mesas
- `dashboardController.test.ts` - Dashboard principal
- `dashboardController.additional.test.ts` - Casos adicionais
- `profileController.test.ts` - Perfil do usuário
- `configController.test.ts` - Configurações do sistema

### **Models/** 📊

- `User.test.ts` - Modelo de usuário
- `Reservation.test.ts` - Modelo de reserva
- `Table.test.ts` - Modelo de mesa
- `PasswordReset.test.ts` - Modelo de reset de senha

### **Middlewares/** 🛡️

- `auth.test.ts` - Middleware de autenticação
- `auth.additional.test.ts` - Casos adicionais de auth
- `security.test.ts` - Middlewares de segurança
- `rateLimitMiddleware.test.ts` - Rate limiting

### **Services/** ⚙️

- `emailService.test.ts` - Serviço de email
- `schedulerService.test.ts` - Serviço de agendamento

### **Utils/** 🛠️

- `jwt.test.ts` - Utilitários JWT
- `reservationUtils.test.ts` - Utilitários de reserva
- `reservationUtils.additional.test.ts` - Casos adicionais
- `configUtils.test.ts` - Utilitários de configuração
- `dateUtils.test.ts` - Utilitários de data
- `logger.test.ts` - Sistema de logs

### **Validations/** ✅

- `schemas.test.ts` - Validação de schemas Zod

### **Config/** ⚙️

- `admin.test.ts` - Configurações administrativas
- `database.test.ts` - Configurações de banco
- `index.test.ts` - Configurações gerais
- `rateLimit.test.ts` - Configurações de rate limit
- `server.test.ts` - Configurações do servidor

### **Integration/** 🔗

- `adminFlow.e2e.test.ts` - Fluxo administrativo completo
- `passwordRecovery.e2e.test.ts` - Recuperação de senha
- `userFlow.e2e.test.ts` - Fluxo de usuário completo
- `login.integration.test.ts` - Integração de login

## 🚀 Testes de Performance

### 1. **Teste de Smoke** (Verificação Rápida)

```bash
npm run test:smoke
```

- **Duração:** 30 segundos
- **Carga:** 2 req/seg
- **Objetivo:** Verificar se o sistema está funcionando
- **Esperado:** Taxa de sucesso > 90%

### 2. **Teste de Performance** (Carga Realista)

```bash
npm run test:performance
```

- **Duração:** 2 minutos
- **Carga:** 2 → 5 → 8 req/seg
- **Objetivo:** Testar performance sob carga realista
- **Esperado:** Taxa de sucesso > 80%

### 3. **Teste de Stress** (Limites do Sistema)

```bash
npm run test:stress
```

- **Duração:** 2.5 minutos
- **Carga:** 1 → 3 → 5 → 1 req/seg
- **Objetivo:** Identificar limites do MongoDB Free
- **Esperado:** Degradação controlada

### **Variantes de Ambiente:**

```bash
# Desenvolvimento
npm run test:smoke:dev
npm run test:performance:dev
npm run test:stress:dev

# Com conexão ao banco de teste
npm run test:smoke:with-db
npm run test:performance:with-db
npm run test:stress:with-db
```

## 📊 Cenários de Teste de Performance

### **Fluxo de Reserva (60%)**

- Login do usuário
- Criação de reserva
- Validação de conflitos

### **Consulta de Reservas (25%)**

- Login do usuário
- Listagem de reservas

### **Consulta de Mesas (15%)**

- Login do usuário
- Listagem de mesas

## 🛠️ Scripts de Suporte

### **Setup de Usuários de Teste**

```bash
npm run setup:test-users
```

Cria 20 usuários de teste para os cenários.

### **Atualizar Mesas no Artillery**

```bash
npm run update-tables
```

Atualiza automaticamente os IDs das mesas nos testes.

### **Gerar Relatório**

```bash
npm run test:report
```

Gera relatório detalhado dos resultados.

### **Obter Token de Admin**

```bash
npm run get-admin-token
```

Obtém token para configurações administrativas.

## 📈 Métricas Analisadas

### **Performance**

- Tempo de resposta (min, max, média, p95, p99)
- Taxa de requisições por segundo
- Throughput total

### **Qualidade**

- Taxa de sucesso (% de requisições 200)
- Taxa de erro (% de falhas)
- Códigos de status HTTP

### **Limites**

- Rate limiting (erros 429)
- Timeouts (ETIMEDOUT)
- Conexões recusadas (ECONNREFUSED)

## 🎯 Limitações do MongoDB Free Tier

### **Esperado:**

- ✅ **2-5 req/seg:** Funciona perfeitamente
- ⚠️ **5-8 req/seg:** Degradação moderada
- ❌ **8+ req/seg:** Timeouts (limite do banco)

### **Para Produção:**

- MongoDB Atlas M10+ ($57/mês)
- PostgreSQL Supabase Pro ($25/mês)
- Neon PostgreSQL ($20/mês)

## 🚀 Como Executar

### **1. Preparação**

```bash
# Instalar dependências
npm install

# Criar usuários de teste (para performance)
npm run setup:test-users

# Atualizar mesas (se necessário)
npm run update-tables
```

### **2. Execução de Testes Unitários**

```bash
# Todos os testes
npm test

# Testes específicos
npm run test:models
npm run test:controllers
npm run test:integration
npm run test:unit

# Com watch mode
npm run test:watch

# Com cobertura
npm run test:coverage
```

### **3. Execução de Testes de Performance**

```bash
# Verificação rápida
npm run test:smoke

# Teste de performance
npm run test:performance

# Teste de stress
npm run test:stress
```

### **4. Análise**

```bash
# Gerar relatório de performance
npm run test:report
```

## 📝 Interpretação dos Resultados

### **✅ Bom Resultado:**

- Taxa de sucesso > 80%
- Tempo de resposta < 2 segundos
- Poucos erros 429 (rate limit)
- Cobertura de código > 70%

### **⚠️ Atenção:**

- Taxa de sucesso < 60%
- Tempo de resposta > 5 segundos
- Muitos timeouts
- Cobertura de código < 60%

### **❌ Problema:**

- Taxa de sucesso < 40%
- Servidor não responde
- Muitas conexões recusadas
- Cobertura de código < 50%

## 🔧 Configurações

### **Rate Limits (Desenvolvimento)**

- Auth: 2000 req/min
- API: 20000 req/5min
- Refresh: 200 req/30min

### **Cenários de Teste**

- Usuários: 20 (artillery-users.csv)
- Mesas: 1 (configurada automaticamente)
- Horários: 18:00, 19:00, 20:00, 21:00
- Datas: 2025-07-25, 2025-07-26, 2025-07-27

### **Configuração Jest**

- **Timeout:** 30 segundos por teste
- **Environment:** Node.js
- **Coverage:** HTML, LCOV, Text
- **Setup:** MongoDB Memory Server
- **Path Mapping:** @shared para módulos compartilhados

## 🧪 Estrutura de Testes

### **Arquivos de Configuração:**

- `setup.ts` - Configuração inicial dos testes
- `globalSetup.ts` - Setup global
- `globalTeardown.ts` - Limpeza global
- `helpers.ts` - Funções auxiliares
- `jest.d.ts` - Tipos Jest

### **Organização:**

```
__tests__/
├── artillery/          # Testes de performance
├── config/            # Testes de configuração
├── controllers/       # Testes de controladores
├── integration/       # Testes de integração
├── middlewares/       # Testes de middlewares
├── models/           # Testes de modelos
├── services/         # Testes de serviços
├── utils/            # Testes de utilitários
├── validations/      # Testes de validação
└── *.test.ts         # Testes gerais
```

## 📞 Suporte

Para dúvidas sobre os testes:

1. **Testes Unitários:** Verificar logs do Jest
2. **Testes de Performance:** Verificar se o backend está rodando
3. **Cobertura:** Verificar relatório HTML em `coverage/`
4. **Integração:** Confirmar se os usuários de teste existem
5. **Performance:** Verificar se as mesas estão configuradas
6. **Geral:** Analisar logs do servidor durante o teste

### **Comandos Úteis:**

```bash
# Verificar cobertura detalhada
npm run test:coverage

# Executar testes específicos
npm test -- --testNamePattern="auth"

# Executar testes com verbose
npm run test:verbose

# Limpar cache do Jest
npx jest --clearCache
```
