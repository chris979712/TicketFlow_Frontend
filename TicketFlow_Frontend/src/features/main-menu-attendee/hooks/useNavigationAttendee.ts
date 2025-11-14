import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetUserFromToken } from "../../../utils/userData";

export function useNavigationAttendee(){
    const [isAttendee, setIsAttendee] = useState(false);
    const Navigate = useNavigate();

    useEffect(() => {
        const User = GetUserFromToken();
        const TypeUser = User?.typeUser;
        if(TypeUser === 1){
            setIsAttendee(true);
        }else{
            setIsAttendee(false);
            Navigate("/*");
        }
    },[Navigate])

    return {
        isAttendee,
        setIsAttendee
    }
}