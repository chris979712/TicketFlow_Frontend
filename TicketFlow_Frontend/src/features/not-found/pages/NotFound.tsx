import { ArrowLeftSquareIcon as ReturnIcon } from "lucide-react";
import { Link } from "react-router-dom";
import './NotFound.css'

export default function NotFound(){
    return (
        <div className="notfound-div">
            <h1>Recurso no encontrado</h1>
            <p>El recurso que deseas buscar no existe, fue movido de lugar o no cuenta con los permisos necesarios para acceder a el.</p>
            <Link to="/" className="back-link"><ReturnIcon size={50}></ReturnIcon></Link>
        </div>
    );
}