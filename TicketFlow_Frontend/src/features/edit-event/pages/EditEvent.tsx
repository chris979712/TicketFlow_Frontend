import { useEventStore } from "../hooks/useEventStore";
import { EventEditionForm } from "../components/EventEditionForm";
import TicketFlowWhiteLogo from "../../../../public/Letras_Blancas_TicketFlow.png"
import { Link } from "react-router-dom";
import "./EditEventPage.css"

export default function EditEvent(){
    const Event = useEventStore(state => state.selectedEvent);

    return (
        <main id="event-edit-root" className="edit-event-page ee-unique-9f3a">
            {
                Event && (
                    <section className="event-form-edition">
                        <header className="header-edition-event">
                            <div className='div_welcome'>
                                <img src={TicketFlowWhiteLogo} alt="Ticket flog logo color blanco" title="logo de ticket flow"/>
                                <Link className="link-return" to="/dashboard-organizer">Regresar</Link>
                            </div>
                        </header>
                        <h1 className="title">Edición de datos generales de evento</h1>
                        <p className="indications">Recuerde que al editar un evento, ya no es posible modificar datos como asientos o lugar de sede.</p>
                        <EventEditionForm/>
                    </section>
                )
            }
            {
                !Event && <p className="error-not-event">No se puede editar ningun evento</p>
            }
        </main>
    )
}
