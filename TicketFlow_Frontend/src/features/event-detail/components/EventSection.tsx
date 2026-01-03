import {GetEventLocation } from "../../../utils/const";
import { useEventSaleStore } from "../../main-menu-attendee/hooks/useEventSaleStore"
import TicketFlowDefaultImage from "../../../../public/TicketFLow_logo.png";
import "./EventSection.css"

export function EventSaleSection(){
    const {selectedEvent} = useEventSaleStore();

    return (
        <section className="ed-event-details-section">
            <div className="ed-event-details">
                <div className="ed-event-image-wrapper">
                    <img src={selectedEvent?.imageUrl ? selectedEvent?.imageUrl : TicketFlowDefaultImage} alt={"Imagen promocional del evento: "+selectedEvent?.event_name} title={selectedEvent?.event_name}/>
                </div>
                <div className="ed-event-name">
                    <h2 className="ed-event-name">{selectedEvent?.event_name}</h2>
                    <p className="ed-event-description">{selectedEvent?.description}</p>
                    <p className="ed-event-schedule">Fecha: {selectedEvent?.event_date} en horario de {selectedEvent?.start_time} - {selectedEvent?.end_time}</p>
                    <p className="ed-event-location"><strong>Ubicación: </strong>{GetEventLocation(selectedEvent!.event_location_id)}</p>
                </div>
            </div>
        </section>
    )
}