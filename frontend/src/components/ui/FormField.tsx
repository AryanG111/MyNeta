import * as React from "react"
import { Input, type InputProps } from "./Input"

interface FormFieldProps extends InputProps {
    label: string;
    error?: string;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
    ({ label, error, className, ...props }, ref) => {
        return (
            <div className={`space-y-2 ${className}`}>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {label}
                </label>
                <Input ref={ref} error={error} {...props} />
            </div>
        )
    }
)
FormField.displayName = "FormField"
