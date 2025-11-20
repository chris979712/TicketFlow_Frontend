import { useState, type FormEvent } from 'react';
import { useAlert } from '../../../hooks/useAlert';
import {useStripe,useElements} from '@stripe/react-stripe-js';

export function useCheckOutForm(){
    const stripe = useStripe();
    const elements = useElements();
    const {alert,setAlert} = useAlert();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) {
            return;
        }
        setIsLoading(true);
        setAlert(null);
        setMessage("");
        try{
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/dashboard-attendee/payment-reservation/completion`,
                },
            });
            if (error) {
                const errorMessage = error.message || "Ha ocurrido un error inesperado.";
                const alertType = (error.type === "card_error" || error.type === "validation_error") ? "warning" : "error";
                setAlert({type: alertType,message: errorMessage});
                setMessage(errorMessage);
            }
        }catch(error){
            setAlert({type: "error", message: "Error de conexión. Por favor intenta nuevamente."});
            setMessage("Error de conexión. Por favor intenta nuevamente.");
        }finally{
            setIsLoading(false);
        }
    };

    const paymentElementOptions = {
        layout: "tabs" as const 
    };

    return {
        alert,
        setAlert,
        paymentElementOptions,
        message,
        isLoading,
        handleSubmit,
        stripe,
        elements
    }
}