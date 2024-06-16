import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/error-page";
import Dashboard from "./pages/dashboard";
import SingleService from "./pages/singleService";
import { LoginProvider } from "./context/LoginContext";
import Login from "./pages/login";
import { CartProvider } from "./context/CartContext";
import Orders from "./pages/orders";
import CartScreen from "./pages/cartscreen";
import StaffDashboad from "./pages/staff/staff_dashboard";
import StaffSingleService from "./pages/staff/staff_singleService";
import StaffCatagory from "./pages/staff/staff_catagory";
import StaffOrders from "./pages/staff/staff_orders";

const root = ReactDOM.createRoot(document.getElementById("root"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "dashboard",
    element: <Dashboard />,
    errorElement: <ErrorPage />,
  },
  {
    path: "dashboard/Service-item",
    element: <SingleService />,
    errorElement: <ErrorPage />,
  },
  {
    path: "loginScreen",
    element: <Login />,
    errorElement: <ErrorPage />,
  },{
    path: "orders",
    element: <Orders />,
    errorElement: <ErrorPage />,
  },
  {
    path: "cartscreen",
    element: <CartScreen />,
    errorElement: <ErrorPage />,
  },
  {
    path: "staff_dashboard",
    element: <StaffDashboad />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dashboard/staff_Service-item",
    element: <StaffSingleService />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dashboard/Staff_Catagory",
    element: <StaffCatagory />,
    errorElement: <ErrorPage />,
  },{
    path: "/dashboard/Staff_Orders",
    element: <StaffOrders />,
    errorElement: <ErrorPage />,
  },
]);
root.render(
  <React.StrictMode>
    <LoginProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </LoginProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
