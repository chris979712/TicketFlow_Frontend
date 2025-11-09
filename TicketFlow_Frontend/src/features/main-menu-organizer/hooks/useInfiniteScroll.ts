import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../hooks/useAlert";
import { useEffect, useState, useRef} from "react";
import { useMainMenuOrganizer } from "../hooks/MainMenuOrganizeContext";
import { GetAllEvents, GetEventImage,GetEventsBySearch} from "../services/MenuService";
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

interface EventProps {
    event_id: number,
    event_name: string,
    category: string,
    description: string,
    event_date: string,
    start_time: string,
    end_time: string,
    created_at: string,
    updated_at: string,
    imageUrl?: string,
    event_status_id: number,
    event_location_id: number
}

export function useInfiniteScroll(){
    const [items, setItems] = useState<EventProps[]>([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const {eventName,eventCategory,eventStatus,searchTrigger,start,stop} = useMainMenuOrganizer();
    const Navigate = useNavigate()
    const {alert,setAlert} = useAlert();
    const firstRender = useRef(true);
    const PAGE_SIZE = 10;

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

    async function ObtainAllEvents(){
        start();
        const ApiResponse = await GetAllEvents(PAGE_SIZE,page);
        if(ApiResponse.status === 200){
            let Events: EventProps[] = ApiResponse.data.rows;
            Events = await SetEventImages(Events);
            setItems(prev => {
                const merged = [...prev, ...Events]
                return merged.filter(
                    (event, index, arr) =>
                        arr.findIndex(e => e.event_id === event.event_id) === index
                );
            });
            setPage(prev => prev + PAGE_SIZE);
            if(Events.length < PAGE_SIZE){
                setHasMore(false);
            }
        }else if(ApiResponse.status === 401){
            setAlert({type: "error", message: ApiResponse.message!})
            setTimeout(() => {
                Navigate("/")
            },2000)
        }else if(ApiResponse.status >= 400 && ApiResponse.status <= 499){
            setAlert({type: "warning", message: ApiResponse.message!});
        }else{
            setAlert({type: "error", message: ApiResponse.message!});
        }
        stop();
    }
    
    async function ObtainEventsBySearch(){
        start();
        const ApiResponse = await GetEventsBySearch(PAGE_SIZE,page,eventCategory,eventStatus,eventName);
        if(ApiResponse.status === 200){
            let Events: EventProps[] = ApiResponse.data.rows;
            Events = await SetEventImages(Events);
            setItems(prev => {
                const merged = [...prev, ...Events]
                return merged.filter(
                    (event, index, arr) =>
                        arr.findIndex(e => e.event_id === event.event_id) === index
                );
            });
            setPage(prev => prev + PAGE_SIZE);
            if(Events.length < PAGE_SIZE){
                setHasMore(false);
            }
        }else if(ApiResponse.status === 401){
            setAlert({type: "error", message: ApiResponse.message!})
            setTimeout(() => {
                Navigate("/")
            },2000)
        }else if(ApiResponse.status >= 400 && ApiResponse.status <= 499){
            setAlert({type: "warning", message: ApiResponse.message!});
        }else{
            setAlert({type: "error", message: ApiResponse.message!});
        }
        stop();
    }

    function FormatDate(dateISO: string) {
        return dayjs(dateISO).format("DD/MM/YYYY");
    }

    useEffect(() => {
        if(firstRender.current){
            firstRender.current = false;
        }else if(searchTrigger > 0){
            setItems([]);
            setPage(0);
            setHasMore(true);
            ObtainEventsBySearch();
        }
    },[searchTrigger])

    useEffect(() => {
        ObtainAllEvents();
    },[]);

    return {
        FormatDate,
        alert,
        ObtainAllEvents,
        hasMore,
        items,
        setAlert
    }
}