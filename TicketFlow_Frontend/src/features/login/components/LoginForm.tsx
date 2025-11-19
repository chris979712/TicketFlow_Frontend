import { Input } from "../../../components/Input";
import { Link } from "react-router-dom";
import { Alert } from "../../../components/Alert";
import { useLogIn } from "../hooks/useLogIn";
import { Loader } from "../../../components/Loader";
import './LoginForm.css'

export function LoginForm(){
    const {setUsername, errorValidation,setPassword, handleSubmit,alert,setAlert,loading} = useLogIn();
    
    return (
        <>
            {
                alert && (
                    <Alert type={alert.type} 
                        message={alert.message} 
                        onClose={() => setAlert(null)} />
                )
            }
            <form onSubmit={handleSubmit} className="Form">
                <Input 
                    id="txt_username"
                    name="username"
                    label="Nombre de usuario: "
                    placeholder="user1234"
                    type="text"
                    maxLength={100}
                    onChange={(e) => setUsername(e.target.value)}
                    required/>
                <Input 
                    id="txt_password"
                    name="password"
                    label="Contraseña"
                    type="password"
                    aria-describedby="passwordHelp"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <p id="passwordHelp" className="sr-only">
                    Tu contraseña se ingresará de manera segura.
                </p>
                {
                    errorValidation && <p className="error-format-inputs" role="alert" aria-live="assertive">{errorValidation}</p>
                }
                <button type="submit" className="btn_submit" disabled={loading}>{loading ? <Loader /> : "Iniciar sesión"}</button>
                <Link to="/password-recovery" className="a-recovery-password"  aria-label="Recuperar mi contraseña de acceso">Recuperar mi contraseña</Link>
                <Link to="/sign-in" className="a-register" aria-label="Registrarse para crear una cuenta nueva">Registrarse</Link>
            </form>
        </>
    )
}