import { useEffect } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { Alert } from "../../../components/Alert";
import { useAlert } from "../../../hooks/useAlert";

export default function Completion() {
    const stripe = useStripe();
    const navigate = useNavigate();
    const {alert,setAlert} = useAlert();

    useEffect(() => {
        if (!stripe) return;
        const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");
        if (!clientSecret) {
            setAlert({ type: "error", message: "No se encontró información del pago." });
            return;
        }
        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        switch (paymentIntent!.status) {
            case "succeeded":
                setAlert({ type: "success", message: "Pago exitoso. Redirigiendo..." });
                setTimeout(() => {
                    navigate("/dashboard-attendee");
                }, 3000);
                break;
            case "processing":
                setAlert({ type: "warning", message: "Su pago se está procesando..." });
                break;
            case "requires_payment_method":
                setAlert({
                    type: "warning",
                    message: "El pago no fue completado. Intente nuevamente."
                });
                setTimeout(() => {
                    navigate("/dashboard-attendee");
                }, 3000);
                break;
            default:
                setAlert({
                    type: "error",
                    message: "⚠ Ocurrió un error inesperado al procesar el pago."
                });
        }
        });
    }, [stripe, navigate]);

    return (
        <section className="completion-section">
        {alert && (
            <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
            />
        )}
        </section>
    );
}
