import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';

function AppHeader() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          to={isAuthenticated ? '/dashboard' : '/'}
          className="text-lg font-semibold tracking-tight text-slate-900"
        >
          API Tracker
        </Link>

        <nav className="flex items-center gap-4 text-sm text-slate-600">
          {isAuthenticated ? (
            <>
              <span className="hidden text-slate-500 sm:inline">
                {user?.email}
              </span>
              <Link to="/dashboard" className="hover:text-teal-800">
                Dashboard
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hover:text-teal-800"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-teal-800">
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-teal-800 px-3 py-1.5 font-medium text-white hover:bg-teal-700"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen">
          <AppHeader />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
