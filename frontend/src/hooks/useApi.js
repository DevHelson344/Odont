import { useState, useEffect } from 'react'

// Detecta automaticamente a URL da API
const getApiBase = () => {
  // 1. Tenta usar variável de ambiente
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL}/api`
  }
  
  // 2. Em produção, usa URL relativa (proxy)
  if (import.meta.env.PROD) {
    return '/api'
  }
  
  // 3. Em desenvolvimento, usa localhost
  return 'http://localhost:3002/api'
}

const API_BASE = getApiBase()

console.log('🔗 API Base URL:', API_BASE)

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

export function useApi(endpoint, dependencies = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, dependencies)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: getAuthHeaders()
      })
      if (!response.ok) throw new Error('Erro na requisição')
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refetch: fetchData }
}

export async function apiPost(endpoint, data) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(data)
  })
  return response.json()
}

export async function apiPut(endpoint, data) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(data)
  })
  return response.json()
}

export async function apiDelete(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  })
  return response.json()
}