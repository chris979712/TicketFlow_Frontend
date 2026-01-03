import { Link } from "react-router-dom"
import { LogOutIcon } from "lucide-react"
import { useHandleSession } from "../../../hooks/useHandleSession"
import './Nav.css'

export function NavBar(){
    const {handleLogout} = useHandleSession();

    return (
        <nav className="ma-navbar">
            <div className="ma-container-navigation">
                <div className="ma-navbar-center">
                    <ul className="ma-navbar-links">
                        <li><Link to="/dashboard-attendee/my-tickets">Mis boletos</Link></li>
                    </ul>
                </div>
                <button className="ma-btn-logout" onClick={handleLogout}><LogOutIcon size={20}></LogOutIcon></button>
            </div>
        </nav>
    )
}