import Joi from "joi";
import { RegexUniqueEmail } from "../utils/regex";

const EmailSchema = Joi.object({
    email: Joi.string().email().regex(RegexUniqueEmail).required().messages({
        "string.pattern.base": "Verifique el formato del correo ingresado."
    }),
})

export function ValidateEmail(email: string){
    return EmailSchema.validate({email},{abortEarly: true})
}