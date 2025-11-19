import axios from "axios";
import { type ApiResponse } from "../../../schemas/api";
const API_URL = import.meta.env.VITE_API_URL;

export async function PostStripePayment(seatsId: number[]): Promise<ApiResponse>{
    try{
        let Body = {};
        if(seatsId.length === 1){
            Body = {
                event_seat_id: seatsId
            }
        }else if(seatsId.length >= 1){
            Body = {
                event_seat_id: seatsId,
                holdMinutes: 10
            }
        }
        const Token = localStorage.getItem("authToken");
        const ApiResponse = await axios.post(`${API_URL}/v1/ticket/buy`,Body,{
            headers: {
                "Authorization": `Bearer ${Token}`
            }
        });
        return {status: ApiResponse.status, data: ApiResponse.data};
    }catch(error: any){
        const status = error.response?.status || 0;
        let message = "Error desconocido.";
        switch(status){
            case 400: message = "Solicitud inválida (faltan campos o formato incorrecto)."; break;
            case 401: message = "Su sesión ha expirado, por favor incie sesión de nuevo."; break;
            case 403: message = "El usuario a pagar la reserva no es un asistente."; break;
            case 409: message = "Los asientos ingresados no se encuentran reservados. No es posible hacer la compra."; break;
            case 0:   message = "No se pudo conectar con el servidor."; break;
        }
        return {status,message};
    }
}