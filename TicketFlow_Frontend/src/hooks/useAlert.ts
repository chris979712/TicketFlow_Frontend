import { type AlertType } from "../components/Alert";
import { useState } from "react";

export function useAlert(){
    const [alert, setAlert] = useState<{type: AlertType, message: string} | null>(null);

    return {
        alert,
        setAlert
    }
}