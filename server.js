const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Banco de dados em memória (simulação)
let coletas = [];
let pontos = [
  {
    id: 1,
    nome: "EcoPonto Centro",
    endereco: "Rua das Flores, 123 - Centro",
    tipo: "Papel, Plástico, Metal",
    status: "ativo"
  },
  {
    id: 2,
    nome: "EcoPonto Bairro Verde",
    endereco: "Av. Sustentável, 456 - Bairro Verde",
    tipo: "Vidro, Eletrônicos, Orgânicos",
    status: "ativo"
  }
];
let usuarios = [];
let nextColetaId = 1;
let nextPontoId = 3;
let nextUsuarioId = 1;

// ==================== ROTAS DA API ====================

// Rota principal
// Rota raiz - apenas para verificar se API está rodando
app.get('/', (req, res) => {
  res.json({
    message: 'EcoTrack API está rodando! 🌱',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      coletas: '/api/coletas',
      pontos: '/api/pontos',
      dashboard: '/api/dashboard'
    }
  });
});

// ==================== COLETAS ====================

// Listar todas as coletas
app.get('/api/coletas', (req, res) => {
  res.json({
    success: true,
    data: coletas,
    total: coletas.length
  });
});

// Buscar coleta por ID
app.get('/api/coletas/:id', (req, res) => {
  const coleta = coletas.find(c => c.id === parseInt(req.params.id));
  
  if (!coleta) {
    return res.status(404).json({
      success: false,
      message: 'Coleta não encontrada'
    });
  }
  
  res.json({
    success: true,
    data: coleta
  });
});

// Criar nova coleta
app.post('/api/coletas', (req, res) => {
  const { tipo, quantidade, unidade, pontoId, observacoes } = req.body;
  
  if (!tipo || !quantidade || !pontoId) {
    return res.status(400).json({
      success: false,
      message: 'Campos obrigatórios: tipo, quantidade, pontoId'
    });
  }
  
  const novaColeta = {
    id: nextColetaId++,
    tipo,
    quantidade: parseFloat(quantidade),
    unidade: unidade || 'kg',
    pontoId: parseInt(pontoId),
    observacoes: observacoes || '',
    data: new Date().toISOString(),
    status: 'registrada'
  };
  
  coletas.push(novaColeta);
  
  res.status(201).json({
    success: true,
    message: 'Coleta registrada com sucesso',
    data: novaColeta
  });
});

// Atualizar coleta
app.put('/api/coletas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = coletas.findIndex(c => c.id === id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Coleta não encontrada'
    });
  }
  
  coletas[index] = {
    ...coletas[index],
    ...req.body,
    id: id
  };
  
  res.json({
    success: true,
    message: 'Coleta atualizada com sucesso',
    data: coletas[index]
  });
});

// Deletar coleta
app.delete('/api/coletas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = coletas.findIndex(c => c.id === id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Coleta não encontrada'
    });
  }
  
  coletas.splice(index, 1);
  
  res.json({
    success: true,
    message: 'Coleta removida com sucesso'
  });
});

// ==================== PONTOS DE COLETA ====================

// Listar todos os pontos
app.get('/api/pontos', (req, res) => {
  res.json({
    success: true,
    data: pontos
  });
});

// Criar novo ponto
app.post('/api/pontos', (req, res) => {
  const { nome, endereco, tipo } = req.body;
  
  if (!nome || !endereco) {
    return res.status(400).json({
      success: false,
      message: 'Campos obrigatórios: nome, endereco'
    });
  }
  
  const novoPonto = {
    id: nextPontoId++,
    nome,
    endereco,
    tipo: tipo || 'Todos os tipos',
    status: 'ativo'
  };
  
  pontos.push(novoPonto);
  
  res.status(201).json({
    success: true,
    message: 'Ponto de coleta criado com sucesso',
    data: novoPonto
  });
});

// ==================== ESTATÍSTICAS ====================

// Dashboard com estatísticas
app.get('/api/dashboard', (req, res) => {
  const totalColetas = coletas.length;
  const totalQuantidade = coletas.reduce((sum, c) => sum + c.quantidade, 0);
  
  const coletasPorTipo = coletas.reduce((acc, c) => {
    acc[c.tipo] = (acc[c.tipo] || 0) + c.quantidade;
    return acc;
  }, {});
  
  const ultimasColetas = coletas
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .slice(0, 5);
  
  res.json({
    success: true,
    data: {
      totalColetas,
      totalQuantidade: totalQuantidade.toFixed(2),
      totalPontos: pontos.length,
      coletasPorTipo,
      ultimasColetas,
      impactoAmbiental: {
        co2Evitado: (totalQuantidade * 2.5).toFixed(2),
        arvoresEquivalentes: Math.floor(totalQuantidade / 10),
        energiaEconomizada: (totalQuantidade * 3.2).toFixed(2)
      }
    }
  });
});

// ==================== RELATÓRIOS ====================

// Gerar relatório mensal
app.get('/api/relatorios/mensal', (req, res) => {
  const mesAtual = new Date().getMonth();
  const coletasMes = coletas.filter(c => {
    const dataColeta = new Date(c.data);
    return dataColeta.getMonth() === mesAtual;
  });
  
  const totalMes = coletasMes.reduce((sum, c) => sum + c.quantidade, 0);
  
  res.json({
    success: true,
    data: {
      mes: mesAtual + 1,
      ano: new Date().getFullYear(),
      totalColetas: coletasMes.length,
      totalQuantidade: totalMes.toFixed(2),
      detalhes: coletasMes
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🌱 EcoTrack rodando em http://localhost:${PORT}`);
  console.log(`📊 API disponível em http://localhost:${PORT}/api`);
});
