import React, { useState } from 'react';
import { Plus, BookOpen, Bell, Trophy, Users, ArrowLeft } from 'lucide-react';
import { addClassAssignment, addClassAnnouncement, addClassExam, addClassExamResult } from '../lib/teacherApi';

interface ClassManagementPanelProps {
  classData: any;
  onBack: () => void;
  onRefresh: () => void;
}

export default function ClassManagementPanel({ classData, onBack, onRefresh }: ClassManagementPanelProps) {
  const [activeTab, setActiveTab] = useState<'assignments' | 'announcements' | 'exams'>('assignments');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get data from props
  const assignments = classData?.class_assignments || [];
  const announcements = classData?.class_announcements || [];
  const exams = classData?.class_exams || [];

  // Assignment form
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    subject: '',
    due_date: ''
  });

  // Announcement form
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    type: 'info' as 'info' | 'warning' | 'success' | 'error'
  });

  // Exam form
  const [examForm, setExamForm] = useState({
    exam_name: '',
    exam_type: '',
    exam_date: '',
    total_questions: ''
  });

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addClassAssignment({
        class_id: classData.id,
        teacher_id: classData.teacher_id,
        ...assignmentForm
      });

      alert('Ödev başarıyla eklendi!');
      setShowForm(false);
      setAssignmentForm({ title: '', description: '', subject: '', due_date: '' });
      // Refresh the parent component
      onRefresh();
      // Also refresh current view by reloading the page
      window.location.reload();
    } catch (error: any) {
      alert('Ödev ekleme hatası: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addClassAnnouncement({
        class_id: classData.id,
        teacher_id: classData.teacher_id,
        ...announcementForm
      });

      alert('Duyuru başarıyla eklendi!');
      setShowForm(false);
      setAnnouncementForm({ title: '', content: '', type: 'info' });
      // Refresh the parent component
      onRefresh();
      // Also refresh current view by reloading the page
      window.location.reload();
    } catch (error: any) {
      alert('Duyuru ekleme hatası: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addClassExam({
        class_id: classData.id,
        teacher_id: classData.teacher_id,
        exam_name: examForm.exam_name,
        exam_type: examForm.exam_type,
        exam_date: examForm.exam_date,
        total_questions: examForm.total_questions ? parseInt(examForm.total_questions) : 0
      });

      alert('Sınav başarıyla eklendi!');
      setShowForm(false);
      setExamForm({ exam_name: '', exam_type: '', exam_date: '', total_questions: '' });
      // Refresh the parent component
      onRefresh();
      // Also refresh current view by reloading the page
      window.location.reload();
    } catch (error: any) {
      alert('Sınav ekleme hatası: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const subjects = [
    'Matematik', 'Türkçe', 'Fen Bilimleri', 'Sosyal Bilgiler', 'İngilizce',
    'Fizik', 'Kimya', 'Biyoloji', 'Tarih', 'Coğrafya', 'Edebiyat', 'Diğer'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Geri</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{classData.class_name} - Yönetim</h1>
              <p className="text-gray-600">Sınıfınızı yönetin ve içerik ekleyin</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          {[
            { key: 'assignments', label: 'Ödevler', icon: BookOpen },
            { key: 'announcements', label: 'Duyurular', icon: Bell },
            { key: 'exams', label: 'Sınavlar', icon: Trophy },
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

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">İçerikler yükleniyor...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">
                {activeTab === 'assignments' && 'Ödev Yönetimi'}
                {activeTab === 'announcements' && 'Duyuru Yönetimi'}
                {activeTab === 'exams' && 'Sınav Yönetimi'}
              </h3>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>
                  {activeTab === 'assignments' && 'Yeni Ödev'}
                  {activeTab === 'announcements' && 'Yeni Duyuru'}
                  {activeTab === 'exams' && 'Yeni Sınav'}
                </span>
              </button>
            </div>

            {/* Content List */}
            <div className="space-y-4">
              {activeTab === 'assignments' && (
                assignments.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Henüz ödev eklenmemiş</p>
                  </div>
                ) : (
                  assignments.map((assignment) => (
                    <div key={assignment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{assignment.title}</h4>
                          <p className="text-blue-600 font-medium">{assignment.subject}</p>
                          {assignment.description && (
                            <p className="text-gray-600 mt-2">{assignment.description}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                            <span>Son Teslim: {new Date(assignment.due_date).toLocaleDateString('tr-TR')}</span>
                            <span>Oluşturulma: {new Date(assignment.created_at).toLocaleDateString('tr-TR')}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded border border-blue-600 hover:bg-blue-50">
                            Düzenle
                          </button>
                          <button className="text-red-600 hover:text-red-800 px-3 py-1 rounded border border-red-600 hover:bg-red-50">
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )
              )}

              {activeTab === 'announcements' && (
                announcements.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Bell className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Henüz duyuru eklenmemiş</p>
                  </div>
                ) : (
                  announcements.map((announcement) => (
                    <div key={announcement.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-lg">{announcement.title}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              announcement.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                              announcement.type === 'success' ? 'bg-green-100 text-green-800' :
                              announcement.type === 'error' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {announcement.type === 'warning' ? 'Uyarı' :
                               announcement.type === 'success' ? 'Başarı' :
                               announcement.type === 'error' ? 'Hata' : 'Bilgi'}
                            </span>
                          </div>
                          <p className="text-gray-700">{announcement.content}</p>
                          <div className="mt-3 text-sm text-gray-500">
                            <span>Oluşturulma: {new Date(announcement.created_at).toLocaleDateString('tr-TR')}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded border border-blue-600 hover:bg-blue-50">
                            Düzenle
                          </button>
                          <button className="text-red-600 hover:text-red-800 px-3 py-1 rounded border border-red-600 hover:bg-red-50">
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )
              )}

              {activeTab === 'exams' && (
                exams.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Henüz sınav eklenmemiş</p>
                  </div>
                ) : (
                  exams.map((exam) => (
                    <div key={exam.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{exam.exam_name}</h4>
                          <p className="text-purple-600 font-medium">{exam.exam_type}</p>
                          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                            <span>Sınav Tarihi: {new Date(exam.exam_date).toLocaleDateString('tr-TR')}</span>
                            {exam.total_questions > 0 && (
                              <span>Soru Sayısı: {exam.total_questions}</span>
                            )}
                            <span>Oluşturulma: {new Date(exam.created_at).toLocaleDateString('tr-TR')}</span>
                          </div>
                          {exam.class_exam_results && exam.class_exam_results.length > 0 && (
                            <div className="mt-2 text-sm text-green-600">
                              {exam.class_exam_results.length} öğrenci sonucu girildi
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-green-600 hover:text-green-800 px-3 py-1 rounded border border-green-600 hover:bg-green-50">
                            Sonuçlar
                          </button>
                          <button className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded border border-blue-600 hover:bg-blue-50">
                            Düzenle
                          </button>
                          <button className="text-red-600 hover:text-red-800 px-3 py-1 rounded border border-red-600 hover:bg-red-50">
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Forms */}
      {showForm && activeTab === 'assignments' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Yeni Ödev Ekle</h3>
            <form onSubmit={handleSubmitAssignment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ödev Başlığı *</label>
                <input
                  type="text"
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ders *</label>
                <select
                  value={assignmentForm.subject}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Ders seçin</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Son Teslim Tarihi *</label>
                <input
                  type="date"
                  value={assignmentForm.due_date}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, due_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <textarea
                  value={assignmentForm.description}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Ekleniyor...' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showForm && activeTab === 'announcements' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Yeni Duyuru Ekle</h3>
            <form onSubmit={handleSubmitAnnouncement} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duyuru Başlığı *</label>
                <input
                  type="text"
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tür</label>
                <select
                  value={announcementForm.type}
                  onChange={(e) => setAnnouncementForm(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="info">Bilgi</option>
                  <option value="warning">Uyarı</option>
                  <option value="success">Başarı</option>
                  <option value="error">Hata</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">İçerik *</label>
                <textarea
                  value={announcementForm.content}
                  onChange={(e) => setAnnouncementForm(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={4}
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Ekleniyor...' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showForm && activeTab === 'exams' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Yeni Sınav Ekle</h3>
            <form onSubmit={handleSubmitExam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sınav Adı *</label>
                <input
                  type="text"
                  value={examForm.exam_name}
                  onChange={(e) => setExamForm(prev => ({ ...prev, exam_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sınav Türü *</label>
                <select
                  value={examForm.exam_type}
                  onChange={(e) => setExamForm(prev => ({ ...prev, exam_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Tür seçin</option>
                  <option value="TYT">TYT</option>
                  <option value="AYT">AYT</option>
                  <option value="LGS">LGS</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Yazılı">Yazılı</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sınav Tarihi *</label>
                <input
                  type="date"
                  value={examForm.exam_date}
                  onChange={(e) => setExamForm(prev => ({ ...prev, exam_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Toplam Soru Sayısı</label>
                <input
                  type="number"
                  value={examForm.total_questions}
                  onChange={(e) => setExamForm(prev => ({ ...prev, total_questions: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  min="1"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Ekleniyor...' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}