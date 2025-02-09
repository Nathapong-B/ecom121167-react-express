// import React from "react"
import { useEffect } from "react";
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
import Profile from "./pages/backoffice/profileAccount";
import MainPage from "./pages/homepage/mainPage";
import CartDetail from "./pages/homepage/cartDetail";
import OrderDetail from "./pages/homepage/orderDetail";
import Payments from "./pages/payments/payments";
import CompletePage from "./pages/payments/completePage";
import MyPurchase from "./pages/user/myPurchase";
import ProductDetail from "./pages/homepage/productDetail";
import MyProfile from "./pages/user/myProfile";
import UserGuard from "./pages/user/userGuard";

const router = createBrowserRouter([
    {
        path: '/', element: <Homepage />,
        children: [
            { index: true, element: <MainPage /> },
            { path: 'main', element: <MainPage /> },
            { path: 'main/product-detail', element: <ProductDetail /> },
            { path: 'main/cart', element: <UserGuard element={<CartDetail />} /> },
            { path: 'main/order', element: <UserGuard element={<OrderDetail />} /> },
            { path: 'payments', element: <UserGuard element={<Payments />} /> },
            { path: 'payment-complete', element: <UserGuard element={<CompletePage />} /> },
            { path: 'profile/my-purchase', element: <UserGuard element={<MyPurchase />} /> },
            { path: 'profile/my-profile', element: <UserGuard element={<MyProfile />} /> }
        ]
    },
    {
        path: 'auth',
        element: <AuthLayout />,
        children: [
            { index: true, element: <Signin /> },
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
            { path: 'profile', element: <Profile /> }
        ]
    }, {
        path: '/testpath', element: <TestPath />
    }
])

export default function Routes() {

    // let intervalId = 0;

    // const showText = () => {
    //     console.log('interval')
    // }

    // const runInterval = () => {
    //     intervalId = setInterval(showText, 1000);
    // }

    // const clearIntervalAll = (id) => {
    //     for (let i = id; i > 0; i--) {
    //         clearInterval(i);
    //     }
    // }

    // useEffect(() => {

    //     runInterval()

    //     window.onclick = (e) => {
    //         clearIntervalAll(intervalId)


    //         // runInterval()
    //         console.log('onclick')
    //     };
    //     window.onscroll = () => {
    //         clearIntervalAll(intervalId)

    //         // runInterval()
    //         console.log('onscroll')
    //     };

    //     window.onblur = () => {
    //         console.log('onblue')
    //         clearIntervalAll(intervalId)
    //     };
    // }, []);

    return (
        <>
            <ToastContainer />
            <RouterProvider router={router} />
        </>
    )
}