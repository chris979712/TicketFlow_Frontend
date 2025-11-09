import React from 'react';
import './Select.css';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    placeHolder?: string,
    options: { value: string | number; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options,placeHolder = "-- Selecciona una opción --", ...props }, ref) => {
        return (
        <div className="input-wrapper">
            {label && (
                <label htmlFor={props.id} className="input-label">
                    {label}
                </label>
            )}
            <select ref={ref} className="input-field select-field" {...props}>
                <option value="">{placeHolder}</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                        {opt.label}
                        </option>
                    ))}
            </select>
        </div>
        );
    }
);

Select.displayName = 'Select';
