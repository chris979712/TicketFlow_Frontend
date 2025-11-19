import { useState, type FormEvent } from 'react';
import {useStripe,useElements,PaymentElement} from '@stripe/react-stripe-js';
import { Alert } from '../../../components/Alert';
import { useAlert } from '../../../hooks/useAlert';

export function CheckOutForm() {
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
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/dashboard-attendee/payment-reservation/completion`,
            },
        });
        if (error.type === "card_error" || error.type === "validation_error") {
            setAlert({
                type: "warning",
                message: error.message!
            })
            setMessage(error.message!);
        } else {
            setAlert({
                type: "warning",
                message: error.message || "Ha ocurrido un error inesperado."
            })
            setMessage(error.message!);
        }
        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "tabs" as const 
    };

    return (
        <>
            {alert && (
                    <Alert
                        type={alert.type}
                        message={alert.message}
                        onClose={() => setAlert(null)}
                    />
                )}
            <form onSubmit={handleSubmit} className="payment-form">
                <PaymentElement options={paymentElementOptions} />
                <button disabled={isLoading || !stripe || !elements}className="pay-button">
                    {isLoading ? 'Procesando...' : 'Pagar ahora'}
                </button>
                {message && <div className="payment-message">{message}</div>}
            </form>
        </>
    );
}