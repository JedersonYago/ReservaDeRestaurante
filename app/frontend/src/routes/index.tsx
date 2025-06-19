import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Dashboard } from "../pages/Dashboard";
import { Reservations } from "../pages/Reservations";
import { NewReservation } from "../pages/Reservations/New";
import { ReservationDetails } from "../pages/Reservations/Details";
import { Tables } from "../pages/Tables";
import { NewTable } from "../pages/Tables/New";
import { TableDetails } from "../pages/Tables/Details";
import { EditTable } from "../pages/Tables/Edit";
import { Profile } from "../pages/Profile";
import { useAuth } from "../hooks/useAuth";
import { ProtectedLayout } from "../components/ProtectedLayout";
import { Settings } from "../pages/Settings";
import { ProtectedRoute } from "../components/ProtectedRoute";

export function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rotas protegidas */}
      <Route element={<ProtectedLayout />}>
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/reservations"
          element={
            isAuthenticated ? <Reservations /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/reservations/new"
          element={
            isAuthenticated ? <NewReservation /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/reservations/:id"
          element={
            isAuthenticated ? <ReservationDetails /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/tables"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <Tables />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/tables/new"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <NewTable />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/tables/:id"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <TableDetails />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/tables/:id/edit"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <EditTable />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />

        <Route
          path="/settings"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <Settings />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Route>
    </Routes>
  );
}
