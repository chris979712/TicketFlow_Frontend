import TicketFlowWhiteLogo from '../../../../public/Logo_Blanco_horizontal.png';
import { NavBar } from './Nav';
import './Header.css'

export function Header(){
    return (
        <header className="header-menu-organizer">
            <div className='div_welcome'>
                <img src={TicketFlowWhiteLogo} alt="TicketFlow logo color blanco" title="logo de ticket flow"/>
            </div>
            <NavBar></NavBar>
        </header>
    )
}