import { Link } from "react-router-dom"
import { LogOutIcon } from "lucide-react"
import { useHandleSession } from "../../../hooks/useHandleSession"
import './Nav.css'

export function NavBar(){
    const {handleLogout} = useHandleSession();

    return (
        <nav className="navbar">
            <div className="navbar-center">
                <ul className="navbar-links">
                    <li><Link to="/dashboard-attendee/my-tickets">Mis boletos</Link></li>
                </ul>
            </div>
            <button className="btn-logout" onClick={handleLogout}><LogOutIcon size={20}></LogOutIcon></button>
        </nav>
    )
}