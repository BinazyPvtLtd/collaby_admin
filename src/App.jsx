import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Businesses from "./pages/Businesses";
import Influencers from "./pages/Influencers";
import Campaigns from "./pages/Campaigns";
import Applications from "./pages/Applications";
import Deals from "./pages/Deals";
import Banners from "./pages/Banners";
import Products from "./pages/Products";
import Referrals from "./pages/Referrals";
import Categories from "./pages/Categories";

function Protected({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return null;
  if (!admin) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <Protected>
            <Layout />
          </Protected>
        }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="businesses" element={<Businesses />} />
        <Route path="influencers" element={<Influencers />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="applications" element={<Applications />} />
        <Route path="deals" element={<Deals />} />
        <Route path="banners" element={<Banners />} />
        <Route path="products" element={<Products />} />
        <Route path="referrals" element={<Referrals />} />
        <Route path="categories" element={<Categories />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
