import { useNavigate } from "react-router-dom";
import { useOrganizerStore } from "../features/main-menu-organizer/hooks/useOrganizerStore";

export function useHandleSession(){
    const navigate = useNavigate();
    const {idCompany,setOrganizerCompany} = useOrganizerStore();
    
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        if(idCompany){
            setOrganizerCompany(null);
        }
        navigate("/");
    };

    return {
        handleLogout
    }
}