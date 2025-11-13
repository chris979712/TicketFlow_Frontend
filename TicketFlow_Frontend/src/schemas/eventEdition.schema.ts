import Joi from "joi";
import {RegexTextNumbersCharacters,RegexMultilineText,RegexSimpleText,RegexDateFormat,RegexHour} from '../utils/regex';

const EventEditionInformationSchema = Joi.object({
    name: Joi.string().min(1).regex(RegexTextNumbersCharacters).required().messages({
        'any.required': "Por favor ingrese un nombre para su evento.",
        'string.empty': "Por favor ingrese un nombre para su evento.",
        "string.min": "El nombre del evento debe contener al menos un caracter.",
        "string.pattern.base": "Verifique el formato del nombre de evento ingresado."
    }),
    description: Joi.string().min(1).regex(RegexMultilineText).required().messages({
        'any.required': "Por favor ingrese una descripción para su evento.",
        'string.empty': "Por favor ingrese una descripción para su evento.",
        "string.min": "La descripción del evento debe contener al menos un caracter.",
        "string.pattern.base": "Verifique el formato de la descripción del evento ingresado."
    }),
    category: Joi.string().min(4).regex(RegexSimpleText).required().messages({
        'any.required': "Por favor seleccione una categoria para su evento.",
        'string.empty': "Por favor seleccione una categoria para su evento.",
        "string.min": "La categoria del evento debe contener al menos 4 caracteres",
        "string.pattern.base": "Verifique el formato de la categoria del evento ingresada."
    }),
    eventDate: Joi.string().min(10).max(10).regex(RegexDateFormat).required().messages({
        'any.required': "Por favor ingrese una fecha para su evento.",
        'string.empty': "Por favor ingrese una fecha para su evento.",
        "string.min": "Verifique el formato de la fecha ingresada.",
        "string.pattern.base": "Verifique el formato de la fecha ingresada."
    }),
    startingHour: Joi.string().min(5).regex(RegexHour).required().messages({
        'any.required': "Por favor ingrese una hora de inicio para su evento.",
        'string.empty': "Por favor ingrese una hora de inicio para su evento.",
        "string.min": "Verifique el formato de la hora de inicio ingresada.",
        "string.pattern.base": "Verifique el formato de la hora de inicio ingresada."
    }),
    endingHour: Joi.string().min(5).regex(RegexHour).required().messages({
        'any.required': "Por favor ingrese una hora de finalización para su evento.",
        'string.empty': "Por favor ingrese una hora de finalización para su evento.",
        "string.min": "Verifique el formato de la hora de fin ingresada.",
        "string.pattern.base": "Verifique el formato de la hora de fin ingresada."
    })
})

const EventStatusSchema = Joi.object({
    statusId: Joi.number().positive().min(1).required().messages({
        'any.required': "Por favor seleccione un estado para el evento a editar.",
        "number.positive": "Por favor seleccione un estado para su evento a editar.",
        "number.min": "El identificador del estado del evento debe ser un número positivo.",
        "number.base": "El identificador del estado del evento debe ser un número positivo."
    })
})

export function ValidateEventEditionInformation(name: string, description: string, category: string, eventDate: string, startingHour: string, endingHour: string){
    return EventEditionInformationSchema.validate({name,description,category,eventDate,startingHour,endingHour},{abortEarly: true});
}

export function ValidateEventEditionStatus(statusId: number){
    return EventStatusSchema.validate({statusId},{abortEarly: true});
}