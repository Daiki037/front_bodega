import React, { useState } from 'react';
import ETLTab from './ETLTab';
import TablerosTab from './TablerosTab';
import PowerBITab from './PowerBITab';

const BodegaDatos = () => {
    const [activeTab, setActiveTab] = useState('scripts');

    return (
        <div className="card mx-auto" style={{ marginTop: '50px' }}>
            <div style={{ textAlign: 'center', marginBottom: '15px', marginTop: '15px' }}>
                <h1>Bodega de Datos</h1>
            </div>
            <div className="tabs" style={{ display: 'flex', borderBottom: '2px solid #ccc', marginBottom: '20px' }}>
                <div
                    onClick={() => setActiveTab('scripts')}
                    style={{ padding: '10px 20px', cursor: 'pointer', marginRight: '10px',
                        borderBottom: activeTab === 'scripts' ? '2px solid #007bff' : 'none',
                        color: activeTab === 'scripts' ? '#007bff' : '#000',
                        fontWeight: activeTab === 'scripts' ? 'bold' : 'normal',
                    }}
                >
                    ETL
                </div>
                <div
                    onClick={() => setActiveTab('proyeccion')}
                    style={{ padding: '10px 20px', cursor: 'pointer', marginRight: '10px',
                        borderBottom: activeTab === 'proyeccion' ? '2px solid #007bff' : 'none',
                        color: activeTab === 'proyeccion' ? '#007bff' : '#000',
                        fontWeight: activeTab === 'proyeccion' ? 'bold' : 'normal',
                    }}
                >
                    TABLEROS DISPONIBLES
                </div>
                <div
                    onClick={() => setActiveTab('descarga')}
                    style={{ padding: '10px 20px', cursor: 'pointer',
                        borderBottom: activeTab === 'descarga' ? '2px solid #007bff' : 'none',
                        color: activeTab === 'descarga' ? '#007bff' : '#000',
                        fontWeight: activeTab === 'descarga' ? 'bold' : 'normal',
                    }}
                > 
                    POWER BI
                </div>
            </div>
            <div className="tab-content" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
                {activeTab === 'scripts' && <ETLTab />}
                {activeTab === 'proyeccion' && <TablerosTab />}
                {activeTab === 'descarga' && <PowerBITab />}
            </div>
        </div>
    );
};

export default BodegaDatos;