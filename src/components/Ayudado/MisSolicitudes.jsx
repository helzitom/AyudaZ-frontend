import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const ESTADO_BADGE = {
    activa:      { bg: '#d1fae5', color: '#065f46', label: 'Activa' },
    en_proceso:  { bg: '#dbeafe', color: '#1e40af', label: 'En proceso' },
    cerrada:     { bg: '#f3f4f6', color: '#6b7280', label: 'Cerrada' },
    cancelada:   { bg: '#fee2e2', color: '#991b1b', label: 'Cancelada' },
};

const OFERTA_BADGE = {
    pendiente:   { bg: '#fef3c7', color: '#92400e' },
    aceptada:    { bg: '#d1fae5', color: '#065f46' },
    rechazada:   { bg: '#fee2e2', color: '#991b1b' },
    completada:  { bg: '#ede9fe', color: '#5b21b6' },
};

const MisSolicitudes = () => {
    const { user, backendUser } = useAuth();
    const [solicitudes, setSolicitudes]   = useState([]);
    const [ofertas, setOfertas]           = useState({});
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState(null);
    const [tab, setTab]                   = useState('activas'); // 'activas' | 'historial'
    const navigate = useNavigate();

    // ── Carga todas las solicitudes del usuario ───────────────────────────────
    const cargarSolicitudes = async () => {
        try {
            setError(null);
            // Carga activas + cerradas en una sola llamada
            const response = await api.get('/solicitudes/mis-solicitudes');
            const todas = response.data || [];

            const mias = todas.filter(sol =>
                sol.ayudado?.email === user?.email ||
                sol.ayudado?.id    === backendUser?.id
            );
            setSolicitudes(mias);
        } catch (err) {
            console.error('Error al cargar solicitudes:', err);
            setError('No se pudieron cargar tus solicitudes. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.email) cargarSolicitudes();
        else setLoading(false);
    }, [user, backendUser]);

    // ── Ver postulantes de una solicitud ──────────────────────────────────────
    const verOfertas = async (solicitudId) => {
        // Toggle: si ya están cargadas, las oculta
        if (ofertas[solicitudId]) {
            setOfertas(prev => { const n = {...prev}; delete n[solicitudId]; return n; });
            return;
        }
        try {
            const res = await api.get(`/solicitudes/${solicitudId}/ofertas`);
            setOfertas(prev => ({ ...prev, [solicitudId]: res.data || [] }));
        } catch {
            alert('No se pudieron cargar los postulantes');
        }
    };

    // ── Aceptar oferta → cierra la solicitud y suma puntos ────────────────────
    const aceptarSolicitud = async (ofertaId) => {
        try {
            await api.post(`/solicitudes/ofertas/${ofertaId}/aceptar`);
            await cargarSolicitudes();
            setOfertas({}); // limpiar panel de ofertas
        } catch (err) {
            alert(err.response?.data || 'Error al aceptar la oferta.');
        }
    };

    // ── Rechazar oferta ───────────────────────────────────────────────────────
    const rechazarOferta = async (ofertaId) => {
        try {
            await api.post(`/solicitudes/ofertas/${ofertaId}/rechazar`);
            await cargarSolicitudes();
            setOfertas({});
        } catch (err) {
            alert(err.response?.data || 'No se pudo rechazar la oferta.');
        }
    };

    // ── Separar en activas e historial ────────────────────────────────────────
    const activas   = solicitudes.filter(s => ['activa','en_proceso'].includes(s.estado));
    const historial = solicitudes.filter(s => ['cerrada','cancelada'].includes(s.estado));

    // ── Estados de carga / error ──────────────────────────────────────────────
    if (loading) return (
        <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <p style={{ color: '#6b7280' }}>Cargando tus solicitudes...</p>
        </div>
    );

    if (error) return (
        <div style={{ textAlign: 'center', padding: '48px 20px', color: '#dc2626' }}>
            <p>{error}</p>
            <button onClick={cargarSolicitudes} style={s.btnSecundario}>Reintentar</button>
        </div>
    );

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div style={{ padding: '24px', maxWidth: 820, margin: '0 auto' }}>

            {/* Volver */}
            <button onClick={() => navigate('/dashboard')} style={s.btnVolver}>
                ← Volver al Dashboard
            </button>

            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
                Mis solicitudes
            </h3>

            {/* Tabs */}
            <div style={s.tabs}>
                <button
                    style={{ ...s.tab, ...(tab === 'activas' ? s.tabActive : {}) }}
                    onClick={() => setTab('activas')}
                >
                    📋 Activas
                    {activas.length > 0 && (
                        <span style={s.tabBadge}>{activas.length}</span>
                    )}
                </button>
                <button
                    style={{ ...s.tab, ...(tab === 'historial' ? s.tabActive : {}) }}
                    onClick={() => setTab('historial')}
                >
                    🗂️ Historial
                    {historial.length > 0 && (
                        <span style={{ ...s.tabBadge, background: '#f3f4f6', color: '#6b7280' }}>
                            {historial.length}
                        </span>
                    )}
                </button>
            </div>

            {/* ── TAB ACTIVAS ─────────────────────────────────────────────── */}
            {tab === 'activas' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {activas.length === 0 && (
                        <div style={s.emptyBox}>
                            <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
                            <p style={{ color: '#6b7280', margin: 0 }}>No tienes solicitudes activas.</p>
                        </div>
                    )}
                    {activas.map(sol => (
                        <TarjetaSolicitud
                            key={sol.id}
                            sol={sol}
                            ofertas={ofertas}
                            onVerOfertas={verOfertas}
                            onAceptar={aceptarSolicitud}
                            onRechazar={rechazarOferta}
                        />
                    ))}
                </div>
            )}

            {/* ── TAB HISTORIAL ───────────────────────────────────────────── */}
            {tab === 'historial' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {historial.length === 0 && (
                        <div style={s.emptyBox}>
                            <div style={{ fontSize: 40, marginBottom: 10 }}>🗂️</div>
                            <p style={{ color: '#6b7280', margin: 0 }}>
                                Aún no tienes solicitudes cerradas.
                            </p>
                        </div>
                    )}
                    {historial.map(sol => (
                        <TarjetaHistorial key={sol.id} sol={sol} />
                    ))}
                </div>
            )}
        </div>
    );
};

// ── Tarjeta de solicitud activa ───────────────────────────────────────────────
const TarjetaSolicitud = ({ sol, ofertas, onVerOfertas, onAceptar, onRechazar }) => {
    const estadoInfo = ESTADO_BADGE[sol.estado] || ESTADO_BADGE.activa;
    const listaOfertas = ofertas[sol.id];

    return (
        <div style={s.card}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
        >
            {/* Cabecera */}
            <div style={s.cardHeader}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <h4 style={s.cardTitle}>{sol.titulo}</h4>
                        <span style={{ ...s.badge, background: estadoInfo.bg, color: estadoInfo.color }}>
                            {estadoInfo.label}
                        </span>
                    </div>
                    <p style={s.cardDesc}>{sol.descripcion}</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                        <span style={{ ...s.badge, background: '#fef3c7', color: '#92400e' }}>
                            Urgencia: {sol.urgencia}/5
                        </span>
                        {sol.ubicacion && (
                            <span style={{ ...s.badge, background: '#f3f4f6', color: '#4b5563' }}>
                                📍 {sol.ubicacion}
                            </span>
                        )}
                        <span style={{ ...s.badge, background: '#f3f4f6', color: '#4b5563' }}>
                            📅 {new Date(sol.fechaCreacion).toLocaleDateString('es-PE')}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => onVerOfertas(sol.id)}
                    style={s.btnVerOfertas}
                    onMouseEnter={e => e.currentTarget.style.background = '#e5e7eb'}
                    onMouseLeave={e => e.currentTarget.style.background = '#f3f4f6'}
                >
                    {listaOfertas ? 'Ocultar postulantes' : 'Ver postulantes'}
                </button>
            </div>

            {/* Panel de postulantes */}
            {listaOfertas && (
                <div style={s.ofertasPanel}>
                    <p style={s.ofertasTitle}>📋 Postulantes ({listaOfertas.length})</p>

                    {listaOfertas.length === 0 && (
                        <div style={s.emptyOfertas}>Nadie se ha postulado todavía.</div>
                    )}

                    {listaOfertas.map(oferta => {
                        const vol       = oferta.voluntario || {};
                        const badgeInfo = OFERTA_BADGE[oferta.estado] || OFERTA_BADGE.pendiente;

                        return (
                            <div key={oferta.id} style={s.ofertaCard}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                                    <div style={{ flex: 1 }}>
                                        {/* Voluntario */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                            <div style={s.volAvatar}>
                                                {(vol.nombre || 'V')[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p style={s.volNombre}>
                                                    {vol.nombre || 'Voluntario'}
                                                </p>
                                                <span style={{ ...s.badge, background: badgeInfo.bg, color: badgeInfo.color, fontSize: 10 }}>
                                                    {oferta.estado?.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Contacto */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginLeft: 42 }}>
                                            {vol.email && (
                                                <p style={s.volDetalle}>✉️ {vol.email}</p>
                                            )}
                                            {vol.telefono && (
                                                <p style={s.volDetalle}>📱 {vol.telefono}</p>
                                            )}
                                            {oferta.mensaje && (
                                                <p style={{ ...s.volDetalle, color: '#4b5563', marginTop: 4 }}>
                                                    💬 {oferta.mensaje}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Botones solo si activa y pendiente */}
                                    {sol.estado === 'activa' && oferta.estado === 'pendiente' && (
                                        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                            <button
                                                onClick={() => onAceptar(oferta.id)}
                                                style={s.btnAceptar}
                                                onMouseEnter={e => e.currentTarget.style.background = '#059669'}
                                                onMouseLeave={e => e.currentTarget.style.background = '#10b981'}
                                            >
                                                ✓ Aceptar
                                            </button>
                                            <button
                                                onClick={() => onRechazar(oferta.id)}
                                                style={s.btnRechazar}
                                            >
                                                ✕ Rechazar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// ── Tarjeta de historial (solicitud cerrada) ──────────────────────────────────
const TarjetaHistorial = ({ sol }) => {
    const [ofertaAceptada, setOfertaAceptada] = useState(null);
    const [cargando, setCargando]             = useState(false);
    const [expandido, setExpandido]           = useState(false);
    const estadoInfo = ESTADO_BADGE[sol.estado] || ESTADO_BADGE.cerrada;

    // Carga la oferta aceptada/completada al expandir
    const cargarVoluntario = async () => {
        if (ofertaAceptada || cargando) { setExpandido(e => !e); return; }
        setCargando(true);
        try {
            const res = await api.get(`/solicitudes/${sol.id}/ofertas`);
            const aceptada = (res.data || []).find(o =>
                o.estado === 'aceptada' || o.estado === 'completada'
            );
            setOfertaAceptada(aceptada || null);
            setExpandido(true);
        } catch {
            setExpandido(true); // muestra igualmente aunque falle
        } finally {
            setCargando(false);
        }
    };

    const vol = ofertaAceptada?.voluntario;

    return (
        <div style={{ ...s.card, opacity: 0.9 }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
        >
            <div style={s.cardHeader}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <h4 style={{ ...s.cardTitle, color: '#6b7280' }}>{sol.titulo}</h4>
                        <span style={{ ...s.badge, background: estadoInfo.bg, color: estadoInfo.color }}>
                            {estadoInfo.label}
                        </span>
                    </div>
                    <p style={{ ...s.cardDesc, WebkitLineClamp: 2 }}>{sol.descripcion}</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                        <span style={{ ...s.badge, background: '#f3f4f6', color: '#6b7280' }}>
                            Urgencia: {sol.urgencia}/5
                        </span>
                        {sol.fechaCierre && (
                            <span style={{ ...s.badge, background: '#f3f4f6', color: '#6b7280' }}>
                                ✓ Cerrada: {new Date(sol.fechaCierre).toLocaleDateString('es-PE')}
                            </span>
                        )}
                    </div>
                </div>

                {/* Botón ver voluntario que ayudó */}
                <button
                    onClick={cargarVoluntario}
                    style={{ ...s.btnVerOfertas, fontSize: 12 }}
                    onMouseEnter={e => e.currentTarget.style.background = '#e5e7eb'}
                    onMouseLeave={e => e.currentTarget.style.background = '#f3f4f6'}
                >
                    {cargando ? '...' : expandido ? 'Ocultar' : '👤 Ver voluntario'}
                </button>
            </div>

            {/* Info del voluntario que ayudó */}
            {expandido && (
                <div style={{ ...s.ofertasPanel, background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                    {!ofertaAceptada ? (
                        <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                            No se encontró información del voluntario.
                        </p>
                    ) : (
                        <div>
                            <p style={{ ...s.ofertasTitle, color: '#065f46' }}>
                                ✅ Voluntario que te ayudó
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ ...s.volAvatar, background: 'linear-gradient(135deg,#10b981,#059669)', width: 44, height: 44, fontSize: 18 }}>
                                    {(vol?.nombre || 'V')[0].toUpperCase()}
                                </div>
                                <div>
                                    <p style={{ ...s.volNombre, fontSize: 15 }}>
                                        {vol?.nombre || 'Voluntario'}
                                    </p>
                                    {vol?.email && (
                                        <p style={s.volDetalle}>✉️ {vol.email}</p>
                                    )}
                                    {vol?.telefono && (
                                        <p style={s.volDetalle}>📱 {vol.telefono}</p>
                                    )}
                                    {ofertaAceptada.mensaje && (
                                        <p style={{ ...s.volDetalle, marginTop: 4, color: '#4b5563' }}>
                                            💬 "{ofertaAceptada.mensaje}"
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ── Estilos ───────────────────────────────────────────────────────────────────
const s = {
    btnVolver: {
        display: 'flex', alignItems: 'center', gap: 8,
        background: '#111827', color: '#fff', border: 'none',
        borderRadius: 10, padding: '10px 16px', cursor: 'pointer',
        fontWeight: 600, marginBottom: 20, fontSize: 13,
    },
    btnSecundario: {
        background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 8,
        padding: '8px 16px', cursor: 'pointer', fontSize: 13,
    },
    tabs: {
        display: 'flex', gap: 8, marginBottom: 20,
        borderBottom: '2px solid #f3f4f6', paddingBottom: 0,
    },
    tab: {
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '10px 18px', borderRadius: '10px 10px 0 0',
        border: 'none', background: 'transparent', cursor: 'pointer',
        fontSize: 14, fontWeight: 500, color: '#6b7280',
        borderBottom: '2px solid transparent', marginBottom: -2,
    },
    tabActive: {
        color: '#111827', fontWeight: 700,
        borderBottom: '2px solid #111827', background: '#f9fafb',
    },
    tabBadge: {
        background: '#111827', color: '#fff',
        borderRadius: 99, fontSize: 10, fontWeight: 700,
        padding: '1px 7px',
    },
    card: {
        background: '#fff', border: '1px solid #e5e7eb',
        borderRadius: 16, padding: '20px', transition: 'box-shadow 0.2s',
    },
    cardHeader: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', gap: 12, flexWrap: 'wrap',
    },
    cardTitle: { fontSize: 16, fontWeight: 700, margin: 0, color: '#111827' },
    cardDesc:  { fontSize: 13, color: '#6b7280', margin: '4px 0 0', lineHeight: 1.5 },
    badge: {
        display: 'inline-block', padding: '2px 10px',
        borderRadius: 99, fontSize: 12, fontWeight: 500,
    },
    btnVerOfertas: {
        background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 8,
        padding: '7px 14px', fontSize: 13, fontWeight: 500,
        color: '#374151', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
    },
    ofertasPanel: {
        marginTop: 16, paddingTop: 14, borderTop: '1px solid #e5e7eb',
        borderRadius: 10, padding: 14, background: '#f9fafb',
        border: '1px solid #f0f0f0',
    },
    ofertasTitle: { fontSize: 13, fontWeight: 700, color: '#374151', margin: '0 0 12px' },
    emptyOfertas: {
        fontSize: 13, color: '#9ca3af', textAlign: 'center', padding: '10px 0',
    },
    ofertaCard: {
        background: '#fff', border: '1px solid #e5e7eb',
        borderRadius: 10, padding: '12px 14px', marginBottom: 10,
    },
    volAvatar: {
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: 'linear-gradient(135deg,#667eea,#764ba2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 700, fontSize: 15,
    },
    volNombre: { margin: 0, fontSize: 14, fontWeight: 700, color: '#111827' },
    volDetalle: { margin: '2px 0 0', fontSize: 12, color: '#6b7280' },
    btnAceptar: {
        background: '#10b981', border: 'none', borderRadius: 8,
        padding: '8px 14px', fontSize: 12, fontWeight: 600,
        color: 'white', cursor: 'pointer', transition: 'background 0.2s',
    },
    btnRechazar: {
        background: 'white', border: '1px solid #fca5a5', borderRadius: 8,
        padding: '8px 14px', fontSize: 12, fontWeight: 600,
        color: '#dc2626', cursor: 'pointer',
    },
    emptyBox: {
        textAlign: 'center', padding: '40px 20px',
        background: '#f9fafb', borderRadius: 16, border: '1px dashed #e5e7eb',
    },
};

export default MisSolicitudes;