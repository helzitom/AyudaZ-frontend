import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { FaSignOutAlt, FaHandsHelping, FaTachometerAlt, FaClipboardList, FaUserShield } from 'react-icons/fa';

const Navbar = () => {
    const { user, backendUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    // Determinar qué rol mostrar (para la etiqueta visual)
    const rolTexto = backendUser?.tipoUsuario === 'voluntario' ? 'Voluntario'
                    : backendUser?.tipoUsuario === 'ayudado' ? 'Solicitante'
                    : backendUser?.tipoUsuario === 'admin' ? 'Administrador'
                    : '';

    return (
        <nav style={{
            background: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
        }}>
            <div style={{
                maxWidth: 1280,
                margin: '0 auto',
                padding: '12px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
            }}>
                {/* Logo + nombre */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    cursor: 'pointer',
                }} onClick={() => navigate('/dashboard')}>
                    <div style={{
                        width: 40,
                        height: 40,
                        background: 'linear-gradient(135deg, #1e1e2a 0%, #121217 100%)',
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}>
                        <FaHandsHelping style={{ color: 'white', fontSize: 20 }} />
                    </div>
                    <span style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: '#111827',
                        letterSpacing: '-0.3px',
                    }}>Ayuda Z</span>
                </div>

                {/* Enlaces centrales (derecha en desktop) */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    flexWrap: 'wrap',
                }}>
                    {/* Enlace a Inicio */}
                    <Link to="/dashboard" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 14,
                        fontWeight: 500,
                        color: '#4b5563',
                        textDecoration: 'none',
                        padding: '6px 12px',
                        borderRadius: 40,
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = '#f3f4f6';
                        e.currentTarget.style.color = '#111827';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#4b5563';
                    }}>
                        <FaTachometerAlt size={14} />
                        Inicio
                    </Link>

                    {/* Enlace específico para ayudado */}
                    {backendUser?.tipoUsuario === 'ayudado' && (
                        <Link to="/mis-solicitudes" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 14,
                            fontWeight: 500,
                            color: '#4b5563',
                            textDecoration: 'none',
                            padding: '6px 12px',
                            borderRadius: 40,
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = '#f3f4f6';
                            e.currentTarget.style.color = '#111827';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#4b5563';
                        }}>
                            
                        </Link>
                    )}

                    {/* Enlace para admin */}
                    {backendUser?.tipoUsuario === 'admin' && (
                        <Link to="/admin" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 14,
                            fontWeight: 500,
                            color: '#4b5563',
                            textDecoration: 'none',
                            padding: '6px 12px',
                            borderRadius: 40,
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = '#f3f4f6';
                            e.currentTarget.style.color = '#111827';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#4b5563';
                        }}>
                            <FaUserShield size={14} />
                            Panel Admin
                        </Link>
                    )}

                    {/* Badge de rol (si existe) */}
                    {rolTexto && (
                        <span style={{
                            background: '#f3f4f6',
                            padding: '4px 12px',
                            borderRadius: 40,
                            fontSize: 12,
                            fontWeight: 600,
                            color: '#4b5563',
                            border: '1px solid #e5e7eb',
                        }}>
                            {rolTexto}
                        </span>
                    )}

                    {/* Botón de cerrar sesión (moderno) */}
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            background: '#f3f4f6',
                            border: '1px solid #e5e7eb',
                            borderRadius: 40,
                            padding: '6px 16px',
                            fontSize: 14,
                            fontWeight: 500,
                            color: '#1f2937',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 1px 1px rgba(0,0,0,0.02)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#e5e7eb';
                            e.currentTarget.style.borderColor = '#d1d5db';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#f3f4f6';
                            e.currentTarget.style.borderColor = '#e5e7eb';
                        }}
                    >
                        <FaSignOutAlt style={{ fontSize: 14 }} />
                        <span>Cerrar sesión</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;