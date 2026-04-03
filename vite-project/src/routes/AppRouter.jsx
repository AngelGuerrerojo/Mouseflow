import { Navigate, Outlet, Route, Routes, useLocation } from "react-router";
import MainLayout from "../components/MainLayout";
import Landing from "../pages/Landing";
import Dashboard from "../pages/Dashboard";
import Progress from "../pages/Progress";
import Profile from "../pages/Profile";
import Ranking from "../pages/Ranking";
import LessonDetail from "../pages/LessonDetail";
import Dictionary from "../pages/Dictionary";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { getCurrentUser } from "../lib/api";

function PrivateRoute() {
  const location = useLocation();
  const user = getCurrentUser();
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout withFooter />}>
        <Route index element={<Landing />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route element={<PrivateRoute />}>
          <Route path="/menu" element={<Dashboard />} />
          <Route path="/progreso" element={<Progress />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/diccionario" element={<Dictionary />} />
          <Route path="/lecciones/:id" element={<LessonDetail />} />
        </Route>
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
