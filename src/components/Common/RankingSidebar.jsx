import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const RankingSidebar = () => {
    const [ranking, setRanking] = useState([]);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const res = await api.get('/ranking/mensual');
                setRanking(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchRanking();
    }, []);

    return (
        <aside className="ranking-sidebar">
            <h3>🏆 Ranking de Guerreros del mes</h3>
            {ranking.map((item, idx) => (
                <div key={item.id}>
                    {idx + 1}. {item.voluntario?.nombre || 'Voluntario'} - {item.puntos} pts
                </div>
            ))}
        </aside>
    );
};

export default RankingSidebar;