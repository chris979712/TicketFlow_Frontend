import axios from "axios";
import {type ApiResponse} from "../../../schemas/api.ts";
const API_URL = import.meta.env.VITE_API_URL;

export async function loginUser(username: string, password: string): Promise<ApiResponse>{
    try{
        const ResponseFromApi = await axios.post(`${API_URL}/v1/login`,{
            username,
            passwordHash: password
        });
        return {status: ResponseFromApi.status, data: ResponseFromApi.data};
    }catch(error: any){
        const status = error.response?.status || 0;
        let message = "Error desconocido.";
        switch(status){
            case 400: message = "Solicitud inválida (faltan campos o formato incorrecto)."; break;
            case 401: message = "Credenciales incorrectas, por favor verifique su usuario y/o contraseña."; break;
            case 404: message = "Credenciales incorrectas, por favor verifique su usuario y/o contraseña."; break;
            case 500: message = "Ha ocurrido un error al intentar realizar la operación."; break;
            case 0:   message = "No se pudo conectar con el servidor."; break;
        }
        return {status,message};
    }
}