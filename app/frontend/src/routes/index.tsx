import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { ForgotPassword } from "../pages/ForgotPassword";
import { ResetPassword } from "../pages/ResetPassword";
import { Dashboard } from "../pages/Dashboard";
import { Reservations } from "../pages/Reservations";
import { NewReservation } from "../pages/Reservations/New";
import { ReservationDetails } from "../pages/Reservations/Details";
import { Tables } from "../pages/Tables";
import { NewTable } from "../pages/Tables/New";
import { TableDetails } from "../pages/Tables/Details";
import { EditTable } from "../pages/Tables/Edit";
import { Profile } from "../pages/Profile";
import { ProtectedLayout } from "../components/ProtectedLayout";
import { Settings } from "../pages/Settings";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Rotas protegidas */}
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/reservations/new" element={<NewReservation />} />
        <Route path="/reservations/:id" element={<ReservationDetails />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/tables/new" element={<NewTable />} />
        <Route path="/tables/:id" element={<TableDetails />} />
        <Route path="/tables/:id/edit" element={<EditTable />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
