import axios from "axios";
import {type ApiResponse} from "../../../schemas/api.ts";
import type { SeatProps } from "../hooks/useCreateEvent.ts";
import { useSessionHandler } from "../../../hooks/useSessionHandler.ts";
const API_URL = import.meta.env.VITE_API_URL;
const {GetTokenCookie} = useSessionHandler();

export async function GetEventAllLocations(): Promise<ApiResponse>{
    try{
        const token = GetTokenCookie();
        const ResponseFromApi = await axios.get(`${API_URL}/v1/location/search/all`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return {status: ResponseFromApi.status, data: ResponseFromApi.data};
    }catch(error: any){
        const status = error.response?.status || 0;
        let message = "Error desconocido."
        switch(status){
            case 400: message = "Solicitud inválida (faltan campos o formato incorrecto)."; break;
            case 401: message = "Sesión expirada, por favor vuelva a iniciar sesión."; break;
            case 404: message = "No se ha encontrado ninguna sede disponible."; break;
            case 500: message = "Error interno al realizar la petición."; break;

        }
        return {status,message}
    }
}

export async function GetAllLocationSeats(idlocation: number){
    try{
        const token = GetTokenCookie();
        const ResponseFromApi = await axios.get(`${API_URL}/v1/location/${idlocation}/layout`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return {status: ResponseFromApi.status, data: ResponseFromApi.data};
    }catch(error: any){
        const status = error.response?.status || 0;
        let message = "Error desconocido."
        switch(status){
            case 400: message = "Solicitud inválida (faltan campos o formato incorrecto)."; break;
            case 401: message = "Sesión expirada, por favor vuelva a iniciar sesión."; break;
            case 404: message = "No se ha encontrado ninguna sede disponible con el id ingresado."; break;
            case 500: message = "Error interno al realizar la petición."; break;

        }
        return {status,message}
    }
}

export async function PostEventWithSeats(eventName: string, category: string, description: string, event_date: string, start_time: string, end_time: string, company_id: number, event_location_id: number, seats: SeatProps[]): Promise<ApiResponse>{
    try{
        const token = GetTokenCookie();
        const body = {
            event: {
                event_name: eventName,
                category,
                description,
                event_date,
                start_time,
                end_time,
                company_id,
                event_location_id
            },
            inventory: seats
        };
        const ResponseFromApi = await axios.put(`${API_URL}/v1/eventseats/with-event`, body,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return {status: ResponseFromApi.status,data: ResponseFromApi.data};
    }catch(error: any){
        const status = error.response?.status || 0;
        let message = "Error desconocido.";
        switch(status){
            case 400: message = "Solicitud inválida (faltan campos o formato incorrecto)."; break;
            case 401: message = "Sesión expirada, por favor vuelva a iniciar sesión."; break;
            case 403: message = "Solo un organizador puede crear eventos."; break;
            case 409: message = "El encuentro a ingresar se encuentra duplicado o choca con el horario de otro evento."; break;
            case 500: message = "Error interno al realizar la petición."; break;
            case 503: message = "No se ha podido establecer conexión con la base de datos."
        }
        return {status, message};
    }
}

export async function PutImageForAnEvent(image: File,imageType: string, altText: string, sortOrder: number,eventId:number){
    try{
        const token = GetTokenCookie();
        const formData = new FormData();
        formData.append("image", image); 
        formData.append("imageType", imageType);
        formData.append("altText", altText);
        formData.append("sortOrder", sortOrder.toString());
        const ResponseFromApi = await axios.put(`${API_URL}/v1/event/img/${eventId}/new`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        });
        return {status: ResponseFromApi.status, data: ResponseFromApi.data};
    }catch(error: any){
        const status = error.response?.status || 0;
        let message = "Error desconocido.";
        switch(status){
            case 400: message = "Evento creado, la imagen no ha podido ser insertada."; break;
            case 401: message = "Sesión expirada, por favor vuelva a iniciar sesión."; break;
            case 403: message = "Solo un organizador puede subir una foto de eventos."; break;
            case 404: message = "No se ha encontrado el evento a asignar la foto."; break;
            case 500: message = "Error interno al realizar la petición."; break;
        }
        return {status, message}
    }
}