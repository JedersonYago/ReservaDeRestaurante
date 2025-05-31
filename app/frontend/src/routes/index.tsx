import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Reservations } from "../pages/Reservations";
import { NewReservation } from "../pages/Reservations/New";
import { ReservationDetails } from "../pages/Reservations/Details";
import { Tables } from "../pages/Tables";
import { NewTable } from "../pages/Tables/New";
import { TableDetails } from "../pages/Tables/Details";
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
  {
    path: "/tables",
    element: <Tables />,
  },
  {
    path: "/tables/new",
    element: <NewTable />,
  },
  {
    path: "/tables/:id",
    element: <TableDetails />,
  },
  // {
  //   path: "/profile",
  //   element: <Profile />,
  // },
]);
