import { Header } from "./Header";
import { Outlet } from "react-router-dom";

export function ProtectedLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
