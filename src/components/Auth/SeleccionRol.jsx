import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';

const SeleccionRol = () => {
    const [step, setStep] = useState('choice'); // choice, voluntario, ayudado, completado
    const [rol, setRol] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user, refreshBackendUser } = useAuth();
    const navigate = useNavigate();

    // Formularios (solo con los campos necesarios, sin email/contraseña)
    const formVoluntario = useForm({
        defaultValues: { nombre: '', declaracion: false }
    });
    const formAyudado = useForm({
        defaultValues: {
            nombre: '',
            nombreConyuge: '',
            fechaNacimientoConyuge: '',
            lugarNacimientoConyuge: '',
            cantidadIntegrantes: 1,
            declaracion: false
        }
    });

    const elegirRol = (selected) => {
        setRol(selected);
        setStep(selected);
    };

    const submitVoluntario = async (data) => {
        if (!data.nombre.trim()) {
            formVoluntario.setError('nombre', { message: 'El nombre es requerido' });
            return;
        }
        if (!data.declaracion) {
            formVoluntario.setError('declaracion', { message: 'Debes aceptar la declaración' });
            return;
        }
        setLoading(true);
        try {
            await api.post('/auth/registro/voluntario', {
                email: user.email,
                nombre: data.nombre
            });
            await refreshBackendUser();
            setStep('completado');
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const submitAyudado = async (data) => {
        if (!data.nombre.trim()) {
            formAyudado.setError('nombre', { message: 'El nombre es requerido' });
            return;
        }
        if (!data.declaracion) {
            formAyudado.setError('declaracion', { message: 'Debes aceptar la declaración' });
            return;
        }
        setLoading(true);
        try {
            await api.post('/auth/registro/ayudado', {
                email: user.email,
                nombre: data.nombre,
                nombreConyuge: data.nombreConyuge,
                fechaNacimientoConyuge: data.fechaNacimientoConyuge,
                lugarNacimientoConyuge: data.lugarNacimientoConyuge,
                cantidadIntegrantes: data.cantidadIntegrantes
            });
            await refreshBackendUser();
            setStep('completado');
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Animaciones inline
    const animations = `
        @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeUp { animation: fadeUp 0.3s ease-out; }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
    `;

    return (
        <>
            <style>{animations}</style>
            <div style={{
                minHeight: '100vh',
                background: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24,
            }}>
                {/* PASO 1: Elegir rol */}
                {step === 'choice' && (
                    <div className="animate-fadeUp" style={{ width: '100%', maxWidth: 560 }}>
                        <div style={{ textAlign: 'center', marginBottom: 32 }}>
                            <div style={{
                                width: 56, height: 56, background: '#0f1117', borderRadius: 14,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                            }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                                    <path d="M12 21C12 21 3 14 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14 14 21 12 21Z" />
                                </svg>
                            </div>
                            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Bienvenido/a a Ayuda Z</h1>
                            <p style={{ fontSize: 15, color: '#6b7280' }}>¿Cómo quieres participar?</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            {/* Voluntario */}
                            <button onClick={() => elegirRol('voluntario')} style={{
                                background: 'white', border: '2px solid #e5e7eb', borderRadius: 16, padding: 28,
                                cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.border = '2px solid #0f1117'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; }}
                                onMouseLeave={e => { e.currentTarget.style.border = '2px solid #e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                <div style={{ width: 48, height: 48, background: '#d1fae5', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#065f46" strokeWidth="2">
                                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                                    </svg>
                                </div>
                                <p style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Quiero ayudar</p>
                                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>
                                    Seré voluntario y apoyaré a personas que necesiten ayuda en mi comunidad.
                                </p>
                                <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#065f46', background: '#d1fae5', padding: '4px 10px', borderRadius: 99 }}>
                                    ✓ Acceso inmediato
                                </div>
                            </button>

                            {/* Ayudado */}
                            <button onClick={() => elegirRol('ayudado')} style={{
                                background: 'white', border: '2px solid #e5e7eb', borderRadius: 16, padding: 28,
                                cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.border = '2px solid #0f1117'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; }}
                                onMouseLeave={e => { e.currentTarget.style.border = '2px solid #e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                <div style={{ width: 48, height: 48, background: '#dbeafe', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2">
                                        <path d="M12 21C12 21 3 14 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14 14 21 12 21Z" />
                                    </svg>
                                </div>
                                <p style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Necesito ayuda</p>
                                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>
                                    Soy una persona en situación de vulnerabilidad y requiero apoyo de la comunidad.
                                </p>
                                <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#1d4ed8', background: '#dbeafe', padding: '4px 10px', borderRadius: 99 }}>
                                    ✓ Requiere verificación
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {/* PASO 2: Formulario Voluntario */}
                {step === 'voluntario' && (
                    <div className="animate-slideIn" style={{
                        background: 'white', borderRadius: 20, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                        padding: 36, width: '100%', maxWidth: 520,
                    }}>
                        <button onClick={() => setStep('choice')} style={{
                            background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
                            gap: 6, fontSize: 13, color: '#6b7280', marginBottom: 20,
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 5l-7 7 7 7" />
                            </svg>
                            Volver
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                            <div style={{ width: 40, height: 40, background: '#d1fae5', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#065f46" strokeWidth="2">
                                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                                </svg>
                            </div>
                            <div>
                                <h2 style={{ fontSize: 20, fontWeight: 700 }}>Datos del voluntario</h2>
                                <p style={{ fontSize: 13, color: '#6b7280' }}>Completa tu perfil para comenzar a ayudar</p>
                            </div>
                        </div>

                        <form onSubmit={formVoluntario.handleSubmit(submitVoluntario)} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <Campo label="Nombre completo" error={formVoluntario.formState.errors.nombre?.message}>
                                <input placeholder="Tu nombre completo" {...formVoluntario.register('nombre', { required: 'El nombre es requerido' })} style={inputStyle} />
                            </Campo>

                            <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', marginTop: 4 }}>
                                <input type="checkbox" {...formVoluntario.register('declaracion', { required: 'Debes aceptar la declaración' })} style={{ marginTop: 3, flexShrink: 0 }} />
                                <span style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.5 }}>
                                    Declaro que la información proporcionada es verdadera y que soy mayor de 18 años.
                                </span>
                            </label>
                            {formVoluntario.formState.errors.declaracion && (
                                <p style={{ fontSize: 12, color: '#ef4444' }}>{formVoluntario.formState.errors.declaracion.message}</p>
                            )}

                            <button type="submit" disabled={loading} style={{
                                marginTop: 8, padding: '13px', background: loading ? '#9ca3af' : '#0f1117',
                                border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, color: 'white',
                                cursor: loading ? 'not-allowed' : 'pointer',
                            }}>
                                {loading ? 'Guardando...' : 'Registrarme como voluntario'}
                            </button>
                        </form>
                    </div>
                )}

                {/* PASO 3: Formulario Ayudado */}
                {step === 'ayudado' && (
                    <div className="animate-slideIn" style={{
                        background: 'white', borderRadius: 20, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                        padding: 36, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto',
                    }}>
                        <button onClick={() => setStep('choice')} style={{
                            background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
                            gap: 6, fontSize: 13, color: '#6b7280', marginBottom: 20,
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 5l-7 7 7 7" />
                            </svg>
                            Volver
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                            <div style={{ width: 40, height: 40, background: '#dbeafe', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2">
                                    <path d="M12 21C12 21 3 14 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14 14 21 12 21Z" />
                                </svg>
                            </div>
                            <div>
                                <h2 style={{ fontSize: 20, fontWeight: 700 }}>Solicitar apoyo</h2>
                                <p style={{ fontSize: 13, color: '#6b7280' }}>Completa tus datos para acceder al sistema</p>
                            </div>
                        </div>

                        <div style={{
                            background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: 10,
                            padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'flex-start',
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#d97706" style={{ flexShrink: 0, marginTop: 1 }}>
                                <path d="M12 2L1 21h22L12 2zm1 14h-2v-2h2v2zm0-4h-2V8h2v4z" />
                            </svg>
                            <div>
                                <p style={{ fontSize: 13, fontWeight: 600, color: '#92400e' }}>Verificación de elegibilidad</p>
                                <p style={{ fontSize: 12, color: '#92400e', marginTop: 2, lineHeight: 1.5 }}>
                                    Este sistema es exclusivo para personas en situación de vulnerabilidad. Tu solicitud será revisada antes de ser aprobada.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={formAyudado.handleSubmit(submitAyudado)} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <Campo label="Nombre completo" error={formAyudado.formState.errors.nombre?.message}>
                                <input placeholder="Tu nombre completo" {...formAyudado.register('nombre', { required: 'El nombre es requerido' })} style={inputStyle} />
                            </Campo>

                            <Campo label="Nombre del cónyuge" error={formAyudado.formState.errors.nombreConyuge?.message}>
                                <input placeholder="Nombre del cónyuge" {...formAyudado.register('nombreConyuge', { required: 'Requerido' })} style={inputStyle} />
                            </Campo>

                            <Campo label="Fecha de nacimiento del cónyuge" error={formAyudado.formState.errors.fechaNacimientoConyuge?.message}>
                                <input type="date" {...formAyudado.register('fechaNacimientoConyuge', { required: 'Requerido' })} style={inputStyle} />
                            </Campo>

                            <Campo label="Lugar de nacimiento del cónyuge" error={formAyudado.formState.errors.lugarNacimientoConyuge?.message}>
                                <input placeholder="Ciudad / Departamento" {...formAyudado.register('lugarNacimientoConyuge', { required: 'Requerido' })} style={inputStyle} />
                            </Campo>

                            <Campo label="Cantidad de integrantes en el hogar" error={formAyudado.formState.errors.cantidadIntegrantes?.message}>
                                <input type="number" min={1} max={20} {...formAyudado.register('cantidadIntegrantes', { required: 'Requerido', min: 1 })} style={inputStyle} />
                            </Campo>

                            <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
                                <input type="checkbox" {...formAyudado.register('declaracion', { required: 'Debes aceptar la declaración' })} style={{ marginTop: 3, flexShrink: 0 }} />
                                <span style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.5 }}>
                                    Declaro bajo juramento que la información proporcionada es verdadera y que me encuentro en situación de vulnerabilidad.
                                </span>
                            </label>
                            {formAyudado.formState.errors.declaracion && (
                                <p style={{ fontSize: 12, color: '#ef4444' }}>{formAyudado.formState.errors.declaracion.message}</p>
                            )}

                            <button type="submit" disabled={loading} style={{
                                marginTop: 8, padding: '13px', background: loading ? '#9ca3af' : '#0f1117',
                                border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, color: 'white',
                                cursor: loading ? 'not-allowed' : 'pointer',
                            }}>
                                {loading ? 'Guardando...' : 'Enviar solicitud de registro'}
                            </button>
                        </form>
                    </div>
                )}

                {/* PASO 4: Completado */}
                {step === 'completado' && (
                    <div className="animate-fadeUp" style={{
                        background: 'white', borderRadius: 20, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                        padding: 48, width: '100%', maxWidth: 440, textAlign: 'center',
                    }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: '50%', background: rol === 'voluntario' ? '#d1fae5' : '#dbeafe',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={rol === 'voluntario' ? '#065f46' : '#1d4ed8'} strokeWidth="2.5">
                                <path d="M20 6L9 17l-5-5" />
                            </svg>
                        </div>

                        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>
                            {rol === 'voluntario' ? '¡Ya eres voluntario!' : '¡Registro enviado!'}
                        </h2>
                        <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, marginBottom: 28 }}>
                            {rol === 'voluntario'
                                ? 'Tu perfil está listo. Ya puedes comenzar a ayudar desde el dashboard.'
                                : 'Tu solicitud de registro fue enviada. Un administrador revisará tus datos y te notificará pronto.'
                            }
                        </p>

                        <button onClick={() => navigate('/dashboard')} style={{
                            width: '100%', padding: '13px', background: '#0f1117', border: 'none',
                            borderRadius: 10, fontSize: 15, fontWeight: 600, color: 'white', cursor: 'pointer',
                        }}>
                            Ir al dashboard
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

// Componente auxiliar Campo
const Campo = ({ label, error, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 14, fontWeight: 500, color: '#111827' }}>{label}</label>
        {children}
        {error && <p style={{ fontSize: 12, color: '#ef4444' }}>{error}</p>}
    </div>
);

const inputStyle = {
    width: '100%', padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: 8,
    fontSize: 14, color: '#111827', background: '#f9fafb', outline: 'none', fontFamily: 'inherit',
};

export default SeleccionRol;