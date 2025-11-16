import {GetEventLocation } from "../../../utils/const";
import { useEventSaleStore } from "../../main-menu-attendee/hooks/useEventSaleStore"
import TicketFlowDefaultImage from "../../../../public/TicketFLow_logo.png";
import "./EventSection.css"

export function EventSaleSection(){
    const {selectedEvent} = useEventSaleStore();

    return (
        <section className="event-details-section">
            <div className="event-details">
                <div className="event-image-wrapper">
                    <img src={selectedEvent?.imageUrl ? selectedEvent?.imageUrl : TicketFlowDefaultImage} alt={"Imagen promocional del evento: "+selectedEvent?.event_name} title={selectedEvent?.event_name}/>
                </div>
                <div className="event-name">
                    <h2 className="event-name">{selectedEvent?.event_name}</h2>
                    <p className="event-description">{selectedEvent?.description}</p>
                    <p className="event-schedule">Fecha: {selectedEvent?.event_date} en horario de {selectedEvent?.start_time} - {selectedEvent?.end_time}</p>
                    <p className="event-location"><strong>Ubicación: </strong>{GetEventLocation(selectedEvent!.event_location_id)}</p>
                </div>
            </div>
        </section>
    )
}