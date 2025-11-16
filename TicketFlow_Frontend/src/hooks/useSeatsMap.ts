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
        const map: Record<number, { available: boolean; base_price: number }> = {};
        eventSeats.forEach(s => {
            map[s.seat_id] = {
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
        if(!selectedSeats.find(seat => seat.seat_id === selectedSeat.seat_id)){
            selectedSeats.push(selectedSeat);
            const SeatsUpdated = selectedSeats;
            setSelectedSeats(SeatsUpdated);
        }
    }

    function HandleSeatHover(seat: Seat, event: React.MouseEvent){
        setHoveredSeat(seat);
        setTooltipPosition({ x: event.clientX, y: event.clientY });
    }

    function handleSeatLeave(){
        setHoveredSeat(null);
    }

    useEffect(() => {
        if (!dataSeats || apiSeats.length === 0) return;
        const apiSeatsById = NormalizeEventSeats(apiSeats);
        const result = dataSeats!.sections.map(section => ({
            section_name: section.section_name,
            rows: GroupSeatsByRow(section.seats.map(
                seat => ({
                    ...seat,
                    available: apiSeatsById[seat.seat_id]?.available ?? false,
                    base_price: apiSeatsById[seat.seat_id]?.base_price ?? 0
                })
            ))
        }));
        setGroupedSeats(result);
    }, [dataSeats,apiSeats]);

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
        HandlerSeatSelection
    }
}