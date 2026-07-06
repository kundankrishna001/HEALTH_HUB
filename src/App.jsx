import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppShell from './layouts/AppShell';
import AuthLayout from './layouts/AuthLayout';
import LoadingScreen from './components/ui/LoadingScreen';

const Welcome = lazy(() => import('./pages/Welcome'));
const Features = lazy(() => import('./pages/Features'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const SymptomChecker = lazy(() => import('./pages/SymptomChecker'));
const DietPlan = lazy(() => import('./pages/DietPlan'));
const Recipes = lazy(() => import('./pages/Recipes'));
const FoodScanner = lazy(() => import('./pages/FoodScanner'));
const FoodChecker = lazy(() => import('./pages/FoodChecker'));
const Nutrition = lazy(() => import('./pages/Nutrition'));
const WaterTracker = lazy(() => import('./pages/WaterTracker'));
const HealthMetrics = lazy(() => import('./pages/HealthMetrics'));
const Family = lazy(() => import('./pages/Family'));
const Achievements = lazy(() => import('./pages/Achievements'));
const DoctorReports = lazy(() => import('./pages/DoctorReports'));
const Corporate = lazy(() => import('./pages/Corporate'));
const School = lazy(() => import('./pages/School'));
const Settings = lazy(() => import('./pages/Settings'));
const Language = lazy(() => import('./pages/Language'));
const About = lazy(() => import('./pages/About'));
const Help = lazy(() => import('./pages/Help'));
const Privacy = lazy(() => import('./pages/Privacy'));

function ProtectedRoute({ children }) {
  const { user, bootstrapped } = useAuth();
  if (!bootstrapped) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthLayout>
              <Signup />
            </AuthLayout>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthLayout>
              <ForgotPassword />
            </AuthLayout>
          }
        />
        <Route
          path="/reset-password"
          element={
            <AuthLayout>
              <ResetPassword />
            </AuthLayout>
          }
        />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="symptoms" element={<SymptomChecker />} />
          <Route path="diet-plan" element={<DietPlan />} />
          <Route path="recipes" element={<Recipes />} />
          <Route path="food-scanner" element={<FoodScanner />} />
          <Route path="food-checker" element={<FoodChecker />} />
          <Route path="nutrition" element={<Nutrition />} />
          <Route path="water" element={<WaterTracker />} />
          <Route path="metrics" element={<HealthMetrics />} />
          <Route path="family" element={<Family />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="doctor" element={<DoctorReports />} />
          <Route path="corporate" element={<Corporate />} />
          <Route path="school" element={<School />} />
          <Route path="settings" element={<Settings />} />
          <Route path="language" element={<Language />} />
          <Route path="about" element={<Navigate to="/about" replace />} />
          <Route path="help" element={<Help />} />
          <Route path="privacy" element={<Privacy />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
