import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForgotPasswordMutation } from '@/hooks/use-auth';
import { forgotPasswordSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import type { z } from 'zod';

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
    const [isSuccess, setIsSuccess] = useState(false);
    const { mutate: forgotPassword, isPending } = useForgotPasswordMutation();

    const form = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = (data: ForgotPasswordFormData) => {
        forgotPassword(data, {
            onSuccess: () => {
                setIsSuccess(true);
            },
            onError: (error: any) => {
                const errorMessage = error.response?.data?.message;
                console.log('Forgot Password Error :', error);
                toast.error(errorMessage);
            },
        });
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="w-full max-w-md space-y-6">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
                        <CardDescription className="text-muted-foreground mb-5">
                            Enter your email to reset your password
                        </CardDescription>
                        <Link to="/auth/sign-in" className="flex items-center gap-2 max-w-[150px]">
                            <Button
                                variant={'ghost'}
                                className="text-blue-500 cursor-pointer hover:bg-transparent hover:text-blue-700"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back to sign in</span>
                            </Button>
                        </Link>
                    </CardHeader>

                    <CardContent>
                        {isSuccess ? (
                            <div className="flex flex-col items-center justify-center">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                                <h1 className="text-2xl font-bold">Password reset email sent</h1>
                                <p className="text-muted-foreground">
                                    Check your email for a link to reset your password
                                </p>
                            </div>
                        ) : (
                            <>
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="space-y-4"
                                    >
                                        <FormField
                                            name="email"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email Address</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="email"
                                                            {...field}
                                                            placeholder="Enter your email"
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
                                                'Reset Password'
                                            )}
                                        </Button>
                                    </form>
                                </Form>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
