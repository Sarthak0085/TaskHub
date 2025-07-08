import { Button } from '@/components/ui/button';
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
import { useSignUpMutation } from '@/hooks/use-auth';
import { signUpSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { z } from 'zod';

export type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
    const navigate = useNavigate();
    const { mutate, isPending } = useSignUpMutation();

    const form = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmitHandler = (values: SignUpFormData) => {
        mutate(values, {
            onSuccess: () => {
                toast.success('Email Verification Required', {
                    description:
                        "Please check your email for a verification link. If you don't see it, please check your spam folder.",
                });

                form.reset();
                navigate('/auth/sign-in');
            },
            onError: (error: any) => {
                const errorMessage = error.response?.data?.message || 'An error occurred';
                console.log(error);
                toast.error(errorMessage);
            },
        });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
            <div className="w-full max-w-md space-y-6 shadow-xl">
                <Card>
                    <CardHeader className="text-center mb-5">
                        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                        <CardDescription>Create an account to continue</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmitHandler)}
                                className="space-y-6"
                            >
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="John Doe"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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
                                            <FormLabel>Password</FormLabel>
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
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
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
                                        'Create Account'
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>

                    <CardFooter>
                        <div className="w-full flex items-center justify-center">
                            <p>
                                Already have an account?{' '}
                                <Link to={'/auth/sign-in'} className="underline text-blue-500">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
