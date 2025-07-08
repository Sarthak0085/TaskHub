import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden font-semibold',
    {
        variants: {
            variant: {
                default:
                    'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
                secondary:
                    'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
                success:
                    'border-transparent bg-emerald-500 text-primary-foreground [a&]:hover:bg-emerald-500/90',
                destructive:
                    'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
                primary:
                    'border-transparent bg-orange-500 text-white [a&]:hover:bg-orange-500/90 focus-visible:ring-orange-500/20 dark:focus-visible:ring-orange-500/40 dark:bg-orange-500/60',
                muted: 'border-transparent bg-muted-foreground text-white [a&]:hover:bg-muted-foreground/90 focus-visible:ring-muted-foreground/20 dark:focus-visible:ring-muted-foreground/40 dark:bg-muted-foreground/60',
                outline: 'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

function Badge({
    className,
    variant,
    asChild = false,
    ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : 'span';

    return (
        <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
