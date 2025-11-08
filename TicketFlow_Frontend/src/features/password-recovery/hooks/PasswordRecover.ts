import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert} from "../../../hooks/useAlert";
import { useLoading } from "../../../hooks/useLoading";
import { ResetPasswordWithToken } from "../services/PasswordRecover";
import { ValidatePasswordToken } from "../../../schemas/passwordRecovery.Schema";


export function usePasswordRecover(){
    const [verificationCode, setVerificationCode] = useState("");
    const [errorValidation, setErrorValidation] = useState(""); 
    const [newPassword, setNewPassword] = useState("");
    const {start,stop,loading} = useLoading();
    const {alert,setAlert} = useAlert();
    const Navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorValidation("");
        start();
        const DataValidation = ValidatePasswordToken(verificationCode,newPassword);
        if(!DataValidation.error)
        {
            const ApiResponse = await ResetPasswordWithToken(verificationCode,newPassword);
            if(ApiResponse.status === 200){
                setAlert({type: "success",message: "Su contraseña se ha restablecido con éxito. Será redirigido al inicio de sesión."})
                setTimeout(() => {
                    stop();
                    Navigate("/");
                }, 3000)
            }else if(ApiResponse.status >= 400 && ApiResponse.status <= 499){
                setAlert({type: "warning", message: ApiResponse.message!});
            }else{
                setAlert({type: "error", message: ApiResponse.message!});
            }
        }else{
            setErrorValidation(DataValidation.error.details[0].message);
        }
        stop();
    }     

    return {
        alert,
        setAlert,
        errorValidation,
        setVerificationCode,
        setNewPassword,
        loading,
        handleSubmit
    }
}