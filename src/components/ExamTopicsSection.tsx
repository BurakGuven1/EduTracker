import React, { useState } from 'react';
import { TrendingUp, BookOpen, BarChart3, Lock, Crown, Star } from 'lucide-react';

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
    2018: ['Türev Uygulamaları', 'İntegral Uygulamaları', 'Analitik Geometri', 'Diziler ve Seriler', 'Olasılık'],
    2019: ['Fonksiyon Analizi', 'Türev', 'İntegral', 'Analitik Geometri', 'İstatistik'],
    2020: ['Limit ve Süreklilik', 'Türev', 'İntegral', 'Analitik Geometri', 'Olasılık'],
    2021: ['Fonksiyonlar', 'Türev Uygulamaları', 'İntegral', 'Diziler', 'İstatistik'],
    2022: ['Limit', 'Türev', 'İntegral Uygulamaları', 'Analitik Geometri', 'Olasılık'],
    2023: ['Fonksiyon Analizi', 'Türev', 'İntegral', 'Diziler ve Seriler', 'İstatistik'],
    2024: ['Limit ve Süreklilik', 'Türev Uygulamaları', 'İntegral', 'Analitik Geometri', 'Olasılık'],
    2025: ['Fonksiyonlar', 'Türev', 'İntegral Uygulamaları', 'Diziler', 'İstatistik']
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
  const [selectedYears, setSelectedYears] = useState(freeYears);
  const [searchTerm, setSearchTerm] = useState('');

  const isPremium = hasPremiumAccess(user, hasClassViewerSession);
  const availableYears = isPremium ? Object.keys(examTopics[selectedSubject as keyof typeof examTopics]) : freeYears;

  // Konu istatistikleri hesaplama
  const calculateTopicStats = () => {
    const topicCounts: Record<string, number> = {};
    const subjectData = examTopics[selectedSubject as keyof typeof examTopics];
    
    selectedYears.forEach(year => {
      const topics = subjectData[year as keyof typeof subjectData] || [];
      topics.forEach(topic => {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      });
    });

    return Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count }))
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

  const handleYearToggle = (year: string) => {
    if (!isPremium && !freeYears.includes(year)) {
      onUpgrade();
      return;
    }

    setSelectedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  return (
    <div id="exam-topics" className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BarChart3 className="h-12 w-12 text-indigo-600 mr-4" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                TYT-AYT Çıkmış Konular Analizi
              </h2>
              <div className="flex items-center justify-center mt-2">
                <span className="text-indigo-600 font-semibold">2018-2025</span>
                {isPremium ? (
                  <div className="ml-3 flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    <Crown className="h-4 w-4 mr-1" />
                    Premium Erişim
                  </div>
                ) : (
                  <div className="ml-3 flex items-center bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                    <Lock className="h-4 w-4 mr-1" />
                    Sınırlı Erişim
                  </div>
                )}
              </div>
            </div>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Son 8 yılın TYT ve AYT sınavlarında çıkan konuları analiz edin. 
            Hangi konuların ne sıklıkta çıktığını görün ve çalışma planınızı optimize edin.
          </p>
        </div>

        {/* Premium Upgrade Banner */}
        {!isPremium && (
          <div className="mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="h-8 w-8 mr-4" />
                <div>
                  <h3 className="text-xl font-bold mb-1">Profesyonel Pakete Geçin!</h3>
                  <p className="text-purple-100">
                    2021-2025 yıllarının tüm verilerine erişin. Gelişmiş AI analizi ile çalışma planınızı optimize edin.
                  </p>
                </div>
              </div>
              <button
                onClick={onUpgrade}
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                Şimdi Yükselt
              </button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sol Panel - Kontroller */}
          <div className="lg:col-span-1 space-y-6">
            {/* Ders Seçimi */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-indigo-600" />
                Ders Seçimi
              </h3>
              <div className="space-y-2">
                {subjects.map(subject => (
                  <button
                    key={subject.key}
                    onClick={() => setSelectedSubject(subject.key)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedSubject === subject.key
                        ? 'bg-indigo-50 border-2 border-indigo-500 text-indigo-700'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${subject.color} mr-3`}></div>
                      <span className="font-medium">{subject.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Yıl Seçimi */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Yıl Seçimi</h3>
              <div className="grid grid-cols-2 gap-2">
                {availableYears.map(year => (
                  <button
                    key={year}
                    onClick={() => handleYearToggle(year)}
                    className={`p-2 rounded-lg text-sm font-medium transition-colors relative ${
                      selectedYears.includes(year)
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {year}
                    {!isPremium && !freeYears.includes(year) && (
                      <Lock className="h-3 w-3 absolute top-1 right-1" />
                    )}
                  </button>
                ))}
              </div>
              {!isPremium && (
                <div className="mt-3 text-xs text-gray-500 text-center">
                  <Lock className="h-3 w-3 inline mr-1" />
                  Premium: 2021-2025 erişimi
                </div>
              )}
            </div>

            {/* Arama */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Konu Ara</h3>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Konu adı yazın..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Sağ Panel - Sonuçlar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  {subjects.find(s => s.key === selectedSubject)?.name} - Konu Analizi
                </h3>
                <div className="text-sm text-gray-500">
                  {selectedYears.length} yıl seçili • {filteredStats.length} konu
                </div>
              </div>

              {filteredStats.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>Seçilen kriterlere uygun konu bulunamadı.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredStats.map((stat, index) => (
                    <div
                      key={stat.topic}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full text-sm font-bold mr-4">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{stat.topic}</h4>
                          <p className="text-sm text-gray-600">
                            {selectedYears.length} yılda {stat.count} kez çıktı
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-4">
                          <div
                            className="bg-indigo-500 h-2 rounded-full"
                            style={{
                              width: `${(stat.count / Math.max(...filteredStats.map(s => s.count))) * 100}%`
                            }}
                          ></div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-indigo-600">{stat.count}</div>
                          <div className="text-xs text-gray-500">
                            %{((stat.count / selectedYears.length) * 100).toFixed(0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* İstatistik Özeti */}
              {filteredStats.length > 0 && (
                <div className="mt-8 grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {filteredStats.length}
                    </div>
                    <div className="text-sm text-blue-800">Toplam Konu</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.max(...filteredStats.map(s => s.count))}
                    </div>
                    <div className="text-sm text-green-800">En Çok Çıkan</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {(filteredStats.reduce((sum, stat) => sum + stat.count, 0) / filteredStats.length).toFixed(1)}
                    </div>
                    <div className="text-sm text-purple-800">Ortalama Çıkma</div>
                  </div>
                </div>
              )}
            </div>

            {/* AI Önerileri - Sadece Premium */}
            {isPremium && filteredStats.length > 0 && (
              <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
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
                      odaklanın. Bu konular son {selectedYears.length} yılda en sık çıkan konulardır.
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
      </div>
    </div>
  );
}

export default ExamTopicsSection;