import axios from "axios";
import {type ApiResponse} from "../../../schemas/api.ts";
const API_URL = import.meta.env.VITE_API_URL;

export async function SendValidationCode(email: string): Promise<ApiResponse>{
    try{
        const ApiResponse = await axios.post(`${API_URL}/v1/auth/password/forgot`, {
            email
        });
        return {status: ApiResponse.status, data: ApiResponse.data};
    }catch(error: any){
        const status = error.response?.status || 0;
        let message = "Error desconocido.";
        switch(status){
            case 400: message = "Solicitud inválida (faltan campos o formato incorrecto)."; break;
            case 404: message = "Por favor verifique que el correo ingresado pertenezca a su cuenta."; break;
            case 500: message = "Ha ocurrido un error al intentar realizar la operación."; break;
            case 0:   message = "No se pudo conectar con el servidor."; break;
        }
        return {status,message};
    }
}

export async function ResetPasswordWithToken(validationCode: string, password: string): Promise<ApiResponse>{
    try{
        const ApiResponse = await axios.post(`${API_URL}/v1/auth/password/reset`,{
            token: validationCode,
            newPassword: password
        });
        return {status: ApiResponse.status, data: ApiResponse.data}
    }catch(error: any){
        const status = error.response?.status || 0;
        let message = "Error desconocido.";
        switch(status){
            case 400: message = "El código ingresado no es correcto, por favor verifiquelo."; break;
            case 500: message = "Ha ocurrido un error al intentar realizar la operación."; break;
            case 0:   message = "No se pudo conectar con el servidor."; break;
        }
        return {status,message};
    }
}