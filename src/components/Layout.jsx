import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  {
    to: "/businesses",
    label: "Businesses",
    icon: "M3 21V8l7-5 11 5v13h-6v-6H9v6H3z",
  },
  {
    to: "/influencers",
    label: "Influencers",
    icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  },
  {
    to: "/campaigns",
    label: "Campaigns",
    icon: "M12 2v20M2 7l20 10M2 17l20-10",
  },
  {
    to: "/applications",
    label: "Applications",
    icon: "M9 12h6m-6 4h6M9 8h6M5 21h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z",
  },
  // {
  //   to: "/deals",
  //   label: "Deals",
  //   icon: "M17 9V7a5 5 0 0 0-10 0v2m-2 0h14v12H5V9zm7 4v4m0 0h.01",
  // },
  { to: "/banners", label: "Banners", icon: "M4 5h16v14H4zM4 9h16M4 15h16" },
  // {
  //   to: "/products",
  //   label: "Products",
  //   icon: "M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z",
  // },
  { to: "/referrals", label: "Referrals", icon: "M13 7l7 5-7 5M5 7l7 5-7 5" },
  {
    to: "/categories",
    label: "Categories",
    icon: "M7 7h10v10H7zM12 11v6M9 14h6",
  },
];

function Sidebar({ onNavigate }) {
  return (
    <aside className="hidden lg:flex w-64 flex-col bg-gray-900 text-gray-300 h-screen sticky top-0">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
        <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">
          A
        </div>
        <span className="text-lg font-semibold text-white">Collaby Admin</span>
      </div>
      <SidebarContent onNavigate={onNavigate} />
    </aside>
  );
}

function SidebarContent({ onNavigate }) {
  return (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {navItems.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-indigo-600 text-white"
                : "hover:bg-gray-800 hover:text-white"
            }`
          }>
          <svg
            className="h-5 w-5 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function MobileSidebar({ open, onClose }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-gray-900 text-gray-300 transition-transform lg:hidden ${
          open ? "translate-x-0" : "pointer-events-none -translate-x-full"
        }`}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
          <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">
            A
          </div>
          <span className="flex-1 text-lg font-semibold text-white">
            Collaby Admin
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="-mr-2 rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <SidebarContent onNavigate={onClose} />
      </aside>
    </>
  );
}

function Topbar({ onMenuClick }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="lg:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-gray-900">
          Collaby Admin Panel
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden sm:block text-sm text-gray-600">
          {admin?.name || "Admin"}
        </span>
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
            {(admin?.name || "A").charAt(0).toUpperCase()}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-600 font-medium">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <MobileSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setMenuOpen(true)} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
