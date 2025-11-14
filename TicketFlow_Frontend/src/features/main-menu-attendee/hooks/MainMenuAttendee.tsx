import { createContext, useContext, useState } from "react";
import { useLoading } from "../../../hooks/useLoading";

type MainMenuContextType = {
    eventName: string,
    eventCategory: string,
    eventDate: string,
    debouncedName: string,
    page: number,
    setPage: (value: any) => void;
    setEventName: (value: string) => void,
    setEventCategory: (value: string) => void,
    setEventDate: (value: string) => void,
    setDebouncedName: (value: string) => void,
    loading: boolean,
    start: () => void,
    stop: () => void,
}

const MainMenuAttendeeContext = createContext<MainMenuContextType | null>(null);

export function MainMenuAttendeeProvider({children}: {children: React.ReactNode}){
    const [eventName, setEventName] = useState("");
    const [eventCategory, setEventCategory] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [page, setPage] = useState(0);
    const {start,stop,loading} = useLoading();
    const [debouncedName, setDebouncedName] = useState("");
    
    return (
        <MainMenuAttendeeContext.Provider value={({eventName,setEventName,eventCategory,setEventCategory,eventDate,setEventDate,page,setPage,start,stop,loading,debouncedName,setDebouncedName})}>
            {children}
        </MainMenuAttendeeContext.Provider>
    )
}

export function useMainMenuAttendee(){
    const context = useContext(MainMenuAttendeeContext);
    if(!context){
        throw new Error('El contexto del menú principal del asistente no está bien usado.');
    }
    return context;
}