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
import { useResetPasswordMutation } from '@/hooks/use-auth';
import { resetPasswordSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import type { z } from 'zod';

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
    const [searchParams] = useSearchParams();

    const token = searchParams.get('token');

    const [isSuccess, setIsSuccess] = useState(false);
    const { mutate: resetPassword, isPending } = useResetPasswordMutation();

    const form = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        },
    });

    const onSubmit = (values: ResetPasswordFormData) => {
        if (!token) {
            toast.error('Invalid token');
            return;
        }

        resetPassword(
            { ...values, token: token as string },
            {
                onSuccess: () => {
                    setIsSuccess(true);
                },
                onError: (error: any) => {
                    const errorMessage = error.response?.data?.message;
                    toast.error(errorMessage);
                    console.log('Reset Password Error :', error);
                },
            }
        );
    };
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="w-full max-w-md space-y-6">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                        <CardDescription className="text-muted-foreground mb-5">
                            Enter your password below
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
                                <h1 className="text-2xl font-bold">Password reset successful</h1>
                            </div>
                        ) : (
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        name="newPassword"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>New Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="*********"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        name="confirmPassword"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="*********"
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
                                            'Reset Password'
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
