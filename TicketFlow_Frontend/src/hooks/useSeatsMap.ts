import { useAlert } from "./useAlert";
import { useEffect, useState } from "react";
import seatsTeatroAurora from "../utils/TeatroAurora.json";
import seatsAuditorioReforma from "../utils/AuditorioReforma.json";
import { useTicketStore } from "../features/event-detail/hooks/useTicketReservationStore";

export interface Seat {
    seat_id: number,
    seat_no: string,
    row_no: string,
    display_label:string,
    available?: boolean,
    base_price?: number,
    event_seat_id?: number; 
}

interface Section {
    section_name: string,
    seats: Seat[]
}

export interface SeatMap {
    sections: Section[]
}

export function useSeatMap(locationName: string, apiSeats: any[]){
    const [dataSeats, setDataSeats] = useState<SeatMap | null>(null);
    const [groupedSeats, setGroupedSeats] = useState<{section_name: string; rows: Record<string, Seat[]> }[]>([]);
    const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const {selectedSeats,setSelectedSeats} = useTicketStore();
    const {alert,setAlert} = useAlert();
    const isMobile = window.innerWidth <= 480;

    function CssName(name: string){
        return name
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") 
            .replace(/\s+/g, "-")
            .toLowerCase();
    }

    function ObtainDataSeatsFromLocation(){
        if(locationName === "Teatro Aurora"){
            setDataSeats(seatsTeatroAurora);
        }else if(locationName === "Auditorio Reforma"){
            setDataSeats(seatsAuditorioReforma);
        }
    }

    function NormalizeEventSeats(eventSeats: any[]) {
        const map: Record<number, { seat_id: number;available: boolean; base_price: number }> = {};
        eventSeats.forEach(s => {
            map[s.seat_id] = {
                seat_id: s.event_seat_id,
                available: s.event_seat_status_id === 1, 
                base_price: Number(s.base_price)
            };
        });
        return map;
    }

    function GroupSeatsByRow(seats: Seat[]) {
        const rows: Record<string, Seat[]> = {};
        seats.forEach(seat => {
            if (!rows[seat.row_no]) {
                rows[seat.row_no] = [];
            }
            rows[seat.row_no].push(seat);
        });
        for (const row in rows) {
            rows[row].sort((a, b) => Number(a.seat_no) - Number(b.seat_no));
        }
        return rows;
    }

    function HandlerSeatSelection(selectedSeat: Seat){
        setAlert(null);
        const alreadySelected = selectedSeats.find(seat => seat.seat_id === selectedSeat.seat_id);
        if(!alreadySelected){
            setSelectedSeats([...selectedSeats, selectedSeat]);
            setAlert({type: "success", message: "Asiento agregado a la lista de compras."})
        }else{
            setAlert({type: "warning",message: "El asiento que desea agregar ya se encuentra en sus tickets de compra."});
        }
    }

    function HandleSeatHover(seat: Seat, event: React.MouseEvent | React.TouchEvent){
        setHoveredSeat(seat);
        if ('clientX' in event) {
            setTooltipPosition({ x: event.clientX, y: event.clientY });
        } else if ('touches' in event && event.touches.length > 0) {
            setTooltipPosition({ 
                x: event.touches[0].clientX, 
                y: event.touches[0].clientY 
            });
        }
    }

    function handleSeatLeave(){
        setHoveredSeat(null);
    }

    function HandleSeatClick(seat: Seat, event: React.MouseEvent | React.TouchEvent){
        if(isMobile){
            HandleSeatHover(seat, event);
            HandlerSeatSelection(seat);
        }else{
            HandlerSeatSelection(seat);
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            if (hoveredSeat) {
                setHoveredSeat(null);
            }
        };
        window.addEventListener('scroll', handleScroll, true); 
        return () => {
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [hoveredSeat]);

    useEffect(() => {
        if (!dataSeats || apiSeats.length === 0) return;
        const apiSeatsById = NormalizeEventSeats(apiSeats);
        const result = dataSeats!.sections.map(section => ({
            section_name: section.section_name,
            rows: GroupSeatsByRow(section.seats.map(
                seat => ({
                    ...seat,
                    seat_id: apiSeatsById[seat.seat_id]?.seat_id ?? seat.seat_id,
                    available: apiSeatsById[seat.seat_id]?.available ?? false,
                    base_price: apiSeatsById[seat.seat_id]?.base_price ?? 0
                })
            ))
        }));
        setGroupedSeats(result);
    }, [dataSeats,apiSeats]);

    useEffect(() => {
        if(alert){
            const timer = setTimeout(() => setAlert(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [alert])

    useEffect(() => {
        ObtainDataSeatsFromLocation();
    }, [])

    return {
        CssName,
        hoveredSeat,
        tooltipPosition,
        groupedSeats,
        handleSeatLeave,
        setTooltipPosition,
        HandleSeatHover,
        HandlerSeatSelection,
        alert,
        setAlert,
        HandleSeatClick,
        isMobile
    }
}