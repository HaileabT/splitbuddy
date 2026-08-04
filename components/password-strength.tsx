import { passwordCriteria, validatePassword } from "@/lib/utils/strings";
import { Check, X } from "lucide-react";

interface PasswordStrengthIndicatorProps {
    password: string;
}

function PasswordCriteriaItem({cKey, isValid}: {cKey: keyof typeof passwordCriteria, isValid: boolean}) {
    return (
        <div className="flex items-center gap-2">
            <span>{isValid ? <Check className="text-success size-4" /> : <X className="text-destructive size-4" />}</span>
            <span className={isValid ? "text-foreground text-sm" : "text-muted-foreground text-sm"}>{passwordCriteria[cKey]}</span>
        </div>
    )
}

export function PasswordStrengthIndicator({password}: PasswordStrengthIndicatorProps) {
    const results = validatePassword(password);
    console.log(results)
    return (
        <div className="flex flex-col gap-2">
           {results.pass.map(k => {
            return <PasswordCriteriaItem key={k} cKey={k} isValid />
           })}
           {results.fail.map(k => {
            return <PasswordCriteriaItem key={k} cKey={k} isValid={false} />
           })}
        </div>
    )
}