# MediTech API — Referência

**Base URL:** `http://127.0.0.1:5000`  
**Auth:** header `Authorization: Bearer <token>` — obrigatório nas rotas marcadas com 🔒  
**Formato de datas:** `YYYY-MM-DD`  
**Content-Type:** `application/json`

> **Legenda:** `*` = obrigatório · 🔒 = requer JWT · 🔒(admin) = requer JWT de admin

---

## Índice
- [Auth](#auth)
- [Usuários](#usuários)
- [Consultas](#consultas)
- [Especialidades](#especialidades)
- [Horários Disponíveis](#horários-disponíveis)

---

## Auth

### `POST /auth/login`
> Autentica o usuário e retorna o JWT de acesso. **Não requer token.**

**Precisa — Body:**
| Campo  | Tipo   | * | Descrição         |
|--------|--------|---|-------------------|
| email  | string | * | E-mail do usuário |
| senha  | string | * | Senha do usuário  |

```json
{ "email": "joao@email.com", "senha": "senha123" }
```

**Retorna:**
| Código | Situação                        |
|--------|---------------------------------|
| `200`  | `{ "access_token": "<jwt>" }`   |
| `401`  | Credenciais inválidas           |
| `422`  | Campos obrigatórios ausentes    |
| `500`  | Erro interno do servidor        |

---

## Usuários

### `POST /usuarios`
> Cadastra um novo **paciente**. Não requer token.

**Precisa — Body:**
| Campo            | Tipo   | * | Descrição                                                        |
|------------------|--------|---|------------------------------------------------------------------|
| nome             | string | * | Primeiro nome                                                    |
| sobrenome        | string | * | Sobrenome                                                        |
| data_nascimento  | date   | * | Formato `YYYY-MM-DD`                                             |
| genero           | string | * | `masculino` \| `feminino` \| `outro` \| `prefiro_nao_informar`   |
| email            | string | * | E-mail válido                                                    |
| senha            | string | * | Senha                                                            |
| cpf              | string | * | Somente dígitos, 11 caracteres                                   |
| telefone         | string | * | Ex.: `11999999999`                                               |
| tipo             | string | * | Deve ser enviado como `"paciente"`                               |

```json
{
  "nome": "Joao",
  "sobrenome": "Silva",
  "data_nascimento": "1999-10-23",
  "genero": "masculino",
  "email": "joao@email.com",
  "senha": "senha123",
  "cpf": "12345678901",
  "telefone": "11999999999",
  "tipo": "paciente"
}
```

**Retorna:**
| Código | Situação                     |
|--------|------------------------------|
| `201`  | Usuário cadastrado com sucesso |
| `422`  | Erro de validação            |
| `500`  | Erro interno do servidor     |

---

### `GET /usuarios` 🔒(admin)
> Lista todos os usuários. **Requer token de admin.**

**Precisa — Query params (todos opcionais):**
| Param  | Tipo    | Descrição                                         |
|--------|---------|---------------------------------------------------|
| ativo  | boolean | Filtrar por status ativo (`true` ou `false`)      |
| tipo   | string  | `admin` \| `medico` \| `paciente`                 |
| nome   | string  | Busca parcial por nome ou sobrenome               |
| cpf    | string  | Busca exata por CPF                               |
| ordem  | string  | `asc` \| `desc` — ordenação por data de cadastro (padrão: `desc`) |

**Retorna:**
| Código | Situação                              |
|--------|---------------------------------------|
| `200`  | Array de objetos usuário              |
| `401`  | Token ausente, inválido ou expirado   |
| `403`  | Acesso negado — requer token de admin |
| `422`  | Valor inválido nos filtros            |

---

### `POST /usuarios/medico`
> Cadastra um **médico**. Não requer token.

**Precisa — Body:** mesmo schema de `POST /usuarios`, sem o campo `tipo` (inferido pela rota).

| Campo            | Tipo   | * |
|------------------|--------|---|
| nome             | string | * |
| sobrenome        | string | * |
| data_nascimento  | date   | * |
| genero           | string | * |
| email            | string | * |
| senha            | string | * |
| cpf              | string | * |
| telefone         | string | * |

**Retorna:**
| Código | Situação                     |
|--------|------------------------------|
| `201`  | Médico cadastrado com sucesso |
| `422`  | Erro de validação            |
| `500`  | Erro interno do servidor     |

---

### `POST /usuarios/admin` 🔒(admin)
> Cadastra um **admin**. **Requer token de admin.**

**Precisa — Body:** mesmo schema de `POST /usuarios/medico`.

**Retorna:**
| Código | Situação                              |
|--------|---------------------------------------|
| `201`  | Admin cadastrado com sucesso          |
| `401`  | Token ausente, inválido ou expirado   |
| `403`  | Acesso negado — requer token de admin |
| `422`  | Erro de validação                     |
| `500`  | Erro interno do servidor              |

---

## Consultas

### `POST /consultas` 🔒
> Agenda uma nova consulta para o paciente autenticado.

**Precisa — Header:** `Authorization: Bearer <token>`  
**Precisa — Body:**
| Campo           | Tipo    | * | Descrição                        |
|-----------------|---------|---|----------------------------------|
| especialidade_id | integer | * | ID da especialidade              |
| medico_id       | integer | * | ID do médico                     |
| data_agendada   | date    | * | Data da consulta (`YYYY-MM-DD`)  |
| hora            | string  | * | Horário no formato `HH:MM`       |

```json
{
  "especialidade_id": 1,
  "medico_id": 2,
  "data_agendada": "2026-04-10",
  "hora": "14:30"
}
```

**Retorna:**
| Código | Situação                            |
|--------|-------------------------------------|
| `201`  | Consulta agendada com sucesso       |
| `401`  | Token ausente, inválido ou expirado |
| `422`  | Erro de validação                   |
| `500`  | Erro interno do servidor            |

---

### `GET /consultas` 🔒
> Lista todas as consultas do paciente autenticado.

**Precisa — Header:** `Authorization: Bearer <token>`

**Retorna:**
| Código | Situação                            |
|--------|-------------------------------------|
| `200`  | Array de objetos consulta do paciente autenticado |
| `401`  | Token ausente, inválido ou expirado |

---

## Especialidades

### `GET /especialidades` 🔒
> Lista todas as especialidades cadastradas.

**Precisa — Header:** `Authorization: Bearer <token>`

**Retorna:**
| Código | Situação                            |
|--------|-------------------------------------|
| `200`  | Array de objetos especialidade      |
| `401`  | Token ausente, inválido ou expirado |

---

### `POST /especialidades` 🔒(admin)
> Cadastra uma nova especialidade. **Requer token de admin.**

**Precisa — Header:** `Authorization: Bearer <token>` (admin)  
**Precisa — Body:**
| Campo | Tipo   | * | Descrição               |
|-------|--------|---|-------------------------|
| nome  | string | * | Nome da especialidade   |

```json
{ "nome": "Cardiologia" }
```

**Retorna:**
| Código | Situação                              |
|--------|---------------------------------------|
| `201`  | Especialidade cadastrada com sucesso  |
| `401`  | Token ausente, inválido ou expirado   |
| `403`  | Acesso negado — requer token de admin |
| `422`  | Erro de validação                     |
| `500`  | Erro interno do servidor              |

---

### `GET /especialidades/medico/{medico_id}` 🔒
> Lista as especialidades associadas a um médico específico.

**Precisa — Header:** `Authorization: Bearer <token>`  
**Precisa — Path param:** `medico_id` (integer) — ID do médico

**Retorna:**
| Código | Situação                            |
|--------|-------------------------------------|
| `200`  | Array de especialidades do médico   |
| `401`  | Token ausente, inválido ou expirado |

---

### `POST /especialidades/medico/{medico_id}` 🔒(admin)
> Associa uma especialidade a um médico. **Requer token de admin.**

**Precisa — Header:** `Authorization: Bearer <token>` (admin)  
**Precisa — Path param:** `medico_id` (integer) — ID do médico  
**Precisa — Body:**
| Campo           | Tipo    | * | Descrição           |
|-----------------|---------|---|---------------------|
| especialidade_id | integer | * | ID da especialidade |

```json
{ "especialidade_id": 1 }
```

**Retorna:**
| Código | Situação                              |
|--------|---------------------------------------|
| `200`  | Especialidade associada com sucesso   |
| `401`  | Token ausente, inválido ou expirado   |
| `403`  | Acesso negado — requer token de admin |
| `422`  | Erro de validação                     |
| `500`  | Erro interno do servidor              |

---

## Horários Disponíveis

### `POST /horarios-disponiveis` 🔒
> Cadastra um horário disponível para um médico.  
> Médico autenticado cadastra para si próprio; admin pode informar `medico_id` de outro.

**Precisa — Header:** `Authorization: Bearer <token>`  
**Precisa — Body:**
| Campo     | Tipo    | * | Valores aceitos / Descrição                                         |
|-----------|---------|---|---------------------------------------------------------------------|
| dia_semana | integer | * | `0`=seg · `1`=ter · `2`=qua · `3`=qui · `4`=sex · `5`=sáb · `6`=dom |
| periodo   | string  | * | `manha` \| `tarde` \| `noite`                                       |
| medico_id  | integer |   | Obrigatório apenas para admins (para cadastrar horário de outro médico) |

```json
{ "dia_semana": 1, "periodo": "manha", "medico_id": 2 }
```

**Retorna:**
| Código | Situação                            |
|--------|-------------------------------------|
| `201`  | Horário cadastrado com sucesso      |
| `401`  | Token ausente, inválido ou expirado |
| `403`  | Acesso negado                       |
| `422`  | Erro de validação                   |
| `500`  | Erro interno do servidor            |

---

### `GET /horarios-disponiveis/disponivel` 🔒
> Retorna médicos e horários disponíveis para agendamento, dados uma especialidade, data e período.  
> **Usar antes de criar uma consulta** para obter `medico_id` e os horários disponíveis.

**Precisa — Header:** `Authorization: Bearer <token>`  
**Precisa — Query params (todos obrigatórios):**
| Param            | Tipo    | * | Exemplo      | Descrição                                  |
|------------------|---------|---|--------------|--------------------------------------------|
| especialidade_id | integer | * | `1`          | ID da especialidade                        |
| data             | date    | * | `2026-04-14` | Data desejada para a consulta (`YYYY-MM-DD`) |
| periodo          | string  | * | `manha`      | `manha` \| `tarde` \| `noite`              |

**Retorna:**
| Código | Situação                                          |
|--------|---------------------------------------------------|
| `200`  | Array de `{ medico_id, nome, horarios: [...] }` disponíveis |
| `401`  | Token ausente, inválido ou expirado               |
| `422`  | Parâmetros inválidos ou ausentes                  |

---

### `GET /horarios-disponiveis/medico/{medico_id}` 🔒
> Lista todos os horários cadastrados de um médico específico.

**Precisa — Header:** `Authorization: Bearer <token>`  
**Precisa — Path param:** `medico_id` (integer) — ID do médico

**Retorna:**
| Código | Situação                               |
|--------|----------------------------------------|
| `200`  | Array de horários disponíveis do médico |
| `401`  | Token ausente, inválido ou expirado    |

---

### `DELETE /horarios-disponiveis/{horario_id}` 🔒
> Remove um horário disponível cadastrado.

**Precisa — Header:** `Authorization: Bearer <token>`  
**Precisa — Path param:** `horario_id` (integer) — ID do horário a remover

**Retorna:**
| Código | Situação                            |
|--------|-------------------------------------|
| `200`  | Horário removido com sucesso        |
| `401`  | Token ausente, inválido ou expirado |
| `403`  | Acesso negado                       |
| `422`  | Horário não encontrado              |
