import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute: React.FC = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen bg-wood-50">Carregando...</div>;
    }

    if (!user || user.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
