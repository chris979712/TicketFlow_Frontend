import { useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import './Alert.css'

export type AlertType = "success" | "error" | "warning";

interface AlertProps{
    type: AlertType,
    message: string,
    onClose: () => void;
    duration?: number
}

export function Alert({type,message,onClose,duration = 3000}: AlertProps){
    useEffect(() => {
        const timer = setTimeout(onClose,duration);
        return () => clearTimeout(timer);
    }, [onClose,duration]);

    const icons = {
        success: <CheckCircle className="alert-icon success" />,
        error: <XCircle className="alert-icon error" />,
        warning: <AlertTriangle className="alert-icon warning" />,
    };

    return (
        <div className={`alert-container ${type}`}>
            {icons[type]}
        <div className="alert-text">
            <strong>
            {type === "success" && "¡Éxito!"}
            {type === "error" && "¡Error!"}
            {type === "warning" && "¡Advertencia!"}
            </strong>
            <p>{message}</p>
        </div>
        </div>
    )
}