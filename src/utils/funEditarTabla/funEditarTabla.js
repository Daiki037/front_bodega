import axios from 'axios'
import Swal from 'sweetalert2'

const API = process.env.REACT_APP_API

const filterData = (data, filters) => {
  return data.filter((row) => {
    return (
      String(row.codigo).toLowerCase().includes(filters.toLowerCase()) ||
      String(row.nombre).toLowerCase().includes(filters.toLowerCase())
    )
  })
}

// Función para ocultar el mensaje de validación después de un tiempo
const timeMessage = (time = 2000) => {
  setTimeout(() => {
    const validationMessage = Swal.getValidationMessage()

    if (validationMessage) {
      validationMessage.style.display = 'none'
    }
  }, time)
}

//Valida que el codigo no tenga caracteres especiales
const validateCodigo = (codigo) => {
  const regex = /^[a-zA-Z0-9]+$/
  return regex.test(codigo)
}

// Cargar opciones para los selects al montar el componente

const fetchSelectOptions = async (fileName, content) => {
  if (!fileName || fileName.trim() === '') {
    throw new Error('Nombre de archivo invalido')
  }

  try {
    if (!content || content.length === 0) {
      throw new Error('El contenido está vacío o es inválido')
    }
    const baseFileName = fileName.split('.')[0]
    const dynamicKeys = Object.keys(content[0]).filter(
      (key) =>
        !key.startsWith(`cod_${baseFileName}`) &&
        !key.startsWith(`nom_${baseFileName}`)
    )

    const options = {}
    // Promisificar las peticiones para realizarlas en paralelo
    const promises = dynamicKeys.map(async (key) => {
      let parame = key.split('_')[1]?.trim()

      if (!parame) {
        console.warn(`El parámetro es inválido para la clave: ${key}`)
        return { [key]: null }
      }

      try {
        let response = await axios.get(`${API}/getSelectOptions/${parame}`)
        return { [key]: response.data }
      } catch (error) {
        console.error(`Error fetching options for ${key}:`, error.message)
        return { [key]: null } // O manejar el error de otra manera
      }
    })

    // Esperar a que todas las promesas se resuelvan
    const results = await Promise.all(promises)

    // Combinar los resultados en un solo objeto
    results.forEach((result) => {
      Object.assign(options, result)
    })

    return options
  } catch (error) {
    console.error('Error fetching select options:', error)
    throw new error('Error en la función fetchSelectOptions') // Re-lanzar el error para que pueda ser capturado en niveles superiores
  }
}

//Crea los campos adicionales cuando el diccionario supera a los dos
const getAdditionalFields = (content, fileName, selectOptions, row = {}) => {
  const masDosAtributos = content && Object.keys(content[0] || {}).length > 2

  if (masDosAtributos) {
    const baseFileName = fileName.split('.')[0]
    return Object.keys(content[0])
      .map((key) => {
        if (key !== `cod_${baseFileName}` && key !== `nom_${baseFileName}`) {
          const options = selectOptions[key] || []

          // Obtener el valor actual del registro que se está editando
          const currentValue = row[key] || ''

          const selectOptionsMarkup = options
            .map(
              (option) =>
                `<option value="${option.codigo}" ${
                  option.codigo === currentValue ? 'selected' : ''
                }>${option.codigo}-${option.nombre}</option>`
            )
            .join('')

          return `
          <select id="${key}" class="swal2-select">
            <option value="">${key}</option>
            ${selectOptionsMarkup}
          </select>`
        }
        return ''
      })
      .join('')
  }
  return ''
}

const getFormData = (masDosAtributos, fileName, content) => {
  const codigo = Swal.getPopup().querySelector('#codigo').value
  const nombre = Swal.getPopup().querySelector('#nombre').value
  const additionalData = {}
  if (masDosAtributos) {
    const baseFileName = fileName.split('.')[0]
    Object.keys(content[0]).forEach((key) => {
      if (key !== `cod_${baseFileName}` && key !== `nom_${baseFileName}`) {
        additionalData[key] = Swal.getPopup().querySelector(`#${key}`).value
      }
    })
  }
  return { codigo, nombre, additionalData }
}

const validateForm = (formData, isEditing, data) => {
  if (!formData.nombre && !formData.codigo && formData.additionalData) {
    Swal.showValidationMessage('Los campos no deben estar vacios')
    timeMessage()
    return false
  }

  if (isEditing) {
    if (!formData.codigo || !validateCodigo(formData.codigo)) {
      Swal.showValidationMessage(
        'El código no debe estar vacío y no debe contener espacios ni caracteres especiales.'
      )
      timeMessage()
      return false
    }

    if (isCodigoRepetido(formData.codigo, data)) {
      Swal.showValidationMessage('El código ya existe')
      timeMessage()
      return false
    }
  }

  if (!formData.nombre) {
    Swal.showValidationMessage('El campo nombre no debe estar vacío.')
    timeMessage()
    return false
  }

  if (formData.additionalData) {
    for (const [key, value] of Object.entries(formData.additionalData)) {
      if (!value) {
        Swal.showValidationMessage(`El campo ${key} no debe estar vacío.`)
        timeMessage()
        return false
      }
    }
  }

  return true
}

const isCodigoRepetido = (codigo, data) => {
  return data.some((row) => {
    return (
      String(row.codigo)
        .trim()
        .localeCompare(String(codigo).trim(), undefined, {
          sensitivity: 'base'
        }) === 0
    )
  })
}

const addNewRow = async (
  codigo,
  nombre,
  additionalData,
  fileName,
  content,
  data,
  setData
) => {
  const baseFileName = fileName.split('.')[0]
  const hasMoreThanTwoAttributes =
    Object.keys(content[0]).filter(
      (key) => key !== `cod_${baseFileName}` && key !== `nom_${baseFileName}`
    ).length > 0
  const newRow = { codigo: String(codigo), nombre }
  const updatedData = [...data, newRow]
  const isSaved = await saveChanges(
    codigo,
    nombre,
    hasMoreThanTwoAttributes ? additionalData : {},
    fileName
  )
  if (isSaved) {
    setData(updatedData)
  } else {
    Swal.fire({
      title: 'Error',
      text: 'Error al agregar la nueva fila. Por favor, intente nuevamente.',
      icon: 'error',
      showConfirmButton: false,
      timer: 2000
    })
  }
}

//Guarda los cambios que se realicen en la tabla
const saveChanges = async (codigo, nombre, additionalData, fileName) => {
  try {
    const baseFileName = fileName.split('.')[0].trim()
    const payload = { codigo, nombre, ...additionalData }
    console.log('el base file name:', baseFileName)
    await axios.post(`${API}/saveJson/${baseFileName}`, { data: payload })

    Swal.fire({
      title: 'Éxito',
      text: 'Datos guardados exitosamente.',
      icon: 'success',
      showConfirmButton: false,
      timer: 2000
    })

    return true
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: 'Error al guardar los datos. Por favor, intente nuevamente.',
      icon: 'error',
      showConfirmButton: false,
      timer: 2000
    })
    return false
  }
}

export {
  filterData,
  timeMessage,
  validateCodigo,
  fetchSelectOptions,
  getAdditionalFields,
  getFormData,
  validateForm,
  isCodigoRepetido,
  addNewRow,
  saveChanges
}
