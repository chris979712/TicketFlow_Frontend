import { useState, useEffect } from "react";
import { GetUserFromToken } from "../utils/userData";
import { useNavigate } from "react-router-dom";

export function useNavigationOrganizer(){
    const [isOrganizer,setIsOrganizer] = useState(false);
    const Navigate = useNavigate();
    useEffect(() => {
        const User = GetUserFromToken();
        const TypeUser = User?.typeUser;
        if (TypeUser === 2) {
            setIsOrganizer(true);
        } else {
            setIsOrganizer(false);
            Navigate("/*"); 
        }     
    },[Navigate])

    return {
        isOrganizer
    }

}