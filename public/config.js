// Configuração da API
// URL do backend no Render
const PROD_API_URL = 'https://ecotrack-g11t.onrender.com/api';

// URL para desenvolvimento local
const DEV_API_URL = 'http://localhost:3000/api';

// Detecta automaticamente o ambiente
const API_URL = window.location.hostname === 'localhost' 
    ? DEV_API_URL 
    : PROD_API_URL;

console.log('🌍 Ambiente detectado:', window.location.hostname);
console.log('🔗 Conectando à API:', API_URL);