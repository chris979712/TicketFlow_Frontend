import axios from "axios";
import { type ApiResponse } from "../../../schemas/api";
import { useSessionHandler } from "../../../hooks/useSessionHandler";
const API_URL = import.meta.env.VITE_API_URL;
const {GetTokenCookie} = useSessionHandler();

export async function GetSalesReport(companyID: number, startDate: string, endDate: string): Promise<ApiResponse>{
    try{
        const token = GetTokenCookie();
        const ResponseAPI = await axios.get(`${API_URL}/v1/report/sales?companyId=${companyID}&startDate=${startDate}&endDate=${endDate}`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return {status: ResponseAPI.status, data: ResponseAPI.data.data}
    }catch(error: any){
        const status = error.response?.status || 0;
        let message = "Error desconocido.";
        switch(status){
            case 400: message = "Solicitud inválida (faltan campos o formato incorrecto)."; break;
            case 401: message = "Su sesión ha expirado, por favor incie sesión de nuevo."; break;
            case 403: message = "El usuario que desea consultar el reporte de ventas no tiene los permisos necesarios."; break;
            case 500: message = "Error al intentar obtener los datos del reporte que se desea generar."; break;
            case 0:   message = "No se pudo conectar con el servidor."; break;
        }
        return {status,message};
    }
}