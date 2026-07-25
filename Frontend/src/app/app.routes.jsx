import { createBrowserRouter } from "react-router-dom";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import AddProduct from "../features/products/pages/AddProduct";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <h1>Hello Snitch User</h1>
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/add-product",
        element: <AddProduct />
    }
])
