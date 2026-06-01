import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const TodosUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editandoId, setEditandoId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [modalImagen, setModalImagen] = useState(false);
    const [verificacionActual, setVerificacionActual] = useState(null);

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        try {
            const res = await api.get('/admin/usuarios');
            setUsuarios(res.data);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
        } finally {
            setLoading(false);
        }
    };

    const suspender = async (id) => {
        if (!window.confirm('¿Suspender este usuario? Pasará a estado "rechazado".')) return;
        try {
            await api.post(`/admin/suspender/${id}`);
            cargarUsuarios(); // recargar
        } catch (error) {
            alert('Error al suspender: ' + error.message);
        }
    };

    const eliminar = async (id) => {
        if (!window.confirm('¿Eliminar permanentemente este usuario? Esta acción no se puede deshacer.')) return;
        try {
            await api.delete(`/admin/eliminar/${id}`);
            cargarUsuarios();
        } catch (error) {
            alert('Error al eliminar: ' + error.message);
        }
    };

    const iniciarEdicion = (usuario) => {
        setEditandoId(usuario.id);
        setEditForm({
            nombre: usuario.nombre || '',
            email: usuario.email || '',
            tipoUsuario: usuario.tipoUsuario || '',
            estado: usuario.estado || ''
        });
    };

    const cancelarEdicion = () => {
        setEditandoId(null);
        setEditForm({});
    };

    const guardarEdicion = async (id) => {
        try {
            await api.put(`/admin/usuarios/${id}`, editForm);
            cancelarEdicion();
            cargarUsuarios();
        } catch (error) {
            alert('Error al guardar cambios: ' + error.message);
        }
    };

    const verEvidencia = async (usuario) => {
        try {

            const res = await api.get(
                `/admin/verificacion-pobreza/usuario/${usuario.id}`
            );

            setVerificacionActual({
                usuario,
                ...res.data
            });

            setModalImagen(true);

        } catch (error) {

            alert(
                error?.response?.data ||
                'No existe verificación SISFOH'
            );

        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: 40 }}>Cargando usuarios...</div>;

    return (
        <div>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <tr>
                            <th style={{ padding: 12, textAlign: 'left' }}>ID</th>
                            <th style={{ padding: 12, textAlign: 'left' }}>Nombre</th>
                            <th style={{ padding: 12, textAlign: 'left' }}>Email</th>
                            <th style={{ padding: 12, textAlign: 'left' }}>Rol</th>
                            <th style={{ padding: 12, textAlign: 'left' }}>Estado</th>
                            <th style={{ padding: 12, textAlign: 'left' }}>verificacion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(usuario => (
                            <tr
                                key={usuario.id}
                                style={{
                                    borderBottom: '1px solid #e5e7eb',
                                    transition: 'all .2s'
                                }}
                            >
                                <td style={{ padding: 14, fontWeight: 600 }}>
                                    #{usuario.id}
                                </td>

                                <td style={{ padding: 14 }}>
                                    {editandoId === usuario.id ? (
                                        <input
                                            value={editForm.nombre}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    nombre: e.target.value
                                                })
                                            }
                                            style={{
                                                width: '100%',
                                                padding: 10,
                                                borderRadius: 8,
                                                border: '1px solid #d1d5db'
                                            }}
                                        />
                                    ) : (
                                        usuario.nombre || '—'
                                    )}
                                </td>

                                <td style={{ padding: 14 }}>
                                    {editandoId === usuario.id ? (
                                        <input
                                            value={editForm.email}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    email: e.target.value
                                                })
                                            }
                                            style={{
                                                width: '100%',
                                                padding: 10,
                                                borderRadius: 8,
                                                border: '1px solid #d1d5db'
                                            }}
                                        />
                                    ) : (
                                        usuario.email
                                    )}
                                </td>

                                <td style={{ padding: 14 }}>
                                    <span
                                        style={{
                                            background:
                                                usuario.tipoUsuario === 'admin'
                                                    ? '#ede9fe'
                                                    : usuario.tipoUsuario === 'ayudado'
                                                        ? '#dbeafe'
                                                        : '#dcfce7',
                                            color: '#111827',
                                            padding: '6px 12px',
                                            borderRadius: 999,
                                            fontSize: 12,
                                            fontWeight: 600
                                        }}
                                    >
                                        {usuario.tipoUsuario}
                                    </span>
                                </td>

                                <td style={{ padding: 14 }}>
                                    <span
                                        style={{
                                            background:
                                                usuario.estado === 'activo'
                                                    ? '#dcfce7'
                                                    : usuario.estado === 'pendiente'
                                                        ? '#fef3c7'
                                                        : '#fee2e2',
                                            color:
                                                usuario.estado === 'activo'
                                                    ? '#166534'
                                                    : usuario.estado === 'pendiente'
                                                        ? '#92400e'
                                                        : '#991b1b',
                                            padding: '6px 12px',
                                            borderRadius: 999,
                                            fontSize: 12,
                                            fontWeight: 600
                                        }}
                                    >
                                        {usuario.estado}
                                    </span>
                                </td>

                                <td style={{ padding: 14 }}>
                                    {usuario.tipoUsuario === 'ayudado' ? (
                                        <button
                                            onClick={() => verEvidencia(usuario)}
                                            style={{
                                                background: '#8b5cf6',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: 10,
                                                padding: '8px 14px',
                                                cursor: 'pointer',
                                                fontWeight: 600
                                            }}
                                        >
                                            Ver SISFOH
                                        </button>
                                    ) : (
                                        <span style={{ color: '#9ca3af' }}>—</span>
                                    )}
                                </td>

                                <td style={{ padding: 14 }}>
                                    {editandoId === usuario.id ? (
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button
                                                onClick={() => guardarEdicion(usuario.id)}
                                                style={{
                                                    background: '#10b981',
                                                    color: '#fff',
                                                    border: 'none',
                                                    padding: '8px 12px',
                                                    borderRadius: 8,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Guardar
                                            </button>

                                            <button
                                                onClick={cancelarEdicion}
                                                style={{
                                                    background: '#6b7280',
                                                    color: '#fff',
                                                    border: 'none',
                                                    padding: '8px 12px',
                                                    borderRadius: 8,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button
                                                onClick={() => iniciarEdicion(usuario)}
                                                style={{
                                                    background: '#2563eb',
                                                    color: '#fff',
                                                    border: 'none',
                                                    padding: '8px 12px',
                                                    borderRadius: 8,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                onClick={() => suspender(usuario.id)}
                                                style={{
                                                    background: '#f59e0b',
                                                    color: '#fff',
                                                    border: 'none',
                                                    padding: '8px 12px',
                                                    borderRadius: 8,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Suspender
                                            </button>

                                            <button
                                                onClick={() => eliminar(usuario.id)}
                                                style={{
                                                    background: '#ef4444',
                                                    color: '#fff',
                                                    border: 'none',
                                                    padding: '8px 12px',
                                                    borderRadius: 8,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {modalImagen && verificacionActual && (
                <div
                    onClick={() => setModalImagen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,.75)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999,
                        padding: 20
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: '#fff',
                            borderRadius: 20,
                            maxWidth: 1100,
                            width: '95%',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            boxShadow: '0 20px 50px rgba(0,0,0,.3)'
                        }}
                    >
                        <div
                            style={{
                                padding: 20,
                                borderBottom: '1px solid #e5e7eb',
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}
                        >
                            <div>
                                <h2 style={{ margin: 0 }}>
                                    Constancia SISFOH
                                </h2>

                                <p style={{ marginTop: 8, color: '#6b7280' }}>
                                    {verificacionActual.usuario.nombre}
                                </p>
                            </div>

                            <button
                                onClick={() => setModalImagen(false)}
                                style={{
                                    border: 'none',
                                    background: '#f3f4f6',
                                    borderRadius: 10,
                                    width: 40,
                                    height: 40,
                                    cursor: 'pointer'
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{ padding: 24 }}>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: 20,
                                    marginBottom: 20
                                }}
                            >
                                <div>
                                    <strong>Nivel:</strong><br />
                                    {verificacionActual.nivel}
                                </div>

                                <div>
                                    <strong>Fecha:</strong><br />
                                    {new Date(
                                        verificacionActual.fechaVerificacion
                                    ).toLocaleString()}
                                </div>
                            </div>

                            <div style={{ marginBottom: 20 }}>
                                <strong>Observaciones</strong>

                                <div
                                    style={{
                                        marginTop: 8,
                                        padding: 12,
                                        background: '#f9fafb',
                                        borderRadius: 10
                                    }}
                                >
                                    {verificacionActual.observaciones || 'Sin observaciones'}
                                </div>
                            </div>

                            <img
                                src={`http://localhost:8080/api/admin/verificacion-pobreza/imagen/${verificacionActual.usuario.id}`}
                                alt="SISFOH"
                                style={{
                                    width: '100%',
                                    maxHeight: '75vh',
                                    objectFit: 'contain',
                                    borderRadius: 14,
                                    border: '1px solid #e5e7eb',
                                    background: '#f9fafb',
                                    display: 'block'
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TodosUsuarios;