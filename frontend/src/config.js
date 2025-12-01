// Configuração da API
export const API_CONFIG = {
  // Força usar Railway em produção
  baseURL: import.meta.env.MODE === 'production' 
    ? 'https://odont-production.up.railway.app/api'
    : 'http://localhost:3002/api'
}

console.log('⚙️ Config Mode:', import.meta.env.MODE)
console.log('🔗 API URL:', API_CONFIG.baseURL)
