import { createBrowserRouter } from "react-router-dom";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import AddProduct from "../features/products/pages/AddProduct";
import Dashboard from "../features/products/pages/Dashboard";

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
        path: "/seller",
        children: [
            {
                path: "products",
                element: <Dashboard />,
            },
            {
                path: "products/add",
                element: <AddProduct />,
            },
        ],
    }
])
