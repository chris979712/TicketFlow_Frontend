import { createContext, useContext, useState } from "react";

type PasswordRecoveryContextType = {
    isInsertingEmail: boolean;
    isInsertingCodeAndPassword: boolean;
    setIsInsertingEmail: (value: boolean) => void;
    setIsInsertingCodeAndPassword:(value: boolean) => void;
};

const PasswordRecoveryContext = createContext<PasswordRecoveryContextType | null>(null);

export function PasswordRecoveryProvider({children}: {children: React.ReactNode}){
    const [isInsertingEmail,setIsInsertingEmail] = useState(true);
    const [isInsertingCodeAndPassword, setIsInsertingCodeAndPassword] = useState(false);

    return (
        <PasswordRecoveryContext.Provider value={({isInsertingEmail,isInsertingCodeAndPassword,setIsInsertingEmail,setIsInsertingCodeAndPassword})}>
            {children}
        </PasswordRecoveryContext.Provider>
    );
}

export function usePasswordRecovery(){
    const context = useContext(PasswordRecoveryContext);
    if(!context){
        throw new Error('El contexto de recuperación de contraseña está mal ubicado.')
    }
    return context;
}