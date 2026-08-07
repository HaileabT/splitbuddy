import { cn } from "@/lib/utils";

interface LazyTextProps {
    isLoading?: boolean;
    text?: React.ReactNode;
    failed?: boolean;
    fallback?: React.ReactNode;
    className?: string;
    loadingClassName?: string;
}

export function LazyText({ isLoading, text, failed, fallback, className, loadingClassName }: LazyTextProps) {
    if (isLoading) {
        return (
            <span
                className={cn(
                    "inline-block w-20 h-[1.1em] min-h-4 bg-foreground/20 animate-pulse rounded align-middle",
                    loadingClassName
                )}
            />
        );
    }

    if (failed) {
        return <span className={cn(className)}>{fallback}</span>;
    }

    return <span className={cn(className)}>{text}</span>;
}