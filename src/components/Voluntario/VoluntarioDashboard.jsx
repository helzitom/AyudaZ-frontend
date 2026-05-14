import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import OfertaCard from './OfertaCard';
import RankingSidebar from '../Common/RankingSidebar';
import Navbar from '../Common/Navbar';

// Categorías predefinidas
const CATEGORIAS = ["Todas", "Alimentos", "Transporte", "Cuidado de Niños", "Educación", "Salud", "Hogar", "Otro"];

const VoluntarioDashboard = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState("Todas");
    const [filtroCategoria, setFiltroCategoria] = useState("Todas");

    useEffect(() => {
        const fetchSolicitudes = async () => {
            try {
                setLoading(true);
                const res = await api.get('/solicitudes/activas');
                console.log('Solicitudes cargadas:', res.data);
                setSolicitudes(res.data || []);
            } catch (error) {
                console.error('Error al cargar solicitudes:', error);
                setSolicitudes([]);
            } finally {
                setLoading(false);
            }
        };
        fetchSolicitudes();
    }, []);

    const ofrecerAyuda = async (solicitudId, mensaje) => {
        try {
            await api.post(`/solicitudes/${solicitudId}/ofrecer`, mensaje, {
                headers: { 'Content-Type': 'text/plain' }
            });
            alert('✅ Ofrecimiento enviado correctamente');
            // Recargar solicitudes para actualizar el estado
            const res = await api.get('/solicitudes/activas');
            setSolicitudes(res.data || []);
        } catch (error) {
            console.error('Error al ofrecer ayuda:', error);
            alert('❌ Error al enviar el ofrecimiento. Intenta nuevamente.');
        }
    };

    // Calcular estadísticas basadas en las solicitudes reales
    const stats = {
        total: solicitudes.length,
        abiertas: solicitudes.filter(s => s.estado?.toLowerCase() === 'activa').length,
        enProgreso: solicitudes.filter(s => s.estado?.toLowerCase() === 'en-progreso' || s.estado?.toLowerCase() === 'en_progreso').length,
        completadas: solicitudes.filter(s => s.estado?.toLowerCase() === 'completada').length,
    };

    // Filtrar solicitudes según estado y categoría
    const solicitudesFiltradas = solicitudes.filter(s => {
        // Filtro por estado
        let estadoOk = true;
        if (filtroEstado === "Abiertas") {
            estadoOk = s.estado?.toLowerCase() === 'activa';
        } else if (filtroEstado === "Progreso") {
            estadoOk = s.estado?.toLowerCase() === 'en-progreso' || s.estado?.toLowerCase() === 'en_progreso';
        } else if (filtroEstado === "Completadas") {
            estadoOk = s.estado?.toLowerCase() === 'completada';
        }
        
        // Filtro por categoría
        let categoriaOk = true;
        if (filtroCategoria !== "Todas") {
            categoriaOk = s.categoria?.toLowerCase() === filtroCategoria.toLowerCase();
        }
        
        return estadoOk && categoriaOk;
    });

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", background: "#f3f4f6" }}>
                <Navbar />
                <div style={{ textAlign: "center", padding: "48px" }}>
                    <p>Cargando solicitudes...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#f3f4f6" }}>
            <Navbar />
            <main style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px" }}>
                {/* Banner informativo */}
                <div style={{
                    background: "#eff6ff", border: "1.5px solid #bfdbfe",
                    borderRadius: 16, padding: "16px 20px",
                    display: "flex", gap: 14, marginBottom: 24,
                }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: "#3b82f6", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                        </svg>
                    </div>
                    <div>
                        <p style={{ fontSize: 15, fontWeight: 700, color: "#1e40af", marginBottom: 4 }}>
                            Panel de Voluntarios – Apoyo Comunitario
                        </p>
                        <p style={{ fontSize: 13, color: "#1d4ed8", lineHeight: 1.6 }}>
                            Estas son las solicitudes activas de personas en situación de vulnerabilidad. 
                            Puedes ofrecer tu ayuda en aquellas donde puedas colaborar. Cada aporte suma puntos en 
                            el ranking de solidaridad.
                        </p>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>
                    {/* Columna principal */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        {/* Tarjetas de estadísticas */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                            <StatCard icon="doc" label="TOTAL" value={stats.total} />
                            <StatCard icon="check-blue" label="ABIERTAS" value={stats.abiertas} />
                            <StatCard icon="clock" label="EN PROGRESO" value={stats.enProgreso} />
                            <StatCard icon="check-green" label="COMPLETADAS" value={stats.completadas} />
                        </div>

                        {/* Panel de filtros */}
                        <div style={{
                            background: "#ffffff", border: "1.5px solid #e5e7eb",
                            borderRadius: 16, padding: 20,
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M3 6h18M7 12h10M11 18h2" />
                                </svg>
                                <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Filtros</span>
                                {(filtroEstado !== "Todas" || filtroCategoria !== "Todas") && (
                                    <button
                                        onClick={() => {
                                            setFiltroEstado("Todas");
                                            setFiltroCategoria("Todas");
                                        }}
                                        style={{
                                            marginLeft: "auto",
                                            fontSize: 12,
                                            color: "#3b82f6",
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            textDecoration: "underline"
                                        }}
                                    >
                                        Limpiar filtros
                                    </button>
                                )}
                            </div>

                            {/* Tabs de estado */}
                            <div style={{
                                display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
                                background: "#f3f4f6", borderRadius: 12,
                                padding: 4, gap: 2, marginBottom: 12,
                            }}>
                                {["Todas", "Abiertas", "Progreso", "Completadas"].map(t => (
                                    <button key={t} onClick={() => setFiltroEstado(t)} style={{
                                        padding: "8px 4px", border: "none", borderRadius: 10,
                                        fontSize: 13, fontWeight: filtroEstado === t ? 600 : 400,
                                        background: filtroEstado === t ? "white" : "transparent",
                                        color: filtroEstado === t ? "#111827" : "#6b7280",
                                        cursor: "pointer",
                                        boxShadow: filtroEstado === t ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
                                        transition: "all 0.15s",
                                    }}>{t}</button>
                                ))}
                            </div>

                            {/* Tags de categoría */}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                {CATEGORIAS.map(c => (
                                    <button key={c} onClick={() => setFiltroCategoria(c)} style={{
                                        padding: "5px 14px",
                                        border: "1.5px solid " + (filtroCategoria === c ? "#111827" : "#e5e7eb"),
                                        borderRadius: 999,
                                        background: filtroCategoria === c ? "#111827" : "transparent",
                                        color: filtroCategoria === c ? "white" : "#4b5563",
                                        fontSize: 13, fontWeight: filtroCategoria === c ? 600 : 400,
                                        cursor: "pointer", transition: "all 0.15s",
                                    }}>{c}</button>
                                ))}
                            </div>
                        </div>

                        {/* Resultados de la búsqueda */}
                        <div style={{ padding: "0 4px" }}>
                            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>
                                Mostrando {solicitudesFiltradas.length} de {solicitudes.length} solicitudes
                            </p>
                        </div>

                        {/* Grid de solicitudes */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                            {solicitudesFiltradas.length === 0 ? (
                                <div style={{
                                    gridColumn: "1/-1", textAlign: "center", padding: "48px 0",
                                    color: "#6b7280", fontSize: 14,
                                }}>
                                    {solicitudes.length === 0 ? (
                                        <>
                                            <p>No hay solicitudes activas en este momento.</p>
                                            <p style={{ fontSize: 12, marginTop: 8 }}>Las nuevas solicitudes aparecerán aquí automáticamente.</p>
                                        </>
                                    ) : (
                                        <p>No hay solicitudes que coincidan con los filtros seleccionados.</p>
                                    )}
                                </div>
                            ) : (
                                solicitudesFiltradas.map(solicitud => (
                                    <OfertaCard
                                        key={solicitud.id}
                                        solicitud={solicitud}
                                        onOfrecer={ofrecerAyuda}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Sidebar ranking */}
                    <div style={{
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 16,
                        overflow: "hidden",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        position: "sticky",
                        top: 80,
                    }}>
                        <RankingSidebar />
                    </div>
                </div>
            </main>
        </div>
    );
};

// Componente de tarjeta de estadística
function StatCard({ icon, label, value }) {
    const icons = {
        "doc": <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /></svg>,
        "check-blue": <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" /></svg>,
        "clock": <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
        "check-green": <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" /></svg>,
    };

    return (
        <div style={{
            background: "#ffffff", border: "1.5px solid #e5e7eb",
            borderRadius: 16, padding: "16px",
            display: "flex", alignItems: "center", gap: 12,
            transition: "all 0.2s",
        }}>
            <div style={{
                width: 44, height: 44, borderRadius: 10, background: "#f9fafb",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>{icons[icon]}</div>
            <div>
                <p style={{ fontSize: 26, fontWeight: 800, lineHeight: 1, color: "#111827" }}>{value}</p>
                <p style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, marginTop: 3, letterSpacing: "0.05em" }}>{label}</p>
            </div>
        </div>
    );
}

export default VoluntarioDashboard;