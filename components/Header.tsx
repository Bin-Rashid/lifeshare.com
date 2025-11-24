'use client';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Header() {
  const { userData, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('লগআউট সফল!');
      router.push('/');
    } catch (error) {
      toast.error('লগআউট ব্যর্থ!');
    }
  };

  return (
    <header className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              LifeShare
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/donors" className="text-gray-700 hover:text-red-600 font-medium">
              সকল রক্তদাতা
            </Link>
            {userData?.role === 'admin' && (
              <Link href="/admin" className="text-gray-700 hover:text-red-600 font-medium">
                এডমিন প্যানেল
              </Link>
            )}
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {userData ? (
              <div className="flex items-center space-x-4">
                {userData.role === 'donor' && (
                  <span className="text-sm text-gray-600 hidden sm:block">
                    {userData.fullName}
                  </span>
                )}
                {userData.profilePhoto ? (
                  <img
                    src={userData.profilePhoto}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-red-500"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {userData.fullName?.charAt(0)}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-900 transition-all"
                >
                  লগআউট
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-2 rounded-lg hover:from-red-700 hover:to-red-900 transition-all"
              >
                লগইন
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}