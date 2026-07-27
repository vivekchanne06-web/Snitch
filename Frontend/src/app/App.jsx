
import { RouterProvider } from 'react-router-dom'
import { routes } from './app.routes'
import { useSelector } from 'react-redux'
import { useAuth } from '../features/auth/hook/useAuth'
import { useEffect } from 'react'


const App = () => {
const user = useSelector(state=>state.auth.user)

const {handleGetMe}=useAuth()

useEffect(()=>{
    handleGetMe();
},[])

  return (
  <>
    <RouterProvider router={routes} />
  </>
  )
}

export default App