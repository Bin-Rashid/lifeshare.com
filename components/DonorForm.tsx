'use client';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUser, convertToBase64 } from '../lib/firestore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function DonorForm() {
  const { currentUser, userData } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    fullName: userData?.fullName || '',
    age: userData?.age || '',
    phone: userData?.phone || '',
    city: userData?.city || '',
    district: userData?.district || '',
    lastDonateDate: userData?.lastDonateDate || '',
    bloodGroup: userData?.bloodGroup || ''
  });
  
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const districts = ['ঢাকা', 'চট্টগ্রাম', 'সিলেট', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'রংপুর', 'ময়মনসিংহ'];
  const cities = ['ঢাকা', 'চট্টগ্রাম', 'সিলেট', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'রংপুর', 'ময়মনসিংহ'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let profilePhotoUrl = userData?.profilePhoto;

      // Upload profile photo if selected
      if (profilePhoto) {
        profilePhotoUrl = await uploadFile(profilePhoto, `profiles/${currentUser?.uid}`);
      }

      // Update user data
      await updateUser(currentUser!.uid, {
        ...formData,
        age: parseInt(formData.age),
        profilePhoto: profilePhotoUrl,
        role: 'donor'
      });

      toast.success('প্রোফাইল আপডেট করা হয়েছে!');
      router.push('/');
    } catch (error) {
      toast.error('একটি error occurred!');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          রক্তদাতা প্রোফাইল সম্পূর্ণ করুন
        </h1>
        <p className="text-gray-600">
          আপনার তথ্য প্রদান করুন যাতে অন্যরা আপনাকে খুঁজে পেতে পারে
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            প্রোফাইল ছবি
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            পূর্ণ নাম
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="আপনার পূর্ণ নাম লিখুন"
          />
        </div>

        {/* Age and Blood Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              বয়স
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="18"
              max="65"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="১৮"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ব্লাড গ্রুপ
            </label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">ব্লাড গ্রুপ নির্বাচন করুন</option>
              {bloodGroups.map(group => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ফোন নম্বর
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="০১XXXXXXXXX"
          />
        </div>

        {/* District and City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              জেলা
            </label>
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">জেলা নির্বাচন করুন</option>
              {districts.map(district => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              শহর
            </label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">শহর নির্বাচন করুন</option>
              {cities.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Last Donate Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            শেষ রক্তদানের তারিখ
          </label>
          <input
            type="date"
            name="lastDonateDate"
            value={formData.lastDonateDate}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-3 px-4 rounded-lg hover:from-red-700 hover:to-red-900 transition-all disabled:opacity-50 font-bold"
        >
          {loading ? 'সেভ হচ্ছে...' : 'প্রোফাইল সেভ করুন'}
        </button>
      </form>
    </div>
  );
}
