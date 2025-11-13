import { create } from "zustand";
import {persist} from "zustand/middleware";

interface OrganizerStore {
    idCompany: number | null;
    setOrganizerCompany: (idCompany: number | null) => void;
}

export const useOrganizerStore = create(
    persist<OrganizerStore>(
        (set) => ({
            idCompany: null,
            setOrganizerCompany: (idCompany) => set({idCompany: idCompany})
        }),
        {
            name: "organizer-storage"
        }
    )
)