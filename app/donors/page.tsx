'use client';
import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import DonorCard from '../../components/DonorCard';
import { User } from '../../types';
import { getAllDonors } from '../../lib/firestore';

export default function DonorsPage() {
  const [donors, setDonors] = useState<User[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    district: '',
    city: '',
    bloodGroup: ''
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const districts = ['ঢাকা', 'চট্টগ্রাম', 'সিলেট', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'রংপুর', 'ময়মনসিংহ'];
  const cities = ['ঢাকা', 'চট্টগ্রাম', 'সিলেট', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'রংপুর', 'ময়মনসিংহ'];

  useEffect(() => {
    loadDonors();
  }, []);

  useEffect(() => {
    filterDonors();
  }, [donors, filters]);

  const loadDonors = async () => {
    try {
      const allDonors = await getAllDonors();
      setDonors(allDonors);
    } catch (error) {
      console.error('Error loading donors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDonors = () => {
    let filtered = donors;

    if (filters.district) {
      filtered = filtered.filter(donor => donor.district === filters.district);
    }

    if (filters.city) {
      filtered = filtered.filter(donor => donor.city === filters.city);
    }

    if (filters.bloodGroup) {
      filtered = filtered.filter(donor => donor.bloodGroup === filters.bloodGroup);
    }

    setFilteredDonors(filtered);
  };

  const clearFilters = () => {
    setFilters({ district: '', city: '', bloodGroup: '' });
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              সকল রক্তদাতা
            </h1>
            <p className="text-lg text-gray-600">
              আপনার এলাকার রক্তদাতা খুঁজে বের করুন এবং যোগাযোগ করুন
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* District Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  জেলা
                </label>
                <select
                  value={filters.district}
                  onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">সকল জেলা</option>
                  {districts.map(district => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  শহর
                </label>
                <select
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">সকল শহর</option>
                  {cities.map(city => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Blood Group Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ব্লাড গ্রুপ
                </label>
                <select
                  value={filters.bloodGroup}
                  onChange={(e) => setFilters({ ...filters, bloodGroup: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">সকল ব্লাড গ্রুপ</option>
                  {bloodGroups.map(group => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-all"
                >
                  ফিল্টার ক্লিয়ার
                </button>
              </div>
            </div>
          </div>

          {/* Donors Grid */}
          {filteredDonors.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                কোন রক্তদাতা পাওয়া যায়নি
              </h3>
              <p className="text-gray-600">
                আপনার নির্বাচিত ফিল্টারের সাথে মিলছে এমন কোন রক্তদাতা নেই
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDonors.map((donor) => (
                <DonorCard key={donor.uid} donor={donor} />
              ))}
            </div>
          )}

          {/* Results Count */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              মোট {filteredDonors.length} জন রক্তদাতা পাওয়া গেছে
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
