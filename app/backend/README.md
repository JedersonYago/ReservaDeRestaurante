# Backend - Sistema de Reservas de Restaurante

Este é o backend do sistema de reservas de restaurante, desenvolvido com Node.js, Express, TypeScript e MongoDB.

## 🚀 Tecnologias Utilizadas

- Node.js
- Express
- TypeScript
- MongoDB (Mongoose)
- JWT para autenticação
- Joi para validação de dados
- Jest para testes

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- MongoDB instalado e rodando localmente
- npm ou yarn

## 📁 Estrutura de Pastas

```
src/
├── controllers/     # Controladores da aplicação
├── middlewares/     # Middlewares (autenticação, validação)
├── models/         # Modelos do MongoDB
├── routes/         # Rotas da API
├── validations/    # Schemas de validação
└── index.ts        # Arquivo principal
```

## 🔌 Endpoints da API

### Autenticação

- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login de usuário

### Mesas

- `GET /api/tables` - Listar todas as mesas
- `POST /api/tables` - Criar nova mesa
- `PUT /api/tables/:id` - Atualizar mesa
- `DELETE /api/tables/:id` - Remover mesa

### Reservas

- `GET /api/reservations` - Listar todas as reservas
- `POST /api/reservations` - Criar nova reserva
- `PUT /api/reservations/:id` - Atualizar reserva
- `DELETE /api/reservations/:id` - Cancelar reserva

## 🔑 Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação.:

## 🧪 Testes (pré-implementado)

O projeto utiliza Jest para testes. Os testes estão organizados em:

- Testes unitários
- Testes de integração

Para executar os testes:

```bash
npm test
```

## 🔐 Segurança

- Todas as senhas são hasheadas usando bcrypt
- Tokens JWT para autenticação
- Validação de dados com Joi
- Proteção contra ataques com Helmet
- Rate limiting para prevenir abusos
- CORS configurado para origens específicas

## 🔢 Código de Administrador

Para criar uma conta de administrador, é necessário fornecer um código especial válido. Este código é definido na variável de ambiente `ADMIN_CODE`. Por padrão, o código é "ADMIN123456", mas deve ser alterado em produção.
