import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, BookOpen, Bell, Trophy, Users, ArrowLeft, CreditCard as Edit, Trash2, X, Upload, Download, BarChart3 } from 'lucide-react';
import { 
  addClassAssignment, 
  addClassAnnouncement, 
  addClassExam, 
  getClassAssignments, 
  getClassAnnouncements, 
  getClassExams,
  updateClassAssignment,
  updateClassAnnouncement,
  updateClassExam,
  deleteClassAssignment,
  deleteClassAnnouncement,
  deleteClassExam
} from '../lib/teacherApi';

interface ClassManagementPanelProps {
  classData: any;
  onBack: () => void;
  onRefresh: () => void;
}

export default function ClassManagementPanel({ classData, onBack, onRefresh }: ClassManagementPanelProps) {
  const [activeTab, setActiveTab] = useState<'assignments' | 'announcements' | 'exams'>('assignments');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedResult, setSelectedResult] = useState<any>(null);

  // Load fresh data when component mounts
  useEffect(() => {
    loadClassContent();
  }, [classData.id]);

  const loadClassContent = async () => {
    setDataLoading(true);
    try {
      const [assignmentsRes, announcementsRes, examsRes] = await Promise.all([
        getClassAssignments(classData.id),
        getClassAnnouncements(classData.id),
        getClassExams(classData.id)
      ]);

      setAssignments(assignmentsRes.data || []);
      setAnnouncements(announcementsRes.data || []);
      setExams(examsRes.data || []);
    } catch (error) {
      console.error('Error loading class content:', error);
    } finally {
      setDataLoading(false);
    }
  };

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

  // Edit form state
  const [editForm, setEditForm] = useState<any>({});

  // Button handlers
  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setEditForm({ ...item });
    setShowEditModal(true);
  };

  const handleDelete = (item: any) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleResults = (exam: any) => {
    setSelectedItem(exam);
    setShowResultsModal(true);
  };

  // Edit submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);

    try {
      if (activeTab === 'assignments') {
        await updateClassAssignment(selectedItem.id, editForm);
        alert('Ödev başarıyla güncellendi!');
      } else if (activeTab === 'announcements') {
        await updateClassAnnouncement(selectedItem.id, editForm);
        alert('Duyuru başarıyla güncellendi!');
      } else if (activeTab === 'exams') {
        await updateClassExam(selectedItem.id, editForm);
        alert('Sınav başarıyla güncellendi!');
      }

      setShowEditModal(false);
      await loadClassContent();
    } catch (error: any) {
      alert('Güncelleme hatası: ' + error.message);
    } finally {
      setEditLoading(false);
    }
  };

  // Delete submission
  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);

    try {
      if (activeTab === 'assignments') {
        await deleteClassAssignment(selectedItem.id);
        alert('Ödev başarıyla silindi!');
      } else if (activeTab === 'announcements') {
        await deleteClassAnnouncement(selectedItem.id);
        alert('Duyuru başarıyla silindi!');
      } else if (activeTab === 'exams') {
        await deleteClassExam(selectedItem.id);
        alert('Sınav başarıyla silindi!');
      }

      setShowDeleteModal(false);
      await loadClassContent();
    } catch (error: any) {
      alert('Silme hatası: ' + error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

const handleFileUpload = async () => {
  if (!selectedFile || !selectedItem) return;

  setUploadLoading(true);
  try {
    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `${selectedItem.id}_${Date.now()}.${fileExt}`;
    const filePath = `exam-results/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('exam-results')
      .upload(filePath, selectedFile);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('exam-results')
      .getPublicUrl(filePath);

    const { error: dbError } = await supabase
      .from('class_exam_results')
      .upsert({
        exam_id: selectedItem.id,
        student_id: null, // Tüm sınıf için
        result_file_url: urlData.publicUrl,
        result_file_name: selectedFile.name,
        uploaded_at: new Date().toISOString(),
        score: 0,
        correct_answers: 0,
        wrong_answers: 0,
        empty_answers: 0
      }, {
        onConflict: 'exam_id,student_id'
      });

    if (dbError) throw dbError;

    alert('Dosya başarıyla yüklendi!');
    setSelectedFile(null);
    setShowResultsModal(false);
    onRefresh(); // Listeyi yenile
  } catch (error: any) {
    console.error('Dosya yükleme hatası:', error);
    alert('Dosya yüklenirken hata oluştu: ' + error.message);
  } finally {
    setUploadLoading(false);
  }
};

  // Dosya silme fonksiyonu
const handleFileDelete = async (resultId: string) => {
  if (!confirm('Bu dosyayı silmek istediğinizden emin misiniz?')) return;

  try {
    // 1. Database'den sil
    const { error: dbError } = await supabase
      .from('class_exam_results')
      .delete()
      .eq('id', resultId);

    if (dbError) throw dbError;

    const { error: storageError } = await supabase.storage
    .from('exam-results')
    .remove([filePath]);

    alert('Dosya başarıyla silindi!');
    onRefresh();
  } catch (error: any) {
    console.error('Dosya silme hatası:', error);
    alert('Dosya silinirken hata oluştu: ' + error.message);
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
      await loadClassContent();
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
      await loadClassContent();
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

          {dataLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Veriler yükleniyor...</p>
            </div>
          ) : (
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
                          <button 
                            onClick={() => handleEdit(assignment)}
                            className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded border border-blue-600 hover:bg-blue-50 flex items-center space-x-1"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Düzenle</span>
                          </button>
                          <button 
                            onClick={() => handleDelete(assignment)}
                            className="text-red-600 hover:text-red-800 px-3 py-1 rounded border border-red-600 hover:bg-red-50 flex items-center space-x-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Sil</span>
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
                          <button 
                            onClick={() => handleEdit(announcement)}
                            className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded border border-blue-600 hover:bg-blue-50 flex items-center space-x-1"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Düzenle</span>
                          </button>
                          <button 
                            onClick={() => handleDelete(announcement)}
                            className="text-red-600 hover:text-red-800 px-3 py-1 rounded border border-red-600 hover:bg-red-50 flex items-center space-x-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Sil</span>
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
                          <button 
                            onClick={() => handleResults(exam)}
                            className="text-green-600 hover:text-green-800 px-3 py-1 rounded border border-green-600 hover:bg-green-50 flex items-center space-x-1"
                          >
                            <BarChart3 className="h-4 w-4" />
                            <span>Sonuçlar</span>
                          </button>
                          <button 
                            onClick={() => handleEdit(exam)}
                            className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded border border-blue-600 hover:bg-blue-50 flex items-center space-x-1"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Düzenle</span>
                          </button>
                          <button 
                            onClick={() => handleDelete(exam)}
                            className="text-red-600 hover:text-red-800 px-3 py-1 rounded border border-red-600 hover:bg-red-50 flex items-center space-x-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Sil</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {activeTab === 'assignments' && 'Ödev Düzenle'}
                  {activeTab === 'announcements' && 'Duyuru Düzenle'}
                  {activeTab === 'exams' && 'Sınav Düzenle'}
                </h3>
                <button onClick={() => setShowEditModal(false)}>
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              
              <form onSubmit={handleEditSubmit} className="space-y-4">
                {activeTab === 'assignments' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ödev Başlığı</label>
                      <input
                        type="text"
                        value={editForm.title || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ders</label>
                      <select
                        value={editForm.subject || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, subject: e.target.value }))}
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Son Teslim Tarihi</label>
                      <input
                        type="date"
                        value={editForm.due_date || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, due_date: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                      <textarea
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        rows={3}
                      />
                    </div>
                  </>
                )}

                {activeTab === 'announcements' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duyuru Başlığı</label>
                      <input
                        type="text"
                        value={editForm.title || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tür</label>
                      <select
                        value={editForm.type || 'info'}
                        onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="info">Bilgi</option>
                        <option value="warning">Uyarı</option>
                        <option value="success">Başarı</option>
                        <option value="error">Hata</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
                      <textarea
                        value={editForm.content || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        rows={4}
                        required
                      />
                    </div>
                  </>
                )}

                {activeTab === 'exams' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sınav Adı</label>
                      <input
                        type="text"
                        value={editForm.exam_name || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, exam_name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sınav Türü</label>
                      <select
                        value={editForm.exam_type || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, exam_type: e.target.value }))}
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sınav Tarihi</label>
                      <input
                        type="date"
                        value={editForm.exam_date || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, exam_date: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Toplam Soru Sayısı</label>
                      <input
                        type="number"
                        value={editForm.total_questions || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, total_questions: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        min="1"
                      />
                    </div>
                  </>
                )}

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {editLoading ? 'Güncelleniyor...' : 'Güncelle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-red-600">Silme Onayı</h3>
                <button onClick={() => setShowDeleteModal(false)}>
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700">
                  <strong>{selectedItem?.title || selectedItem?.exam_name}</strong> öğesini silmek istediğinizden emin misiniz?
                </p>
                <p className="text-red-600 text-sm mt-2">Bu işlem geri alınamaz!</p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
                >
                  İptal
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleteLoading}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {deleteLoading ? 'Siliniyor...' : 'Sil'}
                </button>
              </div>
            </div>
          </div>
        )}

{/* Results Modal */}
{showResultsModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">
          {selectedItem?.exam_name} - Sonuçlar ve Dosya Yükleme
        </h3>
        <button onClick={() => setShowResultsModal(false)}>
          <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        </button>
      </div>

      {/* Mevcut Dosyalar */}
      {selectedItem?.class_exam_results && selectedItem.class_exam_results.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-green-600" />
            Yüklenmiş Dosyalar
          </h4>
          <div className="space-y-3">
            {selectedItem.class_exam_results
              .filter((result: any) => result.result_file_url) // Sadece dosyası olanları göster
              .map((result: any) => (
                <div key={result.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {result.result_file_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(result.uploaded_at).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={result.result_file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Görüntüle
                    </a>
                    <button
                      onClick={() => handleFileDelete(result.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Yeni Dosya Yükleme */}
      <div className="mb-8 p-4 border-2 border-dashed border-gray-300 rounded-lg">
        <h4 className="font-semibold mb-4 flex items-center">
          <Upload className="h-5 w-5 mr-2 text-blue-600" />
          Yeni Sınav Sonucu Dosyası Yükle
        </h4>
        <div className="space-y-4">
          <div>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.pdf,.docx,.xlsx"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Desteklenen formatlar: PNG, JPG, PDF, DOCX, XLSX (Max: 10MB)
            </p>
          </div>
          {selectedFile && (
            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-blue-800">{selectedFile.name}</span>
                <span className="text-xs text-blue-600">
                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <button
                onClick={handleFileUpload}
                disabled={uploadLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {uploadLoading ? 'Yükleniyor...' : 'Yükle'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Öğrenci Sonuçları Tablosu */}
      <div>
        <h4 className="font-semibold mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
          Öğrenci Sonuçları
        </h4>
        {selectedItem?.class_exam_results && selectedItem.class_exam_results.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Sıra</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Öğrenci</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Puan</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Doğru</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Yanlış</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Boş</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Dosya</th>
                </tr>
              </thead>
              <tbody>
                {selectedItem.class_exam_results
                  .sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
                  .map((result: any, index: number) => (
                    <tr key={result.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 font-medium">
                        {result.students?.profiles?.full_name || 'Genel Sınav Sonucu'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 font-semibold text-blue-600">
                        {result.score ? result.score.toFixed(1) : '0'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-green-600">
                        {result.correct_answers || 0}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-red-600">
                        {result.wrong_answers || 0}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-600">
                        {result.empty_answers || 0}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {result.result_file_url ? (
                          <div className="flex space-x-2">
                            <a
                              href={result.result_file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                              Görüntüle
                            </a>
                            <button
                              onClick={() => handleFileDelete(result.id)}
                              className="text-red-600 hover:text-red-800 text-xs"
                            >
                              Sil
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">Dosya yok</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Henüz sınav sonucu girilmemiş</p>
          </div>
        )}
      </div>
    </div>
  </div>
)}

        {/* Add Forms */}
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
    </div>
  );
}