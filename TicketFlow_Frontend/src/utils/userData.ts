import { jwtDecode } from "jwt-decode";
import { useSessionHandler } from "../hooks/useSessionHandler";

type TokenPayload = {
    id: number,
    email: string,
    nickname: string,
    username: string,
    typeUser: number
}

export function GetUserFromToken(): TokenPayload | null {
    const {GetTokenCookie} = useSessionHandler();
    const token = GetTokenCookie();
    if(!token) return null;
    try{
        return jwtDecode<TokenPayload>(token);
    }catch(err){
        return null;
    }
}