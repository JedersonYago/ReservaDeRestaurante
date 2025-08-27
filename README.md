# 🍽️ ReservaFácil - Sistema de Reservas de Restaurante

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18%2B-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-6%2B-purple.svg)](https://vitejs.dev/)
[![Turbo](https://img.shields.io/badge/Turbo-2%2B-orange.svg)](https://turbo.build/)

**ReservaFácil** é um sistema completo de gerenciamento de reservas para restaurantes, desenvolvido com tecnologias modernas e focado na experiência do usuário. O sistema permite que clientes façam reservas online facilmente e que administradores gerenciem mesas, horários e configurações de forma eficiente.

## 🌐 Demo Online

(em breve)

## 📸 Demonstração

O sistema oferece uma interface intuitiva e responsiva:

- **Dashboard do Cliente**: Visualização de reservas, estatísticas pessoais
- **Dashboard do Administrador**: Estatísticas completas, gerenciamento de mesas e reservas
- **Sistema de Autenticação**: Login seguro com JWT e refresh tokens
- **Gestão de Mesas**: Criação, edição e configuração de disponibilidade
- **Sistema de Reservas**: Processo simplificado de agendamento

## 🚀 Funcionalidades Principais

### 👤 Para Clientes

- ✅ **Registro e Login** com validação segura
- ✅ **Criação de Reservas** com seleção de mesa, data e horário
- ✅ **Gestão de Reservas** - visualizar, cancelar ou limpar histórico
- ✅ **Dashboard Personalizado** com estatísticas pessoais
- ✅ **Perfil do Usuário** com alteração de dados e senha
- ✅ **Recuperação de Senha** via email
- ✅ **Interface Responsiva** adaptada para todos os dispositivos

### 👨‍💼 Para Administradores

- ✅ **Dashboard Administrativo** com métricas completas
- ✅ **Gerenciamento de Mesas** - criar, editar, definir capacidade e disponibilidade
- ✅ **Controle de Reservas** - confirmar, cancelar, reagendar
- ✅ **Sistema de Configurações** - horários de funcionamento, limites de reservas
- ✅ **Remanejamento Automático** de reservas quando mesa entra em manutenção
- ✅ **Relatórios e Estatísticas** - ocupação, horários populares, clientes únicos
- ✅ **Limpeza Automática** de dados expirados

### 🛡️ Segurança e Performance

- ✅ **Autenticação JWT** com access e refresh tokens
- ✅ **Rate Limiting** para proteção contra ataques
- ✅ **Helmet** para cabeçalhos de segurança
- ✅ **Compressão** de dados para melhor performance
- ✅ **Sanitização** de dados de entrada
- ✅ **Cache Control** para recursos estáticos

### 🧪 Testes e Qualidade

- ✅ **Testes Unitários** com Jest (70%+ cobertura)
- ✅ **Testes de Integração** para fluxos completos
- ✅ **Testes de Performance** com Artillery
- ✅ **Testes de Stress** para validação de limites
- ✅ **Vitest** configurado para testes frontend
- ✅ **MSW** para mock de APIs

## 🏗️ Arquitetura Técnica

### Estrutura do Monorepo

```
ReservaFácil/
├── 📁 app/                    # Aplicação principal
│   ├── 📁 backend/            # API Node.js + TypeScript
│   │   ├── 📁 src/
│   │   │   ├── 📁 config/     # Configurações do sistema
│   │   │   ├── 📁 controllers/# Controladores da API
│   │   │   ├── 📁 middlewares/# Middlewares de segurança e validação
│   │   │   ├── 📁 models/     # Modelos MongoDB/Mongoose
│   │   │   ├── 📁 routes/     # Definição de rotas
│   │   │   ├── 📁 services/   # Serviços (email, scheduler)
│   │   │   ├── 📁 types/      # Tipagem do sistema
│   │   │   ├── 📁 utils/      # Utilitários (JWT, datas)
│   │   │   ├── 📁 validations/# Schemas de validação
│   │   │   └── 📁 __tests__/  # Suíte completa de testes
│   │   ├── 📁 scripts/        # Scripts de automação
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── 📁 frontend/           # SPA React + TypeScript
│   │   ├── 📁 src/
│   │   │   ├── 📁 components/ # Componentes reutilizáveis
│   │   │   ├── 📁 pages/      # Páginas da aplicação
│   │   │   ├── 📁 hooks/      # Custom hooks
│   │   │   ├── 📁 services/   # Serviços de API
│   │   │   ├── 📁 utils/      # Utilitários
│   │   │   ├── 📁 types/      # Tipos TypeScript
│   │   │   └── 📁 styles/     # Estilos globais
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── 📁 shared/             # Biblioteca compartilhada
│   │   ├── 📁 types/          # Tipos compartilhados
│   │   ├── 📁 utils/          # Utilitários compartilhados
│   │   ├── 📁 constants/      # Constantes
│   │   └── 📁 validation/     # Schemas de validação
│   ├── package.json           # Workspace root
│   ├── turbo.json            # Configuração Turborepo
│   ├── railway.json          # Configuração Railway (Backend)
│   └── vercel.json           # Configuração Vercel (Frontend)
├── 📁 docs/                   # Documentação do projeto
└── README.md
```

### Stack Tecnológica

#### Backend

- **Node.js** 18+ - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **TypeScript** - Tipagem estática
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação stateless
- **Bcrypt** - Hash de senhas
- **Helmet** - Segurança HTTP
- **Express Rate Limit** - Rate limiting
- **Compression** - Compressão de dados
- **Nodemailer** - Envio de emails
- **Date-fns** - Manipulação de datas
- **Zod** - Validação de dados
- **Jest** - Framework de testes
- **Artillery** - Testes de performance

#### Frontend

- **React** 18+ - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **React Router Dom** - Roteamento
- **TanStack Query** - Gerenciamento de estado servidor
- **Styled Components** - CSS-in-JS
- **React Hook Form** - Formulários
- **Zod** - Validação client-side
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones
- **Date-fns** - Manipulação de datas
- **Vitest** - Framework de testes
- **MSW** - Mock Service Worker

#### Shared

- **TypeScript** - Tipos compartilhados
- **Zod** - Schemas de validação
- **Date-fns** - Utilitários de data

#### DevOps e Ferramentas

- **Turborepo** - Monorepo management
- **ESLint** - Linting
- **NPM Workspaces** - Gerenciamento de dependências
- **Railway** - Deploy do backend
- **Vercel** - Deploy do frontend

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18.0.0 ou superior ([Download](https://nodejs.org/))
- **npm** 8.0.0 ou superior (incluso com Node.js)
- **Git** ([Download](https://git-scm.com/))
- **MongoDB Atlas** (recomendado) ou MongoDB local

## 🚀 Instalação e Configuração

### 1. Clone o Repositório

```bash
git clone https://github.com/JedersonYago/ReservaDeRestaurante.git
cd ReservaDeRestaurante/app
```

### 2. Instalação Rápida com Turborepo

```bash
# Instalar todas as dependências do monorepo
npm install

# Ou limpeza completa + instalação
npm run install:clean
```

### 3. Configuração do Backend

Crie o arquivo `.env` na pasta `backend/`:

```bash
cd backend
cp .env
```

Configure as variáveis no arquivo `.env`:

```env
# Banco de Dados
MONGODB_URI=mongodb+srv://seu-usuario:sua-senha@cluster.mongodb.net/reserva-facil?retryWrites=true&w=majority

# Servidor
PORT=3001
NODE_ENV=development

# Rate Limit
RATE_LIMIT_MAX=10000
RATE_LIMIT_WINDOW_MS=60000

# Autenticação JWT
JWT_SECRET=seu-jwt-secret-muito-seguro-aqui
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=seu-refresh-secret-muito-seguro-aqui
JWT_REFRESH_EXPIRES_IN=7d

# Código Admin (para criar contas admin)
ADMIN_CODE=admin123

# Email (opcional - para recuperação de senha)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app
SMTP_FROM_NAME=Reserva Fácil
SMTP_FROM_EMAIL=seu-email@gmail.com

# URL do frontend
FRONTEND_URL=http://localhost:5173

# CORS
CORS_ORIGIN=http://localhost:5173
```

> ⚠️ **Importante**: Em produção, use variáveis de ambiente seguras e nunca commite o arquivo `.env`!

### 4. Execução em Desenvolvimento

#### Opção 1: Usando Turborepo (Recomendado)

```bash
# Executar frontend e backend simultaneamente
npm run dev

# Ou executar apenas backend
npm run dev:backend

# Ou executar apenas frontend
npm run dev:frontend

# Ou executar sequencialmente (Windows)
npm run dev:sequential
```

#### Opção 2: Manual (desenvolvimento/debug)

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - Shared (se fazendo alterações)
cd shared
npm run dev
```

### 5. Acesso à Aplicação

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3001](http://localhost:3001)
- **API Health Check**: [http://localhost:3001/api](http://localhost:3001/api)

## 🎯 Primeiro Acesso

### 1. Criar Conta de Cliente

1. Acesse [http://localhost:5173](http://localhost:5173)
2. Clique em "Registrar"
3. Preencha os dados e selecione "Cliente"
4. Faça login com suas credenciais

### 2. Criar Conta de Administrador

1. Na página de registro, selecione "Administrador"
2. Digite o código admin: `admin123` (ou o valor do seu `.env`)
3. Complete o cadastro

### 3. Configuração Inicial (Admin)

1. Acesse o painel administrativo
2. Vá em "Configurações" para definir:
   - Horários de funcionamento
   - Limites de reservas por usuário
   - Intervalos entre reservas
3. Crie suas primeiras mesas em "Gestão de Mesas"

## 📊 Banco de Dados

### Modelos Principais

#### User (Usuário)

```typescript
interface User {
  _id: ObjectId;
  name: string;
  email: string;
  username: string;
  password: string; // Hash bcrypt
  role: "client" | "admin";
  emailChanges?: ChangeControl;
  usernameChanges?: ChangeControl;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Table (Mesa)

```typescript
interface Table {
  _id: ObjectId;
  name: string;
  capacity: number;
  status: "available" | "reserved" | "maintenance" | "expired";
  availability: AvailabilityBlock[];
  createdAt: Date;
  updatedAt: Date;
}

interface AvailabilityBlock {
  date: string; // YYYY-MM-DD
  times: string[]; // ['19:00-20:00', '20:00-21:00']
}
```

#### Reservation (Reserva)

```typescript
interface Reservation {
  _id: ObjectId;
  tableId: ObjectId;
  userId: ObjectId;
  customerName: string;
  customerEmail: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  observations?: string;
  status: "pending" | "confirmed" | "cancelled" | "expired";
  hiddenFromUser: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Config (Configuração)

```typescript
interface Config {
  _id: ObjectId;
  maxReservationsPerUser: number;
  reservationLimitHours: number;
  minIntervalBetweenReservations: number;
  openingHour: string;
  closingHour: string;
  isReservationLimitEnabled: boolean;
  isIntervalEnabled: boolean;
  isOpeningHoursEnabled: boolean;
  updatedBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔗 API Endpoints

### Autenticação (`/api/auth`)

```
POST   /login              # Login do usuário
POST   /register           # Registro de usuário
POST   /refresh            # Renovar access token
POST   /logout             # Logout
POST   /logout-all         # Logout de todos dispositivos
POST   /forgot-password    # Solicitar reset de senha
POST   /reset-password     # Resetar senha
GET    /verify-reset-token # Verificar token de reset
GET    /me                 # Obter usuário atual
GET    /validate           # Validar token
```

### Reservas (`/api/reservations`)

```
GET    /                   # Listar reservas do usuário
GET    /:id                # Obter reserva por ID
POST   /                   # Criar nova reserva
PUT    /:id                # Atualizar reserva
PUT    /:id/cancel         # Cancelar reserva
PUT    /:id/confirm        # Confirmar reserva (admin)
PATCH  /:id/clear          # Remover da lista do usuário
DELETE /:id                # Deletar reserva (admin)
GET    /available-times/:date # Obter horários disponíveis
```

### Mesas (`/api/tables`)

```
GET    /                   # Listar todas as mesas
GET    /:id                # Obter mesa por ID
POST   /                   # Criar mesa (admin)
PUT    /:id                # Atualizar mesa (admin)
DELETE /:id                # Deletar mesa (admin)
GET    /available          # Mesas disponíveis para reserva
GET    /:id/availability   # Verificar disponibilidade específica
GET    /:id/status         # Status da mesa para uma data
```

### Dashboard (`/api/dashboard`)

```
GET    /client-stats       # Estatísticas do cliente
GET    /admin-stats        # Estatísticas do administrador
```

### Configurações (`/api/config`)

```
GET    /                   # Obter configurações atuais
POST   /                   # Atualizar configurações (admin)
```

### Perfil (`/api/profile`)

```
GET    /:username          # Obter perfil do usuário
PUT    /:username          # Atualizar perfil
PUT    /:username/password # Alterar senha
DELETE /:username          # Deletar conta
```

## 🛠️ Scripts Disponíveis

### Root (Monorepo)

```bash
npm run dev              # Executar frontend + backend
npm run dev:backend      # Executar apenas backend
npm run dev:frontend     # Executar apenas frontend
npm run dev:sequential   # Executar sequencialmente (Windows)
npm run build            # Build de todos os pacotes
npm run build:frontend   # Build apenas frontend
npm run build:backend    # Build apenas backend
npm run build:shared     # Build apenas shared
npm run build:fast       # Build paralelo
npm run lint             # Lint de todos os pacotes
npm run test             # Testes de todos os pacotes
npm run clean            # Limpar node_modules e locks
npm run install:clean    # Limpeza + instalação completa
npm run cache:clean      # Limpar cache do Turbo
```

### Backend

```bash
npm run dev              # Modo desenvolvimento (nodemon)
npm run build            # Compilar TypeScript
npm run start            # Executar versão compilada
npm test                 # Executar testes
npm run test:watch       # Testes com watch
npm run test:coverage    # Testes com cobertura
npm run test:models      # Testes de modelos
npm run test:controllers # Testes de controladores
npm run test:integration # Testes de integração
npm run test:unit        # Testes unitários
npm run test:smoke       # Teste de smoke
npm run test:performance # Teste de performance
npm run test:stress      # Teste de stress
npm run lint             # ESLint
```

### Frontend

```bash
npm run dev              # Servidor de desenvolvimento (Vite)
npm run build            # Build para produção
npm run preview          # Preview da build
npm test                 # Executar testes (Vitest)
npm run test:watch       # Testes com watch
npm run test:coverage    # Testes com cobertura
npm run test:ui          # Interface de testes
npm run lint             # ESLint
```

### Shared

```bash
npm run build            # Compilar tipos TypeScript
npm run dev              # Watch mode
npm run clean            # Limpar dist/
```

## 🔧 Funcionalidades Avançadas

### Sistema de Reservas Inteligente

- **Validação de Conflitos**: Verificação automática de disponibilidade
- **Limites Configuráveis**: Controle de quantas reservas por usuário/período
- **Confirmação Automática**: Reservas pendentes confirmadas automaticamente
- **Remanejamento**: Transferência automática quando mesa sai de operação

### Gestão de Mesas Dinâmica

- **Disponibilidade por Data**: Configuração específica para cada dia
- **Status Automático**: Atualização baseada em reservas ativas
- **Manutenção Programada**: Sistema para colocar mesas fora de operação

### Sistema de Configurações

- **Horários de Funcionamento**: Definição flexível de abertura/fechamento
- **Intervalos Entre Reservas**: Controle de tempo mínimo entre agendamentos
- **Limites por Usuário**: Prevenção de spam de reservas

### Scheduler Automático

- **Limpeza Diária**: Remoção de dados expirados
- **Verificação Periódica**: Monitoramento contínuo do sistema
- **Atualização de Status**: Sincronização automática de estados

### Sistema de Testes

- **Testes Unitários**: Cobertura de 70%+ com Jest
- **Testes de Integração**: Fluxos completos de usuário e admin
- **Testes de Performance**: Validação com Artillery
- **Testes de Stress**: Identificação de limites do sistema
- **Mock Service Worker**: Testes frontend isolados

## 🔒 Segurança

### Autenticação e Autorização

- **JWT com Refresh Tokens**: Sistema seguro de autenticação
- **Bcrypt**: Hash seguro de senhas
- **Role-based Access**: Controle de acesso por função (client/admin)

### Proteções Implementadas

- **Rate Limiting**: Proteção contra ataques de força bruta
- **Helmet**: Cabeçalhos de segurança HTTP
- **Data Sanitization**: Limpeza de dados de entrada
- **CORS**: Configuração adequada para cross-origin

### Validação de Dados

- **Schema Validation**: Validação rigorosa com Zod
- **Input Sanitization**: Prevenção de injeção de código
- **Type Safety**: TypeScript em todo o stack

## 📱 Design e UX

### Interface Responsiva

- **Mobile-First**: Design otimizado para dispositivos móveis
- **Styled Components**: CSS-in-JS para componentes consistentes
- **Acessibilidade**: Componentes acessíveis (ARIA labels, navegação por teclado)

### Experiência do Usuário

- **Loading States**: Feedback visual durante operações
- **Error Handling**: Tratamento gracioso de erros
- **Toast Notifications**: Notificações não intrusivas
- **Form Validation**: Validação em tempo real

## 🔄 Estado e Cache

### TanStack Query

- **Cache Inteligente**: Redução de requisições desnecessárias
- **Invalidação Automática**: Atualização baseada em mutações
- **Background Updates**: Sincronização automática de dados
- **Optimistic Updates**: Atualizações otimistas para melhor UX

### Gestão de Estado

- **React Hook Form**: Formulários performáticos
- **Local Storage**: Persistência de dados do usuário
- **Session Storage**: Tokens de acesso temporários

## 👥 Equipe

**Desenvolvido por**: Angelica, Alisson, Darliany, Debora, Denylson, Jederson, Lisboa, Vinicios e Zirlangio.

**Repositório**: [ReservaDeRestaurante](https://github.com/JedersonYago/ReservaDeRestaurante)

## 📚 Documentação Adicional

- [Documento de Requisitos](https://docs.google.com/document/d/1oG-CTwgIwojWTciv3wOayO93IBMtrgLJLyYWWCGYM74/edit?tab=t.0#heading=h.h7rdjbvzkuzw)
- [Testes do Backend](app/backend/src/__tests__/TESTES_BACKEND.md)

---
