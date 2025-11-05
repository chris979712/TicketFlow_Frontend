import { useNavigate } from "react-router-dom";

export function useHandleSession(){
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return {
        handleLogout
    }
}