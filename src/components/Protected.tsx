import type { ReactNode } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('user' | 'admin')[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { token, role } = useAuth();
  const navigate = useNavigate();
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (token && role==='user') {
    return <Navigate to="/" replace />;
  }
  if (token && role==='admin') {
    navigate('/admin')
    //return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
} 