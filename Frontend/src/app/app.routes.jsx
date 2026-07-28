import { createBrowserRouter } from "react-router-dom";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import AddProduct from "../features/products/pages/AddProduct";
import Dashboard from "../features/products/pages/Dashboard";
import Protected from "../features/auth/components/Protected";
import Home from "../features/products/pages/Home";
import ProductDetail from "../features/products/pages/ProductDetail";
import SellerProductDetail from "../features/products/pages/SellerProductDetail";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <Home />
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
        path: "/product/:ProductId",
        element: <ProductDetail />
    },
    {
        path: "/seller",
        children: [
            {
                path: "products",
                element: <Protected role="seller">
                    <Dashboard />
                </Protected>,
            }, 
            {
                path: "products/add",
                element: <Protected role="seller">
                    <AddProduct />
                </Protected>,
            },
            {
                path: "products/:productId",
                element: <Protected role="seller">
                    <SellerProductDetail />
                </Protected>,
            }
        ],
    }
])
