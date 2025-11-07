import { Input } from "../../../components/Input";
import { Link } from "react-router-dom";
import { Alert } from "../../../components/Alert";
import { useLogIn } from "../hooks/useLogIn";
import './LoginForm.css'

export function LoginForm(){
    const {setUsername, errorValidation,setPassword, handleSubmit,alert,setAlert} = useLogIn();
    
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
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {
                    errorValidation && <p className="error-format-inputs">{errorValidation}</p>
                }
                <button type="submit" className="btn_submit">Ingresar</button>
                <Link to="/password-recovery" className="a-recovery-password">Recuperar mi contraseña</Link>
                <Link to="/sign-in" className="a-register">Registrarse</Link>
            </form>
        </>
    )
}