import { cn } from "@/lib/utils";

interface LazyTextProps {
    isLoading: boolean;
    text: React.ReactNode,
    failed?: boolean,
    fallback?: React.ReactNode
    className?: string,
}
export function LazyText({ isLoading, text, failed, fallback, className }: LazyTextProps) {
    return (
        isLoading ? <span className={cn("w-full h-6 bg-foreground/70", className)}></span> : failed ? <span className={cn(className)}>{fallback}</span> : <span className={cn(className)}>{text}</span>
    )
}