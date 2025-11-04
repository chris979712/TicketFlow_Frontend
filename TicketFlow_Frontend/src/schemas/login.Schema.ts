import joi from "joi";
import { RegexUsername,RegexPassword } from "../utils/regex";

const UserSchema = joi.object({
    username: joi.string().min(3).regex(RegexUsername).required().messages({
        "string.min": "El nombre de usuario debe tener más de 3 caracteres",
        "string.pattern.base": "Verifique que el nombre de usuario solo contenga letras o números"
    }),
    password: joi.string().min(8).regex(RegexPassword).required().messages({
        "string.min": "La contraseña debe ser de al menos 8 caracteres.",
        "string.pattern.base": "Verifique que la contraseña contenga al menos 1 letra mayúscula, 1 letra minúscula, 1 caracter especial, 1 número y sea de al menos 8 caracteres sin espacios."
    })
});

export function ValidateLogIn(username: string,password: string){
    return UserSchema.validate({username,password},{abortEarly: true});
}