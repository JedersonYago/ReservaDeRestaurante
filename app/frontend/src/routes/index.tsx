import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ProtectedLayout } from "../components/ProtectedLayout";
import { AdminConfigProvider } from "../components/AdminConfigProvider";
import { PageLoader } from "../components/Loading/PageLoader";

// Páginas públicas (carregadas imediatamente)
// import { Home } from "../pages/Home";
import Login from "../pages/Login";
import { Register } from "../pages/Register/index";
import { ForgotPassword } from "../pages/ForgotPassword";
import { ResetPassword } from "../pages/ResetPassword";

// Páginas protegidas (lazy loading)
const Dashboard = lazy(() =>
  import("../pages/Dashboard").then((m) => ({ default: m.Dashboard }))
);
const Reservations = lazy(() =>
  import("../pages/Reservations").then((m) => ({ default: m.Reservations }))
);
const NewReservation = lazy(() =>
  import("../pages/Reservations/New").then((m) => ({
    default: m.NewReservation,
  }))
);
const ReservationDetails = lazy(() =>
  import("../pages/Reservations/Details").then((m) => ({
    default: m.ReservationDetails,
  }))
);
const Tables = lazy(() =>
  import("../pages/Tables").then((m) => ({ default: m.Tables }))
);
const NewTable = lazy(() =>
  import("../pages/Tables/New").then((m) => ({ default: m.NewTable }))
);
const TableDetails = lazy(() =>
  import("../pages/Tables/Details").then((m) => ({ default: m.TableDetails }))
);
const EditTable = lazy(() =>
  import("../pages/Tables/Edit").then((m) => ({ default: m.EditTable }))
);
const Profile = lazy(() =>
  import("../pages/Profile").then((m) => ({ default: m.Profile }))
);
const Settings = lazy(() =>
  import("../pages/Settings").then((m) => ({ default: m.Settings }))
);

// Página de erro
const NotFound = lazy(() =>
  import("../pages/Error/NotFound").then((m) => ({ default: m.NotFound }))
);

export function AppRoutes() {
  return (
    <Routes>
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Rotas protegidas */}
      <Route element={<ProtectedLayout />}>
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<PageLoader />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route
          path="/reservations"
          element={
            <Suspense fallback={<PageLoader />}>
              <Reservations />
            </Suspense>
          }
        />
        <Route
          path="/reservations/new"
          element={
            <Suspense fallback={<PageLoader />}>
              <NewReservation />
            </Suspense>
          }
        />
        <Route
          path="/reservations/:id"
          element={
            <Suspense fallback={<PageLoader />}>
              <ReservationDetails />
            </Suspense>
          }
        />
        <Route
          path="/tables"
          element={
            <Suspense fallback={<PageLoader />}>
              <Tables />
            </Suspense>
          }
        />
        <Route
          path="/tables/new"
          element={
            <Suspense fallback={<PageLoader />}>
              <NewTable />
            </Suspense>
          }
        />
        <Route
          path="/tables/:id"
          element={
            <Suspense fallback={<PageLoader />}>
              <TableDetails />
            </Suspense>
          }
        />
        <Route
          path="/tables/:id/edit"
          element={
            <Suspense fallback={<PageLoader />}>
              <EditTable />
            </Suspense>
          }
        />
        <Route
          path="/profile"
          element={
            <Suspense fallback={<PageLoader />}>
              <Profile />
            </Suspense>
          }
        />
        <Route
          path="/settings"
          element={
            <AdminConfigProvider>
              <Suspense fallback={<PageLoader />}>
                <Settings />
              </Suspense>
            </AdminConfigProvider>
          }
        />
      </Route>

      {/* Página de erro para rotas não encontradas */}
      <Route
        path="*"
        element={
          <Suspense fallback={<PageLoader />}>
            <NotFound />
          </Suspense>
        }
      />
    </Routes>
  );
}
