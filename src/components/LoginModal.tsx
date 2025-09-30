import React, { useState } from 'react';
import { X, Mail, Lock, User, GraduationCap } from 'lucide-react';
import { signUp, signIn, createProfile, createStudentRecord, createParentRecord, supabase } from '../lib/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: any) => void;
}

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<'student' | 'parent'>('student');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [userType, setUserType] = useState<'student' | 'parent'>('student');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    grade: '',
    schoolName: '',
    parentCode: '',
    classCode: '',
    packageType: 'basic',
    billingCycle: 'monthly'
  });

  // Reset loading when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (isLoginMode) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  const handleLogin = async () => {
    if (activeTab === 'parent') {
      // Parent login with invite code
      if (!formData.parentCode.trim()) {
        alert('Lütfen davet kodunu girin');
        setLoading(false);
        return;
      }
      
      try {
        console.log('=== PARENT LOGIN STARTED ===');
        console.log('Invite code:', formData.parentCode.trim());
        
        // Find student by invite code
        const { data: student, error: studentError } = await supabase
          .from('students')
          .select(`
            *,
            profiles!inner(*)
          `)
          .eq('invite_code', formData.parentCode.trim())
          .single();

        console.log('Student query result:', { student, studentError });

        if (studentError || !student) {
          throw new Error('Geçersiz davet kodu');
        }

        console.log('Found student:', student);

        // Get ALL data for this student immediately
        console.log('=== FETCHING ALL STUDENT DATA ===');
        
        // Get weekly study goal
        console.log('=== FETCHING WEEKLY STUDY GOAL ===');
        const { data: weeklyGoal, error: goalError } = await supabase
          .from('weekly_study_goals')
          .select('*')
          .eq('student_id', student.id)
          .eq('is_active', true)
          .maybeSingle();
        
        console.log('Weekly goal query completed:', {
          data: weeklyGoal,
          error: goalError
        });
        
        // Get exam results
        console.log('=== FETCHING EXAM RESULTS ===');
        console.log('Student ID for queries:', student.id);
        
        const { data: examResults, error: examError } = await supabase
          .from('exam_results')
          .select('*')
          .eq('student_id', student.id)
          .order('exam_date', { ascending: false });
        
        console.log('Exam results query completed:', {
          data: examResults,
          error: examError,
          count: examResults?.length || 0
        });

        console.log('=== FETCHING HOMEWORKS ===');
        const { data: homeworks, error: homeworkError } = await supabase
          .from('homeworks')
          .select('*')
          .eq('student_id', student.id)
          .order('due_date', { ascending: true });
        
        console.log('Homeworks query completed:', {
          data: homeworks,
          error: homeworkError,
          count: homeworks?.length || 0
        });

        console.log('=== FETCHING STUDY SESSIONS ===');
        const { data: studySessions, error: studyError } = await supabase
          .from('study_sessions')
          .select('*')
          .eq('student_id', student.id)
          .order('session_date', { ascending: false });
        
        console.log('Study sessions query completed:', {
          data: studySessions,
          error: studyError,
          count: studySessions?.length || 0
        });
        
        // Test if there's any data in the database at all
        console.log('=== TESTING DATABASE ACCESS ===');
        const { data: allExams, error: allExamsError } = await supabase
          .from('exam_results')
          .select('*')
          .limit(1);
        
        console.log('Database access test:', {
          allExams,
          allExamsError,
          hasData: allExams && allExams.length > 0
        });

        // Create complete student object with all data
        const completeStudent = {
          ...student,
          exam_results: examResults || [],
          homeworks: homeworks || [],
          study_sessions: studySessions || [],
          weekly_study_goal: weeklyGoal
        };

        console.log('=== COMPLETE STUDENT DATA ===');
        console.log('Complete student:', completeStudent);
        console.log('Final exam results count:', (examResults || []).length);
        console.log('Final homeworks count:', (homeworks || []).length);
        console.log('Final study sessions count:', (studySessions || []).length);

        // Create parent user object
        const parentUser = {
          id: `parent_${student.id}`,
          email: `parent_${student.id}@temp.com`,
          profile: {
            id: `parent_${student.id}`,
            full_name: 'Veli',
            role: 'parent',
            email: `parent_${student.id}@temp.com`
          },
          isParentLogin: true,
          connectedStudents: [completeStudent]
        };

        console.log('=== PARENT USER CREATED ===');
        console.log('Parent user:', parentUser);
        console.log('Connected students:', parentUser.connectedStudents);

        // Store in localStorage
        localStorage.setItem('tempParentUser', JSON.stringify(parentUser));

        onLogin(parentUser);
        onClose();
        setFormData({
          email: '',
          password: '',
          name: '',
          confirmPassword: '',
          grade: '',
          schoolName: '',
          parentCode: '',
          classCode: '',
          packageType: 'basic',
          billingCycle: 'monthly'
        });
        return;
      } catch (error: any) {
        console.error('Parent login error:', error);
        alert('Veli girişi hatası: ' + (error.message || 'Bilinmeyen hata'));
        setLoading(false);
        return;
      }
    }

    // Student login
    try {
      const { data, error } = await signIn(formData.email, formData.password);
      if (error) throw error;
      
      if (data.user) {
        onLogin(data.user);
        onClose();
        // Reset form
        setFormData({
          email: '',
          password: '',
          name: '',
          confirmPassword: '',
          grade: '',
          schoolName: '',
          parentCode: '',
          classCode: ''
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      alert('Giriş hatası: ' + (error.message || 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert('Şifreler eşleşmiyor');
      setLoading(false);
      return;
    }

    if (userType === 'student' && (!formData.grade || !formData.schoolName)) {
      alert('Öğrenci için sınıf ve okul bilgisi gereklidir');
      setLoading(false);
      return;
    }

    if (userType === 'student' && (!formData.packageType || !formData.billingCycle)) {
      alert('Lütfen paket seçimi yapın');
      setLoading(false);
      return;
    }

    try {
      let classId = null;
      
      // If class code is provided, validate it first
      if (formData.classCode.trim()) {
        const { data: classData, error: classError } = await supabase
          .from('classes')
          .select('id, status, current_students, student_capacity')
          .eq('invite_code', formData.classCode.trim().toUpperCase())
          .single();

        if (classError || !classData) {
          throw new Error('Geçersiz sınıf kodu');
        }

        if (classData.status !== 'active') {
          throw new Error('Sınıf aktif değil');
        }

        if (classData.current_students >= classData.student_capacity) {
          throw new Error('Sınıf kapasitesi dolu');
        }

        classId = classData.id;
      }

      // 1. Create auth user
      const { data: authData, error: authError } = await signUp(formData.email, formData.password);
      
      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }
      
      if (authData.user) {
        console.log('User created:', authData.user.id);
        
        // Wait a moment for auth to settle
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 2. Create profile
        const profileData = {
          id: authData.user.id,
          email: formData.email,
          full_name: formData.name,
          role: userType,
          package_type: formData.packageType
        };
        
        console.log('Creating profile:', profileData);
        const { error: profileError } = await createProfile(profileData);
        if (profileError) {
          console.error('Profile error:', profileError);
          throw profileError;
        }

        // 3. Create role-specific record
        if (userType === 'student') {
          const studentData = {
            user_id: authData.user.id,
            grade: parseInt(formData.grade),
            school_name: formData.schoolName
          };
          console.log('Creating student:', studentData);
          const { error: studentError } = await createStudentRecord(studentData);
          if (studentError) {
            console.error('Student error:', studentError);
            throw studentError;
          }

          // If class code provided, join the class
          if (classId) {
            const { data: studentRecord } = await supabase
              .from('students')
              .select('id')
              .eq('user_id', authData.user.id)
              .single();

            if (studentRecord) {
              const { error: joinError } = await supabase
                .from('class_students')
                .insert([{
                  class_id: classId,
                  student_id: studentRecord.id,
                  status: 'active'
                }]);

              if (joinError) {
                console.error('Class join error:', joinError);
                // Don't fail registration, just warn
                alert('Kayıt başarılı ancak sınıfa katılımda sorun oluştu. Daha sonra tekrar deneyebilirsiniz.');
              }
            }
          }
        } else {
          const parentData = {
            user_id: authData.user.id
          };
          console.log('Creating parent:', parentData);
          const { error: parentError } = await createParentRecord(parentData);
          if (parentError) {
            console.error('Parent error:', parentError);
            throw parentError;
          }
        }
        
        onLogin(authData.user);
        
        // Reset form
        setFormData({
          email: '',
          password: '',
          name: '',
          confirmPassword: '',
          grade: '',
          schoolName: '',
          parentCode: '',
          classCode: '',
          packageType: 'basic',
          billingCycle: 'monthly'
        });
        
        onClose();
        alert('Kayıt başarılı! Hoş geldiniz!');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      alert('Kayıt hatası: ' + (error.message || 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('student')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'student'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Öğrenci
              </button>
              <button
                onClick={() => setActiveTab('parent')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'parent'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Veli
              </button>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {activeTab === 'parent' ? 'Veli Girişi' : (isLoginMode ? 'Öğrenci Girişi' : 'Öğrenci Kaydı')}
          </h2>
          <p className="text-gray-600 mt-2">
            {activeTab === 'parent' 
              ? 'Öğrencinizden aldığınız davet kodu ile giriş yapın'
              : (isLoginMode ? 'Hesabınıza giriş yapın' : 'Yeni hesap oluşturun')
            }
          </p>
        </div>

        {activeTab === 'parent' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Davet Kodu
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="parentCode"
                  value={formData.parentCode}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Öğrencinizden aldığınız kodu girin"
                  required
                />
              </div>
            </div>
            
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sınıf Kodu (Opsiyonel)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    name="classCode"
                    value={formData.classCode}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-center"
                    placeholder="645A-A006-208D (Opsiyonel)"
                    maxLength={14}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Öğretmeninizden aldığınız sınıf kodunu girebilirsiniz
                </p>
              </div>
            )}

            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paket Seçimi *
                </label>
                <select
                  name="packageType"
                  value={formData.packageType}
                  onChange={handleSelectChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="basic">Temel Paket</option>
                  <option value="advanced">Gelişmiş Paket</option>
                  <option value="professional">Profesyonel Paket</option>
                </select>
              </div>
            )}

            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ödeme Döngüsü *
                </label>
                <select
                  name="billingCycle"
                  value={formData.billingCycle}
                  onChange={handleSelectChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="monthly">Aylık</option>
                  <option value="yearly">Yıllık (%17 İndirim)</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Giriş yapılıyor...
                </div>
              ) : (
                'Veli Girişi Yap'
              )}
            </button>
          </form>
        ) : !isLoginMode && activeTab === 'student' ? (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Hesap Türü
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType('student')}
                className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  userType === 'student'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <GraduationCap className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Öğrenci</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType('parent')}
                className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  userType === 'parent'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <User className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Veli</span>
              </button>
            </div>
          </div>
        ) : null}

        {activeTab === 'student' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ad Soyad
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Adınızı giriniz"
                  required
                />
              </div>
            </div>
          )}

          {!isLoginMode && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sınıf
                </label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleSelectChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Sınıf seçin</option>
                  <option value="5">5. Sınıf</option>
                  <option value="6">6. Sınıf</option>
                  <option value="7">7. Sınıf</option>
                  <option value="8">8. Sınıf</option>
                  <option value="9">9. Sınıf</option>
                  <option value="10">10. Sınıf</option>
                  <option value="11">11. Sınıf</option>
                  <option value="12">12. Sınıf</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Okul Adı
                </label>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Okul adınızı giriniz"
                  required
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-posta
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ornek@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şifre
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {!isLoginMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Şifre Tekrar
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isLoginMode ? 'Giriş yapılıyor...' : 'Kayıt olunuyor...'}
              </div>
            ) : (
              isLoginMode ? 'Giriş Yap' : 'Kayıt Ol'
            )}
          </button>
          </form>
        ) : null}

        {activeTab === 'student' && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              {isLoginMode ? 'Hesabınız yok mu? Kayıt olun' : 'Zaten hesabınız var mı? Giriş yapın'}
            </button>
          </div>
        )}

        {isLoginMode && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-sm font-medium mb-2">Demo Hesapları:</p>
            <div className="text-xs text-blue-700 space-y-1">
              <p>Öğrenci: student@demo.com / 123456</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}