# MediTech API — Referência

**Base URL:** `http://127.0.0.1:5000`

Autenticação via JWT: header `Authorization: Bearer <token>`

---

## Auth

### POST `/auth/login`
Autentica o usuário e retorna o JWT.

**Body:**
```json
{ "email": "joao@email.com", "senha": "senha123" }
```

**Respostas:** `200` OK · `401` Credenciais inválidas · `422` Campos ausentes

---

## Usuários

### POST `/usuarios`
Cadastra um novo paciente. Não requer token.

**Body:**
```json
{
  "nome": "Joao",
  "sobrenome": "Silva",
  "data_nascimento": "1999-10-23",
  "genero": "masculino",
  "telefone": "11999999999",
  "cpf": "12345678901",
  "email": "joao@email.com",
  "senha": "senha123"
}
```
> `genero`: `masculino` | `feminino` | `outro` | `prefiro_nao_informar`

**Respostas:** `201` Criado · `422` Validação · `500` Erro interno

---

### GET `/usuarios` 🔒 (admin)
Lista usuários com filtros opcionais.

**Query params:**
| Param  | Tipo    | Descrição                                 |
|--------|---------|-------------------------------------------|
| ativo  | boolean | Filtrar por ativo/inativo                 |
| tipo   | string  | `admin` \| `medico` \| `paciente`         |
| nome   | string  | Busca parcial por nome/sobrenome          |
| cpf    | string  | Busca exata por CPF                       |
| ordem  | string  | `asc` \| `desc` (padrão: `desc`)          |

**Respostas:** `200` OK · `401` Sem token · `403` Não é admin · `422` Filtro inválido

---

### POST `/usuarios/medico`
Cadastra um médico. Não requer token.

**Body:** mesmo schema de `/usuarios` (sem campo `tipo`).

**Respostas:** `201` Criado · `422` Validação · `500` Erro interno

---

### POST `/usuarios/admin` 🔒 (admin)
Cadastra um admin. Requer token de admin.

**Body:** mesmo schema de `/usuarios` (sem campo `tipo`).

**Respostas:** `201` Criado · `403` Não é admin · `422` Validação · `500` Erro interno

---

## Consultas

### POST `/consultas` 🔒
Agenda uma nova consulta.

**Body:**
```json
{
  "especialidade_id": 1,
  "medico_id": 2,
  "data_agendada": "2026-04-10",
  "hora": "14:30"
}
```

**Respostas:** `201` Agendado · `401` Sem token · `422` Validação · `500` Erro interno

---

### GET `/consultas` 🔒
Lista consultas do paciente autenticado.

**Respostas:** `200` OK · `401` Sem token

---

## Especialidades

### GET `/especialidades` 🔒
Lista todas as especialidades.

**Respostas:** `200` OK · `401` Sem token

---

### POST `/especialidades` 🔒 (admin)
Cadastra uma especialidade.

**Body:**
```json
{ "nome": "Cardiologia" }
```

**Respostas:** `201` Criado · `403` Não é admin · `422` Validação · `500` Erro interno

---

### GET `/especialidades/medico/{medico_id}` 🔒
Lista especialidades de um médico específico.

**Respostas:** `200` OK · `401` Sem token

---

### POST `/especialidades/medico/{medico_id}` 🔒 (admin)
Associa uma especialidade a um médico.

**Body:**
```json
{ "especialidade_id": 1 }
```

**Respostas:** `200` OK · `403` Não é admin · `422` Validação · `500` Erro interno

---

## Horários Disponíveis

### POST `/horarios-disponiveis` 🔒
Cadastra horário disponível para um médico.

**Body:**
```json
{
  "dia_semana": 1,
  "periodo": "manha",
  "medico_id": 2
}
```
> `dia_semana`: `0`=seg · `1`=ter · `2`=qua · `3`=qui · `4`=sex · `5`=sáb · `6`=dom
> `periodo`: `manha` | `tarde` | `noite`
> `medico_id`: obrigatório apenas para admins

**Respostas:** `201` Criado · `403` Acesso negado · `422` Validação · `500` Erro interno

---

### GET `/horarios-disponiveis/disponivel` 🔒
Retorna médicos e horários disponíveis para agendamento.

**Query params (todos obrigatórios):**
| Param           | Tipo    | Exemplo      |
|-----------------|---------|--------------|
| especialidade_id | integer | `1`          |
| data            | date    | `2026-04-14` |
| periodo         | string  | `manha`      |

**Respostas:** `200` OK · `401` Sem token · `422` Parâmetros inválidos

---

### GET `/horarios-disponiveis/medico/{medico_id}` 🔒
Lista horários cadastrados de um médico.

**Respostas:** `200` OK · `401` Sem token

---

### DELETE `/horarios-disponiveis/{horario_id}` 🔒
Remove um horário disponível.

**Respostas:** `200` OK · `403` Acesso negado · `422` Não encontrado
