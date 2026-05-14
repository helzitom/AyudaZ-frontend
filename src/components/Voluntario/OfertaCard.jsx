import React, { useState } from 'react';

// Colores para badges según nivel de urgencia
const URGENCIA_COLORS = {
    1: { bg: '#fef3c7', text: '#92400e' },
    2: { bg: '#ffedd5', text: '#9a3412' },
    3: { bg: '#fee2e2', text: '#991b1b' },
    4: { bg: '#fecaca', text: '#7f1d1d' },
    5: { bg: '#f87171', text: '#ffffff' },
};

const URGENCIA_LABEL = {
    1: 'Urgencia Baja',
    2: 'Urgencia Moderada',
    3: 'Urgencia Alta',
    4: 'Urgencia Muy Alta',
    5: 'Urgencia Crítica',
};

const OfertaCard = ({ solicitud, onOfrecer }) => {
    const [ofrecido, setOfrecido] = useState(false);

    const handleClick = () => {
        const mensaje = prompt('Escribe un mensaje para el solicitante:');
        if (mensaje) {
            onOfrecer(solicitud.id, mensaje);
            setOfrecido(true);
        }
    };

    const urgenciaNivel = solicitud.urgencia;
    const urgenciaColor = URGENCIA_COLORS[urgenciaNivel] || URGENCIA_COLORS[3];
    const urgenciaTexto = URGENCIA_LABEL[urgenciaNivel] || `Urgencia ${urgenciaNivel}/5`;

    // Estado por defecto (abierta) ya que no se recibe estado en la solicitud original
    const estado = { label: 'Abierta', dot: '#f59e0b', color: '#f59e0b' };

    return (
        <div
            style={{
                background: '#ffffff',
                border: '1.5px solid #e5e7eb',
                borderRadius: 16,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                transition: 'box-shadow 0.2s',
            }}
        >
            {/* Badges */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {/* Badge de urgencia */}
                <span
                    style={{
                        padding: '3px 10px',
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 500,
                        background: urgenciaColor.bg,
                        color: urgenciaColor.text,
                    }}
                >
                    {urgenciaTexto}
                </span>

                {/* Badge de estado (siempre "Abierta" mientras no esté ofrecido/completado) */}
                <span
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '3px 10px',
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 500,
                        border: '1.5px solid #e5e7eb',
                        color: '#4b5563',
                    }}
                >
                    <span
                        style={{
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            background: estado.dot,
                            display: 'inline-block',
                        }}
                    />
                    {estado.label}
                </span>
            </div>

            {/* Título */}
            <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>
                {solicitud.titulo}
            </h3>

            {/* Descripción */}
            <p
                style={{
                    fontSize: 14,
                    color: '#6b7280',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    margin: 0,
                }}
            >
                {solicitud.descripcion}
            </p>

            {/* Meta (solo mostramos urgencia numérica) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ display: 'flex', gap: 6, fontSize: 13, color: '#4b5563' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13z" />
                    </svg>
                    Nivel de urgencia: {solicitud.urgencia}/5
                </div>
            </div>

            {/* Botón (solo si no se ha ofrecido ya) */}
            {!ofrecido && (
                <button
                    onClick={handleClick}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: '#0f1117',
                        color: 'white',
                        border: 'none',
                        borderRadius: 10,
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: 'pointer',
                        marginTop: 4,
                        transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#1f2937')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#0f1117')}
                >
                    Ofrecer ayuda
                </button>
            )}

            {/* Mensaje si ya ofreció ayuda */}
            {ofrecido && (
                <div
                    style={{
                        marginTop: 8,
                        padding: '10px',
                        background: '#f3f4f6',
                        borderRadius: 10,
                        fontSize: 13,
                        textAlign: 'center',
                        color: '#4b5563',
                        fontWeight: 500,
                    }}
                >
                    ✓ Ya ofreciste ayuda para esta solicitud
                </div>
            )}
        </div>
    );
};

export default OfertaCard;