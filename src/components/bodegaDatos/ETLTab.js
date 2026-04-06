import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const ETLTab = () => {
    const [selectedScript, setSelectedScript] = useState(null);
    const [scriptContent, setScriptContent] = useState('');
    const [sqlFiles, setSqlFiles] = useState([]);
    const [loadingScripts, setLoadingScripts] = useState(false);

    const loadSqlScripts = async () => {
        setLoadingScripts(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/sql-scripts`);
            if (response.ok) {
                const result = await response.json();
                
                if (result.success && result.data && result.data.files) {
                    setSqlFiles(result.data.files);
                } else {
                    console.error('Estructura de respuesta inesperada:', result);
                    Swal.fire('Error', 'Formato de respuesta del servidor inesperado.', 'error');
                }
            } else {
                console.error('Error al cargar scripts:', response.status);
                Swal.fire('Error', 'No se pudieron cargar los scripts del servidor.', 'error');
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            Swal.fire('Error', 'Error de conexión al servidor.', 'error');
        } finally {
            setLoadingScripts(false);
        }
    };

    useEffect(() => {
        loadSqlScripts();
    }, []);

    const handleScriptClick = async (fileName) => {
        setSelectedScript(fileName);
        setScriptContent('Cargando contenido...');
        
        try {
            const scriptFile = sqlFiles.find(file => file.name === fileName);
            
            if (scriptFile && scriptFile.descripcion) {
                setScriptContent(scriptFile.descripcion);
            } else {
                setScriptContent(`-- Error al cargar el archivo ${fileName}
-- 
-- No se encontró la descripción del script en los datos del servidor
-- Archivo: ${fileName}`);
            }
        } catch (error) {
            console.error('Error al cargar el script:', error);
            setScriptContent(`-- Error al cargar el archivo ${fileName}
-- Error: ${error.message}
-- 
-- Archivo: ${fileName}`);
        }
    };

    const handleEjecutarScripts = async () => {
        // Mostrar confirmación antes de ejecutar
        const result = await Swal.fire({
            title: 'Ejecutar ETL',
            text: 'Esto ejecutará todos los scripts en orden para su funcionamiento. ¿Está seguro de continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, ejecutar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#6c757d'
        });

        if (result.isConfirmed) {
            // Mostrar loading
            Swal.fire({
                title: 'Ejecutando ETL...',
                text: 'Por favor espere mientras se ejecutan los scripts',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/execute-all-scripts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    Swal.fire({
                        title: 'ETL Ejecutado Exitosamente',
                        text: result.message || 'Todos los scripts se ejecutaron correctamente',
                        icon: 'success',
                        confirmButtonText: 'Entendido'
                    });
                } else {
                    Swal.fire({
                        title: 'Error en la Ejecución',
                        text: result.message || 'Hubo un error al ejecutar los scripts',
                        icon: 'error',
                        confirmButtonText: 'Entendido'
                    });
                }
            } catch (error) {
                console.error('Error al ejecutar scripts:', error);
                Swal.fire({
                    title: 'Error de Conexión',
                    text: 'No se pudo conectar con el servidor para ejecutar los scripts',
                    icon: 'error',
                    confirmButtonText: 'Entendido'
                });
            }
        }
    };

    return (
        <div
            style={{                                     
                fontSize: '14px',
                whiteSpace: 'pre-wrap',
                maxHeight: '400px',
                width: '100%',
                boxSizing: 'border-box',
                minWidth: 0
    }}
        >
            <h2>Scripts de Bodega de Datos</h2>
            <br/>
            <p>Selecciona un script para ver su contenido:</p>
            
            <div className="row">
                <div className="col-md-4">
                    <h5>Lista de Scripts</h5>
                    {loadingScripts ? (
                        <div className="text-center p-3">
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Cargando...</span>
                            </div>
                            <p className="mt-2">Cargando scripts...</p>
                        </div>
                    ) : sqlFiles.length > 0 ? (
                        <ul className="list-group">
                            {sqlFiles.map((file, index) => (
                                <li 
                                    key={index}
                                    className={`list-group-item list-group-item-action ${selectedScript === file.name ? 'active' : ''}`}
                                    onClick={() => handleScriptClick(file.name)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="fas fa-file-code mr-2"></i>
                                    {file.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="alert alert-warning" role="alert">
                            <i className="fas fa-exclamation-triangle mr-2"></i>
                            No se encontraron scripts disponibles.
                            <button 
                                className="btn btn-sm btn-outline-primary ml-2"
                                onClick={loadSqlScripts}
                            >
                                <i className="fas fa-sync-alt mr-1"></i>
                                Reintentar
                            </button>
                        </div>
                    )}
                </div>
                <div className="col-md-8">
                    <h5>Contenido del Script</h5>
                    {selectedScript ? (
                        <div>
                            <div className="mb-2">
                                <strong>Archivo: </strong>{selectedScript}
                            </div>
                            <div 
                                style={{
                                    background: '#f8f9fa',
                                    border: '1px solid #dee2e6',
                                    borderRadius: '5px',
                                    padding: '15px',
                                    fontFamily: 'monospace',
                                    fontSize: '14px',
                                    whiteSpace: 'pre-wrap',
                                    maxHeight: '400px',
                                    overflowY: 'auto'
                                }}
                            >
                                {scriptContent || 'Cargando contenido...'}
                            </div>
                        </div>
                    ) : (
                        <div 
                            className="text-muted"
                            style={{
                                background: '#f8f9fa',
                                border: '1px solid #dee2e6',
                                borderRadius: '5px',
                                padding: '15px',
                                textAlign: 'center',
                                minHeight: '200px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            Selecciona un script de la lista para ver su contenido
                        </div>
                    )}
                </div>
            </div>
            
            <div className="row mt-4">
                <div className="col-12 text-center">
                    <button 
                        className="btn btn-success btn-lg"
                        onClick={handleEjecutarScripts}
                        style={{ minWidth: '200px' }}
                    >
                        <i className="fas fa-play mr-2"></i>
                        Ejecutar ETL
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ETLTab;