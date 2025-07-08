import { signInSchema } from '@/lib/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useSignInMutation } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { useAuth } from '@/providers/auth-context';
import { Loader2 } from 'lucide-react';

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignIn() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { mutate, isPending } = useSignInMutation();

    const form = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmitHandler = (values: SignInFormData) => {
        mutate(values, {
            onSuccess: (data: any) => {
                if (data?.requires2FA) {
                    form.reset();
                    toast.success(data?.message);
                    navigate(`/auth/verify-otp?token=${data?.token}`);
                } else {
                    login(data);
                    toast.success('Login Successful');
                    form.reset();
                    navigate('/dashboard');
                }
            },
            onError: (error: any) => {
                const errorMessage = error.response?.data?.message || 'An error occurred';
                console.log('Login Error :', error);
                toast.error(errorMessage);
            },
        });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
            <div className="w-full max-w-md space-y-6 shadow-xl">
                <Card>
                    <CardHeader className="text-center mb-5">
                        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                        <CardDescription>Sign In to your account to continue</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmitHandler)}
                                className="space-y-6"
                            >
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="email@example.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center justify-between">
                                                <FormLabel>Password</FormLabel>
                                                <Link
                                                    to={'/auth/forgot-password'}
                                                    className="text-sm text-blue-600 hover:underline"
                                                >
                                                    forgot password?
                                                </Link>
                                            </div>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="********"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full cursor-pointer bg-blue-500 hover:bg-blue-700"
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        'Sign In'
                                    )}
                                </Button>
                            </form>
                        </Form>
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
