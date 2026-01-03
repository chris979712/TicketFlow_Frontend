import { Input } from "../../../components/Input";
import './RegisterForm.css'
import { Alert } from "../../../components/Alert";
import { useRegister } from "../hooks/useRegister";
import { Loader } from "../../../components/Loader";

export function RegisterForm(){
    const {alert,formRef,setAlert,setName,setFirstlastname,setSecondlastname,setEmail,setUsername,setPassword,setPasswordConfirmation,errorValidation,handleSubmit,loading} = useRegister();
    return(
        <>
            {
                alert && (
                    <Alert type={alert.type} 
                        message={alert.message} 
                        onClose={() => setAlert(null)} />
                )
            }
            <form ref={formRef} onSubmit={handleSubmit} className="rg-register-form">
                {
                    errorValidation && <p className="rg-error-format-inputs" role="alert" aria-live="assertive">{errorValidation}</p>
                }
                <Input
                    label="Nombres(s):"
                    id="txt_name"
                    name="name"
                    type="text"
                    placeholder="Ingrese su nombre(s)"
                    maxLength={100}
                    onChange={(e) => setName(e.target.value)}
                    required
                    aria-required="true"
                />
                <Input
                    label="Primer apellido:"
                    id="txt_firstLastName"
                    name="firstlastname"
                    type="text"
                    placeholder="Ingrese su primer apellido"
                    maxLength={100}
                    onChange={(e) => setFirstlastname(e.target.value)}
                    required
                    aria-required="true"
                />
                <Input
                    label="Segundo apellido:"
                    id="txt_secondLastName"
                    name="secondlastname"
                    type="text"
                    placeholder="Ingrese su segundo apellido"
                    maxLength={100}
                    onChange={(e) => setSecondlastname(e.target.value)}
                />
                <Input 
                    label="Correo:"
                    id="txt_email"
                    name="email"
                    type="email"
                    placeholder="alguien@example.com"
                    required
                    maxLength={100}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-required="true"                                        
                />
                <Input 
                    label="Nombre de usuario:"
                    id="txt_username"
                    name="username"
                    type="text"
                    placeholder="Ejemplo: user123"
                    required
                    maxLength={100}
                    onChange={(e) => setUsername(e.target.value)}
                    aria-required="true"
                />
                <Input 
                    label="Contraseña: "
                    id="pwd_password"
                    name="password"
                    type="password" 
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    aria-required="true"
                    aria-describedby="passwordRules"
                />
                <Input 
                    label="Confirmación de contraseña: "
                    id="pwd_passwordConfirmation"
                    name="passwordConfirmation"
                    type="password" 
                    required
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    aria-required="true"
                    aria-describedby="passwordRules"
                />
                <p id="passwordRules"><strong>Recuerde que su contraseña debe incluir al menos ocho caracteres, incluyendo por lo menos una letra mayúscula, una letra minúscula, un número y un caracter especial. </strong></p>
                <button type="submit" className="rg-btn-submit" disabled={loading}>{loading ? <Loader /> : "Registrarse"}</button>
            </form>
        </>
    )
}