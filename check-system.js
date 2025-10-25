#!/usr/bin/env node

// Script de Verificação do EcoTrack
console.log('\n🔍 Verificando instalação do EcoTrack...\n');

const fs = require('fs');
const http = require('http');

let problemas = 0;
let sucessos = 0;

function sucesso(msg) {
    console.log(`✅ ${msg}`);
    sucessos++;
}

function erro(msg) {
    console.log(`❌ ${msg}`);
    problemas++;
}

function aviso(msg) {
    console.log(`⚠️  ${msg}`);
}

// 1. Verificar Node.js
console.log('1. Verificando Node.js...');
const nodeVersion = process.version;
sucesso(`Node.js ${nodeVersion} instalado`);

// 2. Verificar arquivos
console.log('\n2. Verificando arquivos do projeto...');
const arquivosNecessarios = [
    'server.js',
    'package.json',
    'public/index.html',
    'public/app.js',
    'public/styles.css'
];

arquivosNecessarios.forEach(arquivo => {
    if (fs.existsSync(arquivo)) {
        sucesso(`Arquivo encontrado: ${arquivo}`);
    } else {
        erro(`Arquivo não encontrado: ${arquivo}`);
    }
});

// 3. Verificar node_modules
console.log('\n3. Verificando dependências...');
if (fs.existsSync('node_modules')) {
    sucesso('Pasta node_modules encontrada');
} else {
    erro('Pasta node_modules não encontrada');
    aviso('Execute: npm install');
}

// 4. Verificar servidor
console.log('\n4. Verificando servidor...');
const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/health',
    method: 'GET',
    timeout: 2000
};

const req = http.request(options, (res) => {
    if (res.statusCode === 200) {
        sucesso('Servidor está rodando na porta 3000');
        console.log('\n🎉 TUDO PRONTO! Acesse: http://localhost:3000\n');
    } else {
        erro(`Servidor respondeu com código: ${res.statusCode}`);
    }
    mostrarResumo();
});

req.on('error', (e) => {
    erro('Servidor não está rodando');
    aviso('Execute: npm start');
    console.log('\n💡 Passos para iniciar:');
    console.log('   1. Abra um terminal');
    console.log('   2. Navegue até a pasta do projeto (cd ecotrack)');
    console.log('   3. Execute: npm install (se ainda não fez)');
    console.log('   4. Execute: npm start');
    console.log('   5. Acesse: http://localhost:3000\n');
    mostrarResumo();
});

req.on('timeout', () => {
    req.destroy();
    erro('Timeout ao conectar no servidor');
    mostrarResumo();
});

req.end();

function mostrarResumo() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMO:');
    console.log(`   ✅ Sucessos: ${sucessos}`);
    console.log(`   ❌ Problemas: ${problemas}`);
    console.log('='.repeat(50) + '\n');
    
    if (problemas > 0) {
        console.log('📚 Leia o arquivo TROUBLESHOOTING.md para ajuda detalhada\n');
    }
}
