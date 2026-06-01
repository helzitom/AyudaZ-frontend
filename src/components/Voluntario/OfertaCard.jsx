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

    const [mostrarFormulario, setMostrarFormulario] =
        useState(false);

    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        ubicacion: '',
        telefono: '',
    });

    const urgenciaNivel = solicitud.urgencia;

    const urgenciaColor =
        URGENCIA_COLORS[urgenciaNivel] ||
        URGENCIA_COLORS[3];

    const urgenciaTexto =
        URGENCIA_LABEL[urgenciaNivel] ||
        `Urgencia ${urgenciaNivel}/5`;

    // =========================
    // ESTADO DE MI OFERTA
    // =========================

    const miOferta = solicitud.miOferta;

    const yaOfrecio =
        miOferta !== null &&
        miOferta !== undefined;

    const estadoOferta =
        miOferta?.estado?.toLowerCase();

    const solicitudActiva =
        solicitud.estado?.toLowerCase() === 'activa';

    const puedeOfrecer =
        !yaOfrecio && solicitudActiva;

    // =========================
    // MANEJO INPUTS
    // =========================

    const handleChange = (e) => {

        const { name, value } = e.target;

        // SOLO NUMEROS TELEFONO

        if (name === 'telefono') {

            const soloNumeros =
                value.replace(/\D/g, '');

            if (soloNumeros.length > 9) {
                return;
            }

            setFormData(prev => ({
                ...prev,
                [name]: soloNumeros
            }));

            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // =========================
    // ENVIAR OFERTA
    // =========================

    const handleSubmit = () => {

        if (!puedeOfrecer) {
            return;
        }

        const {
            nombres,
            apellidos,
            ubicacion,
            telefono
        } = formData;

        // VALIDACIONES

        if (
            !nombres.trim() ||
            !apellidos.trim() ||
            !ubicacion.trim() ||
            !telefono.trim()
        ) {

            alert(
                'Todos los campos son obligatorios'
            );

            return;
        }

        if (telefono.length !== 9) {

            alert(
                'El número debe tener 9 dígitos'
            );

            return;
        }

        // CONVERTIR A TEXTO

        const mensaje = `
NOMBRES: ${nombres}
APELLIDOS: ${apellidos}
UBICACIÓN: ${ubicacion}
TELÉFONO: ${telefono}
        `.trim();

        onOfrecer(
            solicitud.id,
            mensaje
        );

        // LIMPIAR

        setFormData({
            nombres: '',
            apellidos: '',
            ubicacion: '',
            telefono: '',
        });

        setMostrarFormulario(false);
    };

    return (
        <div
            style={{
                background: '#ffffff',
                border: '1.5px solid #e5e7eb',
                borderRadius: 18,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                boxShadow:
                    '0 4px 14px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease',
            }}
        >

            {/* BADGES */}

            <div
                style={{
                    display: 'flex',
                    gap: 8,
                    flexWrap: 'wrap'
                }}
            >

                <span
                    style={{
                        padding: '4px 12px',
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 600,
                        background: urgenciaColor.bg,
                        color: urgenciaColor.text,
                    }}
                >
                    {urgenciaTexto}
                </span>

                <span
                    style={{
                        padding: '4px 12px',
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                        background:
                            solicitudActiva
                                ? '#d1fae5'
                                : '#fee2e2',
                        color:
                            solicitudActiva
                                ? '#065f46'
                                : '#991b1b',
                    }}
                >
                    {solicitud.estado}
                </span>

            </div>

            {/* TITULO */}

            <h3
                style={{
                    fontSize: 18,
                    fontWeight: 800,
                    margin: 0,
                    color: '#111827',
                }}
            >
                {solicitud.titulo}
            </h3>

            {/* DESCRIPCION */}

            <p
                style={{
                    fontSize: 14,
                    color: '#6b7280',
                    margin: 0,
                    lineHeight: 1.6,
                }}
            >
                {solicitud.descripcion}
            </p>

            {/* UBICACION */}

            <div
                style={{
                    fontSize: 13,
                    color: '#4b5563',
                    fontWeight: 500,
                }}
            >
                📍 {solicitud.ubicacion}
            </div>

            {/* BOTON */}

            {!mostrarFormulario && (
                <button
                    onClick={() => {

                        if (!puedeOfrecer) {
                            return;
                        }

                        setMostrarFormulario(true);
                    }}
                    disabled={!puedeOfrecer}
                    style={{
                        width: '100%',
                        padding: '13px',
                        background:
                            puedeOfrecer
                                ? 'linear-gradient(to right, #111827, #1f2937)'
                                : '#9ca3af',
                        color: 'white',
                        border: 'none',
                        borderRadius: 12,
                        fontSize: 15,
                        fontWeight: 700,
                        cursor:
                            puedeOfrecer
                                ? 'pointer'
                                : 'not-allowed',
                        opacity:
                            puedeOfrecer
                                ? 1
                                : 0.7,
                        boxShadow:
                            puedeOfrecer
                                ? '0 8px 20px rgba(17,24,39,0.18)'
                                : 'none',
                        transition: 'all 0.2s ease',
                    }}
                >
                    {yaOfrecio
                        ? 'Ya enviaste ayuda'
                        : 'Ofrecer ayuda'}
                </button>
            )}

            {/* FORMULARIO */}

            {mostrarFormulario && (
                <div
                    style={{
                        marginTop: 10,
                        padding: 20,
                        borderRadius: 18,
                        background:
                            'linear-gradient(to bottom, #ffffff, #f8fafc)',
                        border: '1px solid #e5e7eb',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 16,
                        boxShadow:
                            '0 8px 24px rgba(15,23,42,0.06)',
                    }}
                >

                    <div>
                        <h4
                            style={{
                                margin: 0,
                                fontSize: 16,
                                fontWeight: 800,
                                color: '#111827',
                            }}
                        >
                            Datos del voluntario
                        </h4>

                        <p
                            style={{
                                margin: '4px 0 0 0',
                                fontSize: 13,
                                color: '#6b7280',
                            }}
                        >
                            Completa tu información para enviar la ayuda.
                        </p>
                    </div>

                    {/* NOMBRES */}

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 6
                        }}
                    >

                        <label
                            style={labelStyle}
                        >
                            Nombres
                        </label>

                        <input
                            type="text"
                            name="nombres"
                            placeholder="Ej. Juan Carlos"
                            value={formData.nombres}
                            onChange={handleChange}
                            style={inputStyle}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />

                    </div>

                    {/* APELLIDOS */}

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 6
                        }}
                    >

                        <label
                            style={labelStyle}
                        >
                            Apellidos
                        </label>

                        <input
                            type="text"
                            name="apellidos"
                            placeholder="Ej. Pérez Gómez"
                            value={formData.apellidos}
                            onChange={handleChange}
                            style={inputStyle}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />

                    </div>

                    {/* UBICACION */}

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 6
                        }}
                    >

                        <label
                            style={labelStyle}
                        >
                            Ubicación
                        </label>

                        <input
                            type="text"
                            name="ubicacion"
                            placeholder="Ej. San Juan de Lurigancho"
                            value={formData.ubicacion}
                            onChange={handleChange}
                            style={inputStyle}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />

                    </div>

                    {/* TELEFONO */}

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 6
                        }}
                    >

                        <label
                            style={labelStyle}
                        >
                            Número de teléfono
                        </label>

                        <input
                            type="text"
                            name="telefono"
                            placeholder="Ej. 987654321"
                            value={formData.telefono}
                            onChange={handleChange}
                            style={inputStyle}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />

                    </div>

                    {/* BOTONES */}

                    <div
                        style={{
                            display: 'flex',
                            gap: 10,
                            marginTop: 4,
                        }}
                    >

                        <button
                            onClick={handleSubmit}
                            style={{
                                flex: 1,
                                padding: '13px',
                                background:
                                    'linear-gradient(to right, #111827, #1f2937)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 12,
                                fontWeight: 700,
                                fontSize: 14,
                                cursor: 'pointer',
                                boxShadow:
                                    '0 6px 16px rgba(17,24,39,0.18)',
                            }}
                        >
                            Enviar ayuda
                        </button>

                        <button
                            onClick={() =>
                                setMostrarFormulario(false)
                            }
                            style={{
                                flex: 1,
                                padding: '13px',
                                background: '#eef2f7',
                                color: '#374151',
                                border: '1px solid #dbe3ee',
                                borderRadius: 12,
                                fontWeight: 700,
                                fontSize: 14,
                                cursor: 'pointer',
                            }}
                        >
                            Cancelar
                        </button>

                    </div>

                </div>
            )}

            {/* ESTADOS */}

            {estadoOferta === 'pendiente' && (
                <EstadoBox
                    bg="#fef3c7"
                    color="#92400e"
                    text="⏳ Solicitud enviada"
                />
            )}

            {estadoOferta === 'aceptada' && (
                <EstadoBox
                    bg="#d1fae5"
                    color="#065f46"
                    text="✅ Solicitud aceptada"
                />
            )}

            {estadoOferta === 'rechazada' && (
                <EstadoBox
                    bg="#fee2e2"
                    color="#991b1b"
                    text="❌ Solicitud rechazada"
                />
            )}

            {estadoOferta === 'cancelada' && (
                <EstadoBox
                    bg="#e5e7eb"
                    color="#374151"
                    text="🚫 Solicitud cancelada"
                />
            )}

        </div>
    );
};

// =========================
// COMPONENTE ESTADO
// =========================

function EstadoBox({ bg, color, text }) {

    return (
        <div
            style={{
                padding: '12px',
                background: bg,
                borderRadius: 12,
                fontSize: 13,
                textAlign: 'center',
                color: color,
                fontWeight: 700,
            }}
        >
            {text}
        </div>
    );
}

// =========================
// ESTILOS
// =========================

const labelStyle = {
    fontSize: 13,
    fontWeight: 700,
    color: '#374151',
};

const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 14,
    border: '1.5px solid #dbe3ee',
    fontSize: 14,
    fontWeight: 500,
    outline: 'none',
    boxSizing: 'border-box',
    background: '#f8fafc',
    color: '#111827',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
};

const handleFocus = (e) => {

    e.target.style.border =
        '1.5px solid #3b82f6';

    e.target.style.background =
        '#ffffff';

    e.target.style.boxShadow =
        '0 0 0 4px rgba(59,130,246,0.12)';
};

const handleBlur = (e) => {

    e.target.style.border =
        '1.5px solid #dbe3ee';

    e.target.style.background =
        '#f8fafc';

    e.target.style.boxShadow =
        '0 1px 2px rgba(0,0,0,0.03)';
};

export default OfertaCard;