import axios from "axios";
import { type ApiResponse } from "../../../schemas/api";
const API_URL = import.meta.env.VITE_API_URL;

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