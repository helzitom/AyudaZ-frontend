import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';

const MisSolicitudes = () => {
    const { user, backendUser } = useAuth();
    const [solicitudes, setSolicitudes] = useState([]);
    const [ofertas, setOfertas] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargarSolicitudes = async () => {
        try {
            setError(null);
            const response = await api.get('/solicitudes/activas');
            const todasSolicitudes = response.data || [];
            
            console.log('Todas las solicitudes:', todasSolicitudes.length);
            console.log('Tu email:', user?.email);
            console.log('Tu backendUser.id:', backendUser?.id);
            
            // Filtrar solicitudes del usuario actual
            const misSolicitudes = todasSolicitudes.filter(solicitud => {
                // El email está dentro de solicitud.ayudado.email
                const emailAyudado = solicitud.ayudado?.email;
                const idAyudado = solicitud.ayudado?.id;
                
                const esMiSolicitud = 
                    emailAyudado === user?.email ||
                    idAyudado === backendUser?.id;
                
                if (esMiSolicitud) {
                    console.log('✅ Solicitud encontrada:', solicitud.titulo);
                }
                
                return esMiSolicitud;
            });
            
            console.log('Mis solicitudes encontradas:', misSolicitudes.length);
            setSolicitudes(misSolicitudes);
            
        } catch (error) {
            console.error('Error al cargar solicitudes:', error);
            setError('No se pudieron cargar tus solicitudes. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.email) {
            cargarSolicitudes();
        } else {
            setLoading(false);
        }
    }, [user, backendUser]);

    const verOfertas = async (solicitudId) => {
        try {
            const ofertasRes = await api.get(`/solicitudes/${solicitudId}/ofertas`);
            setOfertas(prev => ({ ...prev, [solicitudId]: ofertasRes.data || [] }));
        } catch (err) {
            console.error('Error al cargar ofertas:', err);
            alert('No se pudieron cargar los postulantes');
        }
    };

    const aceptarOferta = async (ofertaId) => {
        try {
            await api.post(`/ofertas/${ofertaId}/aceptar`);
            alert('¡Oferta aceptada correctamente!');
            await cargarSolicitudes();
        } catch (err) {
            console.error('Error al aceptar oferta:', err);
            alert('Error al aceptar la oferta. Intenta nuevamente.');
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                <p>Cargando tus solicitudes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: '#dc2626' }}>
                <p>{error}</p>
                <button 
                    onClick={cargarSolicitudes}
                    style={{
                        marginTop: 16,
                        padding: '8px 16px',
                        background: '#0f1117',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer'
                    }}
                >
                    Reintentar
                </button>
            </div>
        );
    }

    if (solicitudes.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                <p>No has creado ninguna solicitud aún.</p>
                <p style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
                    Las solicitudes que crees aparecerán aquí.
                </p>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Mis solicitudes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {solicitudes.map((sol) => (
                    <div
                        key={sol.id}
                        style={{
                            background: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: 16,
                            padding: '20px',
                            transition: 'box-shadow 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                    >
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: 12,
                            marginBottom: 16,
                        }}>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#111827' }}>
                                    {sol.titulo}
                                </h4>
                                <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 8px' }}>
                                    {sol.descripcion}
                                </p>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '2px 10px',
                                        borderRadius: 99,
                                        fontSize: 12,
                                        fontWeight: 500,
                                        background: sol.estado === 'activa' ? '#d1fae5' : '#fee2e2',
                                        color: sol.estado === 'activa' ? '#065f46' : '#991b1b',
                                    }}>
                                        {sol.estado === 'activa' ? 'Activa' : 'Cerrada'}
                                    </span>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '2px 10px',
                                        borderRadius: 99,
                                        fontSize: 12,
                                        fontWeight: 500,
                                        background: '#fef3c7',
                                        color: '#92400e',
                                    }}>
                                        Urgencia: {sol.urgencia}/5
                                    </span>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '2px 10px',
                                        borderRadius: 99,
                                        fontSize: 12,
                                        fontWeight: 500,
                                        background: '#f3f4f6',
                                        color: '#4b5563',
                                    }}>
                                        📍 {sol.ubicacion}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => verOfertas(sol.id)}
                                style={{
                                    background: '#f3f4f6',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: 8,
                                    padding: '6px 14px',
                                    fontSize: 13,
                                    fontWeight: 500,
                                    color: '#374151',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
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
                                Ver postulantes
                            </button>
                        </div>

                        {ofertas[sol.id] && ofertas[sol.id].length > 0 && (
                            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
                                <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 12 }}>
                                    📋 Postulantes ({ofertas[sol.id].length})
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {ofertas[sol.id].map((oferta) => (
                                        <div
                                            key={oferta.id}
                                            style={{
                                                background: '#f9fafb',
                                                borderRadius: 12,
                                                padding: '12px 16px',
                                                border: '1px solid #f0f0f0',
                                            }}
                                        >
                                            <div style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                gap: 10,
                                            }}>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#111827' }}>
                                                        {oferta.voluntario?.nombre || 'Voluntario'}
                                                    </p>
                                                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>
                                                        {oferta.mensaje}
                                                    </p>
                                                </div>
                                                {sol.estado === 'activa' && oferta.estado === 'pendiente' && (
                                                    <button
                                                        onClick={() => aceptarOferta(oferta.id)}
                                                        style={{
                                                            background: '#10b981',
                                                            border: 'none',
                                                            borderRadius: 8,
                                                            padding: '6px 14px',
                                                            fontSize: 12,
                                                            fontWeight: 600,
                                                            color: 'white',
                                                            cursor: 'pointer',
                                                            transition: 'background 0.2s',
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
                                                        onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
                                                    >
                                                        Aceptar
                                                    </button>
                                                )}
                                                {oferta.estado === 'aceptada' && (
                                                    <span style={{
                                                        background: '#d1fae5',
                                                        color: '#065f46',
                                                        padding: '4px 10px',
                                                        borderRadius: 99,
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                    }}>
                                                        ✓ Aceptado
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MisSolicitudes;