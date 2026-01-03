import { RegisterForm } from "../components/RegisterForm";
import { Link } from "react-router-dom";
import { ArrowLeftCircleIcon as ReturnIcon } from "lucide-react";
import imagelogo from '../../../assets/TicketFlow_horizontal.png'
import './RegisterForm.css'

export default function Register(){
    return(
        <div className="rg-sign-in-div">
            <Link to="/" aria-label="Regresar a la página de inicio"><ReturnIcon size={50} strokeWidth={3}></ReturnIcon></Link>
            <h1>Registro de cuenta</h1>
            <p className="rg-message-register">¡Este es el primer paso para poder comenzar a vivir experiencias únicas e inolvidables!</p>
            <section className="rg-register-form">
                <img className="rg-logo" src={imagelogo} alt="TicketFlow Logo" title="logo TicketFlow"/>
                <RegisterForm />
            </section>
        </div>
    )
}