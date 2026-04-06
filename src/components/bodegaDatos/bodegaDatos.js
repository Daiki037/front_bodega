import React, { useState } from 'react';
import ETLTab from './ETLTab';
import TablerosTab from './TablerosTab';
import PowerBITab from './PowerBITab';

const BodegaDatos = () => {
    const [activeTab, setActiveTab] = useState('scripts');

    return (
        <div  className="card mx-auto" style={{ marginTop: '50px', height: '110%', width: '95%', maxWidth: '1600px', padding: '32px 32px 16px 32px' }} >
            <div style={{ textAlign: 'center', padding: '32px 0 16px 0' }}>
                <h1 style={{ margin: 0 }}>Bodega de Datos</h1>
            </div>
            <div className="tabs" style={{ display: 'flex', borderBottom: '2px solid #ccc', marginBottom: '20px', justifyContent: 'center', width: '100%', background: '#fff' }}>
                <div
                    onClick={() => setActiveTab('scripts')}
                    style={{ padding: '10px 24px', cursor: 'pointer', marginRight: '10px',
                        borderBottom: activeTab === 'scripts' ? '2px solid #007bff' : 'none',
                        color: activeTab === 'scripts' ? '#007bff' : '#000',
                        fontWeight: activeTab === 'scripts' ? 'bold' : 'normal',
                        background: 'none',
                    }}
                >
                    ETL
                </div>
                <div
                    onClick={() => setActiveTab('proyeccion')}
                    style={{ padding: '10px 24px', cursor: 'pointer', marginRight: '10px',
                        borderBottom: activeTab === 'proyeccion' ? '2px solid #007bff' : 'none',
                        color: activeTab === 'proyeccion' ? '#007bff' : '#000',
                        fontWeight: activeTab === 'proyeccion' ? 'bold' : 'normal',
                        background: 'none',
                    }}
                >
                    TABLEROS DISPONIBLES
                </div>
                <div
                    onClick={() => setActiveTab('descarga')}
                    style={{ padding: '10px 24px', cursor: 'pointer',
                        borderBottom: activeTab === 'descarga' ? '2px solid #007bff' : 'none',
                        color: activeTab === 'descarga' ? '#007bff' : '#000',
                        fontWeight: activeTab === 'descarga' ? 'bold' : 'normal',
                        background: 'none',
                    }}
                > 
                    POWER BI
                </div>
            </div>
            <div className="tab-content" style={{ width: '100%', padding: '24px 0', boxSizing: 'border-box', background: '#fff' }}>
                {activeTab === 'scripts' && <ETLTab />}
                {activeTab === 'proyeccion' && <TablerosTab />}
                {activeTab === 'descarga' && <PowerBITab />}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 32 }}>
                <button
                    onClick={() => window.history.back()}
                    style={{
                        padding: '10px 32px',
                        background: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        fontSize: 18,
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                        margin: '16px 16px 16px 16px'
                    }}
                >
                     Regresar
                </button>

            </div>
        </div>
    );
};

export default BodegaDatos;