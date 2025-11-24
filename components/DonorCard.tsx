'use client';
import { User } from '../types';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { deleteUser } from '../lib/firestore';
import toast from 'react-hot-toast';

interface DonorCardProps {
  donor: User;
  onEdit?: (donor: User) => void;
}

export default function DonorCard({ donor, onEdit }: DonorCardProps) {
  const { userData } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const calculateEligibility = (lastDonateDate: string) => {
    const lastDonate = new Date(lastDonateDate);
    const today = new Date();
    const diffTime = today.getTime() - lastDonate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const remainingDays = 90 - diffDays;

    if (diffDays < 90) {
      return { eligible: false, remainingDays };
    }
    return { eligible: true, remainingDays: 0 };
  };

  const { eligible, remainingDays } = calculateEligibility(donor.lastDonateDate);

  const handleDelete = async () => {
    if (!confirm('আপনি কি নিশ্চিত এই ডোনার ডিলিট করতে চান?')) return;
    
    setIsDeleting(true);
    try {
      await deleteUser(donor.uid);
      toast.success('ডোনার ডিলিট করা হয়েছে!');
    } catch (error) {
      toast.error('ডিলিট ব্যর্থ!');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 card-gradient">
      <div className="p-6">
        {/* Header with Photo and Basic Info */}
        <div className="flex items-center space-x-4 mb-4">
          {donor.profilePhoto ? (
            <img
              src={donor.profilePhoto}
              alt={donor.fullName}
              className="w-16 h-16 rounded-full object-cover border-2 border-red-200"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {donor.fullName?.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold text-gray-800">{donor.fullName}</h3>
            <p className="text-gray-600">{donor.age} বছর</p>
          </div>
        </div>

        {/* Donor Details */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">ব্লাড গ্রুপ:</span>
            <span className="font-bold text-red-600">{donor.bloodGroup}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">জেলা:</span>
            <span className="font-medium">{donor.district}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">শহর:</span>
            <span className="font-medium">{donor.city}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">ফোন:</span>
            <span className="font-medium">{donor.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">শেষ রক্তদান:</span>
            <span className="font-medium">
              {new Date(donor.lastDonateDate).toLocaleDateString('bn-BD')}
            </span>
          </div>
        </div>

        {/* Eligibility Status */}
        <div className={`p-3 rounded-lg text-center ${
          eligible 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
        }`}>
          {eligible ? (
            <span className="font-bold">তিনি এখন রক্ত দিতে পারবেন</span>
          ) : (
            <span>
              আবার রক্ত দিতে পারবেন: {remainingDays} দিন পর
            </span>
          )}
        </div>

        {/* Admin Actions */}
        {userData?.role === 'admin' && onEdit && (
          <div className="flex space-x-2 mt-4">
            <button
              onClick={() => onEdit(donor)}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              এডিট
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50"
            >
              {isDeleting ? 'ডিলিটিং...' : 'ডিলিট'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
