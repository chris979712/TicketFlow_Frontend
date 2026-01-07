import CryptoJs from 'crypto-js';
const ENCRIPTION_TOKEN = import.meta.env.VITE_ENCRYPTION;

export function useSessionHandler(){

    function SetTokenCookie(token: string){
        const SECRET_KEY = ENCRIPTION_TOKEN;
        const encryptedToken = CryptoJs.AES.encrypt(token, SECRET_KEY).toString();
        const expires = new Date();
        expires.setTime(expires.getTime() + 1 * 24 * 60 * 60 * 1000);
        document.cookie = `authToken=${encodeURIComponent(encryptedToken)};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
    }

    function GetTokenCookie(){
        const name = "authToken=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');
        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i].trim();
            if (cookie.indexOf(name) === 0) {
                const encryptedToken = cookie.substring(name.length);
                const SECRET_KEY = ENCRIPTION_TOKEN
                const decrypted = CryptoJs.AES.decrypt(encryptedToken, SECRET_KEY);
                return decrypted.toString(CryptoJs.enc.Utf8);
            }
        }
        return null;
    }

    function DeleteTokenCookie(){
        document.cookie = "authToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;secure;samesite=strict";
    }

    return {
        SetTokenCookie,
        DeleteTokenCookie,
        GetTokenCookie
    }
}