import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const medallas = ['🥇', '🥈', '🥉'];

const RankingSidebar = () => {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/ranking/mensual')
            .then(res => setRanking(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <aside style={s.sidebar}>
            <div style={s.header}>
                <span style={s.trophy}>🏆</span>
                <div>
                    <h3 style={s.title}>Ranking de Guerreros</h3>
                    <p style={s.subtitle}>Top del mes</p>
                </div>
            </div>

            {loading && <p style={s.empty}>Cargando...</p>}
            {!loading && ranking.length === 0 && (
                <p style={s.empty}>Aún no hay datos este mes.</p>
            )}

            {ranking.map((item, idx) => (
                <div key={item.id} style={{
                    ...s.row,
                    background: idx === 0 ? '#fefce8' : '#fff',
                    borderColor: idx === 0 ? '#fde68a' : '#f3f4f6',
                }}>
                    <span style={s.pos}>
                        {medallas[idx] ?? `#${idx + 1}`}
                    </span>

                    <div style={s.info}>
                        <p style={s.nombre}>
                            {item.voluntario?.nombre || 'Voluntario'}
                        </p>
                        <p style={s.ayudas}>
                            {item.ayudasCompletadas} {item.ayudasCompletadas === 1 ? 'ayuda' : 'ayudas'}
                        </p>
                    </div>

                    <span style={{
                        ...s.badge,
                        background: idx === 0 ? '#fef3c7' : '#f3f4f6',
                        color: idx === 0 ? '#92400e' : '#6b7280',
                    }}>
                        {item.puntos} pts
                    </span>
                </div>
            ))}
        </aside>
    );
};

const s = {
    sidebar: {
        background: '#fff', borderRadius: 20,
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        padding: 20, border: '1px solid #f3f4f6',
    },
    header: {
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid #f3f4f6',
    },
    trophy: { fontSize: 28 },
    title: { fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 },
    subtitle: { fontSize: 12, color: '#9ca3af', margin: '2px 0 0' },
    row: {
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 12px', borderRadius: 10, border: '1px solid',
        marginBottom: 8,
    },
    pos: { fontSize: 18, flexShrink: 0, width: 28, textAlign: 'center' },
    info: { flex: 1, minWidth: 0 },
    nombre: {
        margin: 0, fontSize: 13, fontWeight: 600, color: '#111827',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    },
    ayudas: { margin: '2px 0 0', fontSize: 11, color: '#9ca3af' },
    badge: { padding: '3px 8px', borderRadius: 99, fontSize: 11, fontWeight: 700, flexShrink: 0 },
    empty: { fontSize: 13, color: '#9ca3af', textAlign: 'center', padding: '12px 0' },
};

export default RankingSidebar;