import React, { useState } from 'react';
import UsuariosPendientes from './UsuariosPendientes';
import TodosUsuarios from './TodosUsuarios';
import LogsAdmin from './LogsAdmin';
import Navbar from '../Common/Navbar';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('pendientes');

    const tabs = [
        { key: 'pendientes', label: 'Pendientes de aprobación' },
        { key: 'todos',      label: 'Todos los usuarios' },
        { key: 'logs',       label: 'Logs de actividad' },
    ];

    return (
        <>
            <style>{`
                @keyframes fadeUp { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
                .animate-fadeUp { animation: fadeUp 0.3s ease-out; }
            `}</style>
            <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
                <Navbar />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
                    <div className="animate-fadeUp" style={{
                        background: 'white', borderRadius: 24,
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.02)',
                        padding: '32px', width: '100%', maxWidth: 1200,
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
                        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #e5e7eb', marginBottom: 24 }}>
                            {tabs.map(tab => (
                                <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                                    padding: '8px 16px', border: 'none', background: 'transparent',
                                    fontSize: 15, cursor: 'pointer', marginBottom: -1,
                                    fontWeight: activeTab === tab.key ? 600 : 400,
                                    color:      activeTab === tab.key ? '#1d4ed8' : '#6b7280',
                                    borderBottom: activeTab === tab.key ? '2px solid #1d4ed8' : '2px solid transparent',
                                }}>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'pendientes' && <UsuariosPendientes />}
                        {activeTab === 'todos'      && <TodosUsuarios />}
                        {activeTab === 'logs'       && <LogsAdmin />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminPanel;