import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import LoadingScreen from './LoadingScreen'


const Protected = ({children, role}) => {

    const user = useSelector(state=>state.auth.user)
    const loading = useSelector(state=>state.auth.loading)
    const location = useLocation()


    if(loading){
        return (
            <LoadingScreen />
        )
    }

    if(!user){
        // Preserve the attempted destination so Login can redirect back
        const redirectTo = encodeURIComponent(location.pathname + location.search)
        return <Navigate to={`/login?redirect=${redirectTo}`} replace />
    }

    if (role && user.role !== role) {
        return <Navigate to="/" replace />
    }
    
  
  return (
    children
  )
}

export default Protected