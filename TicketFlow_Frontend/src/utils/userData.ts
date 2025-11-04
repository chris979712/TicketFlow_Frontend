import { jwtDecode } from "jwt-decode";

type TokenPayload = {
    id: number,
    email: string,
    nickname: string,
    username: string,
    typeUser: number
}

export function GetUserFromToken(): TokenPayload | null {
    const token = localStorage.getItem("authToken");
    if(!token) return null;
    try{
        return jwtDecode<TokenPayload>(token);
    }catch(err){
        return null;
    }
}