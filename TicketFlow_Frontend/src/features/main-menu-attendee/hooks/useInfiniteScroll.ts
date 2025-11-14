import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../hooks/useAlert";
import { useEffect, useRef, useState } from "react";
import { useLoading } from "../../../hooks/useLoading";
import { useMainMenuAttendee } from "./MainMenuAttendee";
import { GetEvents, GetEventImage } from "../services/EventsMenu";
import type { EventProps } from "../../main-menu-organizer/hooks/useInfiniteScroll";
import { EVENT_STATUS_CODE, EVENT_STATUS_ID_TO_CODE, EVENT_STATUS_LABEL, type EventStatusId } from "../../../utils/const";
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

export function useInfiniteScrollEvent(){
    const Navigate = useNavigate();
    const firstRender = useRef(true);
    const {start,stop} = useLoading();
    const {alert,setAlert} = useAlert();
    const [hasmore, setHasMore] = useState(false);
    const eventStatus = EVENT_STATUS_CODE.on_sale;
    const PAGE_SIZE = Object.freeze({ size: 10 });
    const [events, setEvents] = useState<EventProps[]>([]);
    const {debouncedName,eventCategory,eventDate,page,setPage} = useMainMenuAttendee();

    function GetEventStatusLabel(eventStatus: number){
        const StatusID = eventStatus as EventStatusId;
        const Code = EVENT_STATUS_ID_TO_CODE[StatusID];
        return EVENT_STATUS_LABEL[Code] ?? "Desconocido";
    }

    async function SetEventImages(events: EventProps[]){
        const EventsWithImages = await Promise.all(
            events.map(async (event) => {
                const ApiResponse = await GetEventImage(event.event_id);
                const imageUrl = 
                        ApiResponse.status === 200 &&
                        ApiResponse.data?.images?.[0]?.image_path
                            ? IMAGE_URL + ApiResponse.data.images[0].image_path
                            : undefined;
                return {
                    ...event,
                    imageUrl: imageUrl
                };
            })
        );
        return EventsWithImages;
    }

    async function ObtainEvents(currentPage = page, replace = false, status = 0){
        start();
        const ApiResponse = await GetEvents(PAGE_SIZE.size,currentPage,status,debouncedName,eventDate,eventCategory);
        if(ApiResponse.status === 200){
            let Events: EventProps[] = ApiResponse.data.rows;
            Events = await SetEventImages(Events);
            setEvents( prev => {
                if(replace) return Events;
                const merged = [...prev, ...Events];
                return merged.filter(
                    (event,index,arr) =>
                        arr.findIndex(e => e.event_id === event.event_id) === index);
            });
            setPage(currentPage + PAGE_SIZE.size);
            if(Events.length < PAGE_SIZE.size){
                setHasMore(false);
            }
        }else if(ApiResponse.status === 401){
            setAlert({type: "error", message: ApiResponse.message!})
            setTimeout(() => {
                Navigate("/")
            },2000)
        }else if(ApiResponse.status >= 400 && ApiResponse.status <= 499){
            setAlert({type: "warning", message: ApiResponse.message!});
            setHasMore(false);
        }else{
            setAlert({type: "error", message: ApiResponse.message!});
        }
        stop();
    }

    useEffect(() => {
        if(!firstRender.current){
            const NoFilters = debouncedName===""&&eventDate===""&&eventCategory==="";
            if(!NoFilters){
                setEvents([]); 
                setPage(0);
                setHasMore(true);
                ObtainEvents(0,true);
            }else{
                ObtainEvents(0,true,eventStatus);
            }
        }
    },[debouncedName,eventDate,eventCategory]);

    useEffect(() => {
        if(firstRender.current){
            firstRender.current = false;
            ObtainEvents(0,true,eventStatus);
        }
    },[]);

    return {
        alert,
        setAlert,
        events,
        page,
        eventStatus,
        hasmore,
        GetEventStatusLabel,
        ObtainEvents
    }
}