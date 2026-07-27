import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import LoadingScreen from './LoadingScreen'


const Protected = ({children, role}) => {


    const user = useSelector(state=>state.auth.user)
    const loading = useSelector(state=>state.auth.loading)



    if(loading){
        return (
            <LoadingScreen />
        )
    }

    if(!user){
        return <Navigate to="/login" />
    }

    if (role && user.role !== role) {
        return <Navigate to="/" replace />
    }
    
  
  return (
    children
  )
}

export default Protected