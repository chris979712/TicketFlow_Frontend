import { loadStripe } from '@stripe/stripe-js';
import { Alert } from "../../../components/Alert";
import { Elements } from '@stripe/react-stripe-js';
import { useCompletionContent } from '../hooks/useCompletionContent';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE);

function CompletionContent() {

    const {isChecking,alert,setAlert} = useCompletionContent()

    return (
        <section className="completion-section">
            {isChecking ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Verificando el estado de tu pago...</p>
                </div>
            ) : (
                alert && (
                    <Alert
                        type={alert.type}
                        message={alert.message}
                        onClose={() => setAlert(null)}
                    />
                )
            )}
        </section>
    );
}

export default function Completion() {
    return (
        <Elements stripe={stripePromise}>
            <CompletionContent />
        </Elements>
    );
}
