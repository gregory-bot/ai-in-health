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
import { MessageCircle } from 'lucide-react'; // ✅ Import WhatsApp icon

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/register" />;
}

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 relative">
        <Header />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 relative">
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
          </Routes>

          {/* ✅ WhatsApp FAB inside scrollable content */}
          <div className="sticky bottom-6 left-2 z-50 w-fit">
            <a
              href="https://wa.me/254748163492"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition duration-300 flex items-center justify-center"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="w-6 h-6" />
            </a>
          </div>
        </main>

        {isAuthenticated && <ChatFAB />}
        <Toaster position="top-right" />
        <PopupAd />
      </div>
    </Router>
  );
}

export default App;
