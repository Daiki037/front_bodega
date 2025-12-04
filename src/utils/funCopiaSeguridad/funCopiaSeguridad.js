import axios from 'axios'

const API = process.env.REACT_APP_API

// Función para obtener la lista de copias de seguridad
export const fetchBackups = async () => {
  try {
    const response = await axios.get(`${API}/listarBackups`)
    return response
  } catch (error) {
    console.error('Error al obtener la lista de copias de seguridad:', error)
  }
}
