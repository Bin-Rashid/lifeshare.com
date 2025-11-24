'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import DonorCard from '../../components/DonorCard';
import { User, AppConfig } from '../../types';
import { getAllDonors, updateUser, getAppConfig, updateAppConfig } from '../../lib/firestore';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const { userData } = useAuth();
  const router = useRouter();
  
  const [donors, setDonors] = useState<User[]>([]);
  const [config, setConfig] = useState<AppConfig>({
    heroQuote: '',
    whatsappNumber: ''
  });
  const [activeTab, setActiveTab] = useState('donors');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not admin
    if (userData && userData.role !== 'admin') {
      router.push('/');
      return;
    }

    if (userData?.role === 'admin') {
      loadData();
    }
  }, [userData, router]);

  const loadData = async () => {
    try {
      const [allDonors, appConfig] = await Promise.all([
        getAllDonors(),
        getAppConfig()
      ]);
      setDonors(allDonors);
      setConfig(appConfig);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAppConfig(config);
      toast.success('কনফিগারেশন আপডেট করা হয়েছে!');
    } catch (error) {
      toast.error('আপডেট ব্যর্থ!');
    }
  };

  const handleMakeAdmin = async (donor: User) => {
    if (!confirm(`আপনি কি ${donor.fullName} কে এডমিন বানাতে চান?`)) return;

    try {
      await updateUser(donor.uid, { role: 'admin' });
      toast.success('এডমিন হিসেবে নিয়োগ দেওয়া হয়েছে!');
      loadData(); // Reload data
    } catch (error) {
      toast.error('ব্যর্থ!');
    }
  };

  const handleEditDonor = (donor: User) => {
    // Implement edit functionality
    toast.success('এডিট ফিচার শীঘ্রই আসছে!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!userData || userData.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            এডমিন প্যানেল
          </h1>

          {/* Tabs */}
          <div className="flex space-x-4 mb-8 border-b">
            <button
              onClick={() => setActiveTab('donors')}
              className={`pb-4 px-4 font-medium ${
                activeTab === 'donors'
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              সকল রক্তদাতা
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`pb-4 px-4 font-medium ${
                activeTab === 'config'
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              সাইট কনফিগারেশন
            </button>
          </div>

          {/* Donors Tab */}
          {activeTab === 'donors' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  মোট রক্তদাতা: {donors.length} জন
                </h2>
              </div>

              {donors.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">😔</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    কোন রক্তদাতা নেই
                  </h3>
                  <p className="text-gray-600">
                    এখনও কোন রক্তদাতা রেজিস্টার করেননি
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {donors.map((donor) => (
                    <div key={donor.uid} className="relative">
                      <DonorCard donor={donor} onEdit={handleEditDonor} />
                      <button
                        onClick={() => handleMakeAdmin(donor)}
                        className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:from-blue-600 hover:to-blue-700 transition-all"
                      >
                        এডমিন বানান
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Config Tab */}
          {activeTab === 'config' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                সাইট কনফিগারেশন
              </h2>

              <form onSubmit={handleConfigUpdate} className="space-y-6">
                {/* Hero Quote */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    হিরো সেকশন কোট
                  </label>
                  <textarea
                    value={config.heroQuote}
                    onChange={(e) => setConfig({ ...config, heroQuote: e.target.value })}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="হিরো সেকশনে দেখানো কোট লিখুন..."
                  />
                </div>

                {/* WhatsApp Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp নম্বর
                  </label>
                  <input
                    type="tel"
                    value={config.whatsappNumber}
                    onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="+880XXXXXXXXX"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-900 transition-all font-bold"
                >
                  কনফিগারেশন সেভ করুন
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
