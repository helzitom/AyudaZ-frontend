import React, { useState } from 'react';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';   // ← Importante

const CrearSolicitud = ({ onCreada }) => {
    const { backendUser } = useAuth();        // ← Obtener usuario autenticado
    const [form, setForm] = useState({
        titulo: '',
        descripcion: '',
        categoria: '',
        ubicacion: '',
        urgencia: 3,
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!backendUser || !backendUser.id) {
            alert('No se pudo identificar al usuario ayudado. Vuelve a iniciar sesión.');
            return;
        }
        setLoading(true);
        try {
            // 🔥 Enviar ayudadoId dentro del objeto JSON
            const payload = {
                titulo: form.titulo,
                descripcion: form.descripcion,
                categoria: form.categoria,
                ubicacion: form.ubicacion,
                urgencia: form.urgencia,
                ayudadoId: backendUser.id
            };
            // ❌ Así NO: await api.post('/solicitudes', form, { params: { ayudadoId } });
            // ✅ Así SÍ:
            await api.post('/solicitudes', payload);
            alert('Solicitud creada exitosamente');
            onCreada();
            setForm({ titulo: '', descripcion: '', categoria: '', ubicacion: '', urgencia: 3 });
        } catch (error) {
            console.error(error);
            let mensaje = error.response?.data?.message || error.message || 'Error al crear solicitud';
            alert(`❌ ${mensaje}`);
        } finally {
            setLoading(false);
        }
    };

    // ========== ESTILO (EXACTAMENTE IGUAL AL QUE TIENES) ==========
    const animations = `
    @keyframes fadeUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeUp {
        animation: fadeUp 0.3s ease-out;
    }
    `;

    return (
        <>
            <style>{animations}</style>
            <div className="animate-fadeUp" style={{
                background: 'white',
                borderRadius: 20,
                padding: '28px',
                marginBottom: 24,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 24,
                }}>
                    <div style={{
                        width: 40,
                        height: 40,
                        background: '#e0f2fe',
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                    </div>
                    <h3 style={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: '#1f2937',
                        margin: 0,
                    }}>Crear nueva solicitud</h3>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: 14,
                            fontWeight: 500,
                            color: '#374151',
                            marginBottom: 6,
                        }}>Título *</label>
                        <input
                            name="titulo"
                            placeholder="Ej: Necesito víveres para mi familia"
                            value={form.titulo}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1.5px solid #e5e7eb',
                                borderRadius: 8,
                                fontSize: 14,
                                color: '#111827',
                                background: '#f9fafb',
                                outline: 'none',
                                transition: 'border 0.2s',
                                fontFamily: 'inherit',
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = '#0284c7'}
                            onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: 14,
                            fontWeight: 500,
                            color: '#374151',
                            marginBottom: 6,
                        }}>Descripción *</label>
                        <textarea
                            name="descripcion"
                            placeholder="Describe tu situación y lo que necesitas"
                            value={form.descripcion}
                            onChange={handleChange}
                            required
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1.5px solid #e5e7eb',
                                borderRadius: 8,
                                fontSize: 14,
                                color: '#111827',
                                background: '#f9fafb',
                                outline: 'none',
                                resize: 'vertical',
                                fontFamily: 'inherit',
                                transition: 'border 0.2s',
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = '#0284c7'}
                            onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: 14,
                            fontWeight: 500,
                            color: '#374151',
                            marginBottom: 6,
                        }}>Categoría</label>
                        <input
                            name="categoria"
                            placeholder="Ej: Alimentos, Medicina, Vivienda"
                            value={form.categoria}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1.5px solid #e5e7eb',
                                borderRadius: 8,
                                fontSize: 14,
                                color: '#111827',
                                background: '#f9fafb',
                                outline: 'none',
                                transition: 'border 0.2s',
                                fontFamily: 'inherit',
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = '#0284c7'}
                            onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: 14,
                            fontWeight: 500,
                            color: '#374151',
                            marginBottom: 6,
                        }}>Ubicación</label>
                        <input
                            name="ubicacion"
                            placeholder="Distrito, zona, dirección"
                            value={form.ubicacion}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1.5px solid #e5e7eb',
                                borderRadius: 8,
                                fontSize: 14,
                                color: '#111827',
                                background: '#f9fafb',
                                outline: 'none',
                                transition: 'border 0.2s',
                                fontFamily: 'inherit',
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = '#0284c7'}
                            onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: 14,
                            fontWeight: 500,
                            color: '#374151',
                            marginBottom: 6,
                        }}>Nivel de urgencia</label>
                        <select
                            name="urgencia"
                            value={form.urgencia}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1.5px solid #e5e7eb',
                                borderRadius: 8,
                                fontSize: 14,
                                color: '#111827',
                                background: '#f9fafb',
                                cursor: 'pointer',
                                outline: 'none',
                                fontFamily: 'inherit',
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = '#0284c7'}
                            onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                        >
                            <option value="1"> Baja </option>
                            <option value="2"> Media </option>
                            <option value="3"> Alta </option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            marginTop: 8,
                            padding: '12px',
                            background: loading ? '#9ca3af' : '#0f1117',
                            border: 'none',
                            borderRadius: 10,
                            fontSize: 15,
                            fontWeight: 600,
                            color: 'white',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => !loading && (e.currentTarget.style.background = '#1f2937')}
                        onMouseLeave={e => !loading && (e.currentTarget.style.background = '#0f1117')}
                    >
                        {loading ? 'Publicando...' : 'Publicar solicitud'}
                    </button>
                </form>
            </div>
        </>
    );
};

export default CrearSolicitud;