import { useState } from "react";
import { useAlert } from "../../../hooks/useAlert";
import { ValidateRegister } from "../../../schemas/register.Schema";
import { RegisterUser, type RegisterParams } from "../services/registerService";
import { useNavigate } from "react-router-dom";

export function useRegister(){
    const {alert,setAlert} = useAlert();
    const [name,setName] = useState("");
    const [firstlastname, setFirstlastname] = useState("");
    const [secondlastname, setSecondlastname] = useState("");
    const [email,setEmail] = useState("")
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [errorValidation,setErrorValidation] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setErrorValidation("");
        const {error} = ValidateRegister(name,firstlastname,secondlastname,email,username,password,passwordConfirmation);
        if(password === passwordConfirmation){
            if(!error){
                const Data: RegisterParams ={name,firstLastName: firstlastname,seconLastName: secondlastname,email,username,password};
                const response = await RegisterUser(Data);
                if(response.status === 200){
                    setAlert({type: "success", message: response.message!});
                    navigate("/");
                }else{
                    if(response.status >= 400 && response.status < 500){
                        setAlert({type: "warning", message: response.message!})
                    }else{
                        setAlert({type: "error", message: response.message!})
                    }
                }
            }else{
                setErrorValidation(error.details[0].message);
            }
        }else{
            setErrorValidation("Verifique que la contraseñas sean iguales.");
        }
    }

    return {
        alert,
        setAlert,
        setName,
        setFirstlastname,
        setSecondlastname,
        setEmail,
        setUsername,
        setPassword,
        setPasswordConfirmation,
        errorValidation,
        handleSubmit
    }
}