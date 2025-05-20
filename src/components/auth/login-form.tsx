import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuthStore } from '../../lib/store';
import { toast } from 'react-hot-toast';

const images = [
  "https://th.bing.com/th/id/OIP.UtX0_UXLxAYlc7JqCwGN6gHaE0?cb=iwc2&rs=1&pid=ImgDetMain",
  "https://th.bing.com/th/id/OIP.aCFNQ4HBUV9RP00fm6tIwwHaEK?cb=iwc2&rs=1&pid=ImgDetMain",
  "https://actionchange.org/wp-content/uploads/2019/10/pict_large-6.jpg",
  "https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=1200",
];

interface LoginFormProps {}

export function LoginForm({}: LoginFormProps) {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password, username);
      toast.success('Successfully logged in!');
      navigate('/');
    } catch (error) {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left: 2x2 Image Grid (Desktop) */}
      <div className="hidden md:grid grid-cols-2 grid-rows-2 w-1/2 h-screen">
        <img src={images[0]} alt="Image 1" className="object-cover w-full h-full" />
        <img src={images[1]} alt="Image 2" className="object-cover w-full h-full" />
        <img src={images[2]} alt="Image 3" className="object-cover w-full h-full" />
        <img src={images[3]} alt="Image 4" className="object-cover w-full h-full" />
      </div>

      {/* Right: Login Form */}
      <div className="flex flex-1 items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm sm:max-w-md space-y-8 rounded-xl bg-white p-6 sm:p-8 shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              log in to teleCure
            </h2>
            <p className="mt-2 text-xl text-gray-600">
              your home to healthcare and mental wellness assistant
            </p>
          </div>
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    className="block w-full rounded-md border border-gray-300 pl-10 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    required
                    className="block w-full rounded-md border border-gray-300 pl-10 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    className="block w-full rounded-md border border-gray-300 pl-10 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full py-2">
              Sign in
            </Button>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </a>
            </p>
          </form>

          {/* Mobile: 2x2 Image Grid below form */}
          <div className="grid grid-cols-2 grid-rows-2 gap-1 mt-8 md:hidden">
            <img src={images[0]} alt="Image 1" className="object-cover w-full h-24 rounded" />
            <img src={images[1]} alt="Image 2" className="object-cover w-full h-24 rounded" />
            <img src={images[2]} alt="Image 3" className="object-cover w-full h-24 rounded" />
            <img src={images[3]} alt="Image 4" className="object-cover w-full h-24 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}