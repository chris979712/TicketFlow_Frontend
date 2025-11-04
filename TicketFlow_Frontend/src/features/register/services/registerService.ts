import axios from "axios";
import { type ApiResponse } from "../../../schemas/api";
const API_URL = import.meta.env.VITE_API_URL;

export type RegisterParams = {
    name: string,
    firstLastName: string,
    seconLastName: string,
    email: string,
    username: string,
    password: string,
}

export async function RegisterUser(params: RegisterParams): Promise<ApiResponse>{
    try{
        const ResponseFromApi = await axios.post(`${API_URL}/v1/user/register`, {
            email: params.email,
            nickname: params.username,
            password: params.password,
            role: 'attendee',
            attendee: {
                firstName: params.name,
                lastName: params.firstLastName + params.seconLastName,
                middleName: ''
            }
        });
        return {status: ResponseFromApi.status, message: "La cuenta ha sido creada de manera exitosa."}
    }catch(error: any){
        const status = error.response?.status || 0;
        let message = "Error desconocido.";
        switch(status){
            case 400: message = "Solicitud inválida (faltan campos o formato incorrecto)."; break;
            case 409: message = "El nombre de usuario o correo ya se encuentra registrado"; break;
            case 0:   message = "No se pudo conectar con el servidor."; break;
        }
        return {status,message};
    }
}