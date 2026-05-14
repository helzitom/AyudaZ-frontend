import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const AdminRoute = ({ children }) => {
    const { backendUser, loading } = useAuth();
    if (loading) return <div>Cargando...</div>;
    return backendUser?.tipoUsuario === 'admin' ? children : <Navigate to="/dashboard" />;
};

export default AdminRoute;