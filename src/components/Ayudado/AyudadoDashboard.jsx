import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import CrearSolicitud from './CrearSolicitud';
import MisSolicitudes from './MisSolicitudes';
import RankingSidebar from '../Common/RankingSidebar';
import Navbar from '../Common/Navbar';

const AyudadoDashboard = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [ofertas, setOfertas] = useState({});

  const cargarSolicitudes = async () => {
    const res = await api.get('/solicitudes/mis-solicitudes');
    setSolicitudes(res.data);
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const verOfertas = async (solicitudId) => {
    const res = await api.get(`/solicitudes/${solicitudId}/ofertas`);
    setOfertas(prev => ({ ...prev, [solicitudId]: res.data }));
  };

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
      <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
        <Navbar />
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '32px 24px',
        }}>
          <div className="animate-fadeUp" style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 24,
          }}>
            {/* Contenido principal */}
            <div style={{
              flex: 2,
              minWidth: 280,
              background: 'white',
              borderRadius: 24,
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.02)',
              padding: '28px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 28,
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  background: '#fee2e2', // rojo suave
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
                <h2 style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#111827',
                  margin: 0,
                }}>
                  Mis solicitudes de ayuda
                </h2>
              </div>
              <CrearSolicitud onCreada={cargarSolicitudes} />
              <div style={{ marginTop: 32 }}>
                <MisSolicitudes solicitudes={solicitudes} verOfertas={verOfertas} ofertas={ofertas} />
              </div>
            </div>

            {/* Sidebar */}
            <div style={{
              flex: 1,
              minWidth: 260,
            }}>
              <RankingSidebar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AyudadoDashboard;