import './NotFound.css'
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftSquareIcon as ReturnIcon } from "lucide-react";
import { useSessionHandler } from "../../../hooks/useSessionHandler";

export default function NotFound(){
    const {DeleteTokenCookie} = useSessionHandler();

    useEffect(() => {
        DeleteTokenCookie();
    }, []);

    return (
        <main className="nf-notfound-page">
            <div className="nf-ticket-container">
                <div className="nf-ticket-stub">
                    <span className="nf-code">TKTFLW</span>
                    <span className="nf-number">Nº 404</span>
                </div>
                <div className="nf-ticket-main">
                    <span className="nf-ticket-main-text">404</span>
                </div>
            </div>

            <h1>Página No Encontrada</h1>
            <p>Parece que este boleto se perdió entre la multitud.</p>
            
            <Link to="/" className="nf-back-link-btn">
                <ReturnIcon size={22} />
                Regresar al inicio
            </Link>
        </main>
    );
}