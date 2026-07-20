import { setError,setLoading,setUser } from "../state/auth.slice";
import { register,login } from "../services/auth.api";
import {useDispatch} from "react-redux"



export const useAuth = () => {
    const dispatch = useDispatch()
 

    async function handleRegister({email,password,contact,fullName,isSeller=false}){
        try {
            dispatch(setLoading(true))
            const data= await register({email,password,contact,fullName,isSeller})
            dispatch(setUser(data.user))
            return data;
        
        } catch (error) {
            // Extract the backend's exact error message when available
            const backendMessage =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Something went wrong. Please try again.";
            dispatch(setError(backendMessage))
            // Re-throw a plain Error carrying the backend message
            throw new Error(backendMessage);
        }
        finally {
            dispatch(setLoading(false)) 
        }
    }

 
    async function handleLogin({email,password}){
        try {
            dispatch(setLoading(true))
            const data= await login({email,password})
            dispatch(setUser(data.user))
            return data;
        } catch (error) {
             const backendMessage =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Something went wrong. Please try again.";
            dispatch(setError(backendMessage))
            // Re-throw a plain Error carrying the backend message
            throw new Error(backendMessage);
        }
        finally {
            dispatch(setLoading(false)) 
        }
    }
    return{
        handleRegister,
        handleLogin,
    }
}   