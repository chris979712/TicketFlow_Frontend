import { ArrowLeftSquareIcon as ReturnIcon } from "lucide-react";
import { Link } from "react-router-dom";
import './NotFound.css'

export default function NotFound(){
    return (
        <main className="notfound-page">
            <div className="ticket-container">
                <div className="ticket-stub">
                    <span className="code">TKTFLW</span>
                    <span className="number">Nº 404</span>
                </div>
                <div className="ticket-main">
                    <span className="ticket-main-text">404</span>
                </div>
            </div>

            <h1>Página No Encontrada</h1>
            <p>Parece que este boleto se perdió entre la multitud.</p>
            
            <Link to="/" className="back-link-btn">
                <ReturnIcon size={22} />
                Regresar al inicio
            </Link>
        </main>
    );
}