import { useAlert } from "../../../hooks/useAlert";
import type { Seat } from "../../../hooks/useSeatsMap";
import { useTicketStore } from "./useTicketReservationStore";
import { useHandleSession } from "../../../hooks/useHandleSession";
import { CreateReservation, type SeatReservationType } from "../services/EventSale";
import { useEventSaleStore } from "../../main-menu-attendee/hooks/useEventSaleStore";
import { ValidateSeatsToReservate } from "../../../schemas/seatReservationSchema";


export function useTicketSelection(){
    const {selectedSeats,setSelectedSeats} = useTicketStore();
    const {selectedEvent} = useEventSaleStore();
    const {setAlert, alert} = useAlert();
    const {handleLogout} = useHandleSession();

    function HandleQuitTicketFromList(seatId: number){
        const SeatsUpdated = selectedSeats.filter((seat: Seat) => seat.seat_id !== seatId);
        setSelectedSeats(SeatsUpdated);
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

    async function handleReservation(event: React.MouseEvent<HTMLButtonElement>){
        event.preventDefault();
        setAlert(null);
        const SeatsParsed = ObtainSeatsSelectedParsedToReserve(selectedSeats);
        const DataValidationResult = ValidateSeatsToReservate(SeatsParsed);
        if(!DataValidationResult.error){
            const ApiResponse = await CreateReservation(SeatsParsed);
            if(ApiResponse.status === 201){
                setAlert({type: "success", message: "Su reservación ha sido creada, cuenta con 10 minutos para realizar el pago."});
                setSelectedSeats([])
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
        HandleQuitTicketFromList,
        selectedSeats,
        setSelectedSeats,
        handleReservation
    }
}