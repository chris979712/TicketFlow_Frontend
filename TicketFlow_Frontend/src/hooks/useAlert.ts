import { type AlertType } from "../components/Alert";
import { useState } from "react";

interface AlertMessage {
    id: number;
    type: AlertType;
    message: string;
}

export function useAlert(){
    const [alert, setAlert] = useState<{type: AlertType, message: string} | null>(null);
    const [alerts, setAlerts] = useState<AlertMessage[]>([]);

    const addAlert = (type: AlertType, message: string, duration = 3000) => {
        const id = new Date().getTime();
        setAlerts(prev => [...prev, { id, type, message }]);
        setTimeout(() => {
            setAlerts(prev => prev.filter(a => a.id !== id));
        }, duration);
    };

    return {
        alert,
        setAlert,
        alerts,
        setAlerts,
        addAlert
    }
}