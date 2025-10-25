# 🚀 DEPLOY PROFISSIONAL: Render + Netlify

## 🎯 Arquitetura
- **Backend (Node.js)** → Render (sempre ligado, gratuito)
- **Frontend (HTML/CSS/JS)** → Netlify (CDN global, super rápido, gratuito)

## ⏱️ Tempo Total: ~15 minutos

---

# PARTE 1: SUBIR CÓDIGO NO GITHUB

## Passo 1: Criar conta no GitHub (se não tiver)
1. Vá em: https://github.com
2. Clique em **"Sign up"**
3. Complete o registro (gratuito)

## Passo 2: Criar novo repositório
1. Clique no **+** (canto superior direito)
2. Selecione **"New repository"**
3. Configure:
   - **Nome**: `ecotrack`
   - **Visibilidade**: ✅ Public (público)
   - **NÃO** marque "Add README"
4. Clique em **"Create repository"**

## Passo 3: Subir o código (Terminal/CMD)

```bash
# 1. Entre na pasta do projeto
cd ecotrack

# 2. Inicialize o git
git init

# 3. Adicione todos os arquivos
git add .

# 4. Faça o commit
git commit -m "Deploy EcoTrack - Backend + Frontend"

# 5. Conecte com GitHub (copie a URL do seu repositório)
git remote add origin https://github.com/SEU_USUARIO/ecotrack.git

# 6. Envie o código
git branch -M main
git push -u origin main
```

**⚠️ IMPORTANTE**: 
- Troque `SEU_USUARIO` pelo seu username do GitHub!
- Se pedir login, use suas credenciais do GitHub

✅ **Código está no GitHub!**

---

# PARTE 2: DEPLOY DO BACKEND NO RENDER

## Passo 1: Criar conta no Render
1. Vá em: https://render.com
2. Clique em **"Get Started"**
3. Faça login com **GitHub** (mais fácil)
4. Autorize o Render a acessar seus repositórios

## Passo 2: Criar Web Service
1. No dashboard do Render, clique em **"New +"**
2. Selecione **"Web Service"**
3. Encontre o repositório **ecotrack** e clique em **"Connect"**

## Passo 3: Configurar o serviço

Preencha os campos:

```
Name: ecotrack-backend
Region: Oregon (US West) - ou mais próximo
Branch: main
Root Directory: (deixe vazio)
Runtime: Node
Build Command: npm install
Start Command: npm start
```

## Passo 4: Escolher plano
- **Plan**: Selecione **"Free"** (0$/mês)
- ✅ Clique em **"Create Web Service"**

## Passo 5: Aguardar deploy
- ⏳ Aguarde 2-3 minutos (instalação de dependências)
- ✅ Quando aparecer **"Live"**, está pronto!
- 🌐 Copie a URL: `https://ecotrack-backend-XXXXX.onrender.com`

## Passo 6: Testar o backend
Abra no navegador:
```
https://ecotrack-backend-XXXXX.onrender.com/api/health
```

✅ Deve retornar:
```json
{
  "status": "OK",
  "timestamp": "...",
  "uptime": ...
}
```

✅ **Backend está NO AR e funcionando!**

**⚠️ COPIE E GUARDE A URL DO BACKEND!** Você vai precisar!

---

# PARTE 3: ATUALIZAR FRONTEND COM URL DO BACKEND

Antes de fazer deploy no Netlify, precisamos configurar a URL do backend!

## Passo 1: Editar config.js localmente

1. Abra o arquivo `public/config.js` no VS Code
2. Encontre esta linha:
```javascript
const PROD_API_URL = 'https://SEU-APP-AQUI.onrender.com/api';
```

3. **SUBSTITUA** pela URL real do seu backend (que você copiou):
```javascript
const PROD_API_URL = 'https://ecotrack-backend-XXXXX.onrender.com/api';
```

4. **Salve o arquivo!**

## Passo 2: Atualizar no GitHub

```bash
# Na pasta do projeto
git add public/config.js
git commit -m "Configura URL do backend para produção"
git push
```

✅ **Frontend configurado para conectar no backend!**

---

# PARTE 4: DEPLOY DO FRONTEND NO NETLIFY

## Passo 1: Criar conta no Netlify
1. Vá em: https://netlify.com
2. Clique em **"Sign up"**
3. Faça login com **GitHub** (recomendado)
4. Autorize o Netlify

## Passo 2: Criar novo site
1. Clique em **"Add new site"**
2. Selecione **"Import an existing project"**
3. Escolha **"Deploy with GitHub"**
4. Selecione o repositório **ecotrack**

## Passo 3: Configurar build

```
Branch to deploy: main
Base directory: (deixe vazio)
Build command: (deixe vazio)
Publish directory: public
```

## Passo 4: Deploy
- Clique em **"Deploy site"**
- ⏳ Aguarde 1-2 minutos
- ✅ Quando terminar, clique na URL gerada

🎉 **SEU SITE ESTÁ NO AR!**

Você vai ter algo como: `https://seu-site-XXXXX.netlify.app`

---

# PARTE 5: CONFIGURAÇÕES OPCIONAIS

## Mudar nome do site no Netlify
1. No dashboard do Netlify
2. **Site settings** → **Change site name**
3. Escolha: `ecotrack-meunome` (se disponível)
4. Agora seu site será: `https://ecotrack-meunome.netlify.app`

## Adicionar domínio próprio (opcional)
1. Se você tem um domínio (ex: `meusite.com`)
2. No Netlify: **Domain settings** → **Add custom domain**
3. Siga as instruções para configurar DNS

---

# ✅ CHECKLIST FINAL

Verifique se tudo está funcionando:

- [ ] Backend no Render está "Live"
- [ ] URL do backend responde: `/api/health`
- [ ] `config.js` tem a URL correta do backend
- [ ] Código foi atualizado no GitHub
- [ ] Frontend está no ar no Netlify
- [ ] Site abre sem erros
- [ ] Dashboard carrega as estatísticas
- [ ] Consegue criar novas coletas
- [ ] Consegue criar novos pontos

---

# 🎉 PARABÉNS!

Seu sistema está **100% na nuvem** e funcionando 24/7!

## 🌐 URLs Finais:
- **Backend API**: `https://ecotrack-backend-XXXXX.onrender.com`
- **Frontend**: `https://seu-site.netlify.app`

---

# 🔧 MANUTENÇÃO E ATUALIZAÇÕES

## Como fazer atualizações?

Sempre que você modificar o código:

```bash
# 1. Faça as alterações no código
# 2. Salve os arquivos
# 3. Commit e push
git add .
git commit -m "Descrição da mudança"
git push
```

✅ O Render e Netlify vão fazer **deploy automático**!

---

# 🆘 PROBLEMAS COMUNS

## Backend hiberna após 15min sem uso (plano free)
**Normal no plano gratuito do Render!**
- Primeira requisição após hibernar demora ~30 segundos
- Depois funciona normalmente
- **Solução**: Upgrade para plano pago ($7/mês)

## Erro de CORS
**Causa**: URL do backend não configurada corretamente
**Solução**: 
1. Verifique `public/config.js`
2. Certifique-se que tem `/api` no final
3. Faça push para o GitHub

## Site não carrega dados
**Causa**: Backend não está respondendo
**Verificar**:
1. Acesse: `https://seu-backend.onrender.com/api/health`
2. Se não responder, veja logs no dashboard do Render
3. Backend pode estar hibernando (aguarde 30seg)

---

# 📚 RECURSOS ÚTEIS

## Ver logs do backend (Render)
1. Dashboard do Render
2. Clique no seu serviço
3. Aba **"Logs"**

## Ver logs do frontend (Netlify)
1. Dashboard do Netlify
2. Clique no seu site
3. Aba **"Deploys"** → Clique no deploy → **"Deploy log"**

## Forçar novo deploy
**Render**: Settings → Manual Deploy
**Netlify**: Deploys → Trigger deploy

---

# 🎓 VOCÊ APRENDEU:

✅ Git e GitHub
✅ Deploy de backend Node.js
✅ Deploy de frontend estático
✅ Separação de ambientes (dev/prod)
✅ Configuração de variáveis de ambiente
✅ Deploy contínuo (CI/CD)
✅ Arquitetura de aplicação web moderna

---

**Desenvolvido com 💚 para um futuro sustentável!**

**Dúvidas?** Releia este guia passo a passo!
