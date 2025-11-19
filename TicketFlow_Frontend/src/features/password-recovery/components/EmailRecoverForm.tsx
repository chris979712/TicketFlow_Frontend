import { Alert } from "../../../components/Alert";
import { Input } from "../../../components/Input";
import { Loader } from "../../../components/Loader";
import { useEmailRecover } from "../hooks/EmailRecover";
import './Form.css'


export function EmailRecoverForm (){     
    const {alert,handleSubmit,setEmail,errorValidation,setAlert,loading} = useEmailRecover();
    return (
        <section className="recovery-password">
            {
                alert && (
                    <Alert type={alert.type} 
                        message={alert.message} 
                        onClose={() => setAlert(null)} />
                )
            }
            <form onSubmit={handleSubmit} className="form-recovery" aria-describedby="recovery-instructions">
                <div id="recovery-instructions" className="div_instructions">
                    <h2>Restablecer contraseña</h2>
                    <p>Si olvidaste tu contraseña de acceso de TicketFlow, escriba su cuenta de correo con la cual se registro y recibirá el código de verificación para el restablecimiento de su contraseña.</p>
                </div>
                <Input
                    id="txt_email"
                    name="email"
                    type="email"
                    label="Ingrese el correo electrónico asociado a su cuenta:"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                >
                </Input>
                { errorValidation && <p className="error-format-inputs" role="alert">{errorValidation}</p>}
                <button type="submit" className="btn-submit-recover" disabled={loading}>{loading ? <Loader /> : "continuar"}</button>
            </form>
        </section>
    )
}