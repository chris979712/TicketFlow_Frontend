import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../hooks/useAlert";
import { useStripe } from "@stripe/react-stripe-js";

export function useCompletionContent(){
    const stripe = useStripe();
    const navigate = useNavigate();
    const {alert,setAlert} = useAlert();
    const [isChecking, setIsChecking] = useState(true);
    const COUNTDOWN_KEY = 'reservation_countdown_end';

    useEffect(() => {
        if (!stripe) return;
        const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");
        if (!clientSecret) {
            setAlert({ type: "error", message: "No se encontró información del pago." });
            setIsChecking(false);
            setTimeout(() => navigate("/dashboard-attendee"), 3000);
            return;
        }
        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            setIsChecking(false);
            if(!paymentIntent){
                setAlert({ 
                    type: "error", 
                    message: "No se pudo verificar el pago." 
                });
                return;
            }
            switch (paymentIntent.status) {
                case "succeeded":
                    setAlert({ 
                        type: "success", 
                        message: "¡Pago exitoso! Tus boletos han sido confirmados. Redirigiendo..." 
                    });
                    setTimeout(() => {
                        navigate("/dashboard-attendee");
                    }, 3000);
                    break;
                case "processing":
                    setAlert({ 
                        type: "warning", 
                        message: "Tu pago está siendo procesado. Te notificaremos cuando se complete." 
                    });
                    setTimeout(() => {
                        navigate("/dashboard-attendee");
                    }, 5000);
                    break;
                case "requires_payment_method":
                    setAlert({
                        type: "warning",
                        message: "El pago no fue completado. Por favor, intenta con otro método de pago."
                    });
                    setTimeout(() => {
                        navigate("/reservation-payment"); 
                    }, 3000);
                    break;
                case "requires_action":
                    setAlert({
                        type: "warning",
                        message: "Se requiere autenticación adicional para completar el pago."
                    });
                    setTimeout(() => {
                        navigate("/dashboard-attendee");
                    }, 3000);
                    break;
                case "canceled":
                    setAlert({
                        type: "error",
                        message: "El pago fue cancelado."
                    });
                    setTimeout(() => {
                        navigate("/dashboard-attendee");
                    }, 3000);
                    break;
                default:
                    setAlert({
                        type: "error",
                        message: "Ocurrió un error inesperado al procesar el pago."
                    });
                    setTimeout(() => {
                        navigate("/dashboard-attendee");
                    }, 3000);
            }
        }).catch((error) => {
            setIsChecking(false);
            console.log(error);
            setAlert({
                type: "error",
                message: "Error al verificar el estado del pago."
            });
        });;
    }, [stripe, navigate, setAlert]);

    useEffect(() => {
        sessionStorage.removeItem(COUNTDOWN_KEY);
    }, []);

    return {
        isChecking,
        alert,
        setAlert
    }
}