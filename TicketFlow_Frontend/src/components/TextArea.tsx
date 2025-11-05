import React from 'react';
import './TextArea.css';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ label, error, ...props }, ref) => {
        return (
        <div className="input-wrapper">
            {label && (
            <label htmlFor={props.id} className="input-label">
                {label}
            </label>
            )}
            <textarea
            ref={ref}
            className="input-field textarea-field"
            {...props}
            />
            {error && <p className="error-input-message">{error}</p>}
        </div>
        );
    }
);

TextArea.displayName = "TextArea";
