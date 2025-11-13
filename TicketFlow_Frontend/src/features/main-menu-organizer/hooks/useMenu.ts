import { useEffect } from "react";
import { useAlert } from "../../../hooks/useAlert";
import { GetCompanyId } from "../services/MenuService";
import { useOrganizerStore } from "../hooks/useOrganizerStore";
import { useHandleSession } from "../../../hooks/useHandleSession";

export function useMenu(){
    const {setOrganizerCompany} = useOrganizerStore();
    const {alert,setAlert} = useAlert();
    const {handleLogout} = useHandleSession();

    async function ObtainCompanyID(){
        const ApiResponse = await GetCompanyId();
        if(ApiResponse.status === 200){
            const CompanyID = ApiResponse.data.company_id;
            setOrganizerCompany(CompanyID);
        }else if(ApiResponse.status === 401){
            setAlert({type: "warning",message: ApiResponse.message!});
            setTimeout(() => {
                handleLogout();
            },4000);
        }else if(ApiResponse.status >= 400 && ApiResponse.status <= 499){
            setAlert({type: "warning",message: ApiResponse.message!});
        }else{
            setAlert({type: "error",message: ApiResponse.message!});
        }
    }

    useEffect(() => {
        ObtainCompanyID();
    },[])

    return {
        alert,
        setAlert
    }
}