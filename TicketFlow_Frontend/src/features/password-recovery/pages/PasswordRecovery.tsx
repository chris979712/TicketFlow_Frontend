import { EmailRecoverForm } from "../components/EmailRecoverForm"
import TickerFlowWhiteLogo from '../../../../public/Logo_Blanco_horizontal.png'
import { usePasswordRecovery} from "../hooks/PasswordRecoveryContext"
import './PasswordRecovery.css'

export default function PasswordRecovery(){
    const {isInsertingEmail,isInsertingCodeAndPassword} = usePasswordRecovery();

    return (
        <main>
            <header className="header-menu-organizer">
                    <div className='div_welcome'>
                        <img src={TickerFlowWhiteLogo} alt="Ticket flog logo color blanco" title="logo de ticket flow"/>
                    </div>
                </header>
            <h1 className="title-page">Recuperación de contraseña</h1>
            {
                isInsertingEmail && (
                    <EmailRecoverForm />
                )
            }
            {
                isInsertingCodeAndPassword && (
                    <h1>Feli</h1>
                )
            }
        </main>
    )
}