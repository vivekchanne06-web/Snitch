import { createBrowserRouter } from "react-router-dom";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import AddProduct from "../features/products/pages/AddProduct";
import Dashboard from "../features/products/pages/Dashboard";
import Protected from "../features/auth/components/Protected";
import Home from "../features/products/pages/Home";
import ProductDetail from "../features/products/pages/ProductDetail";
import SellerProductDetail from "../features/products/pages/SellerProductDetail";
import LandingPage from "../features/products/pages/LandingPage";
import Cart from "../features/cart/pages/Cart";
import NotFound from "../features/products/pages/NotFound";
import AppLayout from "./AppLayout";

export const routes = createBrowserRouter([
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        element: <AppLayout />,
        children: [
            {
                path: "/",
                element: <LandingPage />,
                handle: {
                    navbar: {
                        navLinks: [{ label: "Shop", to: "/home" }],
                        showCart: true
                    }
                }
            },
            {
                path: "/home",
                element: <Home />,
                handle: {
                    navbar: {
                        navLinks: [{ label: "Collections", to: "/home" }],
                        showCart: true
                    }
                }
            },
            {
                path: "/product/:ProductId",
                element: <ProductDetail />,
                handle: {
                    navbar: {
                        navLinks: [{ label: "Collections", to: "/home" }],
                        showCart: true
                    }
                }
            },
            {
                path: "/cart",
                element: (
                    <Protected>
                        <Cart />
                    </Protected>
                ),
                handle: {
                    navbar: {
                        navLinks: [{ label: "Continue Shopping", to: "/home" }],
                        showCart: false
                    }
                }
            },
            {
                path: "/seller",
                children: [
                    {
                        path: "products",
                        element: (
                            <Protected role="seller">
                                <Dashboard />
                            </Protected>
                        ),
                        handle: {
                            navbar: {
                                navLinks: [
                                    { label: "Shop", to: "/home" },
                                    { label: "My Products", to: "/seller/products" },
                                    { label: "Add Product", to: "/seller/products/add" }
                                ],
                                showCart: false
                            }
                        }
                    },
                    {
                        path: "products/add",
                        element: (
                            <Protected role="seller">
                                <AddProduct />
                            </Protected>
                        ),
                        handle: {
                            navbar: {
                                navLinks: [
                                    { label: "Shop", to: "/home" },
                                    { label: "My Products", to: "/seller/products" },
                                    { label: "Add Product", to: "/seller/products/add" }
                                ],
                                showCart: false
                            }
                        }
                    },
                    {
                        path: "products/:productId",
                        element: (
                            <Protected role="seller">
                                <SellerProductDetail />
                            </Protected>
                        ),
                        handle: {
                            navbar: {
                                navLinks: [
                                    { label: "Shop", to: "/home" },
                                    { label: "My Products", to: "/seller/products" },
                                    { label: "Add Product", to: "/seller/products/add" }
                                ],
                                showCart: false
                            }
                        }
                    }
                ]
            },
            {
                path: "*",
                element: <NotFound />,
                handle: {
                    navbar: {
                        navLinks: [{ label: "Shop", to: "/home" }],
                        showCart: true
                    }
                }
            }
        ]
    }
]);
