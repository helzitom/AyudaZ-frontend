import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const UsuariosPendientes = () => {
    const [pendientes, setPendientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ayudadoSeleccionado, setAyudadoSeleccionado] = useState(null);
    const [cargandoDetalle, setCargandoDetalle] = useState(false);
    const [mostrarModalAprobacion, setMostrarModalAprobacion] = useState(false);
    const [usuarioAprobar, setUsuarioAprobar] = useState(null);
    const [imagen, setImagen] = useState(null);
    const [nivel, setNivel] = useState('POBRE');
    const [observaciones, setObservaciones] = useState('');
    const [subiendo, setSubiendo] = useState(false);

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

    const aprobar = (usuario) => {
        setUsuarioAprobar(usuario);
        setMostrarModalAprobacion(true);

        setImagen(null);
        setNivel('POBRE');
        setObservaciones('');
    };

    const confirmarAprobacion = async () => {
        try {
            if (!imagen) {
                alert('Debe subir una imagen de verificación');
                return;
            }

            setSubiendo(true);

            const formData = new FormData();
            formData.append('imagen', imagen);
            formData.append('nivel', nivel);
            formData.append('observaciones', observaciones);

            await api.post(
                `/admin/verificacion-pobreza/${usuarioAprobar.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            await api.post(`/admin/aprobar/${usuarioAprobar.id}`);

            setPendientes((prev) =>
                prev.filter((u) => u.id !== usuarioAprobar.id)
            );

            setMostrarModalAprobacion(false);
            setUsuarioAprobar(null);
            setImagen(null);
            setObservaciones('');

            alert('Usuario aprobado correctamente');
        } catch (error) {
            console.error('ERROR COMPLETO:', error);
            console.error('RESPONSE:', error.response);
            console.error('DATA:', error.response?.data);

            const mensaje =
                typeof error.response?.data === 'string'
                    ? error.response.data
                    : JSON.stringify(error.response?.data, null, 2);

            alert(mensaje);
        } finally {
            setSubiendo(false);
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
                                        <button
                                            onClick={() => aprobar(usuario)}
                                            style={{
                                                background: '#10b981',
                                                border: 'none',
                                                borderRadius: 8,
                                                padding: '6px 14px',
                                                color: 'white',
                                                cursor: 'pointer'
                                            }}
                                        >
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
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.55)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: 20,
                    }}
                    onClick={cerrarModal}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: '#fff',
                            borderRadius: 20,
                            width: '100%',
                            maxWidth: 650,
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            padding: 24,
                            boxShadow: '0 20px 40px rgba(0,0,0,.2)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 20,
                            }}
                        >
                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: 22,
                                    fontWeight: 700,
                                }}
                            >
                                Información del solicitante
                            </h2>

                            <button
                                onClick={cerrarModal}
                                style={{
                                    border: 'none',
                                    background: '#f3f4f6',
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    fontSize: 18,
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {cargandoDetalle ? (
                            <p>Cargando...</p>
                        ) : (
                            <>
                                {/* DATOS PERSONALES */}

                                <div
                                    style={{
                                        background: '#f9fafb',
                                        padding: 16,
                                        borderRadius: 12,
                                        marginBottom: 16,
                                    }}
                                >
                                    <h3
                                        style={{
                                            marginTop: 0,
                                            marginBottom: 12,
                                            fontSize: 16,
                                        }}
                                    >
                                        Datos personales
                                    </h3>

                                    <p>
                                        <strong>Nombre:</strong>{' '}
                                        {ayudadoSeleccionado.usuario?.nombre || '—'}
                                    </p>

                                    <p>
                                        <strong>Correo:</strong>{' '}
                                        {ayudadoSeleccionado.usuario?.email || '—'}
                                    </p>


                                </div>

                                {/* DATOS FAMILIARES */}



                                <div
                                    style={{
                                        background: '#f9fafb',
                                        padding: 16,
                                        borderRadius: 12,
                                        marginBottom: 16,
                                    }}
                                >
                                    <h3
                                        style={{
                                            marginTop: 0,
                                            marginBottom: 12,
                                            fontSize: 16,
                                        }}
                                    >
                                        Información familiar
                                    </h3>

                                    <p>
                                        <strong>DNI del cónyuge:</strong>{' '}
                                        {ayudadoSeleccionado.dni || '—'}
                                    </p>

                                    <p>
                                        <strong>Cónyuge:</strong>{' '}
                                        {ayudadoSeleccionado.nombreConyuge || 'No registrado'}
                                    </p>

                                    <p>
                                        <strong>Fecha nacimiento cónyuge:</strong>{' '}
                                        {ayudadoSeleccionado.fechaNacimientoConyuge || '—'}
                                    </p>

                                    <p>
                                        <strong>Lugar nacimiento cónyuge:</strong>{' '}
                                        {ayudadoSeleccionado.lugarNacimientoConyuge || '—'}
                                    </p>

                                    <p>
                                        <strong>Integrantes del hogar:</strong>{' '}
                                        {ayudadoSeleccionado.cantidadIntegrantes || '—'}
                                    </p>
                                </div>

                                {/* VALIDACIÓN */}

                                <div
                                    style={{
                                        background: '#f9fafb',
                                        padding: 16,
                                        borderRadius: 12,
                                    }}
                                >
                                    <h3
                                        style={{
                                            marginTop: 0,
                                            marginBottom: 12,
                                            fontSize: 16,
                                        }}
                                    >
                                        Estado de validación
                                    </h3>

                                    <p>
                                        <strong>Confirmado por administrador:</strong>{' '}
                                        {ayudadoSeleccionado.confirmacionAdmin
                                            ? 'Sí'
                                            : 'No'}
                                    </p>

                                    <p>
                                        <strong>Fecha de confirmación:</strong>{' '}
                                        {ayudadoSeleccionado.fechaConfirmacion
                                            ? new Date(
                                                ayudadoSeleccionado.fechaConfirmacion
                                            ).toLocaleString()
                                            : 'Pendiente'}
                                    </p>

                                    <p>
                                        <strong>Observaciones:</strong>{' '}
                                        {ayudadoSeleccionado.observaciones || 'Sin observaciones'}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            {mostrarModalAprobacion && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,.6)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 3000,
                        padding: 20,
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            maxWidth: 700,
                            background: '#fff',
                            borderRadius: 20,
                            padding: 24,
                            maxHeight: '90vh',
                            overflowY: 'auto',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 20,
                            }}
                        >
                            <h2 style={{ margin: 0 }}>
                                Aprobar Ayudado
                            </h2>

                            <button
                                onClick={() =>
                                    setMostrarModalAprobacion(false)
                                }
                                style={{
                                    border: 'none',
                                    background: '#f3f4f6',
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <label>
                                Nivel socioeconómico
                            </label>

                            <select
                                value={nivel}
                                onChange={(e) =>
                                    setNivel(e.target.value)
                                }
                                style={{
                                    width: '100%',
                                    marginTop: 8,
                                    padding: 12,
                                    borderRadius: 10,
                                    border: '1px solid #d1d5db',
                                }}
                            >
                                <option value="POBRE">
                                    POBRE
                                </option>

                                <option value="EXTREMA_POBREZA">
                                    EXTREMA POBREZA
                                </option>
                            </select>
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <label>
                                Evidencia obligatoria
                            </label>

                            <div
                                onDragOver={(e) =>
                                    e.preventDefault()
                                }
                                onDrop={(e) => {
                                    e.preventDefault();

                                    if (
                                        e.dataTransfer.files &&
                                        e.dataTransfer.files[0]
                                    ) {
                                        setImagen(
                                            e.dataTransfer.files[0]
                                        );
                                    }
                                }}
                                style={{
                                    marginTop: 10,
                                    border: '2px dashed #cbd5e1',
                                    borderRadius: 12,
                                    padding: 40,
                                    textAlign: 'center',
                                }}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="imagenPobreza"
                                    style={{ display: 'none' }}
                                    onChange={(e) =>
                                        setImagen(
                                            e.target.files?.[0]
                                        )
                                    }
                                />

                                <label
                                    htmlFor="imagenPobreza"
                                    style={{
                                        cursor: 'pointer',
                                        display: 'block',
                                    }}
                                >
                                    {imagen
                                        ? imagen.name
                                        : 'Arrastra una imagen aquí o haz clic para seleccionar'}
                                </label>
                            </div>
                        </div>

                        {imagen && (
                            <img
                                src={URL.createObjectURL(imagen)}
                                alt="Vista previa"
                                style={{
                                    width: '100%',
                                    maxHeight: 300,
                                    objectFit: 'contain',
                                    borderRadius: 12,
                                    marginBottom: 20,
                                }}
                            />
                        )}

                        <div style={{ marginBottom: 20 }}>
                            <label>
                                Observaciones
                            </label>

                            <textarea
                                value={observaciones}
                                onChange={(e) =>
                                    setObservaciones(
                                        e.target.value
                                    )
                                }
                                rows={5}
                                style={{
                                    width: '100%',
                                    marginTop: 8,
                                    padding: 12,
                                    borderRadius: 10,
                                    border: '1px solid #d1d5db',
                                    resize: 'vertical',
                                }}
                            />
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 12,
                            }}
                        >
                            <button
                                onClick={() =>
                                    setMostrarModalAprobacion(false)
                                }
                                style={{
                                    padding: '10px 18px',
                                    borderRadius: 10,
                                    border: '1px solid #d1d5db',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancelar
                            </button>

                            <button
                                disabled={subiendo}
                                onClick={confirmarAprobacion}
                                style={{
                                    background: '#10b981',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '10px 18px',
                                    borderRadius: 10,
                                    cursor: 'pointer',
                                }}
                            >
                                {subiendo
                                    ? 'Guardando...'
                                    : 'Guardar y Aprobar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UsuariosPendientes;