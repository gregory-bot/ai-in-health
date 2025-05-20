import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/layout/header';
import { LoginForm } from './components/auth/login-form';
import { RegisterForm } from './components/auth/register-form';
import { SymptomForm } from './components/symptoms/symptom-form';
import { PaymentForm } from './components/payment/payment-form';
import { AIAnalysis } from './components/analysis/ai-analysis';
import { ChatFAB } from './components/chat/chat-fab';
import { useAuthStore } from './lib/store';
import { PopupAd } from './components/PopupAd';
import { HomePage } from './components/HomePage';
import MentalWellnessPage from './components/MentalWellnessPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/register" />;
}

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/mental-wellness" element={<MentalWellnessPage />} />
            <Route
              path="/symptoms"
              element={
                <PrivateRoute>
                  <SymptomForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <PrivateRoute>
                  <PaymentForm amount={50} onSuccess={() => {}} />
                </PrivateRoute>
              }
            />
            {/* Add other routes as needed */}
          </Routes>
        </main>
        {isAuthenticated && <ChatFAB />}
        <Toaster position="top-right" />
        <PopupAd />
      </div>
    </Router>
  );
}

export default App; 