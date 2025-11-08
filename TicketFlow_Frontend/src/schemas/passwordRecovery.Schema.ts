import Joi from "joi";
import { RegexTextNumbersCharacters,RegexPassword,RegexUniqueEmail} from "../utils/regex";

const EmailSchema = Joi.object({
    email: Joi.string().email().regex(RegexUniqueEmail).required().messages({
        "string.pattern.base": "Verifique el formato del correo ingresado."
    }),
});

const PasswordTokenSchema = Joi.object({
    token: Joi.string().regex(RegexTextNumbersCharacters).required().messages({
        "string.pattern.base": "Verifique que el código ingresado solo sean letras, números y caracteres."
    }),
    password: Joi.string().min(8).regex(RegexPassword).required().messages({
        "string.pattern.base": "Verifique que la contraseña contenga al menos 1 letra mayúscula, 1 letra minúscula, 1 caracter especial, 1 número y sea de al menos 8 caracteres sin espacios."
    })
});


export function ValidateEmail(email: string){
    return EmailSchema.validate({email},{abortEarly: true});
}

export function ValidatePasswordToken(token: string, password: string){
    return PasswordTokenSchema.validate({token,password}, {abortEarly: true});
}