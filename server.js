const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { db, all, get, run } = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// ==================== ROTAS DE COLETAS ====================

// GET - Listar todas as coletas
app.get('/api/coletas', async (req, res) => {
    try {
        const coletas = await all('SELECT * FROM coletas ORDER BY data DESC');
        res.json({
            success: true,
            data: coletas
        });
    } catch (error) {
        console.error('Erro ao buscar coletas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar coletas'
        });
    }
});

// POST - Criar nova coleta
app.post('/api/coletas', async (req, res) => {
    try {
        const { data, tipo_material, quantidade, ponto_coleta } = req.body;
        
        // Validação
        if (!data || !tipo_material || !quantidade || !ponto_coleta) {
            return res.status(400).json({
                success: false,
                message: 'Todos os campos são obrigatórios'
            });
        }

        const result = await run(
            'INSERT INTO coletas (data, tipo_material, quantidade, ponto_coleta) VALUES (?, ?, ?, ?)',
            [data, tipo_material, quantidade, ponto_coleta]
        );

        res.status(201).json({
            success: true,
            message: 'Coleta registrada com sucesso!',
            data: {
                id: result.id,
                data,
                tipo_material,
                quantidade,
                ponto_coleta
            }
        });
    } catch (error) {
        console.error('Erro ao criar coleta:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao registrar coleta'
        });
    }
});

// PUT - Atualizar coleta
app.put('/api/coletas/:id', async (req, res) => {
    try {
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
    } catch (error) {
        console.error('Erro ao atualizar coleta:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar coleta'
        });
    }
});

// DELETE - Remover coleta
app.delete('/api/coletas/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await run('DELETE FROM coletas WHERE id = ?', [id]);

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: 'Coleta não encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Coleta removida com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao deletar coleta:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao remover coleta'
        });
    }
});

// ==================== ROTAS DE PONTOS ====================

// GET - Listar pontos
app.get('/api/pontos', async (req, res) => {
    try {
        const pontos = await all('SELECT * FROM pontos');
        res.json({
            success: true,
            data: pontos
        });
    } catch (error) {
        console.error('Erro ao buscar pontos:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar pontos'
        });
    }
});

// POST - Criar novo ponto
app.post('/api/pontos', async (req, res) => {
    try {
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
    } catch (error) {
        console.error('Erro ao criar ponto:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao criar ponto'
        });
    }
});

// ==================== DASHBOARD ====================

app.get('/api/dashboard', async (req, res) => {
    try {
        const coletas = await all('SELECT * FROM coletas');
        
        const totalColetas = coletas.length;
        const totalQuantidade = coletas.reduce((sum, c) => sum + parseFloat(c.quantidade || 0), 0);

        // Cálculos de impacto ambiental
        const co2Economizado = (totalQuantidade * 2.5).toFixed(2);
        const arvoresPreservadas = Math.floor(totalQuantidade / 10);
        const energiaEconomizada = (totalQuantidade * 1.8).toFixed(2);

        res.json({
            success: true,
            data: {
                totalColetas,
                totalQuantidade: totalQuantidade.toFixed(2),
                co2Economizado,
                arvoresPreservadas,
                energiaEconomizada,
                ultimasColetas: coletas.slice(0, 5)
            }
        });
    } catch (error) {
        console.error('Erro ao gerar dashboard:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao carregar dashboard'
        });
    }
});

// ==================== RELATÓRIO ====================

app.get('/api/relatorio', async (req, res) => {
    try {
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

        res.json({
            success: true,
            data: {
                mes: mesAtual,
                ano: anoAtual,
                totalColetas: coletas.length,
                totalQuantidade: totalMes.toFixed(2),
                detalhes: coletas
            }
        });
    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao gerar relatório'
        });
    }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        database: 'SQLite - Conectado',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// ==================== ERRO 404 ====================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada'
    });
});

// ==================== INICIAR SERVIDOR ====================

app.listen(PORT, () => {
    console.log(`🌱 EcoTrack rodando em http://localhost:${PORT}`);
    console.log(`📊 API disponível em http://localhost:${PORT}/api`);
    console.log(`🗄️  Banco de dados: SQLite (ecotrack.db)`);
    console.log(`✅ Dados serão persistidos localmente!`);
});