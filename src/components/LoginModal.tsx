import React, { useState } from 'react';
import { X, User, Phone, Users, GraduationCap, BookOpen, BarChart3, TrendingUp, Award, Target, Calendar, Clock } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: any) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [activeTab, setActiveTab] = useState<'student' | 'parent'>('student');
  const [inviteCode, setInviteCode] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (activeTab === 'parent') {
        // Validate parent form
        if (!inviteCode.trim()) {
          setError('Davet kodu gereklidir');
          return;
        }
        if (!parentPhone.trim()) {
          setError('Telefon numarası gereklidir');
          return;
        }

        // Simple phone format validation
        const phoneRegex = /^0\s?\d{3}\s?\d{3}\s?\d{2}\s?\d{2}$/;
        if (!phoneRegex.test(parentPhone.replace(/\s/g, ''))) {
          setError('Telefon numarası 0 507 XXX XX XX formatında olmalıdır');
          return;
        }

        // Mock parent login
        const parentData = {
          id: 'parent-' + Date.now(),
          inviteCode,
          phone: parentPhone,
          role: 'parent',
          isParentLogin: true
        };

        onLogin(parentData);
      } else {
        // Student login logic would go here
        if (!inviteCode.trim()) {
          setError('Davet kodu gereklidir');
          return;
        }

        // Mock student login
        const studentData = {
          id: 'student-' + Date.now(),
          inviteCode,
          role: 'student'
        };

        onLogin(studentData);
      }

      // Reset form
      setInviteCode('');
      setParentPhone('');
      onClose();
    } catch (err) {
      setError('Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setInviteCode('');
    setParentPhone('');
    setError('');
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('student')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'student'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Öğrenci
            </button>
            <button
              onClick={() => setActiveTab('parent')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'parent'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Veli
            </button>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors z-10 bg-white rounded-full p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'student' ? (
            <div>
              <div className="text-center mb-6">
                <GraduationCap className="h-12 w-12 mx-auto text-blue-600 mb-3" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Öğrenci Girişi</h2>
                <p className="text-gray-600">Davet kodunuz ile giriş yapın</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Davet Kodu
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      placeholder="Öğretmeninizden aldığınız kodu girin"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                </button>
              </form>
            </div>
          ) : (
            <div>
              <div className="text-center mb-6">
                <Users className="h-12 w-12 mx-auto text-blue-600 mb-3" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Veli Girişi</h2>
                <p className="text-gray-600">Öğrencinizden aldığınız davet kodu ile giriş yapın</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Davet Kodu
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      placeholder="Öğrencinizden aldığınız kodu girin"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon Numarası
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      placeholder="0 507 XXX XX XX"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Telefon numaranızı 0 507 XXX XX XX formatında giriniz
                  </p>
                </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Giriş Yapılıyor...' : 'Veli Girişi Yap'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;