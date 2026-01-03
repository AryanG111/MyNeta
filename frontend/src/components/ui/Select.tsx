import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: SelectOption[];
    placeholder?: string;
    error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, options, placeholder, error, ...props }, ref) => {
        return (
            <div className="relative">
                <select
                    ref={ref}
                    className={cn(
                        'flex h-10 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 py-2 pr-10 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                        error && 'border-red-500 focus:ring-red-500',
                        className
                    )}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 pointer-events-none" />
                {error && (
                    <p className="mt-1 text-sm text-red-500">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';
