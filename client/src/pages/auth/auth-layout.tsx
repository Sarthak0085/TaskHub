import Loader from '@/components/loader';
import { useAuth } from '@/providers/auth-context';
import { Navigate, Outlet } from 'react-router-dom';

export default function AuthLayout() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <Loader />;
    }

    if (isAuthenticated) {
        return <Navigate to={'/dashboard'} />;
    }

    return <Outlet />;
}
