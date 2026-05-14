import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import VoluntarioDashboard from './components/Voluntario/VoluntarioDashboard';
import AyudadoDashboard from './components/Ayudado/AyudadoDashboard';
import AdminPanel from './components/Admin/AdminPanel';
import PrivateRoute from './components/Common/PrivateRoute';
import AdminRoute from './components/Common/AdminRoute';
import useAuth from './hooks/useAuth';
import MisSolicitudes from './components/Ayudado/MisSolicitudes';

// Componente que decide qué dashboard mostrar según el rol
const DashboardRouter = () => {
  const { backendUser, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (!backendUser) return <div>Error al cargar usuario</div>;

  // --- Nueva pantalla para ayudados pendientes (estilizada) ---
  if (backendUser.tipoUsuario === 'ayudado' && backendUser.estado === 'pendiente') {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}>
        <div style={{
          background: 'white',
          borderRadius: 24,
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.02)',
          padding: '40px 32px',
          maxWidth: 480,
          width: '100%',
          textAlign: 'center',
        }}>
          <div style={{
            width: 64,
            height: 64,
            background: '#fef3c7',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
              <path d="M12 2L1 21h22L12 2zm1 14h-2v-2h2v2zm0-4h-2V8h2v4z" />
            </svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 12 }}>
            Cuenta pendiente de aprobación
          </h2>
          <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6, marginBottom: 8 }}>
            Tu solicitud de ayuda está siendo revisada por un administrador.
          </p>
          <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6, marginBottom: 28 }}>
            Recibirás un correo cuando tu cuenta sea activada.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              background: '#0f1117',
              border: 'none',
              borderRadius: 10,
              padding: '12px 24px',
              fontSize: 14,
              fontWeight: 600,
              color: 'white',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#1f2937'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#0f1117'}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // Resto de la lógica original (sin cambios)
  if (backendUser.tipoUsuario === 'voluntario') return <VoluntarioDashboard />;
  if (backendUser.tipoUsuario === 'ayudado') return <AyudadoDashboard />;
  if (backendUser.tipoUsuario === 'admin') return <AdminPanel />;
  return <div>Rol no válido</div>;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardRouter />
            </PrivateRoute>
          } />
          <Route path="/mis-solicitudes" element={
            <PrivateRoute>
              <MisSolicitudes />
            </PrivateRoute>
          } />
          <Route path="/admin" element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;