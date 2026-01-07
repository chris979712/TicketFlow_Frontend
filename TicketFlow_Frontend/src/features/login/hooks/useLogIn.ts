import { useState} from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { ValidateLogIn } from "../../../schemas/login.Schema";
import { useAlert } from "../../../hooks/useAlert";
import { GetUserFromToken } from "../../../utils/userData";
import { useSessionHandler } from "../../../hooks/useSessionHandler";
import { useLoading } from "../../../hooks/useLoading";
const ATTENDEE_URL = import.meta.env.VITE_MENU_ATTENDEE;
const ORGANIZER_URL = import.meta.env.VITE_MENU_ORGANIZER;

export const useLogIn = () =>{
    const navigate = useNavigate();
    const {alert,setAlert} = useAlert();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorValidation,setErrorValidation] = useState("");
    const {start,stop,loading} = useLoading();
    const {SetTokenCookie} = useSessionHandler();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorValidation("");
        start();
        const {error} = ValidateLogIn(username,password);
        if(!error){
            const response = await loginUser(username,password);
            if(response.status === 200){
                const {token} = response.data;
                SetTokenCookie(token);
                const User = GetUserFromToken();
                if(User?.typeUser === parseInt(ATTENDEE_URL)){
                    navigate("/dashboard-attendee")
                }else if(User?.typeUser === parseInt(ORGANIZER_URL)){
                    navigate("/dashboard-organizer")
                }else{
                    setAlert({type: "error", message: "Ha ocurrido un error al intentar redireccionarlo a la página correspondiente."})
                }
            } else {
                if(response.status >= 400 && response.status < 500){
                    setAlert({type: "warning", message: response.message!})
                }else{
                    setAlert({type: "error", message: response.message!})
                }
            }
        }else{
            setErrorValidation(error.details[0].message);
        }
        stop();
    }

    return {
        username,
        setUsername,
        password,
        setPassword,
        handleSubmit,
        errorValidation,
        alert,
        setAlert,
        loading
    }
}