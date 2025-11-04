import Joi from "joi";
import { RegexUsername,RegexName,RegexPassword,RegexUniqueEmail } from "../utils/regex";

const RegisterSchema = Joi.object({
    name: Joi.string().min(1).regex(RegexName).required().messages({
        "string.min": "El nombre no puede estar vacío.",
        "string.pattern.base": "Verifique el formato del nombre ingresado."
    }),
    firstLastName: Joi.string().min(1).regex(RegexName).required().messages({
        "string.min": "El primer apellido no puede estar vacío.",
        "string.pattern.base": "Verifique el formato del primer apellido ingresado."
    }),
    secondLastName: Joi.string().min(0).regex(RegexName).allow(null,"").messages({
        "string.pattern.base": "Verifique el formato del segundo apellido ingresado."
    }),
    email: Joi.string().email().regex(RegexUniqueEmail).required().messages({
        "string.pattern.base": "Verifique el formato del correo ingresado."
    }),
    username: Joi.string().min(3).regex(RegexUsername).required().messages({
        "string.min": "El nombre de usuario debe tener más de 3 caracteres",
        "string.pattern.base": "Verifique que el nombre de usuario solo contenga letras o números"
    }),
    password: Joi.string().min(8).regex(RegexPassword).required().messages({
        "string.min": "La contraseña debe ser de al menos 8 caracteres.",
        "string.pattern.base": "Verifique que la contraseña contenga al menos 1 letra mayúscula, 1 letra minúscula, 1 caracter especial, 1 número y sea de al menos 8 caracteres sin espacios."
    }),
    confirmationPassword: Joi.string().min(8).regex(RegexPassword).required().messages({
        "string.min": "La contraseña de confirmación debe ser igual que la contraseña ingresada en la parte superior.",
        "string.pattern.base": "Verifique que la contraseña de confirmación sea igual que la contraseña ingresada en la parte superior"
    })
})

export function ValidateRegister(name: string, firstLastName: string, secondLastName: string, email: string, username: string, password: string, confirmationPassword: string){
    return RegisterSchema.validate({name,firstLastName,secondLastName,email,username,password,confirmationPassword},{abortEarly: true})
}