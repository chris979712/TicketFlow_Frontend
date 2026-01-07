import axios from "axios";
import type { ApiResponse} from "../../../schemas/api.ts";
import { useSessionHandler } from "../../../hooks/useSessionHandler.ts";
const API_URL = import.meta.env.VITE_API_URL;
const {GetTokenCookie} = useSessionHandler();

export async function UpdateExistingEvent(event_name: string, category: string, description: string, event_date: string, start_time: string, end_time: string, company_id: number, eventId:number): Promise<ApiResponse>{
    try{
        const token = GetTokenCookie();
        const body = {
            event_name,
            category,
            description,
            event_date,
            start_time,
            end_time,
            company_id
        };
        const ApiResponse = await axios.patch(`${API_URL}/v1/event/edit/${eventId}`,body,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return {status: ApiResponse.status, data: ApiResponse.data};
    }catch(error: any){
        const status = error.response?.status || 0;
        let message = "Error desconocido.";
        switch(status){
            case 400: message = "Solicitud inválida (faltan campos o formato incorrecto)."; break;
            case 401: message = "Sesión expirada, por favor vuelva a iniciar sesión."; break;
            case 403: message = "El organizador no tiene permiso de editar este evento."; break;
            case 404: message = "No se ha encontrado el evento a editar."; break;
            case 409: message = "Ya existe un evento que se encuentra registrado en el horario ingresado."; break;
            case 500: message = "Error interno al realizar la petición."; break;
        }
        return {status,message};
    }
}

export async function UpdateEventStatus(eventId: number, status: number){
    try{
        const token = GetTokenCookie();
        const body = {
            status
        };
        const ApiResponse = await axios.patch(`${API_URL}/v1/event/${eventId}/status`,body,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return {status: ApiResponse.status, data: ApiResponse.data};
    }catch(error: any){
        const status = error.response?.status || 0;
        let message = "Error desconocido.";
        switch(status){
            case 400: message = "Solicitud inválida (faltan campos o formato incorrecto)."; break;
            case 401: message = "Sesión expirada, por favor vuelva a iniciar sesión."; break;
            case 403: message = "El organizador no tiene permiso de editar este evento."; break;
            case 404: message = "No se ha encontrado el evento a editar."; break;
            case 409: message = "Ya existe un evento que se encuentra registrado en el horario ingresado."; break;
            case 500: message = "Error interno al realizar la petición."; break;
        }
        return {status,message};
    }
}

export async function UpdateImageEvent(image: File, imageType: string, altText: string, sortOrder: number, eventId: number): Promise<ApiResponse> {
    try{
        const token = GetTokenCookie();
        const formData = new FormData();
        formData.append("image", image); 
        formData.append("imageType", imageType);
        formData.append("altText", altText);
        formData.append("sortOrder", sortOrder.toString());
        const ApiResponse = await axios.put(`${API_URL}/v1/event/img/${eventId}/new`,formData,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return {status: ApiResponse.status, data: ApiResponse.data};
    }catch(error: any){
        const status = error.response?.status || 0;
        let message = "Error desconocido.";
        switch(status){
            case 400: message = "Solicitud inválida (faltan campos o formato incorrecto)."; break;
            case 401: message = "Sesión expirada, por favor vuelva a iniciar sesión."; break;
            case 403: message = "El organizador no tiene permiso de editar este evento."; break;
            case 404: message = "No se ha encontrado el evento a editar."; break;
            case 500: message = "Error interno al realizar la petición."; break;
        }
        return {status,message};
    }
}