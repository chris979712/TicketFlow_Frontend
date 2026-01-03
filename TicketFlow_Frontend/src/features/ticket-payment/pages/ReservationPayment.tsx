import { Link } from 'react-router-dom';
import Countdown from 'react-countdown';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Alert } from '../../../components/Alert';
import { ConfirmModal } from '../../../components/Modal';
import { CheckOutForm } from '../components/CheckOutForm';
import { RendererCountdown } from '../components/RendererCountdow';
import { useReservationPayment } from '../hooks/useReservationPayment';
import TicketFlowWhiteLogo from '../../../../public/Logo_Blanco_horizontal.png';
import './ReservationPayment.css';

const STRIPE = import.meta.env.VITE_STRIPE;
const StripePromise = loadStripe(STRIPE);

export default function ReservationPayment(){
    const {
        alert,
        setAlert,
        clientSecret,
        reservation,
        countdownEnd,
        HandleCountdownFinished,
        showModal,
        HandleAccept,
        HandleCancel,
        handleReturn,
        isAttendee
    } = useReservationPayment();

    return (
        isAttendee && (
            <div className='tp-payment-page-container'>
                {
                    alert && (
                        <div aria-live="assertive">
                            <Alert
                                type={alert.type}
                                message={alert.message}
                                onClose={() => setAlert(null)}
                            />
                        </div>
                    )
                }
                <header className="tp-header-attendee" role="banner">
                    <div className='tp-div_welcome'>
                        <img
                            src={TicketFlowWhiteLogo}
                            alt=""
                            aria-hidden="true"
                        />

                        <Link
                            className="link-return"
                            to="/dashboard-attendee"
                            onClick={handleReturn}
                            aria-label="Regresar al panel principal"
                        >
                            Regresar
                        </Link>
                    </div>

                    <h1 className="tp-page-title">
                        Pago de reserva de boletos
                    </h1>

                    <strong
                        className='tp-page-warning'
                        role="alert"
                    >
                        Abandonar esta página hará inválida su reserva y deberá volver a realizarla o esperar a que los asientos estén disponibles.
                    </strong>
                </header>

                <section
                    className='tp-payment-section'
                    aria-label="Proceso de pago de reserva"
                >
                    <ConfirmModal 
                        isOpen={showModal}
                        title='¿Desea salir del pago de reserva?'
                        message='Al salir del pago de reserva, su reserva será inválida y tendra que volver a escoger asientos o esperar a que se liberen.'
                        onConfirm={HandleAccept}
                        onCancel={HandleCancel}
                    />

                    {
                        clientSecret && (
                            <Elements stripe={StripePromise} options={{ clientSecret }}>
                                <div className='tp-payment-layout'>
                                    <div
                                        className='tp-payment-form'
                                        aria-live="polite"
                                    >
                                        <Countdown
                                            date={countdownEnd}
                                            onComplete={HandleCountdownFinished}
                                            renderer={RendererCountdown}
                                        />
                                        <CheckOutForm />
                                    </div>
                                    <aside
                                        className='tp-summary-content'
                                        aria-label="Resumen de la compra"
                                    >
                                        <h2 className='tp-summary-title'>
                                            Resúmen de compra
                                        </h2>
                                        <div className="tp-resume-grid">
                                            <span>Cantidad de boletos a comprar:</span>
                                            <span>{reservation?.payment_snapshot.ticketQuantity} boleto(s)</span>
                                            <span>Subtotal:</span>
                                            <span>$ {reservation?.payment_snapshot.subtotal} pesos</span>
                                            <span>Impuestos IVA({reservation?.payment_snapshot.tax_percentage}%):</span>
                                            <span>$ {reservation?.payment_snapshot.tax_amount} pesos</span>
                                            <div className="tp-resume-separator"></div>
                                            <span className="tp-summary-total">Total a pagar:</span>
                                            <span className="tp-summary-total-value">
                                                $ {reservation?.payment_snapshot.total_amount} pesos
                                            </span>
                                        </div>
                                    </aside>
                                </div>
                            </Elements>
                        )
                    }
                </section>
            </div>
        )
    )
}
