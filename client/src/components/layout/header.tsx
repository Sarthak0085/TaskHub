import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const Header = () => {
    const { user } = useAuth();
    return (
        <header className="w-full flex items-center justify-between border-b-1 gap-4 h-16">
            <Link to={'/'} className="flex items-center gap-1">
                <img src="/favicon-96x96.png" alt="logo" className="size-10" />
                <h1 className="text-xl font-bold text-blue-600">TaskHub</h1>
            </Link>
            {!user && (
                <div className="space-x-4">
                    <Link to={'/auth/sign-in'}>
                        <Button variant={'outline'} className="min-w-[100px]">
                            Log in
                        </Button>
                    </Link>
                    <Link to={'/auth/sign-up'}>
                        <Button variant={'default'} className="min-w-[100px]">
                            Get Started
                        </Button>
                    </Link>
                </div>
            )}
            {user && (
                <Link to={'/dashboard'}>
                    <Avatar className="size-8">
                        <AvatarImage src={user?.profilePicture} alt={user?.name} />
                        <AvatarFallback className="bg-blue-400 text-white">
                            {user?.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </Link>
            )}
        </header>
    );
};
