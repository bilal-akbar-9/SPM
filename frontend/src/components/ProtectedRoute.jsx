// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import useUserStore from '../hooks/useUserStore';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useUserStore();
  
  if (!user) return <Navigate to="/" />;
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/errorPage" />;
  }
  
  return children;
};

export default ProtectedRoute;