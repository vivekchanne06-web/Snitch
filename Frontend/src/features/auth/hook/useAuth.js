import { setError,setLoading,setUser } from "../state/auth.slice";
import { registerApi } from "../services/auth.api";
import {useDispatch} from "react-redux"



export const useAuth = () => {
    const dispatch = useDispatch()
 

    async function handleRegister({email,password,contact,fullName,isSeller=false}){
        try {
            dispatch(setLoading(true))
            const data= await registerApi({email,password,contact,fullName,isSeller})
            dispatch(setUser(data.user))
        } catch (error) {
            dispatch(setError(error.message))
        }
        finally {
            dispatch(setLoading(false)) 
        }
    }

    return{
        handleRegister
    }
}   