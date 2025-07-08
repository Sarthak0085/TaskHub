import { postData } from '@/lib/fetch-util';
import type { SignUpFormData } from '@/pages/auth/sign-up';
import { useMutation } from '@tanstack/react-query';

// sign up mutation
export const useSignUpMutation = () => {
    return useMutation({
        mutationFn: (data: SignUpFormData) => postData('/auth/register', data),
    });
};

// sign in mutation
export const useSignInMutation = () => {
    return useMutation({
        mutationFn: (data: { email: string; password: string }) => postData('/auth/login', data),
    });
};

// verify twofa enabled mutation
export const useVerifyTwoFAEnabledMutation = () => {
    return useMutation({
        mutationFn: (data: any) => postData('/auth/verify-twofa-enabled', data),
    });
};

// verify email mutation
export const useVerifyEmailMutation = () => {
    return useMutation({
        mutationFn: (data: { token: string }) => postData('/auth/verify-email', data),
    });
};

// forgot password mutation
export const useForgotPasswordMutation = () => {
    return useMutation({
        mutationFn: (data: { email: string }) => postData('/auth/forgot-password', data),
    });
};

// reset password mutation
export const useResetPasswordMutation = () => {
    return useMutation({
        mutationFn: (data: { token: string; newPassword: string; confirmPassword: string }) =>
            postData('/auth/reset-password', data),
    });
};
