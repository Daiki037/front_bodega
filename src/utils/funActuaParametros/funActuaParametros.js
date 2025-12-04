// src/utils/apiUtils.js
import axios from 'axios'

const API = process.env.REACT_APP_API

// Función para cargar datos de nameParameters
export const loadData = async () => {
  try {
    const response = await axios.get(`${API}/nameParameters`)
    return response.data
  } catch (error) {
    console.error('Error al cargar el archivo nameParameters:', error)
    throw error
  }
}

// Función para cargar datos de fuentes
export const loadDataFuentes = async () => {
  try {
    const response = await axios.get(`${API}/fuentes`)
    return response.data
  } catch (error) {
    console.error('Error al cargar el archivo fuentes:', error)
    throw error
  }
}
