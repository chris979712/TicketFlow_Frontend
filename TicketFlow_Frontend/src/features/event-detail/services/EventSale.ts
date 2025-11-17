import axios from "axios";
import { type ApiResponse } from "../../../schemas/api";
const API_URL = import.meta.env.VITE_API_URL;

export type SeatReservationType ={
    event_id: number,
    event_seat_id: number,
    expiration_at: string
}

export async function ObtainEventInventory(eventId: number):Promise<ApiResponse>{
    try{
        const token = localStorage.getItem("authToken");
        const ApiResponse = await axios.get(`${API_URL}/v1/eventseats/${eventId}/seats`,{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        });
        return {status: ApiResponse.status, data: ApiResponse.data};
    }catch(error: any){
        const status = error.response?.status || 0;
        let message = "Error desconocido.";
        switch(status){
            case 400: message = "Solicitud inválida (faltan campos o formato incorrecto)."; break;
            case 401: message = "Sesión expirada, por favor vuelva a iniciar sesión."; break;
            case 404: message = "No se ha encontrado el evento a buscar."; break;
            case 500: message = "Error al intentar realizar la solicitud."; break;
            case 503: message = "No se ha podido conectar a la base de datos."; break;
            case 0:   message = "No se pudo conectar con el servidor."; break;
        }
        return {status,message};
    }
}

export async function CreateReservation(seats: SeatReservationType[]): Promise<ApiResponse>{
    try{
        const body = {
            event_id: seats[0]!.event_id,
            event_seat_id: seats.map(seat => seat.event_seat_id),
            expiration_at: seats[0]!.expiration_at
        }
        const token = localStorage.getItem("authToken");
        const ApiResponse = await axios.post(`${API_URL}/v1/reservations/reserve`,body,{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        });
        return {status: ApiResponse.status, data: ApiResponse.data};
    }catch(error: any){
        const status = error.response?.status || 0;
        let message = "Error desconocido.";
        switch(status){
            case 400: message = "Solicitud inválida (faltan campos o formato incorrecto)."; break;
            case 401: message = "Sesión expirada, por favor vuelva a iniciar sesión."; break;
            case 404: message = "No se ha encontrado el asiento del evento a reservar."; break;
            case 409: message = "Este asiento ya ha sido reservado por alguien más: "; break;
            case 500: message = "Error al intentar realizar la solicitud."; break;
            case 503: message = "No se ha podido conectar a la base de datos."; break;
            case 0:   message = "No se pudo conectar con el servidor."; break;
        }
        return {status,message,data: error.response?.data};
    }
}