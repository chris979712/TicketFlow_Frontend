import { Link } from 'react-router-dom';
import Countdown from 'react-countdown';
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import { Alert } from '../../../components/Alert';
import { ConfirmModal } from '../../../components/Modal';
import { CheckOutForm } from '../components/CheckOutForm';
import { RendererCountdown } from '../components/RendererCountdow';
import { useReservationPayment } from '../hooks/useReservationPayment';
import TicketFlowWhiteLogo from '../../../../public/Logo_Blanco_horizontal.png';
import './ReservationPayment.css'
const STRIPE = import.meta.env.VITE_STRIPE;
const StripePromise = loadStripe(STRIPE);

export default function ReservationPayment(){
    const {alert,setAlert,clientSecret,reservation,countdownEnd,HandleCountdownFinished,showModal,HandleAccept,HandleCancel,handleReturn,isAttendee} = useReservationPayment();

    return (
        isAttendee && (
            <>
                {
                    alert && 
                    <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)}/>
                }
                <header className="header-attendee">
                    <div className='div_welcome'>
                        <img src={TicketFlowWhiteLogo} alt="Ticket flog logo color blanco" title="logo de ticket flow"/>
                        <Link className="link-return" to="/dashboard-attendee" onClick={handleReturn}>Regresar</Link>
                    </div>
                    <h1 className="page-title">Pago de reserva de boletos</h1>
                    <strong className='page-warning'>Abandonar esta página hará inválida su reserva y deberá volver a realizarla o esperar a que los asientos estén disponibles.</strong>
                </header>
                <section className='payment-section'>
                    <ConfirmModal 
                        isOpen={showModal}
                        title='¿Desea salir del pago de reserva?'
                        message='Al salir del pago de reserva, su reserva será inválida y tendra que volver a escoger asientos o esperar a que se liberen.'
                        onConfirm={HandleAccept}
                        onCancel={HandleCancel}
                    />
                    {
                        clientSecret && (
                            <Elements stripe={StripePromise} options={{clientSecret}}>
                                <div className='payment-layout'>
                                    <div className='payment-form'>
                                        <Countdown date={countdownEnd} onComplete={HandleCountdownFinished} renderer={RendererCountdown}/>
                                        <CheckOutForm />
                                    </div>
                                    <aside className='summary-content'>
                                        <h2 className='summary-title'>Resúmen de compras</h2>
                                        <div className="resume-grid">
                                            <span>Cantidad de boletos a comprar:</span>
                                            <span>{reservation?.payment_snapshot.ticketQuantity} $</span>
                                            <span>Subtotal:</span>
                                            <span>{reservation?.payment_snapshot.subtotal} $</span>
                                            <span>Impuestos {reservation?.payment_snapshot.tax_percentage}:</span>
                                            <span>{reservation?.payment_snapshot.tax_amount} $</span>
                                            <div className="resume-separator"></div>
                                            <span className="summary-total">Total a pagar:</span>
                                            <span className="summary-total-value">{reservation?.payment_snapshot.total_amount} $</span>
                                        </div>
                                    </aside>
                                </div>
                            </Elements>
                        )
                    }
                </section>
            </>
        )
    )
}