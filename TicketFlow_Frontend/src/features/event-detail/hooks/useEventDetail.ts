import { useEffect, useState} from "react";
import { useAlert } from "../../../hooks/useAlert";
import type { Seat } from "../../../hooks/useSeatsMap";
import { useTicketSelection } from "./useTicketSelection";
import { ObtainEventInventory } from "../services/EventSale";
import { useHandleSession } from "../../../hooks/useHandleSession";
import { useEventSaleStore } from "../../main-menu-attendee/hooks/useEventSaleStore";
import { useNavigationAttendee } from "../../main-menu-attendee/hooks/useNavigationAttendee";

export function useEventDetail(){
    const {isAttendee} = useNavigationAttendee();
    const {selectedEvent} = useEventSaleStore();
    const [seatsInventory, setSeatsInventory] = useState<any[]>([]);
    const {alert,setAlert} = useAlert();
    const {handleLogout} = useHandleSession();
    const {setSelectedSeats,selectedSeats} = useTicketSelection();

    async function GetEventInventory(){
        const ApiResponse = await ObtainEventInventory(selectedEvent!.event_id);
        if(ApiResponse.status === 200){
            const DataSeats = ApiResponse.data.seats;
            setSeatsInventory(DataSeats);
        }else if(ApiResponse.status === 401){
            setAlert({type: "warning", message: ApiResponse.message!});
            setTimeout(() => {
                handleLogout();
            },4000)
        }else if(ApiResponse.status >= 400 && ApiResponse.status <= 499){
            setAlert({type: "warning", message: ApiResponse.message!});
        }else{
            setAlert({type: "error", message: ApiResponse.message!});
        }
    }

    async function GetSeatsFromLocalStorage(): Promise<Seat[]>{
        try{
            const SeatsData = localStorage.getItem("selectedSeats");
            const ParsedSeats = await JSON.parse(SeatsData!);
            if(Array.isArray(ParsedSeats)){
                return ParsedSeats;
            }
            return [];
        }catch(error){
            return [];
        }
    }

    useEffect(() => {
        const ObtainSeats = async () => {
            const SeatsSaved = await GetSeatsFromLocalStorage();
            setSelectedSeats(SeatsSaved);
        }
        const handleBeforeUnload = () => {
            localStorage.setItem("selectedSeats",JSON.stringify(selectedSeats));
        }
        window.addEventListener('beforeunload',handleBeforeUnload);
        GetEventInventory();
        ObtainSeats();
        return () => {
            window.removeEventListener("beforeunload",handleBeforeUnload);
            setSelectedSeats([]);
        }
    },[selectedEvent])

    return {
        isAttendee,
        alert,
        setAlert,
        selectedEvent,
        seatsInventory,
    }
}