import Swal from 'sweetalert2'
import axios from 'axios'
import {
  getAdditionalFields,
  getFormData,
  isCodigoRepetido,
  validateForm,
  timeMessage,
  addNewRow,
  saveChanges
} from './funEditarTabla'

const API = process.env.REACT_APP_API

//Funcion para crear un nuevo registro
const showAddModal = async (
  content,
  fileName,
  selectOptions,
  data,
  setData
) => {
  // Obtener los campos adicionales usando la función pasada como argumento
  const masDosAtributos = getAdditionalFields(content, fileName, selectOptions)

  // Configuración y presentación de la ventana modal de SweetAlert
  Swal.fire({
    title: 'Agregar nuevo registro',
    html: `
      <input type="text" id="codigo" class="swal2-input" placeholder="Código">
      <input type="text" id="nombre" class="swal2-input" placeholder="Nombre">
      ${masDosAtributos}
    `,
    confirmButtonText: 'Agregar',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    focusConfirm: false,
    preConfirm: () => {
      const formData = getFormData(masDosAtributos, fileName, content)
      const isValidateForm = validateForm(formData, true, data)

      // Validaciones de código único y de formulario
      if (isCodigoRepetido(formData.codigo, data)) {
        Swal.showValidationMessage('El código ya existe, elija uno diferente.')
        timeMessage()
        return null
      }

      if (!isValidateForm) {
        return null
      }
      return formData
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const { codigo, nombre, additionalData } = result.value
      addNewRow(
        codigo,
        nombre,
        additionalData,
        fileName,
        content,
        data,
        setData
      )
    }
  })
}

function generateSelectOptions(data) {
  // Ejemplo asumiendo que selectData es un array de objetos con propiedades 'value' y 'label'
  return data
    .map((option) => {
      return `<select>
      <option value="${option.value}">${option.label}</option>
      </select>`
    })
    .join('')
}

//Funcion para editar los datos de la tabla
const handleEdit = async (
  row,
  content,
  fileName,
  selectOptions,
  data,
  setData
) => {
  const masDosAtributos = getAdditionalFields(
    content,
    fileName,
    selectOptions,
    row
  )

  Swal.fire({
    title: 'Editar registro',
    html: `
      <input type="text" id="codigo" class="swal2-input" value="${row.codigo}" placeholder="Código" disabled>
      <input type="text" id="nombre" class="swal2-input" value="${row.nombre}" placeholder="Nombre">
      ${masDosAtributos}
    `,
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    cancelButtonText: 'Cancelar',
    focusConfirm: false,
    preConfirm: () => {
      const formData = getFormData(masDosAtributos, fileName, content)

      const isValidateForm = validateForm(formData, false, data)
      if (!isValidateForm) {
        return null
      }
      return formData
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      const { nombre, additionalData } = result.value
      await saveEdit(
        row.codigo,
        nombre,
        additionalData,
        fileName,
        content,
        setData,
        data
      )
    }
  })
}

//Guardar la edicion
const saveEdit = async (
  codigo,
  nuevoNombre,
  additionalData,
  fileName,
  content,
  setData,
  data
) => {
  const baseFileName = fileName.split('.')[0]
  const hasMoreThanTwoAttributes =
    Object.keys(content[0]).filter(
      (key) => key !== `cod_${baseFileName}` && key !== `nom_${baseFileName}`
    ).length > 0
  const updatedData = data.map((row) =>
    String(row.codigo) === String(codigo)
      ? { nombre: nuevoNombre, codigo }
      : row
  )
  const isSaved = await saveChanges(
    codigo,
    nuevoNombre,
    hasMoreThanTwoAttributes ? additionalData : {},
    fileName
  )
  if (isSaved) {
    setData(updatedData)
  } else {
    Swal.fire({
      title: 'Error',
      text: 'Error al guardar los cambios. Por favor, intente nuevamente.',
      icon: 'error',
      showConfirmButton: false,
      timer: 2000
    })
  }
}

//Elimina los datos de la tabla
const handleDelete = async (id, fileName, data, setData) => {
  try {
    const result = await Swal.fire({
      title: 'Confirmación',
      text: '¿Desea eliminar el registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    })
    if (result.isConfirmed) {
      await axios.delete(`${API}/eliminarDatoDiccionario/${id}/${fileName}`)
      const updatedData = data.filter(
        (row) => String(row.codigo) !== String(id)
      )
      await saveChanges(updatedData)
      setData(updatedData)
      Swal.fire({
        title: 'Éxito',
        text: 'El registro ha sido eliminado correctamente',
        icon: 'success',
        showConfirmButton: false,
        timer: 2000
      })
    }
  } catch (error) {
    handleDeleteError(error)
  }
}

const handleDeleteError = (error) => {
  if (error.response && error.response.status === 409) {
    Swal.fire({
      title: 'Error',
      text: 'No se puede eliminar el registro porque está relacionado con otros registros.',
      icon: 'error',
      showConfirmButton: false,
      timer: 2000
    })
  } else {
    Swal.fire({
      title: 'Error',
      text: 'Hubo un problema eliminando el registro.',
      icon: 'error',
      showConfirmButton: false,
      timer: 2000
    })
  }
}

export {
  showAddModal,
  generateSelectOptions,
  handleDelete,
  saveEdit,
  handleEdit
}
