import Joi from "joi";
import { RegexDateFormat } from "../utils/regex";

const SearchingDatesSchema = Joi.object({
    companyId: Joi.number().positive().integer().min(1).required().messages({
        "number.min": "El identificador de la compañia debe ser positivo",
        "number.base": "El idenficador de la compañia debe ser un número entero positivo"
    }),
    startDate: Joi.string().min(10).max(10).regex(RegexDateFormat).required().messages({
        'any.required': "Por favor ingrese una fecha de inicio de búsqueda.",
        'string.empty': "Por favor ingrese una fecha de inicio de búsqueda.",
        "string.min": "La fecha de inicio de búsqueda ingresada es incorrecta",
        "string.pattern.base": "Verifique el formato de fecha para inicio de búsqueda ingresado."
    }),
    endDate: Joi.string().min(10).max(10).regex(RegexDateFormat).required().messages({
        'any.required': "Por favor ingrese una fecha de fin de búsqueda.",
        'string.empty': "Por favor ingrese una fecha de fin de búsqueda.",
        "string.min": "La fecha de fin de búsqueda ingresada es incorrecta",
        "string.pattern.base": "Verifique el formato de fecha para fin de búsqueda ingresado."
    }),
});

export function ValidateSalesReportSearchingInformation(companyId: number, startDate: string, endDate: string){
    return SearchingDatesSchema.validate({companyId,startDate,endDate},{abortEarly: true});
}