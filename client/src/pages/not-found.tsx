import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800">404</h1>
                <p className="text-xl text-gray-600 mt-2">Page Not Found</p>
                <p className="text-sm text-gray-500 mt-1">
                    The page you are looking for doesn’t exist or has been moved.
                </p>
                <Button className="mt-6 cursor-pointer" onClick={() => navigate('/')}>
                    Go back to Home
                </Button>
            </div>
        </div>
    );
}
