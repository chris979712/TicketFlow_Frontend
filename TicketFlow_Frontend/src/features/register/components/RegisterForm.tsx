import { Input } from "../../../components/Input";
import './RegisterForm.css'

export function RegisterForm(){
    return(
        <form action="" className="register-form">
            <Input
                label="Nombres(s):"
                id="txt_name"
                name="name"
                type="text"
                placeholder="Ingrese su nombre(s)"
                maxLength={100}
                required
            />
            <Input
                label="Primer apellido:"
                id="txt_firstLastName"
                name="firstlastname"
                type="text"
                placeholder="Ingrese su primer apellido"
                maxLength={100}
                required
            />
            <Input
                label="Segundo apellido:"
                id="txt_secondLastName"
                name="secondlastname"
                type="text"
                placeholder="Ingrese su segundo apellido"
                maxLength={100}
            />
            <Input 
                label="Correo:"
                id="txt_email"
                name="email"
                type="email"
                placeholder="alguien@example.com"
                required
                maxLength={100}
            />
            <Input 
                label="Nombre de usuario:"
                id="txt_username"
                name="username"
                type="text"
                placeholder="Ejemplo: user123"
                required
                maxLength={100}
            />
            <Input 
                label="Contraseña: "
                id="pwd_password"
                name="password"
                type="password" 
                required
            />
            <Input 
                label="Confirmación de contraseña: "
                id="pwd_passwordConfirmation"
                name="passwordConfirmation"
                type="password" 
                required
            />
            <p>Recuerde que su contraseña debe incluir al menos ocho caracteres, incluyendo por lo menos una letra mayúscula, una letra minúscula, un número y un caracter especial.</p>
            <button type="submit" className="btn-submit">Registrarse</button>
        </form>
    )
}