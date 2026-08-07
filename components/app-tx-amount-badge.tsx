"use client";

interface AppTxAmountBadgeProps {
    amount: number | string;
    role: "owner" | "member";
    className?: string;
}

export function AppTxAmountBadge({ amount, role, className = "" }: AppTxAmountBadgeProps) {
    if (typeof amount === "string"
    ) {
        amount = amount.replaceAll(",", "")
    }
    const amtNum = Number(amount || "0");
    const isOwner = role === "owner";
    const isPositive = amtNum >= 0;

    let badgeText = "";
    let colorClass = "";

    if (isOwner) {
        if (isPositive) {
            badgeText = "member owes";
            colorClass = "bg-success/8 text-success";
        } else {
            badgeText = "you owe";
            colorClass = "bg-destructive/8 text-destructive";
        }
    } else {
        if (isPositive) {
            badgeText = "you owe";
            colorClass = "bg-destructive/8 text-destructive";
        } else {
            badgeText = "you paid";
            colorClass = "bg-success/8 text-success";
        }
    }

    return (
        <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded-md ${colorClass} ${className}`}>
            {badgeText}
        </span>
    );
}
