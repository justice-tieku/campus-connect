import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Protected } from "./components/Protected";
import { Admin } from "./pages/Admin";
import { ForgotPassword } from "./pages/ForgotPassword";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Opportunities } from "./pages/Opportunities";
import { Profile } from "./pages/Profile";
import { ProjectDetail } from "./pages/ProjectDetail";
import { ProjectForm } from "./pages/ProjectForm";
import { Projects } from "./pages/Projects";
import { Register } from "./pages/Register";
import { ResetPassword } from "./pages/ResetPassword";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/new" element={<Protected><ProjectForm mode="create" /></Protected>} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/projects/:id/edit" element={<Protected><ProjectForm mode="edit" /></Protected>} />
        <Route path="/profile" element={<Protected><Profile /></Protected>} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/admin" element={<Protected admin><Admin /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
