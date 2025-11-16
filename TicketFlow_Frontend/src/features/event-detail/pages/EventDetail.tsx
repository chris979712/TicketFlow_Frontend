import { Link } from "react-router-dom";
import { Alert } from "../../../components/Alert";
import {SeatsMap} from "../../../components/SeatsMap";
import { GetEventLocation } from "../../../utils/const";
import { useEventDetail } from "../hooks/useEventDetail";
import { EventSaleSection } from "../components/EventSection";
import { TicketSelection } from "../components/TicketsSelected";
import TicketFlowWhiteLogo from '../../../../public/Logo_Blanco_horizontal.png';
import "./EventDetail.css"

export default function EventDetails(){
    const {isAttendee,
            alert,
            setAlert,
            selectedEvent,
            seatsInventory} = useEventDetail();

    return (
        isAttendee && (
            <main className="main-event-details">
                {
                    alert && (
                        <Alert
                            type={alert.type}
                            message={alert.message}
                            onClose={() => setAlert(null)}
                        ></Alert>
                    )
                }
                <header className="header-attendee">
                    <div className='div_welcome'>
                        <img src={TicketFlowWhiteLogo} alt="Ticket flog logo color blanco" title="logo de ticket flow"/>
                        <Link className="link-return" to="/dashboard-attendee">Regresar</Link>
                    </div>
                    <h1 className="page-title">Disponibilidad de evento</h1>
                </header>
                <EventSaleSection />
                <div className="seats-reservation">
                    <SeatsMap locationName={GetEventLocation(selectedEvent!.event_location_id)} apiSeats={seatsInventory}/>
                    <TicketSelection />
                </div>
            </main>
        )
    )
}