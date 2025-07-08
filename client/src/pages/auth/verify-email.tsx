import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useVerifyEmailMutation } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle, Loader, XCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [isSuccess, setIsSuccess] = useState(false);
    const { mutate, isPending: isVerifying } = useVerifyEmailMutation();

    useEffect(() => {
        if (token) {
            mutate(
                { token },
                {
                    onSuccess: () => {
                        setIsSuccess(true);
                        toast.success('Email verified successfully.', {
                            description: 'You can log in now.',
                        });
                    },
                    onError: (error: any) => {
                        const errorMessage = error.response?.data?.message || 'An error occurred';
                        console.error(error);
                        setIsSuccess(false);
                        toast.error(errorMessage);
                    },
                }
            );
        }
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Verify Email</CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                        Verifying your email
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-6 ">
                        {isVerifying ? (
                            <>
                                <Loader className="w-10 h-10 text-gray-500 animate-spin" />
                                <h3 className="text-lg font-semibold">Verifying email...</h3>
                                <p className="text-sm text-gray-500">
                                    Please wait while we verify your email.
                                </p>
                            </>
                        ) : isSuccess ? (
                            <>
                                <CheckCircle className="w-10 h-10 text-green-500" />
                                <h3 className="text-lg font-semibold">Email Verified</h3>
                                <p className="text-sm text-gray-500">
                                    Your email has been verified successfully.
                                </p>
                                <Link to="/auth/sign-in" className="text-sm text-blue-500 mt-6">
                                    <Button variant="outline" className="cursor-pointer">
                                        <ArrowLeft className="w-4 h-4" /> Back to Sign in
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <XCircle className="w-10 h-10 text-red-500" />
                                <h3 className="text-lg font-semibold">Email Verification Failed</h3>
                                <p className="text-sm text-gray-500">
                                    Your email verification failed. Please try again.
                                </p>

                                <Link to="/auth/sign-in" className="text-sm text-blue-500 mt-6">
                                    <Button variant="outline" className="cursor-pointer">
                                        <ArrowLeft className="w-4 h-4" /> Back to Sign in
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
