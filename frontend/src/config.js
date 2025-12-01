// Configuração da API
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api`
    : 'http://localhost:3002/api'
}

console.log('🔗 API URL:', API_CONFIG.baseURL)
