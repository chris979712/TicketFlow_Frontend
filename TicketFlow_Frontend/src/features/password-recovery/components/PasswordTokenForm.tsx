import { Input } from "../../../components/Input"
import { Alert } from "../../../components/Alert";
import { Loader } from "../../../components/Loader";
import { usePasswordRecover } from "../hooks/PasswordRecover";
import './Form.css'

export function PasswordRecoverForm (){

    const {alert,setAlert,handleSubmit,errorValidation,setVerificationCode,setNewPassword,loading} = usePasswordRecover();
    
    return (
        <section className="recovery-password">
            {
                alert && (
                    <Alert type={alert.type} 
                        message={alert.message} 
                        onClose={() => setAlert(null)} />
                )
            }
            <form onSubmit={handleSubmit} className="pr-form-recovery" aria-describedby="instructions password-guidelines">
                <div id="instructions" className="pr-div-instructions">
                    <h2>Código de verificación</h2>
                    <p>Se ha mandado un código de verificación al correo electrónico proporcionado, favor ingresarlo en el siguiente cuadro de texto.</p>
                </div>
                { errorValidation && <p className="pr-error-format-input"  role="alert">{errorValidation}</p>}
                <div className="pr-input-wrapper">
                    <Input
                        id="pr-txt_email"
                        name="verificationCode"
                        type="text"
                        label="Ingrese el código de verificación enviado a su correo:"
                        maxLength={100}
                        required
                        onChange={(e) => setVerificationCode(e.target.value)}
                        aria-describedby="verification-help"
                    />
                    <p id="verification-help" className="visually-hidden">
                    El código es temporal y debe ingresarse exactamente como aparece en el correo.
                    </p>
                    <Input
                        id="txt_newPassword"
                        name="newPassword"
                        type="password"
                        label="Ingrese su nueva contraseña:"
                        iconSize={30}
                        required
                        minLength={8}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <p id="pr-password-guidelines" className="p-indications">Recuerde que su contraseña debe contener al menos 8 caracteres, con al menos 1 letra mayuscula, 1 letra minúscula, 1 número y 1 caracter especial.</p>
                </div>
                <button type="submit" className="pr-btn-submit-recover" disabled={loading}>{loading ? <Loader /> : "Actualizar"}</button>
            </form>
        </section>
    )
}