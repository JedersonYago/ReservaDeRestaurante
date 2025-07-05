# 🍽️ Sistema de Reservas de Restaurante

Um sistema completo para gerenciar reservas de restaurante, desenvolvido com Node.js, TypeScript e React.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) (geralmente vem com o Node.js)
- [Git](https://git-scm.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) (ou MongoDB Atlas para cloud)

## 🚀 Como executar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/JedersonYago/ReservaDeRestaurante
cd ReservaDeRestaurante
```

### 2. Instale as dependências

Execute os comandos abaixo para instalar as dependências de todas as partes do projeto:

```bash
# Instalar dependências da biblioteca compartilhada
cd shared
npm install

# Instalar dependências do backend
cd ../backend
npm install

# Instalar dependências do frontend
cd ../frontend
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na pasta `backend` com as seguintes variáveis:

```bash
cd backend
```

Crie o arquivo `.env` (conteúdo usado somente durante o desenvolvimento):

```env
# Configurações do MongoDB Atlas
MONGODB_URI=mongodb+srv://reserva-facil:cERrxA0g3n4Zlj9X@cluster0.avzwjwj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# Configurações do servidor
PORT=3001
NODE_ENV=development

# JWT Secret (IMPORTANTE: Mude em produção!)
JWT_SECRET=chave-secreta-jwt-aqui-mude-em-producao

# Configurações de JWT
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

# Codigo Admin
ADMIN_CODE=ADMIN@12345
```

### 4. Execute o projeto

Você precisará de **2 terminais** para executar todas as partes do projeto:

#### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

### 5. Acesse a aplicação

Após executar todos os comandos acima:

- **Frontend**: Abra [http://localhost:5173](http://localhost:5173) no seu navegador
- **Backend API**: Disponível em [http://localhost:3001](http://localhost:3001)

## 📁 Estrutura do Projeto

```
ReservaDeRestaurante/
├── backend/          # API Node.js com TypeScript
├── frontend/         # Interface React com TypeScript
├── shared/          # Tipos e utilitários compartilhados
└── README.md        # Este arquivo
```

## 🛠️ Scripts Disponíveis

### Backend

- `npm run dev` - Executa o servidor em modo de desenvolvimento
- `npm run build` - Compila o TypeScript para JavaScript
- `npm start` - Executa o servidor compilado
- `npm test` - Executa os testes

### Frontend

- `npm run dev` - Executa a aplicação em modo de desenvolvimento
- `npm run build` - Compila a aplicação para produção
- `npm run preview` - Visualiza a build de produção
- `npm run lint` - Executa o linter

### Shared

- `npm run dev` - Compila os tipos em modo watch
- `npm run build` - Compila os tipos

## 🎯 Primeiro Acesso

1. **Certifique-se que o MongoDB está rodando** em sua máquina ou configure uma instância no MongoDB Atlas
2. **Execute os 3 terminais** conforme instruído acima
3. **Acesse o frontend** em [http://localhost:5173](http://localhost:5173)
4. **Crie sua primeira conta** usando o botão "Registrar"

## ⚠️ Solução de Problemas

### Erro de conexão com MongoDB

- Verifique se o MongoDB está instalado e rodando
- Confirme se a `MONGODB_URI` no arquivo `.env` está correta

### Erro "Cannot find module"

- Execute `npm install` em todas as pastas (shared, backend, frontend)
- Verifique se o Node.js está na versão correta

### Porta já está em uso

- Mude a porta no arquivo `.env` do backend (variável `PORT`)
- Ou finalize o processo que está usando a porta

### Frontend não conecta com Backend

- Verifique se o backend está rodando na porta 3001
- Confirme se a `FRONTEND_URL` no `.env` está correta
