import { Link } from "react-router-dom";
import { Alert } from "../../../components/Alert";
import { Loader } from "../../../components/Loader";
import { EndMessage } from "../../../components/EndMessage";
import InfiniteScroll from "react-infinite-scroll-component";
import ImageLogo from "../../../../public/TicketFLow_logo.png";
import { useEventSaleStore } from "../hooks/useEventSaleStore";
import { useInfiniteScrollEvent } from "../hooks/useInfiniteScroll";
import {GetEventLocation,EVENT_STATUS_CODE } from "../../../utils/const";
import './InfiniteScroll.css'

export function InfiniteScrollEventsAttendee(){
    const { alert,
        setAlert,
        events,
        page,
        eventStatus,
        hasmore,
        GetEventStatusLabel,
        ObtainEvents
    } = useInfiniteScrollEvent();
    const {setSelectedEvent} = useEventSaleStore();

    return (
        <>
            {
                alert && (
                    <Alert 
                        type={alert.type}
                        message={alert.message}
                        onClose={() => {setAlert(null)}}
                        duration={5000}
                    />
                )
            }
            <InfiniteScroll
                dataLength={events.length}
                next={() => ObtainEvents(page, false, eventStatus)}
                hasMore={hasmore}
                loader={<Loader />}
                endMessage={<EndMessage />}
            >
                <section className="ma-events">
                    {
                        events.map(event => (
                            <div className="ma-event-item" key={event.event_id}>
                                <img className="ma-event-image" src={event.imageUrl ? event.imageUrl : ImageLogo} alt={`Promocial del evento ${event.event_name}`}/>
                                <div className="ma-event-details">
                                    <h3 className="ma-event-name">{event.event_name}</h3>
                                    <p className="ma-event-description">{event.description}</p>
                                </div>
                                <div className="ma-reveal">
                                    <p className="ma-event-schedule">Fecha: {event.event_date} en horario de {event.start_time} - {event.end_time}</p>
                                    <p className="ma-event-location"><strong>Ubicación: </strong>{GetEventLocation(event.event_location_id)}</p>
                                    <strong className="ma-event-status">Estado del evento: {GetEventStatusLabel(event.event_status_id)}</strong>
                                    {
                                        event.event_status_id === EVENT_STATUS_CODE.on_sale && (
                                            <Link to={`/dashboard-attendee/event-details/${event.event_name}`} onClick={() => setSelectedEvent({
                                                ...event,
                                                start_time: event.start_time.slice(0,8),
                                                end_time: event.end_time.slice(0,8)
                                            })}>Ver disponibilidad</Link>
                                        )
                                    }
                                </div>
                            </div>
                        ))
                    }
                </section>
            </InfiniteScroll>
        </>
    )
}