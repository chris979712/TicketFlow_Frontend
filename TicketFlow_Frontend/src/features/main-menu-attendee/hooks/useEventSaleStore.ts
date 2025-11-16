import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { EventProps } from "../../main-menu-organizer/hooks/useInfiniteScroll";

interface EventStore {
    selectedEvent: EventProps | null;
    setSelectedEvent: (event: EventProps | null) => void;
}

export const useEventSaleStore = create(
    persist<EventStore>(
        (set) => ({
            selectedEvent: null,
            setSelectedEvent: (event) => set({selectedEvent: event}),
        }),
        {
            name: "event-sale-storage"
        }
    )
)