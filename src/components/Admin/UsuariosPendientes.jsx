import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const UsuariosPendientes = () => {
    const [pendientes, setPendientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ayudadoSeleccionado, setAyudadoSeleccionado] = useState(null);
    const [cargandoDetalle, setCargandoDetalle] = useState(false);

    useEffect(() => {
        const fetchPendientes = async () => {
            try {
                const res = await api.get('/admin/pendientes');
                console.log('Usuarios pendientes:', res.data); // 👈 depura
                setPendientes(res.data);
            } catch (error) {
                console.error('Error al cargar pendientes:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPendientes();
    }, []);

    const verDetalleAyudado = async (usuarioId) => {
        setCargandoDetalle(true);
        try {
            // Ajusta esta URL al endpoint que hayas creado
            const res = await api.get(`/admin/ayudados/usuario/${usuarioId}`);
            setAyudadoSeleccionado(res.data);
        } catch (error) {
            console.error('Error al cargar detalles:', error);
            alert('No se pudo cargar la información del ayudado');
            setAyudadoSeleccionado(null);
        } finally {
            setCargandoDetalle(false);
        }
    };

    const cerrarModal = () => setAyudadoSeleccionado(null);

    const aprobar = async (id) => {
        try {
            await api.post(`/admin/aprobar/${id}`);
            setPendientes(pendientes.filter(u => u.id !== id));
        } catch (error) {
            console.error('Error al aprobar:', error);
        }
    };

    const eliminar = async (id) => {
        try {
            await api.delete(`/admin/eliminar/${id}`);
            setPendientes(pendientes.filter(u => u.id !== id));
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    };

    const animations = `
        @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp { animation: fadeUp 0.3s ease-out; }
    `;

    if (loading) return <div style={{ textAlign: 'center', padding: 40 }}>Cargando...</div>;

    return (
        <>
            <style>{animations}</style>
            <div className="animate-fadeUp">
                {pendientes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 20px', background: '#f9fafb', borderRadius: 16 }}>
                        No hay usuarios pendientes.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {pendientes.map((usuario) => (
                            <div key={usuario.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h4>{usuario.nombre || 'Sin nombre'}</h4>
                                        <p>{usuario.email}</p>
                                        {/* Botón que aparece si es ayudado */}
                                        {usuario.tipoUsuario && usuario.tipoUsuario.toLowerCase() === 'ayudado' && (
                                            <button onClick={() => verDetalleAyudado(usuario.id)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: 12 }}>
                                                Ver más información
                                            </button>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: 10 }}>
                                        <button onClick={() => aprobar(usuario.id)} style={{ background: '#10b981', border: 'none', borderRadius: 8, padding: '6px 14px', color: 'white', cursor: 'pointer' }}>
                                            Aprobar
                                        </button>
                                        <button onClick={() => eliminar(usuario.id)} style={{ background: '#ef4444', border: 'none', borderRadius: 8, padding: '6px 14px', color: 'white', cursor: 'pointer' }}>
                                            Rechazar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal con todos los campos de ayudado */}
            {ayudadoSeleccionado && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={cerrarModal}>
                    <div style={{ background: 'white', borderRadius: 20, padding: 24, maxWidth: 500, width: '90%' }} onClick={e => e.stopPropagation()}>
                        <h3>Datos del solicitante</h3>
                        {cargandoDetalle ? <p>Cargando...</p> : (
                            <div>
                                <p><strong>Cónyuge:</strong> {ayudadoSeleccionado.nombreConyuge || '—'}</p>
                                <p><strong>Fecha nacimiento:</strong> {ayudadoSeleccionado.fechaNacimientoConyuge || '—'}</p>
                                <p><strong>Lugar nacimiento:</strong> {ayudadoSeleccionado.lugarNacimientoConyuge || '—'}</p>
                                <p><strong>Integrantes:</strong> {ayudadoSeleccionado.cantidadIntegrantes || '—'}</p>
                                <p><strong>Confirmado por admin:</strong> {ayudadoSeleccionado.confirmacionAdmin ? 'Sí' : 'No'}</p>
                                <p><strong>Fecha confirmación:</strong> {ayudadoSeleccionado.fechaConfirmacion ? new Date(ayudadoSeleccionado.fechaConfirmacion).toLocaleString() : 'Pendiente'}</p>
                                <p><strong>Observaciones:</strong> {ayudadoSeleccionado.observaciones || '—'}</p>
                            </div>
                        )}
                        <button onClick={cerrarModal} style={{ marginTop: 20, background: '#6b7280', border: 'none', borderRadius: 8, padding: '8px 16px', color: 'white', cursor: 'pointer' }}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default UsuariosPendientes;