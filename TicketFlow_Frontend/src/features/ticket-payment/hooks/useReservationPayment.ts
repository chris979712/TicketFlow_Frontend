import {useState, useEffect} from 'react';
import { useNavigate} from 'react-router-dom';
import { useAlert } from '../../../hooks/useAlert';
import { PostStripePayment } from '../services/ReservationPayment';
import { useHandleSession } from '../../../hooks/useHandleSession';
import { useReservationStore, type Reservation } from '../hooks/useReservationStore';
import { useEventSaleStore } from '../../main-menu-attendee/hooks/useEventSaleStore';
import { useNavigationAttendee } from '../../main-menu-attendee/hooks/useNavigationAttendee';

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

export type StripePayment = {
    stripe_client_secret: string,
    payment_snapshot: PaymentSnapshot,
    seats: SeatSnapshot[];
    reservations: Reservation[]
}

export function useReservationPayment(){
    const COUNTDOWN_KEY = 'reservation_countdown_end';
    const COUNTDOWN_DURATION = 600000;
    const {isAttendee} = useNavigationAttendee();
    const [clientSecret, setClientSecret] = useState('');
    const {reservation,setReservation,tempReservations,setTempReservations} = useReservationStore();
    const {alert,setAlert} = useAlert();
    const {handleLogout} = useHandleSession();
    const Navigate = useNavigate();
    const {setSelectedEvent,selectedEvent} = useEventSaleStore();
    const {clearReservation} = useReservationStore();
    const [countdownEnd, setCountdownEnd] = useState<number>(() => {
        const saved = sessionStorage.getItem(COUNTDOWN_KEY);
        if (saved) {
            const endTime = parseInt(saved, 10);
            if (endTime > Date.now()) {
                return endTime;
            }
        }
        const newEndTime = Date.now() + COUNTDOWN_DURATION;
        sessionStorage.setItem(COUNTDOWN_KEY, newEndTime.toString());
        return newEndTime; 
    });
    const [showModal, setShowModal] = useState(false);

    function HandleAccept(){
        setSelectedEvent(null);
        clearReservation();
        setCountdownEnd(0);
        sessionStorage.removeItem(COUNTDOWN_KEY);
        setTimeout(() => {
            Navigate('/dashboard-attendee')
        }, 2000)
    }

    function HandleCancel(){
        setShowModal(false);
    }

    function handleReturn(event: React.MouseEvent<HTMLAnchorElement>){
        event.preventDefault();
        setShowModal(true);
    }

    function HandleCountdownFinished(){
        setAlert({type:"warning",message:"Se ha acabado su tiempo de compra. Será redirigido al menú principal."});
        setSelectedEvent(null);
        clearReservation();
        setCountdownEnd(0);
        sessionStorage.removeItem(COUNTDOWN_KEY);
        setTimeout(() => {
            Navigate('/dashboard-attendee')
        }, 2000)
    }

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
        if (!reservation) return;
        const cleanupReservation = () => {
            clearReservation();
            setTempReservations([]);
            setClientSecret("");
            setCountdownEnd(0);
            sessionStorage.removeItem(COUNTDOWN_KEY);
        };
        const handlePopState = () => {
            cleanupReservation();
        };
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [reservation]);

    useEffect(() => {
        async function GetClientSecret (){
            const ReservationsID = ObtainAllReservationId(tempReservations);
            const ApiResponse = await PostStripePayment(ReservationsID);
            if(ApiResponse.status === 200){
                const Payment: StripePayment = MapStripePaymentResponse(ApiResponse.data);
                setReservation(Payment);
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
        if(tempReservations.length === 0){
            if(selectedEvent){
                Navigate(`/dashboard-attendee/event-details/${selectedEvent.event_name}`)
            }else{
                Navigate('/dashboard-attendee');
            }
        }else if(!clientSecret && tempReservations.length > 0 && isAttendee){
            GetClientSecret();
        }
    },[clientSecret,tempReservations,isAttendee])


    return {
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
        isAttendee,
    }
}