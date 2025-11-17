import Joi from "joi";
import { RegexISOTimeDate } from "../utils/regex";
import type { SeatReservationType } from "../features/event-detail/services/EventSale";

const SeatReservationSchema = Joi.object({
    event_id: Joi.number().positive().min(1).required().messages({
        'any.required': "El ID del evento asociado a la reservación es requerido.",
        "number.positive": "El ID del evento asociado a la reservación es inválido.",
        "number.min": "El ID del evento asociado a la reservación es inválido.",
        "number.base": "El ID del evento asociado a la reservación es inválido."
    }),
    event_seat_id: Joi.number().positive().min(1).required().messages({
        'any.required': "El ID del evento asociado a la reservación es requerido.",
        "number.positive": "El ID del asiento asociado a la reservación es inválido.",
        "number.min": "El ID del asiento asociado a la reservación es inválido.",
        "number.base": "El ID del asiento asociado a la reservación es inválido."
    }),
    expiration_at: Joi.string().regex(RegexISOTimeDate).required().messages({
        'any.required': "El tiempo de expiración de la reservación es requerido.",
        'string.empty': "El tiempo de expiración de la reservación es requerido.",
        "string.min": "El formato del tiempo de expiración de la reservación es inválido.",
        "string.pattern.base": "El formato del tiempo de expiración de la reservación es inválido."
    })
})

const SeatReservationArraySchema = Joi.array().items(SeatReservationSchema).min(1).required().messages({
    "array.base": "Las reservaciones deben enviarse en un arreglo.",
    "array.min": "Debe seleccionar un asiento para realizar una reservación.",
    "array.includes": "Una o mas asientos para reservar no cumplen con el formato requerido.",
    "any.required": "Los asientos para reservar son obligatorio."
});

export function ValidateSeatsToReservate(seats: SeatReservationType[]){
    return SeatReservationArraySchema.validate(seats,{abortEarly: true});
}

