import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../hooks/useAlert";
import { useState, useEffect, useRef } from "react";
import { useLoading } from "../../../hooks/useLoading";
import { ValidateRegister } from "../../../schemas/register.Schema";
import { RegisterUser, type RegisterParams } from "../services/registerService";


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
    const {start,stop,loading} = useLoading();
    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement | null>(null);

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setErrorValidation("");
        start();
        const {error} = ValidateRegister(name,firstlastname,secondlastname,email,username,password,passwordConfirmation);
        if(password === passwordConfirmation){
            if(!error){
                const Data: RegisterParams ={name,firstLastName: firstlastname,seconLastName: secondlastname,email,username,password};
                const response = await RegisterUser(Data);
                if(response.status >= 200 && response.status < 300){
                    setAlert({type: "success", message: response.message!});
                    setTimeout(() => {
                        navigate("/");
                    },3000)
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
        stop();
    }

    useEffect(() => {
        if(errorValidation != ""){
            formRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } 
    },[errorValidation])

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
        handleSubmit,
        loading,
        formRef
    }
}