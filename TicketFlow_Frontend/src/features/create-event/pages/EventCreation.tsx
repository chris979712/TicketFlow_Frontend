import { EventCreationForm } from "../components/EventCreationForm"
import TicketFlowWhiteLogo from '../../../../public/Logo_Blanco_horizontal.png';
import { useNavigationOrganizer } from "../../../hooks/useNavigationOrganizer";
import { Link } from "react-router-dom";
import './EventCreation.css'

export default function EventCreation(){
    const {isOrganizer} = useNavigationOrganizer();
    return (
        isOrganizer && (
            <div className="event-creation-page">
                <header className="header-menu-organizer">
                    <div className='div_welcome'>
                        <img src={TicketFlowWhiteLogo} alt="Ticket flog logo color blanco" title="logo de ticket flow"/>
                        <Link className="link-return" to="/dashboard-organizer">Regresar</Link>
                    </div>
                </header>
                <div className="event-creation">
                    <h1>Creación de evento</h1>
                    <EventCreationForm />
                </div>
            </div>
        )
    )
}