import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { AuthProvider } from './auth-context';

export const queryClient = new QueryClient();

export default function ReactQueryProvider({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                {children}
                <Toaster position="top-right" richColors />
            </AuthProvider>
        </QueryClientProvider>
    );
}
