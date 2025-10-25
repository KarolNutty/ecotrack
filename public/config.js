// Configuração da API
// IMPORTANTE: Depois do deploy no Render, atualize a API_URL abaixo!

// Para desenvolvimento local
const DEV_API_URL = 'http://localhost:3000/api';

// Para produção (Render)
// Substitua pela URL do seu backend no Render após o deploy!
// Exemplo: 'https://ecotrack-backend.onrender.com/api'
const PROD_API_URL = 'https://SEU-APP-AQUI.onrender.com/api';

// Detecta automaticamente o ambiente
const API_URL = window.location.hostname === 'localhost' 
    ? DEV_API_URL 
    : PROD_API_URL;

console.log('🌍 Conectando à API:', API_URL);
