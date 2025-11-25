import { Alert } from "../../../components/Alert";
import { Input } from "../../../components/Input";
import { Loader } from "../../../components/Loader";
import { useEmailRecover } from "../hooks/EmailRecover";
import './Form.css'


export function EmailRecoverForm (){     
    const {alert,handleSubmit,setEmail,errorValidation,setAlert,loading} = useEmailRecover();
    return (
        <section className="pr-recovery-password" aria-labelledby="pr-recovery-title">
            {
                alert && (
                    <Alert type={alert.type} 
                        message={alert.message} 
                        onClose={() => setAlert(null)} />
                )
            }
            <form onSubmit={handleSubmit} className="pr-form-recovery" aria-describedby="pr-recovery-instructions">
                <div id="pr-recovery-instructions" className="pr-div-instructions">
                    <h2 id="pr-recovery-title">Restablecer contraseña</h2>
                    <p>Si olvidaste tu contraseña de acceso de TicketFlow, escribe el correo con el que te registraste y recibirás el código de verificación para restablecer tu contraseña.</p>
                </div>

                <div className="pr-input-wrapper">
                    <Input
                        id="pr-txt_email"
                        name="email"
                        type="email"
                        label="Correo electrónico asociado a la cuenta:"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                { errorValidation && <p className="pr-error-format-inputs" role="alert">{errorValidation}</p>}

                <button type="submit" className="pr-btn-submit-recover" disabled={loading}>{loading ? <Loader /> : "Continuar"}</button>
            </form>
        </section>
    )
}
