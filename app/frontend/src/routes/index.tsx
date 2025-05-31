import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Reservations } from "../pages/Reservations";
import { NewReservation } from "../pages/NewReservation";
import { ReservationDetails } from "../pages/ReservationDetails";
//import { Profile } from '../pages/Profile';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/reservations",
    element: <Reservations />,
  },
  {
    path: "/reservations/new",
    element: <NewReservation />,
  },
  {
    path: "/reservations/:id",
    element: <ReservationDetails />,
  },
  // {
  //   path: "/profile",
  //   element: <Profile />,
  // },
]);
