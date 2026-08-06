interface LazyTextProps {
    isLoading: boolean;
    text: React.ReactNode,
    failed?: boolean,
    fallback?: React.ReactNode
}
export function LazyText({ isLoading, text, failed, fallback }: LazyTextProps) {
    return (
        isLoading ? <span className="w-full h-6 bg-foreground/70"></span> : failed ? <span>{fallback}</span> : <span>{text}</span>
    )
}