import Loader from '@/components/loader';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BackButton } from '@/components/ui/back-button';
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
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    useChangePasswordMutation,
    useGetUserProfileQuery,
    useToggleTwoFAEnabledMutation,
    useUpdateUserProfileMutation,
} from '@/hooks/use-user';
import { changePasswordSchema, profileSchema } from '@/lib/schema';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-context';
import type { User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { z } from 'zod';

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
    const { data, isLoading } = useGetUserProfileQuery() as {
        data: {
            user: User;
        };
        isLoading: boolean;
    };
    const { logout, setUser } = useAuth();
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(data?.user?.profilePicture);

    const { mutate: updateUserProfile, isPending: isUpdatingUserProfile } =
        useUpdateUserProfileMutation();
    const {
        mutate: changePassword,
        isPending: isChangingPassword,
        error,
    } = useChangePasswordMutation();
    const { mutate: toggle2FA, isPending: is2FAToggling } = useToggleTwoFAEnabledMutation();

    const passwordForm = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const profileForm = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: data?.user?.name || '',
            profilePicture: data?.user?.profilePicture || undefined,
        },
        values: {
            name: data?.user?.name || '',
            profilePicture: data?.user?.profilePicture || undefined,
        },
    });

    const handleUpdateProfile = (values: ProfileFormData) => {
        updateUserProfile(values, {
            onSuccess: (data: any) => {
                toast.success('Profile updated successfully');
                profileForm.reset();
                setUser(data?.user);
            },
            onError: (error: any) => {
                const errorMessage = error?.response?.data?.message || 'Failed to update profile';
                console.error('Profile Update Error :', error);
                toast.error(errorMessage);
            },
        });
    };

    const handleToggling2FAEnabled = () => {
        toggle2FA(data?.user?.is2FAEnabled, {
            onSuccess: () => {
                toast.success(
                    data?.user?.is2FAEnabled
                        ? 'Disabled 2FA successfully'
                        : 'Enabled 2FA successfully'
                );
            },
            onError: (error: any) => {
                const errorMessage =
                    error?.response?.data?.message || 'Failed to toggle 2FA Eanbled';
                console.error('Enable 2FA Error :', error);
                toast.error(errorMessage);
            },
        });
    };

    const handleChangePassword = (values: ChangePasswordFormData) => {
        changePassword(values, {
            onSuccess: () => {
                const message =
                    'Password updated successfully. You will be logged out. Please login again.';
                toast.success(message);
                passwordForm.reset();

                setTimeout(() => {
                    logout();
                    navigate('/auth/sign-in');
                }, 3000);
            },
            onError: (error: any) => {
                const errorMessage =
                    error?.response?.data?.message || 'Error while updating password';
                console.error('Change Password Error :', error);
                toast.error(errorMessage);
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.readyState === 2) {
                    setSelectedFile(reader.result as string);
                    profileForm.setValue('profilePicture', reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="space-y-8">
            <div className="px-4 md:px-0">
                <BackButton />
                <h3 className="text-lg font-medium">Profile Information</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>

            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...profileForm}>
                        <form
                            onSubmit={profileForm.handleSubmit(handleUpdateProfile)}
                            className="grid gap-4"
                        >
                            <div className="flex items-center space-x-4 mb-6">
                                <Avatar className="size-20">
                                    <AvatarImage
                                        key={selectedFile || 'default-avatar'}
                                        src={selectedFile || data?.user?.profilePicture}
                                        alt={data?.user?.name}
                                    />
                                    <AvatarFallback className="text-xl bg-blue-400 text-white">
                                        {data?.user?.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div>
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                    />
                                    <Button
                                        size={'sm'}
                                        variant={'outline'}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            document.getElementById('avatar-upload')?.click();
                                        }}
                                    >
                                        Upload Avatar
                                    </Button>
                                </div>
                            </div>
                            <FormField
                                control={profileForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Enter your full name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    defaultValue={data?.user?.email}
                                    readOnly
                                    disabled
                                />
                                <p className="text-xs text-muted-foreground">
                                    Your email address cannot be changed.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="w-fit"
                                disabled={isUpdatingUserProfile || isChangingPassword}
                            >
                                {isUpdatingUserProfile ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Update your password</CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...passwordForm}>
                        <form
                            onSubmit={passwordForm.handleSubmit(handleChangePassword)}
                            className="grid gap-4"
                        >
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        {(error as any)?.response?.data.message}
                                    </AlertDescription>
                                </Alert>
                            )}
                            <div className="grid gap-2">
                                <FormField
                                    control={passwordForm.control}
                                    name="currentPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Current Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="current-password"
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
                                    control={passwordForm.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="new-password"
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
                                    control={passwordForm.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>confirm Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="confirm-password"
                                                    type="password"
                                                    placeholder="********"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-fit"
                                disabled={isLoading || isChangingPassword}
                            >
                                {isLoading || isChangingPassword ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Password'
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
                    <CardDescription>
                        Add an extra layer of security to your account. When enabled, you will be
                        required to enter a code sent to your email after logging in
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <h4
                        className={cn(
                            'text-sm font-semibold',
                            data?.user?.is2FAEnabled ? 'text-emerald-500' : 'text-yellow-500'
                        )}
                    >
                        {data?.user?.is2FAEnabled ? '2FA is enabled' : '2FA is not enabled'}
                    </h4>
                    <Button
                        variant={data?.user?.is2FAEnabled ? 'destructive' : 'default'}
                        className="my-2"
                        onClick={handleToggling2FAEnabled}
                        disabled={is2FAToggling}
                    >
                        {data?.user?.is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
