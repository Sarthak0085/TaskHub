import { inviteMemberSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Check, Copy, Mail } from 'lucide-react';
import { useInvitationMemberMutation } from '@/hooks/use-workspace';
import { toast } from 'sonner';

interface InviteMemberProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    workspaceId: string;
}

export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;

export const InviteMember = ({ isOpen, onOpenChange, workspaceId }: InviteMemberProps) => {
    const [inviteTab, setInviteTab] = useState<string>('email');
    const [linkCopied, setLinkCopied] = useState<boolean>(false);

    const form = useForm<InviteMemberFormData>({
        resolver: zodResolver(inviteMemberSchema),
        defaultValues: {
            email: '',
            role: 'MEMBER',
        },
    });

    const { mutate, isPending } = useInvitationMemberMutation();

    const onSubmit = async (values: InviteMemberFormData) => {
        if (!workspaceId) return;
        mutate(
            {
                workspaceId,
                values,
            },
            {
                onSuccess: () => {
                    toast.success('Invitation sent successfully');
                    form.reset();
                    setInviteTab('email');
                    onOpenChange(false);
                },
                onError: (error: any) => {
                    const errorMessage =
                        error?.response?.data?.message || 'Error while sending invitation';
                    console.error('Invitation sent error : ', error);
                    toast.error(errorMessage);
                },
            }
        );
    };

    const handleCopyInviteLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/workspace-invite/${workspaceId}`);

        setLinkCopied(true);

        setTimeout(() => {
            setLinkCopied(false);
        }, 3000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite to workspace</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="email" value={inviteTab} onValueChange={setInviteTab}>
                    <TabsList>
                        <TabsTrigger value="email">Email</TabsTrigger>
                        <TabsTrigger value="link">Share Link</TabsTrigger>
                    </TabsList>

                    {/* Email  */}
                    <TabsContent value="email">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)}>
                                        <div className="flex flex-col space-y-6 w-full">
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email Address</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="email"
                                                                placeholder="Enter email address"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="role"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="mb-2">
                                                            Select Role
                                                        </FormLabel>
                                                        <FormControl>
                                                            <RadioGroup
                                                                defaultValue={field.value}
                                                                onValueChange={field.onChange}
                                                                className="flex"
                                                            >
                                                                {['ADMIN', 'MEMBER', 'VIEWER'].map(
                                                                    (value) => (
                                                                        <FormItem
                                                                            key={value}
                                                                            className="flex items-center gap-3"
                                                                        >
                                                                            <FormControl>
                                                                                <RadioGroupItem
                                                                                    id={value}
                                                                                    value={value}
                                                                                />
                                                                            </FormControl>
                                                                            <FormLabel
                                                                                htmlFor={value}
                                                                                className="font-normal"
                                                                            >
                                                                                {value}
                                                                            </FormLabel>
                                                                        </FormItem>
                                                                    )
                                                                )}
                                                            </RadioGroup>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <Button
                                            className="mt-6 w-full"
                                            size={'lg'}
                                            disabled={isPending}
                                        >
                                            <Mail className="size-4 mr-2" />
                                            Send
                                        </Button>
                                    </form>
                                </Form>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Share Link  */}
                    <TabsContent value="link">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label>Share this link to invite people</Label>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        className="text-blue-600"
                                        readOnly
                                        value={`${window.location.origin}/workspace-invite/${workspaceId}`}
                                    />

                                    <Button onClick={handleCopyInviteLink} disabled={isPending}>
                                        {linkCopied ? (
                                            <>
                                                <Check className="mr-2 size-4" />
                                                Copied
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="mr-2 size-4" />
                                                Copy
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Anyone with the link can join this workspace
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};
