import { useEffect, useState, useRef} from "react";
import { useAlert } from "../../../hooks/useAlert";
import { useParams,useNavigate } from "react-router-dom";
import { ObtainEventInventory } from "../services/EventSale";
import { useTicketStore } from "./useTicketReservationStore";
import { useHandleSession } from "../../../hooks/useHandleSession";
import { useEventSaleStore } from "../../main-menu-attendee/hooks/useEventSaleStore";
import { useNavigationAttendee } from "../../main-menu-attendee/hooks/useNavigationAttendee";

export function useEventDetail(){
    const {isAttendee} = useNavigationAttendee();
    const {selectedEvent,setSelectedEvent} = useEventSaleStore();
    const [seatsInventory, setSeatsInventory] = useState<any[]>([]);
    const {alert,setAlert} = useAlert();
    const {handleLogout} = useHandleSession();
    const {setSelectedSeats,selectedSeats} = useTicketStore();
    const {eventName} = useParams();
    const Navigate = useNavigate();
    const mainRef = useRef<HTMLElement|null>(null);

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

    useEffect(() => {
        if(selectedEvent) {
            localStorage.setItem(`selectedSeats_${eventName}`, JSON.stringify(selectedSeats));
        }
    }, [selectedSeats, selectedEvent]);

    useEffect(() => {
        if(selectedEvent) {
            const saved = localStorage.getItem(`selectedSeats_${eventName}`);
            if(saved){
                setSelectedSeats(JSON.parse(saved));
                localStorage.removeItem(`selectedSeats_${eventName}`)
            } 
        }
    }, [selectedEvent]);

    useEffect(() => {
        if(!selectedEvent || selectedEvent.event_name !== eventName){
            setSelectedEvent(null);
            Navigate("/*");
        }else{
            GetEventInventory();
        }
        GetEventInventory();
        return () => setSelectedSeats([]);
    },[selectedEvent]);

    useEffect(() => {
        mainRef.current?.scrollIntoView({ 
        behavior: 'auto', 
        block: 'start' 
        });
    }, []);

    return {
        isAttendee,
        alert,
        setAlert,
        selectedEvent,
        seatsInventory,
        eventName,
        mainRef
    }
}