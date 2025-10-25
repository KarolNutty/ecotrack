# 📚 Documentação da API - EcoTrack

## Base URL
```
http://localhost:3000/api
```

## 📋 Endpoints

### 1. Coletas

#### Listar todas as coletas
**GET** `/coletas`

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "tipo": "Papel",
      "quantidade": 50.5,
      "unidade": "kg",
      "pontoId": 1,
      "observacoes": "Coleta realizada com sucesso",
      "data": "2025-10-25T10:30:00.000Z",
      "status": "registrada"
    }
  ],
  "total": 1
}
```

#### Buscar coleta por ID
**GET** `/coletas/:id`

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "tipo": "Papel",
    "quantidade": 50.5,
    "unidade": "kg",
    "pontoId": 1,
    "observacoes": "Coleta realizada com sucesso",
    "data": "2025-10-25T10:30:00.000Z",
    "status": "registrada"
  }
}
```

#### Criar nova coleta
**POST** `/coletas`

**Body:**
```json
{
  "tipo": "Papel",
  "quantidade": 50.5,
  "unidade": "kg",
  "pontoId": 1,
  "observacoes": "Coleta realizada com sucesso"
}
```

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "message": "Coleta registrada com sucesso",
  "data": {
    "id": 1,
    "tipo": "Papel",
    "quantidade": 50.5,
    "unidade": "kg",
    "pontoId": 1,
    "observacoes": "Coleta realizada com sucesso",
    "data": "2025-10-25T10:30:00.000Z",
    "status": "registrada"
  }
}
```

#### Atualizar coleta
**PUT** `/coletas/:id`

**Body:**
```json
{
  "tipo": "Plástico",
  "quantidade": 75.0,
  "status": "processada"
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Coleta atualizada com sucesso",
  "data": {
    "id": 1,
    "tipo": "Plástico",
    "quantidade": 75.0,
    "unidade": "kg",
    "pontoId": 1,
    "observacoes": "Coleta realizada com sucesso",
    "data": "2025-10-25T10:30:00.000Z",
    "status": "processada"
  }
}
```

#### Deletar coleta
**DELETE** `/coletas/:id`

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Coleta removida com sucesso"
}
```

---

### 2. Pontos de Coleta

#### Listar todos os pontos
**GET** `/pontos`

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "EcoPonto Centro",
      "endereco": "Rua das Flores, 123 - Centro",
      "tipo": "Papel, Plástico, Metal",
      "status": "ativo"
    }
  ]
}
```

#### Criar novo ponto
**POST** `/pontos`

**Body:**
```json
{
  "nome": "EcoPonto Norte",
  "endereco": "Av. Sustentável, 789 - Zona Norte",
  "tipo": "Vidro, Eletrônicos"
}
```

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "message": "Ponto de coleta criado com sucesso",
  "data": {
    "id": 3,
    "nome": "EcoPonto Norte",
    "endereco": "Av. Sustentável, 789 - Zona Norte",
    "tipo": "Vidro, Eletrônicos",
    "status": "ativo"
  }
}
```

---

### 3. Dashboard

#### Obter estatísticas gerais
**GET** `/dashboard`

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "totalColetas": 10,
    "totalQuantidade": "450.50",
    "totalPontos": 2,
    "coletasPorTipo": {
      "Papel": 150.5,
      "Plástico": 200.0,
      "Metal": 100.0
    },
    "ultimasColetas": [
      {
        "id": 10,
        "tipo": "Papel",
        "quantidade": 50.5,
        "unidade": "kg",
        "pontoId": 1,
        "data": "2025-10-25T10:30:00.000Z",
        "status": "registrada"
      }
    ],
    "impactoAmbiental": {
      "co2Evitado": "1126.25",
      "arvoresEquivalentes": 45,
      "energiaEconomizada": "1441.60"
    }
  }
}
```

---

### 4. Relatórios

#### Gerar relatório mensal
**GET** `/relatorios/mensal`

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "mes": 10,
    "ano": 2025,
    "totalColetas": 5,
    "totalQuantidade": "250.50",
    "detalhes": [
      {
        "id": 1,
        "tipo": "Papel",
        "quantidade": 50.5,
        "unidade": "kg",
        "pontoId": 1,
        "data": "2025-10-15T10:30:00.000Z",
        "status": "registrada"
      }
    ]
  }
}
```

---

### 5. Health Check

#### Verificar status do servidor
**GET** `/health`

**Resposta de Sucesso (200):**
```json
{
  "status": "OK",
  "timestamp": "2025-10-25T14:30:00.000Z",
  "uptime": 3600.5
}
```

---

## 🔧 Códigos de Erro

### 400 - Bad Request
```json
{
  "success": false,
  "message": "Campos obrigatórios: tipo, quantidade, pontoId"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Coleta não encontrada"
}
```

### 500 - Internal Server Error
```json
{
  "success": false,
  "message": "Erro interno do servidor"
}
```

---

## 📝 Exemplos de Uso com cURL

### Criar uma coleta
```bash
curl -X POST http://localhost:3000/api/coletas \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "Papel",
    "quantidade": 50.5,
    "unidade": "kg",
    "pontoId": 1,
    "observacoes": "Primeira coleta do dia"
  }'
```

### Listar todas as coletas
```bash
curl http://localhost:3000/api/coletas
```

### Obter dashboard
```bash
curl http://localhost:3000/api/dashboard
```

### Criar um ponto de coleta
```bash
curl -X POST http://localhost:3000/api/pontos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "EcoPonto Sul",
    "endereco": "Rua Verde, 456",
    "tipo": "Todos os tipos"
  }'
```

---

## 📊 Cálculos de Impacto Ambiental

### CO₂ Evitado
```
CO₂ = quantidade_total * 2.5 kg
```

### Árvores Equivalentes
```
Árvores = quantidade_total / 10
```

### Energia Economizada
```
Energia = quantidade_total * 3.2 kWh
```

---

## 🧪 Testando a API

Você pode testar a API usando:

1. **Navegador** - Para requisições GET
2. **Postman** - Cliente HTTP completo
3. **cURL** - Linha de comando
4. **Thunder Client** - Extensão do VS Code
5. **Interface Web** - Incluída no projeto

---

## 📦 Tipos de Materiais Suportados

- Papel
- Plástico
- Metal
- Vidro
- Eletrônicos
- Orgânicos

---

## 💡 Dicas

1. Sempre verifique o status do servidor com `/api/health` antes de iniciar
2. Use o dashboard para ter uma visão geral dos dados
3. Os IDs são incrementais e começam em 1
4. Todas as datas são retornadas em formato ISO 8601
5. O servidor usa armazenamento em memória - os dados são perdidos ao reiniciar

---

**Desenvolvido com 🌱 para um futuro mais sustentável**
