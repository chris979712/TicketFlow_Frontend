import axios from "axios";
import type { ApiResponse } from "../../../schemas/api";
const API_URL = import.meta.env.VITE_API_URL;


export async function GetAllEvents(limit: number, offset: number): Promise<ApiResponse>{
    try{
        const token = localStorage.getItem("authToken");
        const ApiResponse = await axios.get(`${API_URL}/v1/company/${2}/events`,{
            params: {limit,offset},
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return {status: ApiResponse.status, data: ApiResponse.data}
    }catch(error: any){
        const status = error.response?.status || 0;
        let message = "Error desconocido.";
        switch(status){
            case 400: message = "Solicitud inválida (faltan campos o formato incorrecto)."; break;
            case 401: message = "Sesión expirada, por favor vuelva a iniciar sesión."; break;
            case 404: message = "No se han encontrado eventos registrados."; break;
            case 0:   message = "No se pudo conectar con el servidor."; break;
        }
        return {status,message};
    }
}


export async function GetEventImage(eventId: number): Promise<ApiResponse>{
    try{
        const token = localStorage.getItem("authToken");
        const ApiResponse = await axios.get(`${API_URL}/v1/event/img/${eventId}/images`,{
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        console.log(ApiResponse.data)
        return {status: ApiResponse.status, data: ApiResponse.data}
    }catch(error: any){
        const status = error.response?.status || 0;
        let message = "Error desconocido.";
        switch(status){
            case 400: message = "Solicitud inválida (faltan campos o formato incorrecto)."; break;
            case 401: message = "Sesión expirada, por favor vuelva a iniciar sesión."; break;
            case 404: message = "No se han encontrado eventos registrados."; break;
            case 500: message = "No se ha podido encontrar la imagen del evento desado"; break;
            case 0:   message = "No se pudo conectar con el servidor."; break;
        }
        return {status,message};
    }
}