import { useState } from 'react';
import {Eye, EyeOff} from 'lucide-react'
import React from 'react';
import './Input.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>{
    label?: string;
    error?: string;
    iconSize?: number;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({label, iconSize, type = "text", error, icon, ...props}, ref) => {
        const [showPassword,setShowPassword] = useState(false);
        const isPassword = type === 'password';
        const toggleVisibility = () => {
            setShowPassword(!showPassword);
        }
        return(
            <div className='input-wrapper'>
                {label && (
                    <label 
                        htmlFor={props.id}
                        className='input-label'>
                        {label}
                    </label>
                )}
                <div className='input-container'>
                    <input 
                        type={isPassword && showPassword ? "text" : type}
                        ref={ref}
                        className={`input-field`}
                        {...props}/>
                    {
                        isPassword && (
                            <button
                                type="button"
                                className="btn-toggle-password"
                                onClick={toggleVisibility}
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword ? <EyeOff size={iconSize ? iconSize : 27}/> : <Eye size={iconSize ? iconSize : 27}/>}
                            </button>
                        )
                    }
                </div>
                {error && <p className='error-input-message'>{error}</p>}
            </div>
            
        );
    }
)
Input.displayName = "Input";