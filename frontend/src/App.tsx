import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MonitorsPage } from './pages/MonitorsPage';
import { MonitorDetailsPage } from './pages/MonitorDetailsPage';

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
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="hover:text-teal-800">
                  Dashboard
                </Link>

                <Link to="/monitors" className="hover:text-teal-800">
                  Monitors
                </Link>
              </div>
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

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/monitors"
                element={
                  <ProtectedRoute>
                    <MonitorsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/monitors/:id"
                element={
                  <ProtectedRoute>
                    <MonitorDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
