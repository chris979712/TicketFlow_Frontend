import { Input } from "../../../components/Input";
import { Link } from "react-router-dom";
import './LoginForm.css'

export function LoginForm(){
    return (
            <form onSubmit={() => {}} className="Form">
                <Input 
                    id="txt_username"
                    name="username"
                    label="Nombre de usuario: "
                    placeholder="user1234"
                    type="text"
                    maxLength={100}
                    required/>
                <Input 
                    id="txt_password"
                    name="password"
                    label="Contraseña"
                    type="password"
                    required
                />
                <button type="submit" className="btn_submit">Ingresar</button>
                <Link to="/recover-password" className="a-recovery-password">Recuperar mi contraseña</Link>
                <Link to="/sign-in" className="a-register">Registrarse</Link>
            </form>
    )
}