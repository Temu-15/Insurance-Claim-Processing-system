import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ClaimsPage from "./pages/ClaimsPage";
import NewClaimPage from "./pages/NewClaimPage";
import UserDashboard from "./pages/UserDashboard";
import AdminPage from "./pages/AdminPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminPoliciesPage from "./pages/AdminPoliciesPage";
import AdminClaimsPage from "./pages/AdminClaimsPage";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user/claims" element={<ClaimsPage />} />
          <Route path="/user/new-claim" element={<NewClaimPage />} />
          <Route path="/products/:productId" element={<ProductDetail />} />
          <Route path="/admin/dashboard" element={<AdminPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/policies" element={<AdminPoliciesPage />} />
          <Route path="/admin/claims" element={<AdminClaimsPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
