import Joi from "joi";
import {RegexSimpleText} from '../utils/regex'

const SectionSchema = Joi.object({
    sectionName: Joi.string().min(2).regex(RegexSimpleText).required().messages({
        "string.min": "Verifique el formato de la sección de los boletos.",
        "string.pattern.base": "Verifique el formato de la sección de los boletos."
    }),
    price: Joi.number().required().positive().messages({
        'any.required': "Por favor ingrese un precio para los boletos de sección de su evento.",
        "number.positive": "Por favor ingrese un precio positivo para los boletos de sección de su evento.",
        "number.min": "El precio de los boletos debe ser positivo.",
        "number.base": "El precio de los boletos debe ser positivo."
    }),
    maxTickets: Joi.number().integer().positive().min(0).required().messages({
        'any.required': "Por favor ingrese la cantidad de boletos a vender.",
        "number.positive": "Por favor ingrese la cantidad de boletos a vender.",
        "number.min": "El número de asientos debe ser positivo",
        "number.base": "El número de asientos debe ser un número entero positivo"
    }),
})

export function ValidateSectionConfiguration(sectionName: string, price: number, maxTickets: number){
    return SectionSchema.validate({sectionName,price,maxTickets},{abortEarly: true})
}