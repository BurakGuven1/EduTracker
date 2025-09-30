import React, { useState } from 'react';
import { TrendingUp, BookOpen, BarChart3, Lock, Crown, Star, Search } from 'lucide-react';

interface ExamTopicsSectionProps {
  user?: any;
  hasClassViewerSession?: boolean;
  onUpgrade: () => void;
}

// TYT-AYT Çıkmış Konular Veritabanı
const examTopics = {
  TYT_Matematik: {
    2018: ['Fonksiyonlar', 'Trigonometri', 'Logaritma', 'Diziler', 'Limit'],
    2019: ['Türev', 'İntegral', 'Analitik Geometri', 'Olasılık', 'İstatistik'],
    2020: ['Fonksiyonlar', 'Polinomlar', 'Üstel Fonksiyonlar', 'Trigonometri', 'Limit'],
    2021: ['Türev', 'İntegral', 'Diziler', 'Seriler', 'Analitik Geometri'],
    2022: ['Logaritma', 'Üstel Fonksiyonlar', 'Trigonometri', 'Olasılık', 'İstatistik'],
    2023: ['Fonksiyonlar', 'Türev', 'İntegral', 'Limit', 'Süreklilik'],
    2024: ['Polinomlar', 'Diziler', 'Analitik Geometri', 'Trigonometri', 'Olasılık'],
    2025: ['Türev', 'İntegral', 'Logaritma', 'Üstel Fonksiyonlar', 'İstatistik']
  },
  TYT_Turkce: {
    2018: ['Anlam Bilgisi', 'Cümle Bilgisi', 'Paragraf', 'Anlatım Bozuklukları', 'Yazım Kuralları'],
    2019: ['Sözcük Türleri', 'Cümle Ögeleri', 'Paragraf', 'Noktalama', 'Anlatım Teknikleri'],
    2020: ['Anlam Bilgisi', 'Fiil Çekimi', 'Paragraf', 'Yazım Kuralları', 'Anlatım Bozuklukları'],
    2021: ['Sözcük Türleri', 'Cümle Bilgisi', 'Paragraf', 'Noktalama', 'Anlatım Teknikleri'],
    2022: ['Anlam Bilgisi', 'Fiil Çekimi', 'Paragraf', 'Yazım Kuralları', 'Anlatım Bozuklukları'],
    2023: ['Sözcük Türleri', 'Cümle Ögeleri', 'Paragraf', 'Noktalama', 'Anlatım Teknikleri'],
    2024: ['Anlam Bilgisi', 'Cümle Bilgisi', 'Paragraf', 'Yazım Kuralları', 'Anlatım Bozuklukları'],
    2025: ['Sözcük Türleri', 'Fiil Çekimi', 'Paragraf', 'Noktalama', 'Anlatım Teknikleri']
  },
  AYT_Matematik: {
    2018: ['Temel Kavramlar', 'Üstel Fonksiyon, Logaritma Fonksiyonu', 'Yönlü Açılar, Trigonometrik Fonksiyonlar', 'Analitik Geometri', 'İntegral', 'Türev', 'Limit ve Süreklilik', 'Diziler', 'Olasılık'],
    2019: ['Temel Kavramlar', 'Üstel Fonksiyon, Logaritma Fonksiyonu', 'Yönlü Açılar, Trigonometrik Fonksiyonlar', 'Analitik Geometri', 'İntegral', 'Türev', 'Limit ve Süreklilik', 'Diziler', 'Olasılık'],
    2020: ['Temel Kavramlar', 'Üstel Fonksiyon, Logaritma Fonksiyonu', 'Yönlü Açılar, Trigonometrik Fonksiyonlar', 'Analitik Geometri', 'İntegral', 'Türev', 'Limit ve Süreklilik', 'Diziler', 'Olasılık'],
    2021: ['Temel Kavramlar', 'Üstel Fonksiyon, Logaritma Fonksiyonu', 'Yönlü Açılar, Trigonometrik Fonksiyonlar', 'Analitik Geometri', 'İntegral', 'Türev', 'Limit ve Süreklilik', 'Diziler', 'Olasılık'],
    2022: ['Temel Kavramlar', 'Üstel Fonksiyon, Logaritma Fonksiyonu', 'Yönlü Açılar, Trigonometrik Fonksiyonlar', 'Analitik Geometri', 'İntegral', 'Türev', 'Limit ve Süreklilik', 'Diziler', 'Olasılık'],
    2023: ['Temel Kavramlar', 'Üstel Fonksiyon, Logaritma Fonksiyonu', 'Yönlü Açılar, Trigonometrik Fonksiyonlar', 'Analitik Geometri', 'İntegral', 'Türev', 'Limit ve Süreklilik', 'Diziler', 'Olasılık'],
    2024: ['Temel Kavramlar', 'Üstel Fonksiyon, Logaritma Fonksiyonu', 'Yönlü Açılar, Trigonometrik Fonksiyonlar', 'Analitik Geometri', 'İntegral', 'Türev', 'Limit ve Süreklilik', 'Diziler', 'Olasılık'],
    2025: ['Temel Kavramlar', 'Üstel Fonksiyon, Logaritma Fonksiyonu', 'Yönlü Açılar, Trigonometrik Fonksiyonlar', 'Analitik Geometri', 'İntegral', 'Türev', 'Limit ve Süreklilik', 'Diziler', 'Olasılık']
  },
  AYT_Fizik: {
    2018: ['Elektrik ve Manyetizma', 'Optik', 'Modern Fizik', 'Dalgalar', 'Termodinamik'],
    2019: ['Mekanik', 'Elektrik', 'Optik', 'Atom Fiziği', 'Dalgalar'],
    2020: ['Kuvvet ve Hareket', 'Elektrik ve Manyetizma', 'Optik', 'Modern Fizik', 'Dalgalar'],
    2021: ['Mekanik', 'Elektrik', 'Optik', 'Termodinamik', 'Atom Fiziği'],
    2022: ['Kuvvet ve Hareket', 'Elektrik ve Manyetizma', 'Optik', 'Modern Fizik', 'Dalgalar'],
    2023: ['Mekanik', 'Elektrik', 'Optik', 'Termodinamik', 'Atom Fiziği'],
    2024: ['Kuvvet ve Hareket', 'Elektrik ve Manyetizma', 'Optik', 'Modern Fizik', 'Dalgalar'],
    2025: ['Mekanik', 'Elektrik', 'Optik', 'Termodinamik', 'Atom Fiziği']
  },
  AYT_Kimya: {
    2018: ['Organik Kimya', 'Asit-Baz', 'Elektrokimya', 'Kimyasal Denge', 'Termokimya'],
    2019: ['Atom Yapısı', 'Periyodik Sistem', 'Kimyasal Bağlar', 'Organik Kimya', 'Elektrokimya'],
    2020: ['Mol Kavramı', 'Asit-Baz', 'Organik Kimya', 'Kimyasal Denge', 'Elektrokimya'],
    2021: ['Atom Yapısı', 'Periyodik Sistem', 'Kimyasal Bağlar', 'Organik Kimya', 'Termokimya'],
    2022: ['Mol Kavramı', 'Asit-Baz', 'Organik Kimya', 'Kimyasal Denge', 'Elektrokimya'],
    2023: ['Atom Yapısı', 'Periyodik Sistem', 'Kimyasal Bağlar', 'Organik Kimya', 'Termokimya'],
    2024: ['Mol Kavramı', 'Asit-Baz', 'Organik Kimya', 'Kimyasal Denge', 'Elektrokimya'],
    2025: ['Atom Yapısı', 'Periyodik Sistem', 'Kimyasal Bağlar', 'Organik Kimya', 'Termokimya']
  },
  AYT_Biyoloji: {
    2018: ['Hücre Bölünmesi', 'Kalıtım', 'Ekoloji', 'Sinir Sistemi', 'Dolaşım Sistemi'],
    2019: ['Hücre Yapısı', 'Fotosentez', 'Solunum', 'Kalıtım', 'Ekoloji'],
    2020: ['Hücre Bölünmesi', 'Protein Sentezi', 'Kalıtım', 'Sinir Sistemi', 'Ekoloji'],
    2021: ['Hücre Yapısı', 'Fotosentez', 'Solunum', 'Kalıtım', 'Dolaşım Sistemi'],
    2022: ['Hücre Bölünmesi', 'Protein Sentezi', 'Kalıtım', 'Sinir Sistemi', 'Ekoloji'],
    2023: ['Hücre Yapısı', 'Fotosentez', 'Solunum', 'Kalıtım', 'Dolaşım Sistemi'],
    2024: ['Hücre Bölünmesi', 'Protein Sentezi', 'Kalıtım', 'Sinir Sistemi', 'Ekoloji'],
    2025: ['Hücre Yapısı', 'Fotosentez', 'Solunum', 'Kalıtım', 'Dolaşım Sistemi']
  }
};

// Premium erişim kontrolü
const hasPremiumAccess = (user: any, hasClassViewerSession: boolean = false) => {
  // Profesyonel paket sahipleri tam erişim
  if (user?.profile?.package_type === 'professional') return true;
  
  // Check if user is viewing via class code
  if (hasClassViewerSession) return true;
  if (user?.isParentLogin && user.connectedStudents) {
    return user.connectedStudents?.some((student: any) =>
      student.profiles?.package_type === 'professional'
    );
  }
  
  return false;
};

const freeYears = ['2018', '2019', '2020']; // Ücretsiz kullanıcılar için

function ExamTopicsSection({ user, hasClassViewerSession = false, onUpgrade }: ExamTopicsSectionProps) {
  const [selectedSubject, setSelectedSubject] = useState('AYT_Matematik');
  const [searchTerm, setSearchTerm] = useState('');

  const isPremium = hasPremiumAccess(user, hasClassViewerSession);
  const availableYears = isPremium ? Object.keys(examTopics[selectedSubject as keyof typeof examTopics]) : freeYears;

  // Konu istatistikleri hesaplama - sadece erişilebilir yıllar için
  const calculateTopicStats = () => {
    const topicCounts: Record<string, { count: number; years: string[] }> = {};
    const subjectData = examTopics[selectedSubject as keyof typeof examTopics];
    
    availableYears.forEach(year => {
      const topics = subjectData[year as keyof typeof subjectData] || [];
      topics.forEach(topic => {
        if (!topicCounts[topic]) {
          topicCounts[topic] = { count: 0, years: [] };
        }
        topicCounts[topic].count += 1;
        topicCounts[topic].years.push(year);
      });
    });

    return Object.entries(topicCounts)
      .map(([topic, data]) => ({ topic, count: data.count, years: data.years }))
      .sort((a, b) => b.count - a.count);
  };

  const topicStats = calculateTopicStats();
  const filteredStats = topicStats.filter(stat => 
    stat.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const subjects = [
    { key: 'TYT_Matematik', name: 'TYT Matematik', color: 'bg-blue-500' },
    { key: 'TYT_Turkce', name: 'TYT Türkçe', color: 'bg-green-500' },
    { key: 'AYT_Matematik', name: 'AYT Matematik', color: 'bg-purple-500' },
    { key: 'AYT_Fizik', name: 'AYT Fizik', color: 'bg-red-500' },
    { key: 'AYT_Kimya', name: 'AYT Kimya', color: 'bg-yellow-500' },
    { key: 'AYT_Biyoloji', name: 'AYT Biyoloji', color: 'bg-indigo-500' }
  ];

  const totalTopics = filteredStats.length;
  const totalQuestions = filteredStats.reduce((sum, stat) => sum + stat.count, 0);
  const selectedYearsCount = availableYears.length;

  return (
    <div id="exam-topics" className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            TYT-AYT Çıkmış Konular Analizi
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-6">
            2018-2025 yılları arasında TYT ve AYT sınavlarında hangi konulardan kaç soru çıktığını detaylı olarak
            inceleyin. Sınav stratejinizi bu verilere göre planlayın.
          </p>
        </div>

        {/* Premium Upgrade Banner */}
        {!isPremium && (
          <div className="mb-8 bg-gradient-to-r from-orange-100 to-yellow-100 border border-orange-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Lock className="h-8 w-8 mr-4 text-orange-600" />
                <div>
                  <h3 className="text-xl font-bold text-orange-800 mb-1">Ücretsiz Önizleme</h3>
                  <p className="text-orange-700">
                    Şu anda sadece 2018-2020 yılları görüntüleniyor. Tüm yılları (2018-2025) görmek için premium pakete geçin.
                  </p>
                </div>
              </div>
              <button
                onClick={onUpgrade}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors whitespace-nowrap"
              >
                Premium'a Geç
              </button>
            </div>
          </div>
        )}

        {/* Main Interface */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Controls Row */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Ders Seçimi */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <BookOpen className="h-4 w-4 mr-2" />
                Ders Seçimi
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                {subjects.map(subject => (
                  <option key={subject.key} value={subject.key}>{subject.name}</option>
                ))}
              </select>
            </div>

            {/* Konu Ara */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <Search className="h-4 w-4 mr-2" />
                Konu Ara
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Konu adı yazın..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Yıl Filtresi */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <BarChart3 className="h-4 w-4 mr-2" />
                Yıl Filtresi 🔒
              </label>
              <div className="flex flex-wrap gap-2">
                {['2018', '2019', '2020'].map(year => (
                  <button
                    key={year}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                  >
                    {year}
                  </button>
                ))}
                {['2021', '2022', '2023', '2024', '2025'].map(year => (
                  <button
                    key={year}
                    disabled
                    className="px-3 py-2 bg-gray-200 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed relative"
                  >
                    {year}
                    <Lock className="h-3 w-3 absolute -top-1 -right-1 text-orange-500" />
                  </button>
                ))}
              </div>
              <p className="text-xs text-orange-600 mt-2">
                2021-2025 yılları premium kullanıcılar için
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{totalTopics}</div>
              <div className="text-blue-800 font-medium">Toplam Konu</div>
            </div>
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{totalQuestions}</div>
              <div className="text-green-800 font-medium">Toplam Soru</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{selectedYearsCount}</div>
              <div className="text-purple-800 font-medium">Seçili Yıl</div>
            </div>
          </div>

          {/* Results */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Konu Listesi */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
                {subjects.find(s => s.key === selectedSubject)?.name} Konuları
              </h3>
              
              {filteredStats.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>Seçilen kriterlere uygun konu bulunamadı.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredStats.map((stat, index) => (
                    <div
                      key={stat.topic}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center flex-1">
                        <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full text-sm font-bold mr-4">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{stat.topic}</h4>
                          <div className="flex items-center mt-1">
                            <span className="text-sm text-gray-600 mr-4">
                              Toplam Soru: {stat.count}
                            </span>
                            <div className="flex items-center space-x-1">
                              {stat.years.map(year => (
                                <span key={year} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {year}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-lg font-bold text-indigo-600">{stat.count}</div>
                        <div className="text-xs text-gray-500">
                          Yıllık Dağılım: {stat.years.join(', ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Grafik Alanı */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                Konu Seçim
              </h3>
              
              {filteredStats.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-12 text-center">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Grafik görmek için bir konu seçin</p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <div className="mb-6">
                    <BarChart3 className="h-24 w-24 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600 text-lg font-medium">
                      {filteredStats.length} konu analiz edildi
                    </p>
                    <p className="text-gray-500 text-sm">
                      {availableYears.join(', ')} yılları baz alınarak
                    </p>
                  </div>
                  
                  {/* En çok çıkan konular */}
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-800 mb-3">En Çok Çıkan Konular:</h4>
                    <div className="space-y-2">
                      {filteredStats.slice(0, 5).map((stat, index) => (
                        <div key={stat.topic} className="flex items-center justify-between bg-white p-3 rounded-lg">
                          <div className="flex items-center">
                            <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center mr-3 ${
                              index === 0 ? 'bg-yellow-100 text-yellow-800' :
                              index === 1 ? 'bg-gray-100 text-gray-800' :
                              index === 2 ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {index + 1}
                            </span>
                            <span className="text-sm font-medium">{stat.topic}</span>
                          </div>
                          <span className="text-sm font-bold text-indigo-600">{stat.count} soru</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Önerileri - Sadece Premium */}
        {isPremium && filteredStats.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-full mr-3">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">AI Çalışma Önerileri</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">🎯 Öncelikli Konular</h4>
                <p className="text-yellow-700 text-sm">
                  <strong>{filteredStats.slice(0, 3).map(s => s.topic).join(', ')}</strong> konularına 
                  odaklanın. Bu konular son {availableYears.length} yılda en sık çıkan konulardır.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">📊 Çalışma Stratejisi</h4>
                <p className="text-yellow-700 text-sm">
                  Yüksek çıkma oranına sahip konulara günlük çalışma sürenizin %60'ını ayırın. 
                  Düşük çıkma oranlı konular için haftalık tekrar yapın.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">⚡ Hızlı İpucu</h4>
                <p className="text-yellow-700 text-sm">
                  {filteredStats[0]?.topic} konusu {filteredStats[0]?.count} kez çıkmış. 
                  Bu konuda günde en az 30 dakika çalışmanızı öneriyoruz.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExamTopicsSection;