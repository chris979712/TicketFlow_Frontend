import { useState } from "react";
import { useAlert } from "../../../hooks/useAlert";
import type { Seat } from "../../../hooks/useSeatsMap";
import { useTicketStore } from "./useTicketReservationStore";
import { useHandleSession } from "../../../hooks/useHandleSession";
import { ValidateSeatsToReservate } from "../../../schemas/seatReservationSchema";
import { CreateReservation, type SeatReservationType } from "../services/EventSale";
import { useEventSaleStore } from "../../main-menu-attendee/hooks/useEventSaleStore";
import { useReservationStore, type Reservation } from "../../ticket-payment/hooks/useReservationStore";
import { useNavigate } from "react-router-dom";

export function useTicketSelection(){
    const {selectedSeats,setSelectedSeats} = useTicketStore();
    const {selectedEvent} = useEventSaleStore();
    const {setAlert, alert} = useAlert();
    const {handleLogout} = useHandleSession();
    const [isHuman, setIsHuman] = useState(false);
    const {setTempReservations} = useReservationStore();
    const Navigate = useNavigate();

    function HandleVerifyHuman(token: string|null){
        if (token) {
            setIsHuman(true);
        } else {
            setIsHuman(false);
        }
    }

    function HandleQuitTicketFromList(seatId: number){
        setAlert(null);
        const SeatsUpdated = selectedSeats.filter((seat: Seat) => seat.seat_id !== seatId);
        setSelectedSeats(SeatsUpdated);
        setAlert({type: "success",message: "Asiento eliminado de la lista de compras."})
    }

    const total = selectedSeats.reduce(
        (sum: number, seat: Seat) => sum + Number(seat.base_price),
        0
    );

    function ObtainSeatsSelectedParsedToReserve(seats: Seat[]): SeatReservationType[]{
        const Now = new Date();
        const Expiration = new Date(Now.getTime() + 10 * 60 * 1000);
        const SeatsToReservate: SeatReservationType[] = seats.map(seat => ({
            event_id: selectedEvent!.event_id,
            event_seat_id: seat.seat_id,
            expiration_at: Expiration.toISOString()
        }));
        return SeatsToReservate;
    }

    function MapReservationResponse(ApiResponse: any): Reservation[] {
        const ReservationList = ApiResponse.data.reservations || [];
        const SeatsList = ApiResponse.data.eventSeats || [];
        return ReservationList.map((r: any) => {
            const seats = SeatsList.filter((s: any) => s.event_seat_id === r.event_seat_id);
            return {
                reservation_id: r.reservation_id,
                attendee_id: r.attendee_id,
                status: r.status,
                expiration_at: r.expiration_at,
                seats
            };
        });
    }

    async function handleReservation(event: React.MouseEvent<HTMLButtonElement>){
        event.preventDefault();
        setAlert(null);
        const SeatsParsed = ObtainSeatsSelectedParsedToReserve(selectedSeats);
        const DataValidationResult = ValidateSeatsToReservate(SeatsParsed);
        if(!DataValidationResult.error){
            const ApiResponse = await CreateReservation(SeatsParsed);
            if(ApiResponse.status === 201){
                const ReservationResponse = MapReservationResponse(ApiResponse);
                setTempReservations(ReservationResponse);
                setAlert({type: "success", message: "Su reservación ha sido creada, cuenta con 10 minutos para realizar el pago."});
                setSelectedSeats([])
                setTimeout(() => {
                    Navigate("/dashboard-attendee/payment-reservation")
                },3000);
            }else if(ApiResponse.status === 401){
                setAlert({type: "warning", message: ApiResponse.message!});
                setTimeout(() => {
                    handleLogout();
                },5000)
            }else if(ApiResponse.status >= 400 && ApiResponse.status <= 499){
                setAlert({type: "warning", message: ApiResponse.message!});
            }else{
                setAlert({type: "error", message: ApiResponse.message!});
            }
        }else{
            setAlert({type: "warning", message: DataValidationResult.error.details[0].message});
        }
    }

    return {
        total, 
        alert,
        setAlert,
        isHuman,
        HandleVerifyHuman,
        HandleQuitTicketFromList,
        selectedSeats,
        setSelectedSeats,
        handleReservation
    }
}