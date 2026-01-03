import { Link } from "react-router-dom"
import { LogOutIcon } from "lucide-react"
import { useHandleSession } from "../../../hooks/useHandleSession"
import './Nav.css'

export function NavBar(){
    const {handleLogout} = useHandleSession();

    return (
        <nav className="mo-navbar" aria-label="Navegación principal">
            <div className="mo-navbar-center">
                <ul className="mo-navbar-links">
                    <li><Link to="/dashboard-organizer/event-creation">Crear evento</Link></li>
                    <li><Link to="/reporte-evento">Reporte de evento</Link></li>
                </ul>
            </div>
            <button className="mo-btn-logout" onClick={handleLogout}><LogOutIcon size={20} aria-hidden="true"></LogOutIcon><span className="visually-hidden">Cerrar sesión</span></button>
        </nav>
    )
}