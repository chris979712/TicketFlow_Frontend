import { useState } from "react";
import { useAlert} from "../../../hooks/useAlert";
import {SendValidationCode} from '../services/PasswordRecover'
import { usePasswordRecovery } from "../hooks/PasswordRecoveryContext"
import { ValidateEmail } from "../../../schemas/passwordRecovery.Schema";
import { useLoading } from "../../../hooks/useLoading";

export function useEmailRecover(){
    const {setIsInsertingEmail, setIsInsertingCodeAndPassword} = usePasswordRecovery();
    const [email,setEmail] = useState("");
    const [errorValidation, setErrorValidation] = useState(""); 
    const {alert,setAlert} = useAlert();
    const {loading, start, stop} = useLoading();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        start();
        const DataValidation = ValidateEmail(email);
        if(!DataValidation.error)
        {
            const ApiResponse = await SendValidationCode(email);
            if(ApiResponse.status === 200){
                stop();
                setIsInsertingEmail(false);
                setIsInsertingCodeAndPassword(true);
            }else if(ApiResponse.status >= 400 && ApiResponse.status <= 499){
                setAlert({type: "warning",message: ApiResponse.message!})
            }else{
                setAlert({type: "error",message: ApiResponse.message!})
            }
        }else{
            setErrorValidation(DataValidation.error.details[0].message);
        }
        stop();
    }

    return {
        email,
        setEmail,
        errorValidation,
        setErrorValidation,
        alert,
        setAlert,
        handleSubmit,
        loading
    }
}