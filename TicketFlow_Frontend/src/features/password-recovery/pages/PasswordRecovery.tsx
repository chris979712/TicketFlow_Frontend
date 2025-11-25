import { Link } from "react-router-dom"
import { EmailRecoverForm } from "../components/EmailRecoverForm"
import { usePasswordRecovery} from "../hooks/PasswordRecoveryContext"
import { PasswordRecoverForm } from "../components/PasswordTokenForm"
import TickerFlowWhiteLogo from '../../../../public/Logo_Blanco_horizontal.png'
import './PasswordRecovery.css'

export default function PasswordRecovery(){
    const {isInsertingEmail,isInsertingCodeAndPassword} = usePasswordRecovery();

    return (
        <main id="pw-recover-root" className="pr-page-root">
            <header className="pr-header">
                <div className='pr-div-welcome'>
                    <img src={TickerFlowWhiteLogo} alt="Logo de TicketFlow color blanco" title="logo de ticket flow"/>
                    <Link to="/" className="pr-link-to-menu" aria-label="Regresar a la página principal">Regresar</Link>
                </div>
            </header>

            <h1 className="pr-title-page">Recuperación de contraseña</h1>

            <section className="pr-content">
                {
                    isInsertingEmail && (
                        <EmailRecoverForm />
                    )
                }
                {
                    isInsertingCodeAndPassword && (
                        <PasswordRecoverForm />
                    )
                }
            </section>
        </main>
    )
}
