import axios from 'axios'

const API = process.env.REACT_APP_API

export const fetchFileNames = async () => {
  try {
    const response = await axios.get(`${API}/nameFiles`)
    return response.data
  } catch (error) {
    console.error('Hubo un error al recuperar los archivos!', error)
    return []
  }
}

export const fetchFileContent = async (selectedFileName) => {
  try {
    const response = await axios.get(`${API}/fileContent/${selectedFileName}`)
    return response.data
  } catch (error) {
    console.error('Error al obtener el contenido del archivo:', error)
    return []
  }
}

export const transformData = (content) => {
  if (!content || content.length === 0) {
    console.log('El archivo no tiene contenido.')
    return []
  }

  return content.map((item) => {
    let transformedItem = {}
    // Asignar el primer atributo numérico que se encuentre a 'codigo'
    let codigoKey = Object.keys(item).find(
      (key) => key.includes('cod_') || key.includes('id')
    )
    if (codigoKey) {
      transformedItem['codigo'] = String(item[codigoKey])
    }
    // Asignar el primer atributo de texto que se encuentre a 'nombre'
    let nombreKey = Object.keys(item).find(
      (key) => key.includes('nom_') || key.includes('name')
    )
    if (nombreKey) {
      transformedItem['nombre'] = item[nombreKey]
    }
    // Si no se encuentra un código, pero hay un nombre, puedes asignar nombre a codigo
    if (!transformedItem['codigo'] && transformedItem['nombre']) {
      transformedItem['codigo'] = transformedItem['nombre']
      transformedItem['nombre'] = ''
    }
    return transformedItem
  })
}
