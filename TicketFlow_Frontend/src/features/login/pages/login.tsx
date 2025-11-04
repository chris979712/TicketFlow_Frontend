import { LoginForm } from "../components/LoginForm"
import ticketFlowLogo from '../../../assets/TicketFlow_horizontal.png';
import './login.css'

export default function Login(){
    return(
        <div className="login">
            <section className="welcome-messages-section">
                <h2>Bienvenido</h2>
                <p className="p_welcomeMessage">Descubre eventos, recibe alertas sobre tus artistas favoritos, obras de teatro y más. Además de la impresión de tus boletos de forma rápida y segura.</p>
            </section>
            <section className="register-section">
                <img src={ticketFlowLogo} alt="TicketFlow logo" title="TicketFlow Logo" className="img_logo"/>
                <h2>Iniciar sesión</h2>
                <p className="p_indications"><strong>Si no tiene una cuenta, de click en registrase.</strong></p>
                <LoginForm />
            </section>
        </div>
    )
}