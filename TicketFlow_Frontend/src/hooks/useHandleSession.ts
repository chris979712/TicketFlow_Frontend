import { useNavigate } from "react-router-dom";
import { useSessionHandler } from "./useSessionHandler";
import { useOrganizerStore } from "../features/main-menu-organizer/hooks/useOrganizerStore";

export function useHandleSession(){
    const navigate = useNavigate();
    const {DeleteTokenCookie} = useSessionHandler();
    const {idCompany,setOrganizerCompany} = useOrganizerStore();
    
    const handleLogout = () => {
        DeleteTokenCookie();
        if(idCompany){
            setOrganizerCompany(null);
        }
        navigate("/");
    };

    return {
        handleLogout
    }
}