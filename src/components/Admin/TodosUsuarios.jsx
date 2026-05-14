import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const TodosUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editandoId, setEditandoId] = useState(null);
    const [editForm, setEditForm] = useState({});

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
                            <th style={{ padding: 12, textAlign: 'left' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(usuario => (
                            <tr key={usuario.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: 12 }}>{usuario.id}</td>
                                <td style={{ padding: 12 }}>
                                    {editandoId === usuario.id ? (
                                        <input
                                            value={editForm.nombre}
                                            onChange={e => setEditForm({ ...editForm, nombre: e.target.value })}
                                            style={{ width: '100%', padding: 6 }}
                                        />
                                    ) : (
                                        usuario.nombre || '—'
                                    )}
                                </td>
                                <td style={{ padding: 12 }}>
                                    {editandoId === usuario.id ? (
                                        <input
                                            value={editForm.email}
                                            onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                            style={{ width: '100%', padding: 6 }}
                                        />
                                    ) : (
                                        usuario.email
                                    )}
                                </td>
                                <td style={{ padding: 12 }}>
                                    {editandoId === usuario.id ? (
                                        <select
                                            value={editForm.tipoUsuario}
                                            onChange={e => setEditForm({ ...editForm, tipoUsuario: e.target.value })}
                                            style={{ width: '100%', padding: 6 }}
                                        >
                                            <option value="voluntario">Voluntario</option>
                                            <option value="ayudado">Ayudado</option>
                                            <option value="admin">Administrador</option>
                                        </select>
                                    ) : (
                                        <span style={{
                                            background: usuario.tipoUsuario === 'admin' ? '#ede9fe' : '#e0e7ff',
                                            padding: '2px 8px',
                                            borderRadius: 20,
                                            fontSize: 12
                                        }}>
                                            {usuario.tipoUsuario}
                                        </span>
                                    )}
                                </td>
                                <td style={{ padding: 12 }}>
                                    {editandoId === usuario.id ? (
                                        <select
                                            value={editForm.estado}
                                            onChange={e => setEditForm({ ...editForm, estado: e.target.value })}
                                            style={{ width: '100%', padding: 6 }}
                                        >
                                            <option value="activo">Activo</option>
                                            <option value="pendiente">Pendiente</option>
                                            <option value="rechazado">Rechazado</option>
                                        </select>
                                    ) : (
                                        <span style={{
                                            background: usuario.estado === 'activo' ? '#dcfce7' :
                                                usuario.estado === 'pendiente' ? '#fef9c3' : '#ffe4e4',
                                            padding: '2px 8px',
                                            borderRadius: 20,
                                            fontSize: 12
                                        }}>
                                            {usuario.estado}
                                        </span>
                                    )}
                                </td>
                                <td style={{ padding: 12 }}>
                                    {editandoId === usuario.id ? (
                                        <>
                                            <button onClick={() => guardarEdicion(usuario.id)} style={{ background: '#10b981', marginRight: 8 }}>Guardar</button>
                                            <button onClick={cancelarEdicion} style={{ background: '#6b7280' }}>Cancelar</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => iniciarEdicion(usuario)} style={{ background: '#3b82f6', marginRight: 8 }}>Editar</button>
                                            <button onClick={() => suspender(usuario.id)} style={{ background: '#f59e0b', marginRight: 8 }}>Suspender</button>
                                            <button onClick={() => eliminar(usuario.id)} style={{ background: '#ef4444' }}>Eliminar</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TodosUsuarios;