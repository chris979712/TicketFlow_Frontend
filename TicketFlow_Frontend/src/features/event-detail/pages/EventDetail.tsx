import { Link } from "react-router-dom";
import { Alert } from "../../../components/Alert";
import { SeatsMap } from "../../../components/SeatsMap";
import { GetEventLocation } from "../../../utils/const";
import { useEventDetail } from "../hooks/useEventDetail";
import { EventSaleSection } from "../components/EventSection";
import { TicketSelection } from "../components/TicketsSelected";
import TicketFlowWhiteLogo from '../../../../public/Logo_Blanco_horizontal.png';

import "./EventDetail.css"

export default function EventDetails(){
    const {
        isAttendee,
        alert,
        setAlert,
        selectedEvent,
        seatsInventory,
        mainRef
    } = useEventDetail();

    return (
        isAttendee && (
            <main ref={mainRef} className="main-event-details ed-unique">
                {
                    alert && (
                        <div aria-live="assertive">
                            <Alert
                                type={alert.type}
                                message={alert.message}
                                onClose={() => setAlert(null)}
                            />
                        </div>
                    )
                }

                <header className="ed-header-attendee" role="banner">
                    <div className='ed-div_welcome'>
                        <img
                            src={TicketFlowWhiteLogo}
                            alt=""
                            aria-hidden="true"
                        />

                        <Link
                            className="ed-link-return"
                            to="/dashboard-attendee"
                            aria-label="Regresar al panel principal"
                        >
                            Regresar
                        </Link>
                    </div>

                    <h1 className="ed-page-title">
                        Disponibilidad de evento
                    </h1>
                </header>

                <div className="ed-section-wrap">
                    <EventSaleSection />

                    <div
                        className="ed-seats-reservation"
                        aria-label="Selección de asientos y boletos"
                    >
                        <SeatsMap
                            locationName={GetEventLocation(selectedEvent!.event_location_id)}
                            apiSeats={seatsInventory}
                        />
                        <TicketSelection />
                    </div>
                </div>
            </main>
        )
    )
}
