import React, { useState } from 'react';
import UsuariosPendientes from './UsuariosPendientes';
import TodosUsuarios from './TodosUsuarios';
import Navbar from '../Common/Navbar';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('pendientes');

    const animations = `
        @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp { animation: fadeUp 0.3s ease-out; }
    `;

    return (
        <>
            <style>{animations}</style>
            <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
                <Navbar />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
                    <div className="animate-fadeUp" style={{
                        background: 'white',
                        borderRadius: 24,
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.02)',
                        padding: '32px',
                        width: '100%',
                        maxWidth: 1200
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                            <div style={{ width: 40, height: 40, background: '#e0e7ff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>
                                Panel de Administración
                            </h2>
                        </div>

                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: 16, borderBottom: '1px solid #e5e7eb', marginBottom: 24 }}>
                            <button
                                onClick={() => setActiveTab('pendientes')}
                                style={{
                                    padding: '8px 16px',
                                    border: 'none',
                                    background: 'transparent',
                                    fontSize: 15,
                                    fontWeight: activeTab === 'pendientes' ? 600 : 400,
                                    color: activeTab === 'pendientes' ? '#1d4ed8' : '#6b7280',
                                    borderBottom: activeTab === 'pendientes' ? '2px solid #1d4ed8' : 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                Pendientes de aprobación
                            </button>
                            <button
                                onClick={() => setActiveTab('todos')}
                                style={{
                                    padding: '8px 16px',
                                    border: 'none',
                                    background: 'transparent',
                                    fontSize: 15,
                                    fontWeight: activeTab === 'todos' ? 600 : 400,
                                    color: activeTab === 'todos' ? '#1d4ed8' : '#6b7280',
                                    borderBottom: activeTab === 'todos' ? '2px solid #1d4ed8' : 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                Todos los usuarios
                            </button>
                        </div>

                        {activeTab === 'pendientes' && <UsuariosPendientes />}
                        {activeTab === 'todos' && <TodosUsuarios />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminPanel;