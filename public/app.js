// ==================== CONFIGURAÇÃO ==================== 
// A URL da API agora vem do config.js (carregado antes deste arquivo)

// ==================== SISTEMA DE NOTIFICAÇÕES (NOVO) ==================== 

function criarToastContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    return container;
}

function mostrarNotificacao(mensagem, tipo = 'success') {
    const container = criarToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    
    const icones = {
        success: '✓',
        erro: '✕',
        info: 'ℹ'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icones[tipo] || '✓'}</span>
        <span class="toast-message">${mensagem}</span>
        <button class="toast-close" onclick="fecharToast(this)">×</button>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        fecharToast(toast.querySelector('.toast-close'));
    }, 4000);
}

function fecharToast(botao) {
    const toast = botao.closest('.toast');
    if (toast) {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }
}

function mostrarSucesso(mensagem) {
    mostrarNotificacao(mensagem, 'success');
}

function mostrarErro(mensagem) {
    mostrarNotificacao(mensagem, 'erro');
}

function mostrarInfo(mensagem) {
    mostrarNotificacao(mensagem, 'info');
}

function bloquearFormulario(form, botaoSubmit) {
    form.classList.add('is-submitting');
    botaoSubmit.classList.add('loading');
    botaoSubmit.disabled = true;
}

function desbloquearFormulario(form, botaoSubmit) {
    form.classList.remove('is-submitting');
    botaoSubmit.classList.remove('loading');
    botaoSubmit.disabled = false;
}

// ==================== NAVEGAÇÃO ==================== 
document.addEventListener('DOMContentLoaded', () => {
    // Configurar navegação
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href').substring(1);
            showSection(target);
            
            // Atualizar link ativo
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Configurar formulários
    document.getElementById('coletaForm').addEventListener('submit', handleColetaSubmit);
    document.getElementById('pontoForm').addEventListener('submit', handlePontoSubmit);

    // Carregar dados iniciais
    carregarDashboard();
    carregarPontos();
    carregarColetas();
});

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');

    // Recarregar dados da seção
    if (sectionId === 'dashboard') {
        carregarDashboard();
    } else if (sectionId === 'coletas') {
        carregarColetas();
    } else if (sectionId === 'pontos') {
        carregarPontos();
    }
}

// ==================== DASHBOARD ==================== 
async function carregarDashboard() {
    try {
        // Mostrar loading
        document.getElementById('coletasPorTipo').innerHTML = '<p class="loading">⏳ Carregando dados...</p>';
        document.getElementById('ultimasColetas').innerHTML = '<p class="loading">⏳ Carregando dados...</p>';
        
        const response = await fetch(`${API_URL}/dashboard`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            const data = result.data;
            
            // Atualizar estatísticas
            document.getElementById('totalColetas').textContent = data.totalColetas;
            document.getElementById('totalQuantidade').textContent = data.totalQuantidade + ' kg';
            document.getElementById('totalPontos').textContent = data.totalPontos;
            document.getElementById('co2Evitado').textContent = data.impactoAmbiental.co2Evitado + ' kg';
            document.getElementById('arvoresEquivalentes').textContent = data.impactoAmbiental.arvoresEquivalentes;
            document.getElementById('energiaEconomizada').textContent = data.impactoAmbiental.energiaEconomizada + ' kWh';
            
            // Renderizar coletas por tipo
            renderColetasPorTipo(data.coletasPorTipo);
            
            // Renderizar últimas coletas
            renderUltimasColetas(data.ultimasColetas);
        }
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        mostrarErroConexao();
    }
}

function renderColetasPorTipo(coletasPorTipo) {
    const container = document.getElementById('coletasPorTipo');
    
    if (Object.keys(coletasPorTipo).length === 0) {
        container.innerHTML = '<p class="info">Nenhuma coleta registrada ainda</p>';
        return;
    }
    
    const total = Object.values(coletasPorTipo).reduce((sum, val) => sum + val, 0);
    
    let html = '<div class="chart-list">';
    for (const [tipo, quantidade] of Object.entries(coletasPorTipo)) {
        const percentual = ((quantidade / total) * 100).toFixed(1);
        html += `
            <div class="chart-item">
                <div>
                    <strong>${tipo}</strong>
                    <p>${quantidade.toFixed(2)} kg (${percentual}%)</p>
                </div>
                <div class="chart-bar" style="width: ${percentual}%; max-width: 200px;"></div>
            </div>
        `;
    }
    html += '</div>';
    
    container.innerHTML = html;
}

function renderUltimasColetas(coletas) {
    const container = document.getElementById('ultimasColetas');
    
    if (coletas.length === 0) {
        container.innerHTML = '<p class="info">Nenhuma coleta registrada</p>';
        return;
    }
    
    let html = '<table><thead><tr><th>Tipo</th><th>Quantidade</th><th>Data</th></tr></thead><tbody>';
    
    coletas.forEach(coleta => {
        const data = new Date(coleta.data).toLocaleDateString('pt-BR');
        html += `
            <tr>
                <td>${coleta.tipo}</td>
                <td>${coleta.quantidade} ${coleta.unidade}</td>
                <td>${data}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

function atualizarDashboard() {
    carregarDashboard();
}

// ==================== COLETAS ==================== 
async function carregarColetas() {
    try {
        document.getElementById('listaColetas').innerHTML = '<p class="loading">⏳ Carregando coletas...</p>';
        
        const response = await fetch(`${API_URL}/coletas`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            renderListaColetas(result.data);
        }
    } catch (error) {
        console.error('Erro ao carregar coletas:', error);
        document.getElementById('listaColetas').innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #ef4444;">
                <p>⚠️ Erro ao carregar coletas. Verifique se o servidor está rodando.</p>
            </div>
        `;
    }
}

function renderListaColetas(coletas) {
    const container = document.getElementById('listaColetas');
    
    if (coletas.length === 0) {
        container.innerHTML = '<p class="info">Nenhuma coleta registrada</p>';
        return;
    }
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tipo</th>
                    <th>Quantidade</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    coletas.forEach(coleta => {
        const data = new Date(coleta.data).toLocaleString('pt-BR');
        html += `
            <tr>
                <td>${coleta.id}</td>
                <td>${coleta.tipo}</td>
                <td>${coleta.quantidade} ${coleta.unidade}</td>
                <td>${data}</td>
                <td><span class="badge badge-success">${coleta.status}</span></td>
                <td>
                    <button class="btn btn-danger" onclick="deletarColeta(${coleta.id})">
                        🗑️ Excluir
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

async function handleColetaSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const botaoSubmit = form.querySelector('button[type="submit"]');
    
    // BLOQUEAR formulário imediatamente
    bloquearFormulario(form, botaoSubmit);
    mostrarInfo('Registrando coleta...');
    
    try {
        const tipo = document.getElementById('tipo').value.trim();
        const quantidade = document.getElementById('quantidade').value.trim();
        const unidade = document.getElementById('unidade').value.trim();
        const pontoId = document.getElementById('pontoId').value.trim();
        const observacoes = document.getElementById('observacoes').value.trim();
        
        // Validação
        if (!tipo) {
            mostrarErro('Selecione o tipo de material');
            document.getElementById('tipo').focus();
            desbloquearFormulario(form, botaoSubmit);
            return;
        }
        
        if (!quantidade || parseFloat(quantidade) <= 0) {
            mostrarErro('Informe uma quantidade válida');
            document.getElementById('quantidade').focus();
            desbloquearFormulario(form, botaoSubmit);
            return;
        }
        
        if (!unidade) {
            mostrarErro('Selecione a unidade');
            document.getElementById('unidade').focus();
            desbloquearFormulario(form, botaoSubmit);
            return;
        }
        
        if (!pontoId) {
            mostrarErro('Selecione um ponto de coleta');
            document.getElementById('pontoId').focus();
            desbloquearFormulario(form, botaoSubmit);
            return;
        }
        
        const coletaData = {
            tipo,
            quantidade: parseFloat(quantidade),
            unidade,
            pontoId: parseInt(pontoId),
            observacoes
        };
        
        const response = await fetch(`${API_URL}/coletas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(coletaData)
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            mostrarSucesso('✓ Coleta registrada com sucesso!');
            form.reset();
            esconderFormColeta();
            carregarColetas();
            atualizarDashboard();
        } else {
            mostrarErro(result.message || 'Erro ao registrar coleta');
            desbloquearFormulario(form, botaoSubmit);
        }
        
    } catch (error) {
        console.error('❌ Erro:', error);
        mostrarErro('Erro de conexão. Servidor está rodando?');
        desbloquearFormulario(form, botaoSubmit);
    }
}

async function deletarColeta(id) {
    if (!confirm('Tem certeza que deseja excluir esta coleta?')) {
        return;
    }
    
    mostrarInfo('Removendo coleta...');
    
    try {
        const response = await fetch(`${API_URL}/coletas/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            mostrarSucesso('✓ Coleta removida com sucesso!');
            carregarColetas();
            atualizarDashboard();
        } else {
            mostrarErro('Erro ao excluir coleta');
        }
    } catch (error) {
        console.error('❌ Erro:', error);
        mostrarErro('Erro ao excluir coleta');
    }
}

function mostrarFormColeta() {
    document.getElementById('formColeta').style.display = 'block';
    carregarPontosSelect();
}

function esconderFormColeta() {
    document.getElementById('formColeta').style.display = 'none';
}

async function carregarPontosSelect() {
    try {
        const response = await fetch(`${API_URL}/pontos`);
        const result = await response.json();
        
        if (result.success) {
            const select = document.getElementById('pontoId');
            select.innerHTML = '<option value="">Selecione...</option>';
            
            result.data.forEach(ponto => {
                const option = document.createElement('option');
                option.value = ponto.id;
                option.textContent = ponto.nome;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar pontos:', error);
    }
}

// ==================== PONTOS ==================== 
async function carregarPontos() {
    try {
        document.getElementById('pontosList').innerHTML = '<p class="loading">⏳ Carregando pontos...</p>';
        
        const response = await fetch(`${API_URL}/pontos`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            renderPontos(result.data);
        }
    } catch (error) {
        console.error('Erro ao carregar pontos:', error);
        document.getElementById('pontosList').innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #ef4444;">
                <p>⚠️ Erro ao carregar pontos. Verifique se o servidor está rodando.</p>
            </div>
        `;
    }
}

function renderPontos(pontos) {
    const container = document.getElementById('pontosList');
    
    if (pontos.length === 0) {
        container.innerHTML = '<p class="info">Nenhum ponto cadastrado</p>';
        return;
    }
    
    let html = '';
    pontos.forEach(ponto => {
        html += `
            <div class="ponto-card">
                <h4>📍 ${ponto.nome}</h4>
                <p><strong>Endereço:</strong> ${ponto.endereco}</p>
                <p><strong>Tipos aceitos:</strong> ${ponto.tipo}</p>
                <span class="ponto-badge">${ponto.status}</span>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

async function handlePontoSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const botaoSubmit = form.querySelector('button[type="submit"]');
    
    bloquearFormulario(form, botaoSubmit);
    mostrarInfo('Cadastrando ponto...');
    
    try {
        const nome = document.getElementById('nomePonto').value.trim();
        const endereco = document.getElementById('enderecoPonto').value.trim();
        const tipo = document.getElementById('tipoPonto').value.trim();
        
        if (!nome) {
            mostrarErro('Informe o nome do ponto');
            document.getElementById('nomePonto').focus();
            desbloquearFormulario(form, botaoSubmit);
            return;
        }
        
        if (!endereco) {
            mostrarErro('Informe o endereço');
            document.getElementById('enderecoPonto').focus();
            desbloquearFormulario(form, botaoSubmit);
            return;
        }
        
        if (!tipo) {
            mostrarErro('Informe os tipos aceitos');
            document.getElementById('tipoPonto').focus();
            desbloquearFormulario(form, botaoSubmit);
            return;
        }
        
        const pontoData = { nome, endereco, tipo };
        
        const response = await fetch(`${API_URL}/pontos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pontoData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            mostrarSucesso('✓ Ponto cadastrado com sucesso!');
            form.reset();
            esconderFormPonto();
            carregarPontos();
        } else {
            mostrarErro(result.message || 'Erro ao cadastrar ponto');
            desbloquearFormulario(form, botaoSubmit);
        }
        
    } catch (error) {
        mostrarErro('Erro de conexão');
        desbloquearFormulario(form, botaoSubmit);
    }
}

function mostrarFormPonto() {
    document.getElementById('formPonto').style.display = 'block';
}

function esconderFormPonto() {
    document.getElementById('formPonto').style.display = 'none';
}

// ==================== RELATÓRIOS ==================== 
async function gerarRelatorio() {
    try {
        const response = await fetch(`${API_URL}/relatorios/mensal`);
        const result = await response.json();
        
        if (result.success) {
            renderRelatorio(result.data);
        }
    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        mostrarErro('Erro ao gerar relatório');
    }
}

function renderRelatorio(dados) {
    const container = document.getElementById('relatorioMensal');
    
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    let html = `
        <div class="relatorio-header">
            <h4>📊 Relatório de ${meses[dados.mes - 1]} ${dados.ano}</h4>
        </div>
        <div class="stats-grid" style="margin-top: 1.5rem;">
            <div class="stat-card">
                <div class="stat-icon">📦</div>
                <div class="stat-info">
                    <h3>${dados.totalColetas}</h3>
                    <p>Coletas no Mês</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">⚖️</div>
                <div class="stat-info">
                    <h3>${dados.totalQuantidade} kg</h3>
                    <p>Material Coletado</p>
                </div>
            </div>
        </div>
    `;
    
    if (dados.detalhes.length > 0) {
        html += `
            <h4 style="margin-top: 2rem; margin-bottom: 1rem;">Detalhamento das Coletas</h4>
            <table>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Tipo</th>
                        <th>Quantidade</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        dados.detalhes.forEach(coleta => {
            const data = new Date(coleta.data).toLocaleDateString('pt-BR');
            html += `
                <tr>
                    <td>${data}</td>
                    <td>${coleta.tipo}</td>
                    <td>${coleta.quantidade} ${coleta.unidade}</td>
                    <td><span class="badge badge-success">${coleta.status}</span></td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
    } else {
        html += '<p class="info" style="margin-top: 1rem;">Nenhuma coleta registrada neste mês</p>';
    }
    
    container.innerHTML = html;
}

// ==================== UTILITÁRIOS ==================== 

function mostrarErroConexao() {
    const containers = ['coletasPorTipo', 'ultimasColetas'];
    containers.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #ef4444;">
                    <p style="font-size: 3rem; margin-bottom: 1rem;">⚠️</p>
                    <h3 style="color: #ef4444; margin-bottom: 0.5rem;">Erro de Conexão</h3>
                    <p style="color: #6b7280;">Não foi possível conectar ao servidor.</p>
                    <p style="color: #6b7280; margin-top: 0.5rem;">Certifique-se de que o servidor está rodando:</p>
                    ode style="background: #f3f4f6; padding: 0.5rem 1rem; border-radius: 4px; display: inline-block; margin-top: 0 0.5rem;">npm start</code>
                </div>
            `;
        }
    });
    
    // Resetar estatísticas
    document.getElementById('totalColetas').textContent = '0';
    document.getElementById('totalQuantidade').textContent = '0 kg';
    document.getElementById('totalPontos').textContent = '0';
    document.getElementById('co2Evitado').textContent = '0 kg';
    document.getElementById('arvoresEquivalentes').textContent = '0';
    document.getElementById('energiaEconomizada').textContent = '0 kWh';
}
