import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

import MainLayout from './components/Layout/MainLayout.jsx';

import LoginPage from './pages/Auth/LoginPage.jsx';
import SignupPage from './pages/Auth/SignupPage.jsx';
import HomePage from './pages/Home/HomePage.jsx';
import SearchPage from './pages/Search/SearchPage.jsx';
import CreateAssetPage from './pages/Assets/CreateAssetPage.jsx';
import CategoryPage from './pages/Category/CategoryPage.jsx';
import LibraryPage from './pages/Library/LibraryPage.jsx';
import DashboardPage from './pages/Dashboard/DashboardPage.jsx';
import ProfilePage from './pages/Profile/ProfilePage.jsx';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected + layout */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout>
                <HomePage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/search"
          element={
            <PrivateRoute>
              <MainLayout>
                <SearchPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/assets/new"
          element={
            <PrivateRoute>
              <MainLayout>
                <CreateAssetPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/categories/:category"
          element={
            <PrivateRoute>
              <MainLayout>
                <CategoryPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/library"
          element={
            <PrivateRoute>
              <MainLayout>
                <LibraryPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
