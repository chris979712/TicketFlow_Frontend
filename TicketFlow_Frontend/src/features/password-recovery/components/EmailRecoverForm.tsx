import { useState } from "react";
import { Input } from "../../../components/Input"
import { usePasswordRecovery } from "../hooks/PasswordRecoveryContext"
import {SendValidationCode} from '../services/PasswordRecover'
import './Form.css'
import { ValidateEmail } from "../../../schemas/email.Schema";
import { useAlert} from "../../../hooks/useAlert";
import { Alert } from "../../../components/Alert";

export function EmailRecoverForm (){
    const {setIsInsertingEmail, setIsInsertingCodeAndPassword} = usePasswordRecovery();
    const [email,setEmail] = useState("");
    const [errorValidation, setErrorValidation] = useState(""); 
    const {alert,setAlert} = useAlert();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const DataValidation = ValidateEmail(email);
        if(!DataValidation.error)
        {
            const ApiResponse = await SendValidationCode(email);
            if(ApiResponse.status === 200){
                setIsInsertingEmail(false);
                setIsInsertingCodeAndPassword(true);
            }else if(ApiResponse.status >= 400 && ApiResponse.status <= 499){
                setAlert({type: "warning",message: ApiResponse.message!})
            }else{
                setAlert({type: "error",message: ApiResponse.message!})
            }

        }else{
            setErrorValidation(DataValidation.error.details[0].message);
        }
    }

    return (
        <section className="recovery-password">
            {
                alert && (
                    <Alert type={alert.type} 
                        message={alert.message} 
                        onClose={() => setAlert(null)} />
                )
            }
            <form onSubmit={handleSubmit} className="form-recovery">
                <div className="div_instructions">
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
                { errorValidation && <p className="error-format-inputs">{errorValidation}</p>}
                <button type="submit" className="btn_submit">Continuar</button>
            </form>
        </section>
    )
}