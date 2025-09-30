import React, { useState } from 'react';
import { BookOpen, Plus, TrendingUp, Calendar, Target, Award, Clock, CheckCircle, AlertCircle, LogOut, CreditCard as Edit, Trash2, MoreVertical, Trophy, Star, Users, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Scatter, ScatterChart } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { useStudentData } from '../hooks/useStudentData';
import ExamForm from './ExamForm';
import HomeworkForm from './HomeworkForm';
import ExamTopicsSection from './ExamTopicsSection';
import AIInsights from './AIInsights';
import { getStudentInviteCode, signOut, deleteExamResult, updateHomework, deleteHomework, addStudySession, getWeeklyStudyGoal, createWeeklyStudyGoal, updateWeeklyStudyGoal, getWeeklyStudySessions } from '../lib/supabase';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'exams' | 'homeworks' | 'analysis'>('overview');
  const [showExamForm, setShowExamForm] = useState(false);
  const [showHomeworkForm, setShowHomeworkForm] = useState(false);
  const [showInviteCode, setShowInviteCode] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [editingExam, setEditingExam] = useState<any>(null);
  const [showExamMenu, setShowExamMenu] = useState<string | null>(null);
  const [showHomeworkMenu, setShowHomeworkMenu] = useState<string | null>(null);
  const [badges, setBadges] = useState<string[]>(['İlk Deneme', 'Haftalık Çalışan']);
  const [studyData, setStudyData] = useState([
    { day: 'Pzt', hours: 0 },
    { day: 'Sal', hours: 0 },
    { day: 'Çar', hours: 0 },
    { day: 'Per', hours: 0 },
    { day: 'Cum', hours: 0 },
    { day: 'Cmt', hours: 0 },
    { day: 'Paz', hours: 0 }
  ]);
  const [showStudyForm, setShowStudyForm] = useState(false);
  const [studyFormData, setStudyFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    hours: '',
    subject: '',
    notes: ''
  });
  const [chartFilter, setChartFilter] = useState<'all' | 'TYT' | 'AYT' | 'LGS'>('all');
  const [weeklyGoal, setWeeklyGoal] = useState<any>(null);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalFormData, setGoalFormData] = useState({
    weekly_hours_target: '25'
  });
  const [goalLoading, setGoalLoading] = useState(false);
  const [showJoinClassModal, setShowJoinClassModal] = useState(false);
  const [classInviteCodeInput, setClassInviteCodeInput] = useState('');
  const [showPaymentNotice, setShowPaymentNotice] = useState(true);
  const [showExamTopics, setShowExamTopics] = useState(false);

  const handleCreateWeeklyGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentData) return;

    setGoalLoading(true);
    try {
      const goalData = {
        student_id: studentData.id,
        weekly_hours_target: parseInt(goalFormData.weekly_hours_target),
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        is_active: true
      };

      if (weeklyGoal) {
        // Update existing goal
        const { error } = await updateWeeklyStudyGoal(weeklyGoal.id, goalData);
        if (error) throw error;
      } else {
        // Create new goal
        const { error } = await createWeeklyStudyGoal(goalData);
        if (error) throw error;
      }

      setShowGoalForm(false);
      
      // Immediately update local state
      const updatedGoal = weeklyGoal ? 
        { ...weeklyGoal, weekly_hours_target: parseInt(goalFormData.weekly_hours_target) } :
        {
          id: 'temp-id',
          student_id: studentData.id,
          weekly_hours_target: parseInt(goalFormData.weekly_hours_target),
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          is_active: true,
          created_at: new Date().toISOString()
        };
      
      setWeeklyGoal(updatedGoal);
      
      // Also reload from database to get the real ID
      setTimeout(async () => {
        const { data: goal } = await getWeeklyStudyGoal(studentData.id);
        if (goal) {
          setWeeklyGoal(goal);
        }
      }, 100);
      
      alert('Haftalık hedef başarıyla kaydedildi!');
    } catch (error) {
      console.error('Error saving weekly goal:', error);
      alert('Hedef kaydedilirken hata oluştu');
    } finally {
      setGoalLoading(false);
    }
  };

  const [weeklyStudyHours, setWeeklyStudyHours] = useState(0);
  
  const { user } = useAuth();
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

  // Calculate package pricing
  const getPackagePrice = () => {
    const packageType = user?.profile?.package_type || 'basic';
    const packages = {
      basic: { monthly: 200, yearly: 2000, name: 'Temel Paket' },
      advanced: { monthly: 300, yearly: 3000, name: 'Gelişmiş Paket' },
      professional: { monthly: 500, yearly: 5000, name: 'Profesyonel Paket' }
    };
    return packages[packageType as keyof typeof packages] || packages.basic;
  };

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentData || !classInviteCodeInput.trim()) return;

    try {
      const { joinClassWithCode } = await import('../lib/teacherApi');
      await joinClassWithCode(studentData.id, classInviteCodeInput.trim());
      
      alert('Sınıfa başarıyla katıldınız!');
      setShowJoinClassModal(false);
      setClassInviteCodeInput('');
      refetch();
    } catch (error: any) {
      alert('Sınıfa katılma hatası: ' + error.message);
    }
  };
  // Load weekly study goal and calculate hours
  React.useEffect(() => {
    const loadWeeklyData = async () => {
      if (!studentData) return;

      // Get current weekly goal
      const { data: goal } = await getWeeklyStudyGoal(studentData.id);
      
      if (goal) {
        setWeeklyGoal(goal);
        
        // Update form data with existing goal
        setGoalFormData({
          weekly_hours_target: goal.weekly_hours_target.toString()
        });
        
        // Calculate actual study hours for this week
        const { data: sessions } = await getWeeklyStudySessions(
          studentData.id,
          goal.start_date,
          goal.end_date
        );
        
        const totalHours = sessions?.reduce((sum: number, session: any) => {
          return sum + (session.duration_minutes || 0) / 60;
        }, 0) || 0;
        
        setWeeklyStudyHours(totalHours);
        
        // Update studyData for chart display
        const newStudyData = [
          { day: 'Pzt', hours: 0 },
          { day: 'Sal', hours: 0 },
          { day: 'Çar', hours: 0 },
          { day: 'Per', hours: 0 },
          { day: 'Cum', hours: 0 },
          { day: 'Cmt', hours: 0 },
          { day: 'Paz', hours: 0 }
        ];
        
        sessions?.forEach((session: any) => {
          const dayIndex = new Date(session.session_date).getDay();
          const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
          const dayName = dayNames[dayIndex];
          const dayData = newStudyData.find(d => d.day === dayName);
          if (dayData) {
            dayData.hours += (session.duration_minutes || 0) / 60;
          }
        });
        
        setStudyData(newStudyData);
      }
    };

    loadWeeklyData();
  }, [studentData]);

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      console.error('Logout error:', error);
    }
    // Auth hook will handle the state change automatically
  };

  const handleShowInviteCode = async () => {
    if (studentData) {
      const { data } = await getStudentInviteCode(studentData.id);
      if (data) {
        setInviteCode(data.invite_code);
        setShowInviteCode(true);
      }
    }
  };

  const handleDeleteExam = async (examId: string) => {
    if (confirm('Bu deneme sonucunu silmek istediğinizden emin misiniz?')) {
      try {
        const { error } = await deleteExamResult(examId);
        if (error) throw error;
        refetch();
        alert('Deneme sonucu silindi');
      } catch (error) {
        console.error('Error deleting exam:', error);
        alert('Silme işlemi başarısız');
      }
    }
  };

  const handleToggleHomework = async (homework: any) => {
    try {
      const updates = {
        completed: !homework.completed,
        completed_at: !homework.completed ? new Date().toISOString() : null
      };
      const { error } = await updateHomework(homework.id, updates);
      if (error) throw error;
      refetch();
    } catch (error) {
      console.error('Error updating homework:', error);
      alert('Güncelleme başarısız');
    }
  };

  const handleDeleteHomework = async (homeworkId: string) => {
    if (confirm('Bu ödevi silmek istediğinizden emin misiniz?')) {
      try {
        const { error } = await deleteHomework(homeworkId);
        if (error) throw error;
        refetch();
        alert('Ödev silindi');
      } catch (error) {
        console.error('Error deleting homework:', error);
        alert('Silme işlemi başarısız');
      }
    }
  };

  // Calculate real statistics from user's data
  const calculateStats = () => {
    const totalExams = examResults.length;
    const averageScore = examResults.length > 0 
      ? examResults.reduce((sum, exam) => sum + (exam.total_score || 0), 0) / examResults.length 
      : 0;
    const pendingHomeworks = homeworks.filter(hw => !hw.completed).length;
    
    // Calculate percentage improvement from last 2 exams
    let improvementPercent = 0;
    if (examResults.length >= 2) {
      const sortedExams = examResults.sort((a, b) => new Date(b.exam_date).getTime() - new Date(a.exam_date).getTime());
      const latest = sortedExams[0].total_score || 0;
      const previous = sortedExams[1].total_score || 0;
      if (previous > 0) {
        improvementPercent = ((latest - previous) / previous) * 100;
      }
      
      // Check for badge earning
      if (latest > previous && !badges.includes('Yükseliş Trendi')) {
        setBadges(prev => [...prev, 'Yükseliş Trendi']);
      }
    }

    const weeklyStudyHours = studyData.reduce((sum, day) => sum + day.hours, 0);

    return { totalExams, averageScore, pendingHomeworks, improvementPercent, weeklyStudyHours };
  };

  const stats = calculateStats();

  // Add study session handler
  const handleAddStudySession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentData || !studyFormData.hours) return;

    try {
      const sessionData = {
        student_id: studentData.id,
        subject: studyFormData.subject || 'Genel',
        duration_minutes: parseFloat(studyFormData.hours) * 60,
        session_date: studyFormData.date,
        notes: studyFormData.notes
      };

      const { error } = await addStudySession(sessionData);
      if (error) throw error;

      // Update local study data
      const dayIndex = new Date(studyFormData.date).getDay();
      const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
      const dayName = dayNames[dayIndex];
      
      setStudyData(prev => prev.map(day => 
        day.day === dayName 
          ? { ...day, hours: day.hours + parseFloat(studyFormData.hours) }
          : day
      ));

      setShowStudyForm(false);
      setStudyFormData({
        date: new Date().toISOString().split('T')[0],
        hours: '',
        subject: '',
        notes: ''
      });
      alert('Çalışma seansı eklendi!');
    } catch (error) {
      console.error('Error adding study session:', error);
      alert('Çalışma seansı eklenirken hata oluştu');
    }
  };

  // Prepare chart data from real exam results
  const filteredExamResults = chartFilter === 'all' 
    ? examResults 
    : examResults.filter(exam => exam.exam_type === chartFilter);

  const chartData = filteredExamResults
    .sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime())
    .slice(-10) // Last 10 exams
    .map((exam, index) => ({
      puan: exam.total_score || 0,
      examType: exam.exam_type,
      examName: exam.exam_name,
      color: `hsl(${(index * 36) % 360}, 70%, 50%)`
    }));

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

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Bu Ay Deneme</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalExams}</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Ortalama Puan</p>
              <p className="text-xl font-bold text-green-600">
                {stats.averageScore > 0 ? stats.averageScore.toFixed(1) : '0'}
              </p>
              <p className="text-xs text-gray-500">/ 500</p>
            </div>
            <Award className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Bekleyen Ödev</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingHomeworks}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Son Gelişim</p>
              <p className={`text-2xl font-bold ${stats.improvementPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.improvementPercent > 0 ? '+' : ''}{stats.improvementPercent.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">son denemenize göre</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Haftalık Çalışma</p>
              <p className="text-2xl font-bold text-blue-600">{weeklyStudyHours.toFixed(1)} saat</p>
              <p className="text-blue-600 text-sm">
                {weeklyGoal ? `Hedef: ${weeklyGoal.weekly_hours_target} saat (${Math.round((weeklyStudyHours / weeklyGoal.weekly_hours_target) * 100)}%)` : 'Bu hafta'}
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
          <div className="flex space-x-2 mt-2">
          <button
            onClick={() => setShowStudyForm(true)}
            className="mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
          >
            Çalışma Ekle
          </button>
          {!weeklyGoal && (
            <button
              onClick={() => setShowGoalForm(true)}
              className="mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
            >
              Hedef Belirle
            </button>
          )}
          {weeklyGoal && (
            <button
              onClick={() => setShowGoalForm(true)}
              className="mt-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200"
            >
              Hedef Güncelle
            </button>
          )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">Deneme İlerlemesi</h3>
      <select
        value={chartFilter}
        onChange={(e) => setChartFilter(e.target.value as any)}
        className="px-3 py-1 border border-gray-300 rounded text-sm"
      >
        <option value="all">Tümü</option>
        <option value="TYT">TYT</option>
        <option value="AYT">AYT</option>
        <option value="LGS">LGS</option>
      </select>
    </div>
    {chartData.length > 0 ? (
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip 
            formatter={(value, name, props) => [
              `${value} puan`,
              `${props.payload.examName} (${props.payload.examType})`
            ]}
          />
          {/* Sadece dot'lar - line kaldırıldı */}
          <Scatter 
            dataKey="puan" 
            fill="#3B82F6" 
            stroke="#3B82F6"
            strokeWidth={2}
            r={6}
            name="Puan"
          />
        </LineChart>
      </ResponsiveContainer>
    ) : (
      <div className="text-center py-16 text-gray-500">
        <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>{chartFilter === 'all' ? 'Grafik için deneme sonucu gerekli' : `${chartFilter} denemesi bulunamadı`}</p>
      </div>
    )}
  </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Yaklaşan Ödevler</h3>
          <div className="space-y-3">
            {homeworks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Henüz ödev eklenmemiş</p>
              </div>
            ) : (
              [...homeworks, ...classAssignments].slice(0, 4).map((homework, index) => (
              <div key={homework.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {homework.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{homework.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(homework.due_date).toLocaleDateString('tr-TR')}
                      {homework.subject && ` • ${homework.subject}`}
                    </p>
                  </div>
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderExams = () => (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Deneme Sonuçları</h3>
        <button 
          onClick={() => setShowExamForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          <span>Yeni Deneme</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {examResults.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Henüz deneme sonucu eklenmemiş</p>
            <button 
              onClick={() => setShowExamForm(true)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              İlk Deneme Sonucunu Ekle
            </button>
          </div>
        ) : (
          examResults.slice(0, 5).map((exam, index) => (
          <div key={index} className="border rounded-lg p-4 relative">
            <div className="flex justify-between items-start mb-3 pr-8">
              <div>
                <h4 className="font-semibold">{exam.exam_name}</h4>
                <p className="text-sm text-gray-600">{new Date(exam.exam_date).toLocaleDateString('tr-TR')}</p>
              </div>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {exam.exam_type}: {exam.total_score ? Math.round(exam.total_score) : 'N/A'}
              </span>
            </div>
            
            {/* Exam Menu */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowExamMenu(showExamMenu === exam.id ? null : exam.id)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </button>
              
              {showExamMenu === exam.id && (
                <div className="absolute right-0 top-8 bg-white border rounded-lg shadow-lg z-10 min-w-[120px]">
                  <button
                    onClick={() => {
                      setEditingExam(exam);
                      setShowExamForm(true);
                      setShowExamMenu(null);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Düzenle</span>
                  </button>
                  <button
                    onClick={() => { handleDeleteExam(exam.id); setShowExamMenu(null); }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 text-red-600 flex items-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Sil</span>
                  </button>
                </div>
              )}
            </div>
            
            <div className="text-sm text-gray-600">
              <p>Toplam Puan: <span className="font-semibold">{exam.total_score ? Math.round(exam.total_score) : 'N/A'}</span></p>
              {exam.notes && <p className="mt-1 text-xs">{exam.notes}</p>}
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <AIInsights examResults={examResults} studentData={studentData} />
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Öğrenci Paneli</h1>
            <p className="text-gray-600">
              Hoş geldin, {user?.profile?.full_name || 'Öğrenci'}! İlerlemeni takip etmeye devam et.
            </p>
            <button
              onClick={handleShowInviteCode}
              className="mt-2 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200"
            >
              Veli Davet Kodu
            </button>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Çıkış Yap</span>
            </button>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {getPackagePrice().name}
              </p>
              <p className="text-xs text-gray-600">
                Aylık {getPackagePrice().monthly}₺ / Yıllık {getPackagePrice().yearly}₺
              </p>
            </div>
          </div>
        </div>

        {/* Payment Notice */}
        {showPaymentNotice && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-yellow-800 font-medium">Ödeme Bildirimi</h3>
                <p className="text-yellow-700 text-sm mt-1">
                  <strong>{getPackagePrice().name}</strong> seçtiniz. 
                  Aylık <strong>{getPackagePrice().monthly}₺</strong> veya 
                  Yıllık <strong>{getPackagePrice().yearly}₺</strong> ödemeniz beklenmektedir.
                </p>
                <p className="text-yellow-600 text-xs mt-2">
                  ⚠️ Ödeme yapılmadığı takdirde hesabınız silinecektir.
                </p>
              </div>
              <button
                onClick={() => setShowPaymentNotice(false)}
                className="text-yellow-600 hover:text-yellow-800"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="flex space-x-1 mb-8">
          {[
            { key: 'overview', label: 'Genel Bakış', icon: TrendingUp },
            { key: 'exams', label: 'Denemeler', icon: BookOpen },
            { key: 'homeworks', label: 'Ödevler', icon: Calendar },
            { key: 'classes', label: 'Sınıflarım', icon: Users },
            { key: 'analysis', label: 'AI Analiz', icon: Target },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'exams' && renderExams()}
        {activeTab === 'analysis' && renderAnalysis()}
        {activeTab === 'classes' && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Sınıflarım</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setShowJoinClassModal(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4" />
                  <span>Sınıfa Katıl</span>
                </button>
                <button
                  onClick={() => setShowExamTopics(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
                >
                  <Target className="h-4 w-4" />
                  <span>Çıkmış Konular</span>
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {studentClasses.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Henüz hiçbir sınıfa katılmadınız</p>
                  {classAnnouncements.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-blue-800 text-sm font-medium">Sınıf Duyuruları</p>
                      <div className="mt-2 space-y-2">
                        {classAnnouncements.slice(0, 3).map((announcement) => (
                          <div key={announcement.id} className="text-left p-2 bg-white rounded border">
                            <p className="font-medium text-sm">{announcement.title}</p>
                            <p className="text-xs text-gray-600">{announcement.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <button 
                    onClick={() => setShowJoinClassModal(true)}
                    className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                  >
                    İlk Sınıfa Katıl
                  </button>
                </div>
              ) : (
                studentClasses.map((classData) => (
                  <div key={classData.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold">{classData.classes?.class_name}</h4>
                        <p className="text-sm text-gray-600">
                          Öğretmen: {classData.classes?.teachers?.full_name}
                        </p>
                        {classData.classes?.teachers?.school_name && (
                          <p className="text-xs text-gray-500">
                            {classData.classes.teachers.school_name}
                          </p>
                        )}
                      </div>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                        Aktif
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      <p>Katılım Tarihi: {new Date(classData.joined_at).toLocaleDateString('tr-TR')}</p>
                    </div>
                    
                    {/* Show class assignments for this class */}
                    {classAssignments.filter(a => a.class_id === classData.class_id).length > 0 && (
                      <div className="mt-3 p-2 bg-blue-50 rounded">
                        <p className="text-blue-800 text-sm font-medium mb-2">📝 Sınıf Ödevleri:</p>
                        {classAssignments
                          .filter(a => a.class_id === classData.class_id)
                          .slice(0, 3)
                          .map((assignment) => (
                            <div key={assignment.id} className="text-sm text-blue-700 mb-1 p-2 bg-white rounded border-l