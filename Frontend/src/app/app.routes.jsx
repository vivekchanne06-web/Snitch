import { createBrowserRouter } from "react-router-dom";
import Register from "../features/auth/pages/Register";



export const routes = createBrowserRouter([
    {
        path: "/",
        element: <h1>Hello Snitch User</h1>
    },
    {
        path:"/register",
        element: <Register />
    }
])
