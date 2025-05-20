import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  ShieldCheck,
  Stethoscope,
  Clock,
  Shield,
  Bell,
  HeartPulse,
  Heart,
  UserCheck,
} from "lucide-react";

// Replace with your preferred hero image
const heroImage =
  "https://images.pexels.com/photos/30677589/pexels-photo-30677589/free-photo-of-professional-consultation-in-lagos-office-setting.jpeg?auto=compress&cs=tinysrgb&w=1200";

// Background image for the patient journey section
const journeyBg =
  "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=1200";

export function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Image Background (only for hero section) */}
      <div className="relative w-full">
        <div className="absolute inset-0 z-0 h-full w-full">
          <img
            src={heroImage}
            alt="Healthcare background"
            className="w-full h-full object-cover"
            style={{ minHeight: "480px", maxHeight: "700px" }}
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        {/* Hero Section */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[480px] max-h-[700px] px-4 py-12 text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center drop-shadow-lg">
            teleCure: Your AI-Powered Health & Wellness Companion
          </h1>
          <p className="text-lg md:text-2xl mb-8 text-center max-w-2xl drop-shadow">
            Gamified self-care, mental health support, women, men and children safety, and AI-driven telemedicine—all in one secure platform.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register">
              <Button className="bg-red-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold">
                Get Started
              </Button>
            </Link>
            <Link to="/symptoms">
              <Button
                variant="outline"
                className="border-white hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold"
              >
                Try Symptom Checker
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works / Gamified Guide */}
      <div className="relative z-20 bg-white/90 py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">
          How teleCure Works
        </h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-green-700 mb-2">
              1. Take Self-Assessment Quizzes
            </h3>
            <ul className="list-disc ml-6 text-gray-700">
              <li>Short, validated mental health quizz</li>
              <li>Track your scores and progress over time</li>
              <li>Earn badges for regular check-ins</li>
            </ul>
            <h3 className="text-xl font-semibold text-green-700 mt-6 mb-2">
              2. Chat with AI or Join Peer Circles
            </h3>
            <ul className="list-disc ml-6 text-gray-700">
              <li>24/7 AI-powered therapist for quick support</li>
              <li>Anonymous, moderated peer support groups</li>
              <li>Crisis SOS button for emergencies</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-pink-700 mb-2">
              3. Women's Health & Safety
            </h3>
            <ul className="list-disc ml-6 text-gray-700">
              <li>Domestic violence help center & discreet chat</li>
              <li>Wellness tracker: mood, sleep, nutrition</li>
              <li>Encrypted journaling with mood analysis</li>
            </ul>
            <h3 className="text-xl font-semibold text-blue-700 mt-6 mb-2">
              4. Men's & Community Health
            </h3>
            <ul className="list-disc ml-6 text-gray-700">
              <li>Men's mental health portal & mentorship</li>
              <li>Tailored resources for under-served groups</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="relative z-20 bg-white py-10 px-2 md:px-8">
        <div className="flex flex-col items-center mb-4">
          <span className="bg-pink-100 text-pink-700 px-4 py-1 rounded-full text-xs font-semibold mb-2">
            Why Choose Us
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
            why teleCure
          </h2>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          <div className="flex items-center space-x-3 bg-white rounded-lg shadow-sm p-3 md:p-4">
            <Clock className="h-7 w-7 text-blue-600 bg-blue-100 rounded-md p-1" />
            <div>
              <div className="font-semibold text-sm md:text-base">Quick Consultations</div>
              <div className="text-xs text-gray-500">Get diagnosed and receive prescriptions in under minutes</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-white rounded-lg shadow-sm p-3 md:p-4">
            <Shield className="h-7 w-7 text-green-600 bg-green-100 rounded-md p-1" />
            <div>
              <div className="font-semibold text-sm md:text-base">Secure Data Records</div>
              <div className="text-xs text-gray-500">Your medical data is encrypted and stored securely on secure technology</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-white rounded-lg shadow-sm p-3 md:p-4">
            <Stethoscope className="h-7 w-7 text-purple-600 bg-purple-100 rounded-md p-1" />
            <div>
              <div className="font-semibold text-sm md:text-base">Expert Doctors</div>
              <div className="text-xs text-gray-500">Access to qualified healthcare professionals 24/7</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-white rounded-lg shadow-sm p-3 md:p-4">
            <Bell className="h-7 w-7 text-orange-600 bg-orange-100 rounded-md p-1" />
            <div>
              <div className="font-semibold text-sm md:text-base">Medicine Reminders</div>
              <div className="text-xs text-gray-500">Never miss a dose with our smart medication reminder system</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-white rounded-lg shadow-sm p-3 md:p-4">
            <HeartPulse className="h-7 w-7 text-red-600 bg-red-100 rounded-md p-1" />
            <div>
              <div className="font-semibold text-sm md:text-base">Health Monitoring</div>
              <div className="text-xs text-gray-500">Track your vital signs and health progress over time</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-white rounded-lg shadow-sm p-3 md:p-4">
            <Heart className="h-7 w-7 text-pink-600 bg-pink-100 rounded-md p-1" />
            <div>
              <div className="font-semibold text-sm md:text-base">Preventive Care</div>
              <div className="text-xs text-gray-500">Get personalized health tips and preventive care recommendations</div>
            </div>
          </div>
        </div>
      </div>

      {/* How the System Works (Patient Journey) with background image */}
      <div className="relative z-20 py-16 px-4">
        {/* Background Image */}
        <div
          className="absolute inset-0 w-full h-full z-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${journeyBg})`,
            filter: "brightness(0.7)",
          }}
        />
        {/* Overlay for contrast */}
        <div className="absolute inset-0 bg-blue-900/60 z-0"></div>

        {/* Content */}
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-center mb-2 text-white drop-shadow-lg">
            How teleCure Patient Journey Works
          </h2>
          <p className="text-center text-blue-100 mb-10">
            Our platform connects you with doctors in three simple steps
          </p>
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white/90 rounded-2xl shadow-lg p-8 flex flex-col items-center transition hover:shadow-2xl">
              <div className="bg-blue-100 rounded-full p-4 mb-4">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-gray-900 text-center">
                Describe Symptoms
              </h3>
              <p className="text-gray-600 text-center mb-4">
                Share your symptoms and medical history through our secure platform
              </p>
              <div className="flex items-center gap-2 bg-pink-50 rounded-full px-4 py-2 text-pink-700 text-sm font-medium">
                <Clock className="h-4 w-4" /> unlimited to yourself
              </div>
            </div>
            {/* Step 2 */}
            <div className="bg-white/90 rounded-2xl shadow-lg p-8 flex flex-col items-center transition hover:shadow-2xl">
              <div className="bg-purple-100 rounded-full p-4 mb-4">
                <ShieldCheck className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-gray-900 text-center">
                AI Analysis
              </h3>
              <p className="text-gray-600 text-center mb-4">
                Our AI system analyzes your symptoms and medical records for preliminary assessment
              </p>
              <div className="flex items-center gap-2 bg-pink-50 rounded-full px-4 py-2 text-pink-700 text-sm font-medium">
                <Clock className="h-4 w-4" /> 30 seconds
              </div>
            </div>
            {/* Step 3 */}
            <div className="bg-white/90 rounded-2xl shadow-lg p-8 flex flex-col items-center transition hover:shadow-2xl">
              <div className="bg-green-100 rounded-full p-4 mb-4">
                <Stethoscope className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-gray-900 text-center">
                Doctor Review
              </h3>
              <p className="text-gray-600 text-center mb-4">
                A qualified doctor reviews your case and provides personalized treatment
              </p>
              <div className="flex items-center gap-2 bg-pink-50 rounded-full px-4 py-2 text-pink-700 text-sm font-medium">
                <Clock className="h-4 w-4" /> 5-7 minutes
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-20 bg-blue-50 py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">
          Platform Features
        </h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-bold text-lg mb-2 text-blue-700">
              AI Symptom Triage Agent
            </h4>
            <p className="text-gray-700 mb-2">
              Describe your symptoms in plain language and get instant, AI-powered triage and recommendations.
            </p>
            <Link to="/symptoms">
              <Button className="bg-blue-700 text-white mt-2">Try Now</Button>
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-bold text-lg mb-2 text-green-700">
              Video Consults & e-Prescriptions
            </h4>
            <p className="text-gray-700 mb-2">
              Book video calls with doctors and receive e-prescriptions securely.
            </p>
            <Button className="bg-green-700 text-white mt-2" disabled>
              Coming Soon
            </Button>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-bold text-lg mb-2 text-pink-700">
              Mental Wellness & Safety
            </h4>
            <p className="text-gray-700 mb-2">
              Access resources, track wellness, and get help discreetly when needed.
            </p>
            <Link to="/mental-wellness">
              <Button className="bg-blue-700 text-white mt-2">Try Now</Button>
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-bold text-lg mb-2 text-yellow-700">
              Community & Peer Support
            </h4>
            <p className="text-gray-700 mb-2">
              Join moderated support circles and connect with mentors.
            </p>
            <Link to="/resources">
              <Button className="bg-blue-700 text-white mt-2">Try Now</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}