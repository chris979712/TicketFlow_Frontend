import { LoginForm } from "../components/LoginForm"
import ticketFlow_horizontal from '../../../assets/TicketFlow_horizontal.png';
import './login.css'

export default function Login(){
    return(
        <div className="lg-login">
            <section className="lg-welcome-messages-section">
                <img src ={ticketFlow_horizontal} alt="Logo de TicketFlow en posición horizontal" title="TicketFlowH" className="lg-img_logo_horizontal"/>
                <h2>Bienvenido</h2>
                <p className="lg-p_welcomeMessage">Descubre eventos, recibe alertas sobre tus artistas favoritos, obras de teatro y más. Además de la impresión de tus boletos de forma rápida y segura.</p>
            </section>
            <section className="lg-register-section">
                <h2>Iniciar sesión</h2>
                <p className="lg-p_indications"><strong>Si no tiene una cuenta, de click en registrarse.</strong></p>
                <LoginForm />
            </section>
        </div>
    )
}