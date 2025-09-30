import React, { useState, useEffect } from 'react';
import { 
  User, TrendingUp, Clock, Award, BookOpen, AlertTriangle, Plus, 
  Target, Calendar, FileText, Brain, LogOut, Copy, Eye, EyeOff,
  BarChart3, Users, Bell
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { useStudentData } from '../hooks/useStudentData';
import { signOut, getStudentInviteCode, getWeeklyStudyGoal, createWeeklyStudyGoal, updateWeeklyStudyGoal, addStudySession } from '../lib/supabase';
import ExamForm from './ExamForm';
import HomeworkForm from './HomeworkForm';
import AIInsights from './AIInsights';

export default function StudentDashboard() {
  const { user, clearUser } = useAuth();
  const { 
    studentData, 
    examResults, 
    homeworks, 
    aiRecommendations,
    studentClasses,
    classAssignments,
    classAnnouncements,
    classExamResults,
    loading, 
    refetch 
  } = useStudentData(user?.id);

  const [showExamForm, setShowExamForm] = useState(false);
  const [showHomeworkForm, setShowHomeworkForm] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [showInviteCode, setShowInviteCode] = useState(false);
  const [weeklyGoal, setWeeklyGoal] = useState<any>(null);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalHours, setGoalHours] = useState(25);
  const [showStudyForm, setShowStudyForm] = useState(false);
  const [studyForm, setStudyForm] = useState({
    subject: '',
    topic: '',
    duration_minutes: '',
    session_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (studentData) {
      loadInviteCode();
      loadWeeklyGoal();
    }
  }, [studentData]);

  const loadInviteCode = async () => {
    if (studentData?.id) {
      const { data } = await getStudentInviteCode(studentData.id);
      if (data) {
        setInviteCode(data.invite_code);
      }
    }
  };

  const loadWeeklyGoal = async () => {
    if (studentData?.id) {
      const { data } = await getWeeklyStudyGoal(studentData.id);
      setWeeklyGoal(data);
      if (data) {
        setGoalHours(data.weekly_hours_target);
      }
    }
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      console.error('Logout error:', error);
    } else {
      clearUser();
    }
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    alert('Davet kodu kopyalandı!');
  };

  const handleCreateGoal = async () => {
    if (!studentData?.id) return;

    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + 7);

      const goalData = {
        student_id: studentData.id,
        weekly_hours_target: goalHours,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        is_active: true
      };

      if (weeklyGoal) {
        await updateWeeklyStudyGoal(weeklyGoal.id, { weekly_hours_target: goalHours });
      } else {
        await createWeeklyStudyGoal(goalData);
      }

      await loadWeeklyGoal();
      setShowGoalForm(false);
      alert('Haftalık hedef başarıyla kaydedildi!');
    } catch (error) {
      console.error('Goal creation error:', error);
      alert('Hedef kaydedilirken hata oluştu');
    }
  };

  const handleAddStudySession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentData?.id) return;

    try {
      const sessionData = {
        student_id: studentData.id,
        subject: studyForm.subject,
        topic: studyForm.topic || null,
        duration_minutes: parseInt(studyForm.duration_minutes),
        session_date: studyForm.session_date,
        notes: studyForm.notes || null
      };

      await addStudySession(sessionData);
      setShowStudyForm(false);
      setStudyForm({
        subject: '',
        topic: '',
        duration_minutes: '',
        session_date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      refetch();
      alert('Çalışma seansı başarıyla eklendi!');
    } catch (error) {
      console.error('Study session error:', error);
      alert('Çalışma seansı eklenirken hata oluştu');
    }
  };

  // Calculate stats
  const averageScore = examResults.length > 0 
    ? examResults.reduce((sum, exam) => sum + (exam.total_score || 0), 0) / examResults.length 
    : 0;

  const completedHomeworks = homeworks.filter(hw => hw.completed).length;
  const totalHomeworks = homeworks.length;

  // Calculate this week's study hours
  const thisWeekStart = new Date();
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
  thisWeekStart.setHours(0, 0, 0, 0);

  const thisWeekEnd = new Date(thisWeekStart);
  thisWeekEnd.setDate(thisWeekStart.getDate() + 6);
  thisWeekEnd.setHours(23, 59, 59, 999);

  // Prepare chart data - Fixed version
  const chartData = examResults && examResults.length > 0
    ? examResults
        .filter(exam => exam.total_score != null && exam.total_score > 0 && exam.exam_date)
        .sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime())
        .slice(-6) // Son 6 deneme
        .map((exam, index) => ({
          date: new Date(exam.exam_date).toLocaleDateString('tr-TR', { 
            day: '2-digit', 
            month: '2-digit',
            year: '2-digit'
          }),
          puan: Math.round(exam.total_score || 0),
          examType: exam.exam_type,
          examName: exam.exam_name,
          fullDate: exam.exam_date
        }))
    : [];

  const homeworkCompletion = totalHomeworks > 0 ? [
    { name: 'Tamamlanan', value: completedHomeworks, color: '#10B981' },
    { name: 'Bekleyen', value: totalHomeworks - completedHomeworks, color: '#F59E0B' }
  ] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Öğrenci verisi bulunamadı</h3>
          <p className="text-gray-600">Lütfen tekrar giriş yapmayı deneyin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Öğrenci Paneli</h1>
            <p className="text-gray-600">
              Hoş geldin, {studentData.profiles?.full_name}! Akademik gelişimini takip et.
            </p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span>{studentData.grade}. Sınıf</span>
              <span>•</span>
              <span>{studentData.school_name}</span>
              {studentData.target_university && (
                <>
                  <span>•</span>
                  <span>Hedef: {studentData.target_university}</span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Çıkış Yap</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Ortalama Puan</p>
                <p className="text-2xl font-bold text-blue-600">
                  {averageScore > 0 ? averageScore.toFixed(1) : '0'}
                </p>
                <p className="text-xs text-gray-500">/ 500</p>
              </div>
              <Award className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tamamlanan Ödev</p>
                <p className="text-2xl font-bold text-green-600">
                  {completedHomeworks}/{totalHomeworks}
                </p>
                <p className="text-green-600 text-sm">
                  {totalHomeworks > 0 ? Math.round((completedHomeworks / totalHomeworks) * 100) : 0}% başarı
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Haftalık Hedef</p>
                <p className="text-2xl font-bold text-purple-600">
                  {weeklyGoal ? `${weeklyGoal.weekly_hours_target}h` : 'Yok'}
                </p>
                <button
                  onClick={() => setShowGoalForm(true)}
                  className="text-purple-600 text-sm hover:underline"
                >
                  {weeklyGoal ? 'Güncelle' : 'Hedef Belirle'}
                </button>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">AI Önerisi</p>
                <p className="text-2xl font-bold text-orange-600">{aiRecommendations.length}</p>
                <p className="text-orange-600 text-sm">yeni öneri</p>
              </div>
              <Brain className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Son Denemeler İlerlemesi</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    fontSize={12}
                    tick={{ fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    domain={[0, 500]} 
                    fontSize={12}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip 
                    formatter={(value: any, name: any, props: any) => [
                      [`${value} puan`, `${props.payload.examName}`],
                      props.payload.examType
                    ]}
                    labelFormatter={(label: any, payload: any) => {
                      if (payload && payload[0]) {
                        return new Date(payload[0].payload.fullDate).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        });
                      }
                      return label;
                    }}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="puan" 
                    stroke="#2563eb" 
                    strokeWidth={2} 
                    name="Puan"
                    dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2, fill: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Henüz deneme sonucu yok</p>
                <button
                  onClick={() => setShowExamForm(true)}
                  className="mt-2 text-blue-600 hover:underline"
                >
                  İlk deneme sonucunu ekle
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Ödev Tamamlama Durumu</h3>
            {homeworkCompletion.length > 0 && totalHomeworks > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={homeworkCompletion}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value, percent }) => `${name}: ${value}`}
                  >
                    {homeworkCompletion.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Henüz ödev yok</p>
                <button
                  onClick={() => setShowHomeworkForm(true)}
                  className="mt-2 text-blue-600 hover:underline"
                >
                  İlk ödevi ekle
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => setShowExamForm(true)}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Deneme Sonucu Ekle</h3>
                <p className="text-gray-600 text-sm">TYT, AYT veya LGS deneme sonucunu kaydet</p>
              </div>
              <Plus className="h-8 w-8 text-blue-600" />
            </div>
          </button>

          <button
            onClick={() => setShowHomeworkForm(true)}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ödev Ekle</h3>
                <p className="text-gray-600 text-sm">Yeni ödev ekle ve takip et</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </button>

          <button
            onClick={() => setShowStudyForm(true)}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Çalışma Seansı</h3>
                <p className="text-gray-600 text-sm">Çalışma süresini kaydet</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </button>
        </div>

        {/* Invite Code Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <h3 className="text-lg font-semibold mb-4">Veli Davet Kodu</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-2">
                Velilerinizin sizi takip edebilmesi için bu kodu paylaşın:
              </p>
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 px-4 py-2 rounded-lg font-mono text-lg">
                  {showInviteCode ? inviteCode : '••••••••'}
                </div>
                <button
                  onClick={() => setShowInviteCode(!showInviteCode)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {showInviteCode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                <button
                  onClick={copyInviteCode}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Copy className="h-4 w-4" />
                  <span>Kopyala</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <AIInsights examResults={examResults} studentData={studentData} />

        {/* Modals */}
        <ExamForm
          isOpen={showExamForm}
          onClose={() => setShowExamForm(false)}
          studentId={studentData.id}
          onSuccess={() => {
            setShowExamForm(false);
            refetch();
          }}
        />

        <HomeworkForm
          isOpen={showHomeworkForm}
          onClose={() => setShowHomeworkForm(false)}
          studentId={studentData.id}
          onSuccess={() => {
            setShowHomeworkForm(false);
            refetch();
          }}
        />

        {/* Weekly Goal Modal */}
        {showGoalForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Haftalık Çalışma Hedefi</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Haftalık Hedef: {goalHours} saat
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={goalHours}
                  onChange={(e) => setGoalHours(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5 saat</span>
                  <span>50 saat</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowGoalForm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
                >
                  İptal
                </button>
                <button
                  onClick={handleCreateGoal}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Study Session Modal */}
        {showStudyForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Çalışma Seansı Ekle</h3>
              <form onSubmit={handleAddStudySession} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ders *</label>
                  <select
                    value={studyForm.subject}
                    onChange={(e) => setStudyForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Ders seçin</option>
                    <option value="Matematik">Matematik</option>
                    <option value="Türkçe">Türkçe</option>
                    <option value="Fen Bilimleri">Fen Bilimleri</option>
                    <option value="Sosyal Bilgiler">Sosyal Bilgiler</option>
                    <option value="İngilizce">İngilizce</option>
                    <option value="Fizik">Fizik</option>
                    <option value="Kimya">Kimya</option>
                    <option value="Biyoloji">Biyoloji</option>
                    <option value="Tarih">Tarih</option>
                    <option value="Coğrafya">Coğrafya</option>
                    <option value="Edebiyat">Edebiyat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                  <input
                    type="text"
                    value={studyForm.topic}
                    onChange={(e) => setStudyForm(prev => ({ ...prev, topic: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Çalıştığınız konu"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Süre (dakika) *</label>
                  <input
                    type="number"
                    value={studyForm.duration_minutes}
                    onChange={(e) => setStudyForm(prev => ({ ...prev, duration_minutes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="60"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tarih *</label>
                  <input
                    type="date"
                    value={studyForm.session_date}
                    onChange={(e) => setStudyForm(prev => ({ ...prev, session_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notlar</label>
                  <textarea
                    value={studyForm.notes}
                    onChange={(e) => setStudyForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={2}
                    placeholder="Çalışma hakkında notlar..."
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowStudyForm(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Kaydet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}