import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const TablerosTab = () => {
    const [powerBIFiles, setPowerBIFiles] = useState([]);
    const [loadingPowerBI, setLoadingPowerBI] = useState(false);

    const loadPowerBIFiles = async () => {
        setLoadingPowerBI(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/powerbi-files`);
            if (response.ok) {
                const result = await response.json();
                
                if (result.success && result.data && result.data.files) {
                    setPowerBIFiles(result.data.files);
                } else {
                    console.error('Estructura de respuesta inesperada:', result);
                    Swal.fire('Error', 'Formato de respuesta del servidor inesperado.', 'error');
                }
            } else {
                console.error('Error al cargar archivos Power BI:', response.status);
                Swal.fire('Error', 'No se pudieron cargar los archivos Power BI del servidor.', 'error');
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            Swal.fire('Error', 'Error de conexión al servidor.', 'error');
        } finally {
            setLoadingPowerBI(false);
        }
    };

    useEffect(() => {
        loadPowerBIFiles();
    }, []);

    const handleTableroClick = (fileName) => {
        const tableroFile = powerBIFiles.find(file => file.name === fileName);
        const title = fileName.replace('.pbix', '');
        const imagePath = `${process.env.REACT_APP_API_URL}/images/${title}.png`;
        
        const getDescription = (name, serverDescription) => {
            if (serverDescription) {
                return serverDescription;
            }
            
            const descriptions = {
                'Casos por Localización': 'Este tablero muestra la distribución de casos por diferentes localizaciones geográficas, permitiendo análisis territorial detallado.',
                'Casos por Sexo': 'Visualiza la distribución de casos por género, facilitando el análisis de patrones demográficos por sexo.',
                'Incidencia': 'Presenta indicadores de incidencia y prevalencia, útiles para el seguimiento epidemiológico y estadístico.',
                'Otros indicadores': 'Contiene indicadores adicionales y métricas complementarias para análisis integral de los datos.',
                'Tasas': 'Muestra diferentes tasas calculadas y ratios importantes para el análisis estadístico de la información.'
            };
            return descriptions[name] || 'Tablero de análisis de datos con visualizaciones interactivas.';
        };
        
        const description = getDescription(title, tableroFile?.descripcion);
        
        Swal.fire({
            title: `Tablero: ${title}`,
            html: `
                <div style="display: flex; margin-bottom: 20px; gap: 20px; align-items: flex-start;">
                    <div style="flex: 1; text-align: center;">
                        <img src="${imagePath}" alt="${title}" style="max-width: 100%; height: auto; border-radius: 8px; border: 1px solid #ddd;">
                    </div>
                    <div style="flex: 1; text-align: left;">
                        <p>${description}</p>
                        <hr>
                        <p><strong>Nota importante:</strong> Para visualizar este tablero es necesario tener la herramienta Power BI, si no la tienen puede descargarla desde la siguiente pestaña. Si ya la tiene descargue el tablero y abra el archivo utilizando la aplicación.</p>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <a href="${process.env.REACT_APP_API_URL}/powerbi-files/${fileName}/download" class="btn btn-primary" download="${fileName}">
                        <i class="fas fa-download"></i> Descargar Tablero
                    </a>
                </div>
            `,
            width: 800,
            showConfirmButton: false,
            showCloseButton: true
        });
    };

    return (
        <div>
            <h2>Opciones de tableros</h2>
            <br/>
            {loadingPowerBI ? (
                <div className="text-center p-3">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando tableros...</p>
                </div>
            ) : powerBIFiles.length > 0 ? (
                <ul className="list-group">
                    {powerBIFiles.map((file, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>Tablero: {file.name.replace('.pbix', '')}</span>
                            <button 
                                className="btn btn-outline-primary btn-sm" 
                                onClick={() => handleTableroClick(file.name)}
                            >
                                Ver Tablero
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="alert alert-warning" role="alert">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    No se encontraron tableros disponibles.
                    <button 
                        className="btn btn-sm btn-outline-primary ml-2"
                        onClick={loadPowerBIFiles}
                    >
                        <i className="fas fa-sync-alt mr-1"></i>
                        Reintentar
                    </button>
                </div>
            )}
        </div>
    );
};

export default TablerosTab;