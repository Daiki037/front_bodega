import React from 'react';

const PowerBITab = () => {
    return (
        <div>
            <h2>Descargar power bi</h2>
            <p>Puede descargar la aplicación de Power BI desde el siguiente enlace:</p>
            <a 
                href="https://www.microsoft.com/es-es/download/details.aspx?id=58494" 
                className="btn btn-primary" 
                target="_blank" 
                rel="noopener noreferrer"
            >
                Descargar Power BI
            </a>
        </div>
    );
};

export default PowerBITab;