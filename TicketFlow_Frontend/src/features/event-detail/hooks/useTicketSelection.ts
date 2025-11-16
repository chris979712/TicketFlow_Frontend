import type { Seat } from "../../../hooks/useSeatsMap";
import { useTicketStore } from "./useTicketReservationStore";


export function useTicketSelection(){
    const {selectedSeats,setSelectedSeats} = useTicketStore();
    
    function HandleQuitTicketFromList(seatId: number){
        const SeatsUpdated = selectedSeats.filter((seat: Seat) => seat.seat_id !== seatId);
        setSelectedSeats(SeatsUpdated);
    }

    const total = selectedSeats.reduce(
        (sum: number, seat: Seat) => sum + Number(seat.base_price),
        0
    );

    return {
        total, 
        HandleQuitTicketFromList,
        selectedSeats
    }
}