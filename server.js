const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { db, all, get, run } = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== CORS CONFIGURADO ====================
// Configuração de CORS para localhost E produção
const isDevelopment = process.env.NODE_ENV !== 'production';

const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'https://ecotrack-backend-3315.onrender.com',
            'https://ecotrack-frontend.onrender.com'
        ];
        
        // Permite requisições sem origin (Postman, curl)
        if (!origin || isDevelopment) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('⚠️  Origem bloqueada:', origin);
            callback(null, true); // Permite mesmo assim em dev
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.static('public'));

// ==================== WRAPPER PARA ASYNC ====================
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// ==================== ROTAS DE COLETAS ====================

// GET - Listar todas as coletas
app.get('/api/coletas', asyncHandler(async (req, res) => {
    const coletas = await all('SELECT * FROM coletas ORDER BY data DESC');
    
    // Mapear para o formato que o frontend espera
    const coletasFormatadas = coletas.map(c => ({
        id: c.id,
        tipo: c.tipo_material,
        quantidade: c.quantidade,
        unidade: 'kg',
        data: c.data,
        pontoColeta: c.ponto_coleta,
        status: 'registrada'
    }));
    
    res.json({
        success: true,
        data: coletasFormatadas,
        total: coletasFormatadas.length
    });
}));

// POST - Criar nova coleta (CORRIGIDO para aceitar dados do frontend)
app.post('/api/coletas', asyncHandler(async (req, res) => {
    console.log('📨 Dados recebidos:', req.body);
    
    const { tipo, quantidade, unidade, pontoId, observacoes } = req.body;
    
    // Validação
    if (!tipo || !quantidade || !pontoId) {
        return res.status(400).json({
            success: false,
            message: 'Campos obrigatórios: tipo, quantidade, pontoId'
        });
    }

    // Buscar nome do ponto
    const ponto = await get('SELECT nome FROM pontos WHERE id = ?', [pontoId]);
    
    if (!ponto) {
        return res.status(404).json({
            success: false,
            message: 'Ponto de coleta não encontrado'
        });
    }

    // Data atual no formato ISO
    const dataAtual = new Date().toISOString();

    const result = await run(
        'INSERT INTO coletas (data, tipo_material, quantidade, ponto_coleta) VALUES (?, ?, ?, ?)',
        [dataAtual, tipo, quantidade, ponto.nome]
    );

    console.log('✅ Coleta criada com ID:', result.id);

    res.status(201).json({
        success: true,
        message: 'Coleta registrada com sucesso!',
        data: {
            id: result.id,
            tipo,
            quantidade,
            unidade: unidade || 'kg',
            pontoId,
            ponto_coleta: ponto.nome,
            data: dataAtual
        }
    });
}));

// PUT - Atualizar coleta
app.put('/api/coletas/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { data, tipo_material, quantidade, ponto_coleta } = req.body;

    const result = await run(
        'UPDATE coletas SET data = ?, tipo_material = ?, quantidade = ?, ponto_coleta = ? WHERE id = ?',
        [data, tipo_material, quantidade, ponto_coleta, id]
    );

    if (result.changes === 0) {
        return res.status(404).json({
            success: false,
            message: 'Coleta não encontrada'
        });
    }

    res.json({
        success: true,
        message: 'Coleta atualizada com sucesso!'
    });
}));

// DELETE - Remover coleta
app.delete('/api/coletas/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await run('DELETE FROM coletas WHERE id = ?', [id]);

    if (result.changes === 0) {
        return res.status(404).json({
            success: false,
            message: 'Coleta não encontrada'
        });
    }

    console.log('🗑️  Coleta deletada:', id);

    res.json({
        success: true,
        message: 'Coleta removida com sucesso!'
    });
}));

// ==================== ROTAS DE PONTOS ====================

// GET - Listar pontos
app.get('/api/pontos', asyncHandler(async (req, res) => {
    const pontos = await all('SELECT * FROM pontos');
    res.json({
        success: true,
        data: pontos
    });
}));

// POST - Criar novo ponto
app.post('/api/pontos', asyncHandler(async (req, res) => {
    const { nome, endereco, tipo } = req.body;

    if (!nome || !endereco || !tipo) {
        return res.status(400).json({
            success: false,
            message: 'Todos os campos são obrigatórios'
        });
    }

    const result = await run(
        'INSERT INTO pontos (nome, endereco, tipo, status) VALUES (?, ?, ?, ?)',
        [nome, endereco, tipo, 'ativo']
    );

    res.status(201).json({
        success: true,
        message: 'Ponto criado com sucesso!',
        data: {
            id: result.id,
            nome,
            endereco,
            tipo,
            status: 'ativo'
        }
    });
}));

// ==================== DASHBOARD (CORRIGIDO) ====================

app.get('/api/dashboard', asyncHandler(async (req, res) => {
    const coletas = await all('SELECT * FROM coletas');
    const pontos = await all('SELECT * FROM pontos');
    
    const totalColetas = coletas.length;
    const totalPontos = pontos.length;
    const totalQuantidade = coletas.reduce((sum, c) => sum + parseFloat(c.quantidade || 0), 0);

    // Coletas por tipo
    const coletasPorTipo = {};
    coletas.forEach(c => {
        const tipo = c.tipo_material;
        coletasPorTipo[tipo] = (coletasPorTipo[tipo] || 0) + parseFloat(c.quantidade || 0);
    });

    // Cálculos de impacto ambiental
    const impactoAmbiental = {
        co2Evitado: (totalQuantidade * 2.5).toFixed(2),
        arvoresEquivalentes: Math.floor(totalQuantidade / 10),
        energiaEconomizada: (totalQuantidade * 1.8).toFixed(2)
    };

    // Últimas 5 coletas formatadas
    const ultimasColetas = coletas
        .slice(0, 5)
        .map(c => ({
            id: c.id,
            tipo: c.tipo_material,
            quantidade: c.quantidade,
            unidade: 'kg',
            data: c.data,
            status: 'registrada'
        }));

    res.json({
        success: true,
        data: {
            totalColetas,
            totalPontos,
            totalQuantidade: totalQuantidade.toFixed(2),
            coletasPorTipo,
            impactoAmbiental,
            ultimasColetas
        }
    });
}));

// ==================== RELATÓRIO ====================

app.get('/api/relatorio', asyncHandler(async (req, res) => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth() + 1;
    const anoAtual = hoje.getFullYear();

    // Buscar coletas do mês atual
    const coletas = await all(`
        SELECT * FROM coletas 
        WHERE strftime('%m', data) = ? 
        AND strftime('%Y', data) = ?
    `, [mesAtual.toString().padStart(2, '0'), anoAtual.toString()]);

    const totalMes = coletas.reduce((sum, c) => sum + parseFloat(c.quantidade || 0), 0);

    // Formatar detalhes
    const detalhes = coletas.map(c => ({
        id: c.id,
        data: c.data,
        tipo: c.tipo_material,
        quantidade: c.quantidade,
        unidade: 'kg',
        status: 'registrada'
    }));

    res.json({
        success: true,
        data: {
            mes: mesAtual,
            ano: anoAtual,
            totalColetas: coletas.length,
            totalQuantidade: totalMes.toFixed(2),
            detalhes
        }
    });
}));

// ==================== RELATÓRIO MENSAL (para compatibilidade) ====================

app.get('/api/relatorios/mensal', asyncHandler(async (req, res) => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth() + 1;
    const anoAtual = hoje.getFullYear();

    const coletas = await all(`
        SELECT * FROM coletas 
        WHERE strftime('%m', data) = ? 
        AND strftime('%Y', data) = ?
    `, [mesAtual.toString().padStart(2, '0'), anoAtual.toString()]);

    const totalMes = coletas.reduce((sum, c) => sum + parseFloat(c.quantidade || 0), 0);

    const detalhes = coletas.map(c => ({
        data: c.data,
        tipo: c.tipo_material,
        quantidade: c.quantidade,
        unidade: 'kg',
        status: 'registrada'
    }));

    res.json({
        success: true,
        data: {
            mes: mesAtual,
            ano: anoAtual,
            totalColetas: coletas.length,
            totalQuantidade: totalMes.toFixed(2),
            detalhes
        }
    });
}));

// ==================== HEALTH CHECK ====================

app.get('/api/health', asyncHandler(async (req, res) => {
    await get('SELECT 1 as test');
    
    res.json({
        status: 'OK',
        database: 'SQLite - Conectado',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
}));

// ==================== ROTA DE TESTE ====================

app.get('/api/test', asyncHandler(async (req, res) => {
    const result = await get('SELECT 1 as test');
    const pontosCount = await get('SELECT COUNT(*) as count FROM pontos');
    const coletasCount = await get('SELECT COUNT(*) as count FROM coletas');
    
    res.json({
        success: true,
        message: 'Conexão com banco funcionando!',
        data: {
            test: result,
            pontos: pontosCount.count,
            coletas: coletasCount.count
        }
    });
}));

// ==================== ROTA PRINCIPAL ====================

app.get('/', (req, res) => {
    res.json({
        message: 'EcoTrack API está rodando! 🌱',
        version: '1.0.0',
        ambiente: process.env.NODE_ENV || 'development',
        endpoints: {
            health: '/api/health',
            test: '/api/test',
            coletas: '/api/coletas',
            pontos: '/api/pontos',
            dashboard: '/api/dashboard',
            relatorio: '/api/relatorio',
            relatorioMensal: '/api/relatorios/mensal'
        }
    });
});

// ==================== ERRO 404 ====================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada',
        path: req.path
    });
});

// ==================== ERROR HANDLER GLOBAL ====================

app.use((err, req, res, next) => {
    console.error('❌ Erro não tratado:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// ==================== INICIAR SERVIDOR ====================

db.get('SELECT 1', (err) => {
    if (err) {
        console.error('❌ Erro ao conectar ao banco:', err.message);
        process.exit(1);
    }
    
    console.log('✅ Banco de dados conectado com sucesso!');
    
    app.listen(PORT, () => {
        console.log('\n' + '='.repeat(50));
        console.log(`🌱 EcoTrack API rodando com sucesso!`);
        console.log('='.repeat(50));
        console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
        console.log(`📍 URL: http://localhost:${PORT}`);
        console.log(`📊 API: http://localhost:${PORT}/api`);
        console.log(`🗄️  Banco: SQLite (ecotrack.db)`);
        console.log(`✅ Status: Operacional`);
        console.log('='.repeat(50) + '\n');
        console.log('Rotas disponíveis:');
        console.log('  GET  /                     - Info da API');
        console.log('  GET  /api/health           - Status da API');
        console.log('  GET  /api/test             - Teste de conexão');
        console.log('  GET  /api/coletas          - Listar coletas');
        console.log('  POST /api/coletas          - Criar coleta');
        console.log('  PUT  /api/coletas/:id      - Atualizar coleta');
        console.log('  DEL  /api/coletas/:id      - Deletar coleta');
        console.log('  GET  /api/pontos           - Listar pontos');
        console.log('  POST /api/pontos           - Criar ponto');
        console.log('  GET  /api/dashboard        - Dashboard completo');
        console.log('  GET  /api/relatorio        - Relatório mensal');
        console.log('\n');
    });
});
