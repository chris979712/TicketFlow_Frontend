import { Alert } from '../../../components/Alert';
import {PaymentElement} from '@stripe/react-stripe-js';
import { useCheckOutForm } from '../hooks/useCheckOutForm';

export function CheckOutForm() {
    const {alert,setAlert,paymentElementOptions,message,isLoading,handleSubmit, stripe, elements} = useCheckOutForm();

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
                {message && <p className="payment-message">{message}</p>}
            </form>
        </>
    );
}