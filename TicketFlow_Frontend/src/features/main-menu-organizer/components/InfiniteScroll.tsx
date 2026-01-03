import InfiniteScroll from "react-infinite-scroll-component";
import { Loader } from "../../../components/Loader";
import { Link } from "react-router-dom";
import { Alert } from "../../../components/Alert";
import ImageLogo from "../../../../public/TicketFLow_logo.png";
import './InfiniteScroll.css'
import { GetEventLocation, GetEventStatusLabel, EVENT_STATUS} from "../../../utils/const";
import { EndMessage } from "../../../components/EndMessage";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useEventStore } from "../../edit-event/hooks/useEventStore";


export function InfiniteScrollEvents(){
    const {
        FormatDate,
        alert,
        ObtainAllEvents,
        hasMore,
        items,
        setAlert
    } = useInfiniteScroll();
    const {setSelectedEvent} = useEventStore();

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
                endMessage={<EndMessage />}
            >
                {
                    items.map(event => (
                        <section className="mo-event-section" key={event.event_id}>
                            <img className="mo-event-image" src={event.imageUrl ? event.imageUrl : ImageLogo} alt={`Promocial del evento ${event.event_name}`}/>
                            <div className="mo-event-details">
                                <div className="mo-event-main-details">
                                    <h3 className="mo-event-name">{event.event_name}</h3>
                                    <p className="mo-event-description">{event.description}</p>
                                </div>
                                <p className="mo-event-category"><strong>Tipo de evento: </strong>{event.category}</p>
                                <p className="mo-event-location"><strong>Ubicación: </strong>{GetEventLocation(event.event_location_id)}</p>
                                <p className="mo-event-state"><strong>Estado del evento: </strong>{GetEventStatusLabel(event.event_status_id)}</p>
                                <p className="mo-event-schedule"><strong>Horario de evento: </strong> {event.event_date} en horario de {event.start_time} - {event.end_time}</p>
                                <p><strong></strong>Creado el: {FormatDate(event.created_at)} - Actualizado por última vez: {FormatDate(event.updated_at)}</p>
                            </div>
                            {
                                (event.event_status_id !== EVENT_STATUS.CLOSED && event.event_status_id !== EVENT_STATUS.COMPLETED) && (
                                    <Link to="/dashboard-organizer/event-edition" className="mo-edit-event-btn" onClick={() => setSelectedEvent({
                                        ...event,
                                        start_time: event.start_time.slice(0,8),
                                        end_time: event.end_time.slice(0,8)
                                    })}>Editar evento</Link>
                                )
                            }
                        </section>
                    ))
                }
            </InfiniteScroll>
        </>
    )
}