import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { GetAllEvents, GetEventImage } from "../services/MenuService";
import { Loader } from "../../../components/Loader";
import { useAlert } from "../../../hooks/useAlert";
import { useNavigate } from "react-router-dom";
import { Alert } from "../../../components/Alert";
import ImageLogo from "../../../../public/TicketFLow_logo.png";
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

export function InfiniteScrollEvents(){
    const [items, setItems] = useState<EventProps[]>([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const Navigate = useNavigate()
    const {alert,setAlert} = useAlert();
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
    }

    useEffect(() => {
        ObtainAllEvents();
    },[]);

    return (
        <>
            {
                alert && (
                    <Alert type={alert.type} 
                        message={alert.message} 
                        onClose={() => setAlert(null)} />
                )
            }
            <InfiniteScroll 
                dataLength={items.length}
                next={ObtainAllEvents}
                hasMore={hasMore}
                loader={<Loader />}
                endMessage={<p>No hay mas eventos que se puedan mostrar</p>}
            >
                {
                    items.map(event => (
                        <section className="event-section" key={event.event_id}>
                            <img src={event.imageUrl ? event.imageUrl : ImageLogo} alt={`Promocial del evento ${event.event_name}`}/>
                            <h3 className="event-name">{event.event_name}</h3>
                            <p className="event-description">{event.description}</p>
                            <p className="event-category">{event.category}</p>
                            <article className="event-description">{event.description}</article>
                            <p className="event-schedule">{event.start_time}-{event.end_time}</p>
                            <p>Creado el: {event.created_at} - Actualizado por última vez: {event.updated_at}</p>
                        </section>
                    ))
                }
            </InfiniteScroll>
        </>
    )
}