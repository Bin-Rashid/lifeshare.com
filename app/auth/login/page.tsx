'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DonorForm from '@/components/DonorForm';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register, userData } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if user is already logged in
    if (userData) {
      router.push(userData.role === 'admin' ? '/admin' : '/');
    }

    // Check if registration was requested
    const registerParam = searchParams.get('register');
    if (registerParam === 'true') {
      setIsLogin(false);
    }
  }, [userData, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast.success('লগইন সফল!');
        router.push('/');
      } else {
        if (password !== confirmPassword) {
          toast.error('পাসওয়ার্ড মিলছে না!');
          return;
        }
        await register(email, password);
        toast.success('রেজিস্ট্রেশন সফল!');
        // Donor form will be shown after registration
      }
    } catch (error: any) {
      toast.error(error.message || 'একটি error occurred!');
    } finally {
      setLoading(false);
    }
  };

  // If user just registered, show donor form
  if (userData && !userData.fullName && !isLogin) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-8">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <DonorForm />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? 'লগইন করুন' : 'রেজিস্টার করুন'}
              </h1>
              <p className="text-gray-600">
                {isLogin 
                  ? 'আপনার অ্যাকাউন্টে প্রবেশ করুন' 
                  : 'একটি নতুন অ্যাকাউন্ট তৈরি করুন'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ইমেইল
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  পাসওয়ার্ড
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    পাসওয়ার্ড নিশ্চিত করুন
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-3 px-4 rounded-lg hover:from-red-700 hover:to-red-900 transition-all disabled:opacity-50 font-bold"
              >
                {loading ? 'লোড হচ্ছে...' : (isLogin ? 'লগইন' : 'রেজিস্টার')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                {isLogin 
                  ? 'নতুন অ্যাকাউন্ট তৈরি করতে চান?' 
                  : 'ইতিমধ্যে অ্যাকাউন্ট আছে?'
                }
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}