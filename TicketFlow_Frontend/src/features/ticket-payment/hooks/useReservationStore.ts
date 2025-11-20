import { create } from "zustand";
import type { Seat } from "../../../hooks/useSeatsMap";
import type { StateStorage } from "zustand/middleware";
import type { StripePayment } from "./useReservationPayment";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Reservation{
    reservation_id: number,
    attendee_id: number,
    status: string,
    expiration_at: string;
    seats: Seat[];
}

interface ReservationStore{
    tempReservations: Reservation[];
    reservation: StripePayment | null;
    setTempReservations: (reservations: Reservation[]) => void;
    setReservation: (Reservation: StripePayment | null) => void;
    clearReservation: () => void;
}

const reservationStorage: StateStorage = {
    getItem: (name: string): string | null => {
        const value = sessionStorage.getItem(name);
        return value;
    },
    setItem: (name: string, value: string): void => {
        sessionStorage.setItem(name, value);
    },
    removeItem: (name: string): void => {
        sessionStorage.removeItem(name);
    },
}

export const useReservationStore = create(
    persist<ReservationStore>(
        (set) => ({
            tempReservations: [],
            reservation: null,
            setTempReservations: (tempReservations) => set({tempReservations}),
            setReservation: (reservation) => set({reservation: reservation}),
            clearReservation: () => set({reservation: null})
        }),
        {
            name: "reservation-storage",
            storage: createJSONStorage(() => reservationStorage)
        }
    )
)