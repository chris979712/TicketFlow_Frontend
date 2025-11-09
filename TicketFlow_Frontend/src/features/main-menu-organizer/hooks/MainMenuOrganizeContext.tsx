import { createContext, useContext, useState } from "react";
import { useLoading } from "../../../hooks/useLoading";

type MainMenuContextType = {
    eventName: string,
    eventCategory: string,
    eventStatus: number,
    setEventName: (value: string) => void,
    setEventCategory: (value: string) => void,
    setEventStatus: (value: number) => void,
    loading: boolean,
    searchTrigger: number,
    start: () => void,
    stop: () => void,
    ObtainEventsBySearch: (e: React.FormEvent) => void
}

const MainMenuOrganizerContext = createContext<MainMenuContextType | null>(null);

export function MainMenuOrganizerProvider({children}: {children: React.ReactNode}){
    const [eventName, setEventName] = useState("");
    const [eventCategory, setEventCategory] = useState("");
    const [eventStatus, setEventStatus] = useState(0);
    const [searchTrigger, setSearchTrigger] = useState(0);
    const {start,stop,loading} = useLoading();
    
    function ObtainEventsBySearch(e: React.FormEvent){
        e.preventDefault();
        setSearchTrigger(prev => prev + 1);
    }

    return (
        <MainMenuOrganizerContext.Provider value={({eventName,eventCategory,eventStatus,setEventName,setEventCategory,setEventStatus,searchTrigger,ObtainEventsBySearch,loading,start,stop})}>
            {children}
        </MainMenuOrganizerContext.Provider>
    )
}

export function useMainMenuOrganizer(){
    const context = useContext(MainMenuOrganizerContext);
    if(!context){
        throw new Error('El contexto del menú principal del organizador no está bien usado.');
    }
    return context;
}