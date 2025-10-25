# 🔧 Guia de Solução de Problemas - EcoTrack

## ❌ Erro: "Erro ao carregar dashboard"

### 🎯 Causa Principal
Este erro ocorre quando o **servidor Node.js não está rodando**. A aplicação precisa do backend para funcionar.

### ✅ Solução Passo a Passo

#### 1. Verifique se você está na pasta correta
```bash
# No terminal, navegue até a pasta do projeto
cd ecotrack

# Verifique se está na pasta correta (deve listar os arquivos)
ls
# Ou no Windows
dir
```

Você deve ver os arquivos: `server.js`, `package.json`, `README.md`, etc.

#### 2. Instale as dependências (se ainda não instalou)
```bash
npm install
```

**Aguarde a instalação concluir!** Isso pode levar alguns minutos.

#### 3. Inicie o servidor
```bash
npm start
```

Você deve ver:
```
🌱 EcoTrack rodando em http://localhost:3000
📊 API disponível em http://localhost:3000/api
```

#### 4. Acesse a aplicação
Abra seu navegador e vá para:
```
http://localhost:3000
```

**⚠️ IMPORTANTE**: Não abra o arquivo `index.html` diretamente! Use o endereço acima.

---

## 🚨 Outros Problemas Comuns

### Problema: "npm não é reconhecido"
**Causa**: Node.js não está instalado

**Solução**:
1. Baixe e instale o Node.js de: https://nodejs.org
2. Escolha a versão LTS (recomendada)
3. Feche e reabra o terminal
4. Teste: `node --version`

---

### Problema: "Porta 3000 já está em uso"
**Causa**: Outra aplicação está usando a porta 3000

**Solução** - Use outra porta:
```bash
# Windows (CMD)
set PORT=3001 && npm start

# Windows (PowerShell)
$env:PORT=3001; npm start

# Mac/Linux
PORT=3001 npm start
```

---

### Problema: Erro ao instalar dependências
```bash
# Limpar cache do npm
npm cache clean --force

# Deletar node_modules e reinstalar
rm -rf node_modules  # Mac/Linux
rmdir /s /q node_modules  # Windows

npm install
```

---

## 📋 Checklist Rápido

- [ ] Node.js instalado? (`node --version`)
- [ ] Na pasta correta? (`ls` mostra server.js?)
- [ ] Executou `npm install`?
- [ ] Executou `npm start`?
- [ ] Acessando `http://localhost:3000`?
- [ ] NÃO abrindo index.html diretamente?

---

**🎯 Lembre-se**: Sempre mantenha o terminal com `npm start` rodando enquanto usa a aplicação!
