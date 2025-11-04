import { useState } from "react";
import { loginUser } from "../services/authService";
import { ValidateLogIn } from "../../../schemas/login.Schema";
import { useAlert } from "../../../hooks/useAlert";

export const useLogIn = () =>{
    const {alert,setAlert} = useAlert();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorValidation,setErrorValidation] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const {error} = ValidateLogIn(username,password);
        if(!error){
            const response = await loginUser(username,password);
            if(response.status === 200){
                console.log("hola")
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
    }

    return {
        username,
        setUsername,
        password,
        setPassword,
        handleSubmit,
        errorValidation,
        alert,
        setAlert
    }
}