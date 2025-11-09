import Joi from "joi";
import { RegexSimpleText, RegexTextNumbersCharacters } from "../utils/regex";

const EventNameSchema = Joi.object({
    name: Joi.string().min(1).regex(RegexTextNumbersCharacters).allow(null,'').messages({
        "string.min": "El nombre del evento debe contener al menos un caracter.",
        "string.pattern.base": "Verifique el formato del nombre de evento ingresado."
    })
});

const EventCategorySchema = Joi.object({
    category: Joi.string().min(4).regex(RegexSimpleText).allow(null,'').messages({
        "string.min": "La categoria del evento debe contener al menos 4 caracteres",
        "string.pattern.base": "Verifique el formato de la categoria del evento ingresada."
    })
});

const EventStatusSchema = Joi.object({
    status_id: Joi.number().integer().positive().min(1).allow(0).messages({
        "number.min": "El identificador de la categoria ser positivo",
        "number.base": "El idenficador de la categoria debe ser un número entero positivo"
    }),
});

export function ValidateEventNameSchema(name: string){
    return EventNameSchema.validate({name: name})
}

export function ValidateEventCategorySchema(category: string){
    return EventCategorySchema.validate({category: category})
}

export function ValidateEventStatusSchema(status: number){
    return EventStatusSchema.validate({status_id: status})
}