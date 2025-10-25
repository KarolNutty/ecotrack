# 🌱 EcoTrack - Sistema de Gestão Ambiental

Sistema completo para monitoramento e gestão de coleta de resíduos recicláveis, desenvolvido com Node.js, Express e vanilla JavaScript.

## ⚠️ IMPORTANTE - Leia Primeiro!

**Se você está vendo erros ao acessar a aplicação**, leia isto:

1. ✅ O servidor Node.js **DEVE** estar rodando
2. ✅ Execute `npm install` e depois `npm start` no terminal
3. ✅ Acesse via `http://localhost:3000` (não abra o arquivo HTML diretamente!)
4. ❌ NÃO abra o arquivo `index.html` diretamente no navegador

**Vendo "Erro ao carregar dashboard"?** 👉 Leia [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

**Verificar se tudo está OK?** Execute: `npm run check`

---

## 📋 Sobre o Projeto

EcoTrack é uma plataforma web que permite o gerenciamento eficiente de coletas de materiais recicláveis, pontos de coleta e geração de relatórios de impacto ambiental. Desenvolvido como projeto de demonstração para vaga de Desenvolvedor Full Stack Júnior.

### ✨ Funcionalidades

- **Dashboard Interativo**: Visualização em tempo real de métricas ambientais
- **Gestão de Coletas**: Registro, edição e exclusão de coletas de materiais
- **Pontos de Coleta**: Cadastro e visualização de locais de coleta
- **Relatórios**: Geração de relatórios mensais com estatísticas
- **Impacto Ambiental**: Cálculo automático de CO₂ evitado e árvores preservadas
- **API REST**: Backend completo com endpoints documentados

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Ambiente de execução JavaScript
- **Express.js** - Framework web minimalista
- **CORS** - Middleware para controle de acesso
- **Body Parser** - Parser de requisições HTTP
- **dotenv** - Gerenciamento de variáveis de ambiente

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna e responsiva
- **JavaScript (Vanilla)** - Lógica e integração com API

## 📦 Instalação

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

### Passos

1. **Extraia o projeto**
   ```bash
   # Extraia o arquivo ZIP e navegue até a pasta
   cd ecotrack
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente (opcional)**
   ```bash
   cp .env.example .env
   # Edite o arquivo .env conforme necessário
   ```

4. **Inicie o servidor**
   ```bash
   npm start
   ```

   Ou para desenvolvimento com auto-reload:
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   ```
   http://localhost:3000
   ```

## 🚀 Como Usar

### Interface Web

1. **Dashboard**: Visualize estatísticas gerais e últimas coletas
2. **Coletas**: Registre novas coletas e gerencie o histórico
3. **Pontos**: Cadastre e visualize pontos de coleta
4. **Relatórios**: Gere relatórios mensais detalhados

### API Endpoints

#### Coletas

- **GET** `/api/coletas` - Lista todas as coletas
- **GET** `/api/coletas/:id` - Busca coleta por ID
- **POST** `/api/coletas` - Cria nova coleta
  ```json
  {
    "tipo": "Papel",
    "quantidade": 50.5,
    "unidade": "kg",
    "pontoId": 1,
    "observacoes": "Coleta realizada com sucesso"
  }
  ```
- **PUT** `/api/coletas/:id` - Atualiza coleta
- **DELETE** `/api/coletas/:id` - Remove coleta

#### Pontos de Coleta

- **GET** `/api/pontos` - Lista todos os pontos
- **POST** `/api/pontos` - Cria novo ponto
  ```json
  {
    "nome": "EcoPonto Norte",
    "endereco": "Rua Example, 789",
    "tipo": "Papel, Plástico"
  }
  ```

#### Dashboard

- **GET** `/api/dashboard` - Retorna estatísticas gerais

#### Relatórios

- **GET** `/api/relatorios/mensal` - Gera relatório do mês atual

#### Health Check

- **GET** `/api/health` - Verifica status do servidor

## 📁 Estrutura do Projeto

```
ecotrack/
├── public/              # Arquivos frontend
│   ├── index.html      # Página principal
│   ├── styles.css      # Estilos CSS
│   └── app.js          # Lógica JavaScript
├── server.js           # Servidor Node.js + API
├── package.json        # Dependências do projeto
├── .env.example        # Exemplo de variáveis de ambiente
└── README.md          # Documentação
```

## 🎨 Recursos Visuais

- Design moderno e responsivo
- Interface intuitiva e amigável
- Animações suaves
- Compatível com dispositivos móveis
- Tema em tons de verde (sustentabilidade)

## 🔄 Próximas Melhorias

- [ ] Integração com banco de dados (MongoDB/PostgreSQL)
- [ ] Autenticação de usuários
- [ ] Upload de imagens das coletas
- [ ] Integração com Google Maps para pontos de coleta
- [ ] Exportação de relatórios em PDF
- [ ] Dashboard com gráficos interativos (Chart.js)
- [ ] Notificações em tempo real
- [ ] Integração com Google Cloud Platform

## 📝 Observações para a Vaga

Este projeto demonstra:

✅ **JavaScript** - Uso de ES6+, async/await, manipulação do DOM
✅ **Node.js** - Servidor Express com API REST completa
✅ **HTML5 e CSS3** - Semântica moderna e design responsivo
✅ **Boas Práticas** - Código limpo, organizado e documentado
✅ **Gestão Ambiental** - Foco em sustentabilidade e impacto positivo

## 🤝 Contribuindo

Este é um projeto de portfólio, mas sugestões são bem-vindas!

## 📄 Licença

MIT License - Sinta-se livre para usar este projeto como base para seus estudos.

## 👨‍💻 Desenvolvedor

Desenvolvido como projeto de demonstração para a vaga de Desenvolvedor Full Stack Júnior na Recicla.se

---

**🌍 Juntos por um planeta mais sustentável!** 🌱
