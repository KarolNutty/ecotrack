const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Criar banco de dados (arquivo .db)
const dbPath = path.resolve(__dirname, 'ecotrack.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Erro ao conectar ao banco:', err);
    } else {
        console.log('✅ Conectado ao banco SQLite');
    }
});

// Criar tabelas se não existirem
db.serialize(() => {
    // Tabela de coletas
    db.run(`
        CREATE TABLE IF NOT EXISTS coletas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT NOT NULL,
            tipo_material TEXT NOT NULL,
            quantidade REAL NOT NULL,
            ponto_coleta TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Tabela de pontos
    db.run(`
        CREATE TABLE IF NOT EXISTS pontos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            endereco TEXT NOT NULL,
            tipo TEXT NOT NULL,
            status TEXT DEFAULT 'ativo'
        )
    `);

    // Inserir pontos iniciais (se não existirem)
    db.get('SELECT COUNT(*) as count FROM pontos', (err, row) => {
        if (!err && row.count === 0) {
            const pontosIniciais = [
                ['EcoPonto Centro', 'Rua das Flores, 123 - Centro', 'Papel, Plástico, Metal', 'ativo'],
                ['EcoPonto Bairro Verde', 'Av. Sustentável, 456 - Bairro Verde', 'Vidro, Eletrônicos', 'ativo'],
                ['EcoPonto Industrial', 'Rua da Indústria, 789 - Zona Industrial', 'Todos os tipos', 'ativo']
            ];

            const stmt = db.prepare('INSERT INTO pontos (nome, endereco, tipo, status) VALUES (?, ?, ?, ?)');
            pontosIniciais.forEach(ponto => stmt.run(ponto));
            stmt.finalize();
            
            console.log('✅ Pontos de coleta iniciais criados');
        }
    });
});

// Funções auxiliares para facilitar queries
const dbFunctions = {
    // GET todos
    all: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    // GET um
    get: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    // INSERT/UPDATE/DELETE
    run: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, changes: this.changes });
            });
        });
    }
};

module.exports = { db, ...dbFunctions };