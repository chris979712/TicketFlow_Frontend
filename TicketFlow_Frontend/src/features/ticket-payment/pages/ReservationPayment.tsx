import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import { CheckOutForm } from '../components/CheckOutForm';
import {useState, useEffect} from 'react';
import { PostStripePayment } from '../services/ReservationPayment';
import { useReservationStore, type Reservation } from '../hooks/useReservationStore';
import { Alert } from '../../../components/Alert';
import { useAlert } from '../../../hooks/useAlert';
import { useNavigate } from 'react-router-dom';
import { useHandleSession } from '../../../hooks/useHandleSession';
import TicketFlowWhiteLogo from '../../../../public/Logo_Blanco_horizontal.png';
import { Link } from 'react-router-dom';
import './ReservationPayment.css'
const STRIPE = import.meta.env.VITE_STRIPE;
const StripePromise = loadStripe(STRIPE);

type PaymentSnapshot = {
    subtotal: number,
    tax_percentage: number,
    tax_amount: number,
    total_amount: number,
    ticketQuantity: number
}

type SeatSnapshot = {
    id: number,
    price: number
}

type StripePayment = {
    stripe_client_secret: string,
    payment_snapshot: PaymentSnapshot,
    seats: SeatSnapshot[];
    reservations: Reservation[]
}

export default function ReservationPayment(){
    const [clientSecret, setClientSecret] = useState('');
    const {reservation} = useReservationStore();
    const {alert,setAlert} = useAlert();
    const {handleLogout} = useHandleSession();
    const Navigate = useNavigate();

    function ObtainAllReservationId(reservation: Reservation[]): number[]{
        return reservation.flatMap(reservation => reservation.seats).map(seat => seat.event_seat_id!);
    }

    function MapStripePaymentResponse(data: any): StripePayment {
        return {
            stripe_client_secret: data.stripe_client_secret,
            payment_snapshot: {
                subtotal: data.payment_snapshot.subtotal,
                tax_percentage: data.payment_snapshot.tax_percentage,
                tax_amount: data.payment_snapshot.tax_amount,
                total_amount: data.payment_snapshot.total_amount,
                ticketQuantity: data.payment_snapshot.ticket_quantity
            },
            seats: data.seats.map((s: any) => ({
                id: s.id,
                price: s.price
            })),
            reservations: data.reservations.map((r: any) => ({
                reservation_id: r.id,
                attendee_id: 0,       
                status: "active",      
                expiration_at: r.expires_at
            }))
        };
    }

    useEffect(() => {
        const GetClientSecret = async () => {
            const ReservationsID = ObtainAllReservationId(reservation);
            const ApiResponse = await PostStripePayment(ReservationsID);
            if(ApiResponse.status === 200){
                const Payment: StripePayment = MapStripePaymentResponse(ApiResponse.data);
                setClientSecret(Payment.stripe_client_secret)
            }else if(ApiResponse.status === 401 || ApiResponse.status === 403){
                setAlert({type: "warning", message: ApiResponse.message!})
                setTimeout(() => {
                    handleLogout();
                    Navigate('/');
                },5000)
            }else if(ApiResponse.status === 409){
                setAlert({type: "warning", message: ApiResponse.message!});
                setTimeout(() => {
                    Navigate('/dashboard-attendee');
                },5000)
            }else{
                setAlert({type: "error", message: ApiResponse.message!});
                setTimeout(() => {
                    handleLogout();
                    Navigate('/');
                },5000)
            }
        }
        if(!clientSecret && reservation.length > 0){
            GetClientSecret();
        }
    },[])

    return (
        <>
            {
                alert && 
                <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)}/>
            }
            <header className="header-attendee">
                <div className='div_welcome'>
                    <img src={TicketFlowWhiteLogo} alt="Ticket flog logo color blanco" title="logo de ticket flow"/>
                    <Link className="link-return" to="/dashboard-attendee">Regresar</Link>
                </div>
                <h1 className="page-title">Pago de reserva de boletos</h1>
            </header>
            <section className='payment-section'>
                {
                    clientSecret && (
                        <Elements stripe={StripePromise} options={{clientSecret}}>
                            <CheckOutForm />
                        </Elements>
                    )
                }
            </section>
        </>
    )
}