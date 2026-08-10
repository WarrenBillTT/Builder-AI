import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom";

const AppContext = createContext(undefined);

export function AppContextProvider({children}){

    const navigate = useNavigate()

    // Auth States
    const [user, setUser] = useState(null)
    const [loadingUser, setLoadingUser] = useState(true);

    // Auth Actions
    const checkSession = async ()=>{
        try {
            const { data } = await api.get("/api/auth/me")
            setUser(data.user);
        } catch (error) {
            setUser(null)
        } finally{
            setLoadingUser(false)
        }
    }

    useEffect(()=>{
        checkSession()
    },[checkSession])

    const login = async (email, password) => {
        try {
            const { data } = await api.post("/api/auth/login", {email, password})
            setUser(data.user)
            toast.success("Welcome back!")
            Navigate("/")
        } catch (err) {
            console.error("Login failed:", err)
            const errMsg = err?.response?.data?.error ||"Invalid email or password";
            toast.error(errMsg);
            throw new Error(errMsg);
        }
    }

    const register = async (name, email, password) => {
        try {
            const { data } = await api.post("/api/auth/register", {name, email, password})
            setUser(data.user)
            toast.success("Account created successfully!")
            Navigate("/")
        } catch (err) {
            console.error("Registration failed:", err)
            const errMsg = err?.response?.data?.error ||"Registration failed";
            toast.error(errMsg);
            throw new Error(errMsg);
        }
    }

    return (
        <AppContext.Provider value={{
            user,
            loadingUser,
            login,
            register
        }}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext(){
    const context = useContext(AppContext);
    if(context === undefined){
        throw new Error("useAppContext must be used within an AppContextProvider");
    }
    return context
}