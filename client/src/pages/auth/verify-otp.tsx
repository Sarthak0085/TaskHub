import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { useVerifyTwoFAEnabledMutation } from '@/hooks/use-auth';
import { useAuth } from '@/providers/auth-context';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function Verify2FAEnabledOtp() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [value, setValue] = useState('');

    const token = searchParams.get('token');

    const { mutate, isPending } = useVerifyTwoFAEnabledMutation();

    const handleVerify = () => {
        if (!value || value.length < 6) return toast.info('Please enter the otp');
        mutate(
            { token: token, otp: value },
            {
                onSuccess: (data: any) => {
                    login(data);
                    toast.success('Login Successful');
                    navigate('/dashboard');
                },
                onError: (error: any) => {
                    const errorMessage = error?.response?.data?.message || 'Failed to Login';
                    console.error('Login Failed Error :', error);
                    toast.error(errorMessage);
                },
            }
        );
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
            <div className="w-full max-w-md space-y-6 shadow-xl">
                <Card>
                    <CardHeader className="text-center mb-5">
                        <div className="text-start!">
                            <BackButton />
                        </div>
                        <CardTitle className="text-2xl font-bold">
                            Two Factor Verification
                        </CardTitle>
                        <CardDescription>Enter your 6 digit OTP sent to your email</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3 w-full flex flex-col items-center justify-center">
                        <Label>Enter the code sent to your email</Label>
                        <InputOTP
                            maxLength={6}
                            pattern={REGEXP_ONLY_DIGITS}
                            value={value}
                            onChange={(value) => setValue(value)}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                            </InputOTPGroup>
                            <InputOTPGroup>
                                <InputOTPSlot index={1} />
                            </InputOTPGroup>
                            <InputOTPGroup>
                                <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPGroup>
                                <InputOTPSlot index={3} />
                            </InputOTPGroup>
                            <InputOTPGroup>
                                <InputOTPSlot index={4} />
                            </InputOTPGroup>
                            <InputOTPGroup>
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                        <Button
                            variant={'default'}
                            className="w-[80%] mt-2"
                            onClick={handleVerify}
                            disabled={isPending}
                        >
                            {isPending ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="size-4 animate-spin" />
                                    <span>Verifying...</span>
                                </div>
                            ) : (
                                <span>Verify & Sign In</span>
                            )}
                        </Button>
                    </CardContent>

                    <CardFooter>
                        <div className="w-full flex items-center justify-center">
                            <p>
                                Don&apos;t have an account?{' '}
                                <Link to={'/auth/sign-up'} className="underline text-blue-500">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
