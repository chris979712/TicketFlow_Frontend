import {create} from "zustand";
import { persist } from "zustand/middleware";
import type { Seat } from "../../../hooks/useSeatsMap";

interface TicketStore{
    selectedSeats: Seat[];
    setSelectedSeats: (seats: Seat[]) => void;
}

export const useTicketStore = create(
    persist<TicketStore>(
        (set) => ({
            selectedSeats: [],
            setSelectedSeats: (seats) => set({selectedSeats: seats}) 
        }),
        {
            name: "tickets-selected-storage"
        }
    )
)