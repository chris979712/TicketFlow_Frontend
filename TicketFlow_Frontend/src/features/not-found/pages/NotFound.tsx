import { ArrowLeftSquareIcon as ReturnIcon } from "lucide-react";
import { Link } from "react-router-dom";
import './NotFound.css'

export function NotFound(){
    return (
        <div className="notfound-div">
            <h1>Recurso no encontrado</h1>
            <p>El recurso que deseas buscar no existe o fue movido de lugar.</p>
            <Link to="/" className="back-link"><ReturnIcon size={50}></ReturnIcon></Link>
        </div>
    );
}