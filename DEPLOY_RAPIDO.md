# ⚡ DEPLOY RÁPIDO - Render + Netlify

## 🚀 EM 3 ETAPAS PRINCIPAIS:

### 1️⃣ GITHUB (5 min)
```bash
cd ecotrack
git init
git add .
git commit -m "Deploy inicial"
git remote add origin https://github.com/SEU_USUARIO/ecotrack.git
git push -u origin main
```

### 2️⃣ RENDER - Backend (5 min)
1. https://render.com → Login com GitHub
2. New + → Web Service
3. Conectar repositório `ecotrack`
4. Configurar:
   - Name: `ecotrack-backend`
   - Build: `npm install`
   - Start: `npm start`
   - Plan: **Free**
5. Create Web Service
6. ⏳ Aguardar deploy
7. ✅ Copiar URL: `https://ecotrack-backend-XXXXX.onrender.com`

### 3️⃣ CONFIGURAR + NETLIFY - Frontend (5 min)

**A) Atualizar config.js:**
```javascript
// public/config.js - linha 10
const PROD_API_URL = 'https://ecotrack-backend-XXXXX.onrender.com/api';
// ☝️ Cole sua URL do Render aqui!
```

**B) Atualizar GitHub:**
```bash
git add public/config.js
git commit -m "Adiciona URL do backend"
git push
```

**C) Deploy no Netlify:**
1. https://netlify.com → Login com GitHub
2. Add new site → Import from GitHub
3. Escolher repositório `ecotrack`
4. Configurar:
   - Base directory: (vazio)
   - Build command: (vazio)
   - Publish directory: `public`
5. Deploy site
6. ✅ Pronto! Site no ar!

---

## 📝 URLs Finais

Você terá:
- **Backend**: `https://ecotrack-backend-XXXXX.onrender.com`
- **Frontend**: `https://XXXXX.netlify.app`

---

## ✅ Testar

1. Abra o frontend no Netlify
2. Deve carregar o dashboard
3. Criar uma coleta
4. Ver estatísticas

---

## 🆘 Problemas?

Leia: **DEPLOY_RENDER_NETLIFY.md** (guia completo)

---

**Tempo total: ~15 minutos** ⏱️
