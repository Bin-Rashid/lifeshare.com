'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getAppConfig } from '../lib/firestore';

export default function Home() {
  const [heroQuote, setHeroQuote] = useState('রক্তদান জীবনদান - একটি রক্ত অনেকগুলো জীবন বাঁচাতে পারে');

  useEffect(() => {
    const loadQuote = async () => {
      const config = await getAppConfig();
      setHeroQuote(config.heroQuote);
    };
    loadQuote();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Header */}
      <div className="gradient-bg text-white">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              জীবন <span className="text-red-200">শেয়ার</span> করুন
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto leading-relaxed">
              {heroQuote}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
              <Link
                href="/auth/login?register=true"
                className="bg-white text-red-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg transform hover:scale-105"
              >
                রক্তদাতা হিসাবে রেজিস্টার করুন
              </Link>
              <Link
                href="/donors"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-red-600 transition-all"
              >
                সকল রক্তদাতা দেখুন
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              কেন রক্তদান গুরুত্বপূর্ণ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              একটি রক্তদান অনেকগুলো জীবন বাঁচাতে পারে। আপনার ছোট্ট contribution অনেক বড় পরিবর্তন আনতে পারে।
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💖</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">জীবন বাঁচান</h3>
              <p className="text-gray-600">আপনার রক্তদান accident victims, surgery patients, এবং অনেক critical patients এর জীবন বাঁচাতে পারে</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🩺</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">স্বাস্থ্য পরীক্ষা</h3>
              <p className="text-gray-600">রক্তদানের সময় আপনার ব্লাড প্রেশার, hemoglobin এবং overall health checkup করা হয়</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">নিয়মিত রক্তদান</h3>
              <p className="text-gray-600">৯০ দিন পর পর আপনি আবার রক্তদান করতে পারবেন। এটি আপনার শরীরের জন্য উপকারী</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
