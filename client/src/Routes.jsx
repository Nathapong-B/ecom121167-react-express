// import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import Homepage from "./pages/homepage/homepage"
import AuthLayout from "./pages/auth/authLayout"
import Signin from "./pages/auth/signin"
import Register from "./pages/auth/register"
import BackOfficeLayout from "./pages/backoffice/backofficeLayout"
import RedirectPage from "./pages/redirectPage"
import Dashboard from "./pages/backoffice/dashboard"
import AdminGuard from "./pages/backoffice/adminGuard"
import TestPath from "./pages/testpath"
import Products from "./pages/backoffice/products"
import Orders from "./pages/backoffice/orders"
import Users from "./pages/backoffice/users"
import Categories from "./pages/backoffice/categories"

const router = createBrowserRouter([
    { path: '/', element: <Homepage /> },
    {
        path: 'auth',
        element: <AuthLayout />,
        children: [
            { path: 'signin', element: <Signin /> },
            { path: 'register', element: <Register /> }
        ]
    },
    {
        path: '/redirect', element: <RedirectPage />
    },
    {
        path: '/backoffice', element: <AdminGuard element={<BackOfficeLayout />} />,
        children: [
            { path: 'dashboard', element: <Dashboard /> },
            { path: 'categories', element: <Categories /> },
            { path: 'product', element: <Products /> },
            { path: 'order', element: <Orders /> },
            { path: 'user', element: <Users /> },
        ]
    }, {
        path: '/testpath', element: <TestPath />
    }
])

export default function Routes() {
    return (
        <>
            <ToastContainer />
            <RouterProvider router={router} />
        </>
    )
}