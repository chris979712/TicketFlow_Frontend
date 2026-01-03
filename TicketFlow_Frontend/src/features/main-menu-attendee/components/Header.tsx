import TicketFlowWhiteLogo from '../../../../public/Logo_Blanco_horizontal.png';
import { NavBar } from './Nav';
import './Header.css'

export function Header(){
    return (
        <header className="ma-header-menu-attendee">
            <div className='ma-div_welcome'>
                <img src={TicketFlowWhiteLogo} alt="Ticket flog logo color blanco" title="logo de ticket flow"/>
            </div>
            <NavBar></NavBar>
        </header>
    )
}