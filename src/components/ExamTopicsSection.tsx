import React, { useState } from 'react';
import { BookOpen, Lock, Star, TrendingUp, BarChart3, Users, Award, Target, Search, Filter } from 'lucide-react';

interface ExamTopicsSectionProps {
  user?: any;
  hasClassViewerSession?: boolean;
  onUpgrade: () => void;
}

export default function ExamTopicsSection({ user, hasClassViewerSession = false, onUpgrade }: ExamTopicsSectionProps) {
  const [selectedSubject, setSelectedSubject] = useState<'TYT_Matematik' | 'TYT_Turkce' | 'TYT_Fen' | 'TYT_Sosyal' | 'AYT_Matematik' | 'AYT_Fizik' | 'AYT_Kimya' | 'AYT_Biyoloji' | 'AYT_Edebiyat' | 'AYT_Tarih' | 'AYT_Cografya'>('AYT_Matematik');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYears, setSelectedYears] = useState<number[]>([2018, 2019, 2020]);

  const hasAccess = user || hasClassViewerSession;

  const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
  const premiumYears = [2021, 2022, 2023, 2024, 2025];

  const subjects = [
    { id: 'TYT_Matematik', name: 'TYT Matematik', type: 'TYT' },
    { id: 'TYT_Turkce', name: 'TYT Türkçe', type: 'TYT' },
    { id: 'TYT_Fen', name: 'TYT Fen Bilimleri', type: 'TYT' },
    { id: 'TYT_Sosyal', name: 'TYT Sosyal Bilgiler', type: 'TYT' },
    { id: 'AYT_Matematik', name: 'AYT Matematik', type: 'AYT' },
    { id: 'AYT_Fizik', name: 'AYT Fizik', type: 'AYT' },
    { id: 'AYT_Kimya', name: 'AYT Kimya', type: 'AYT' },
    { id: 'AYT_Biyoloji', name: 'AYT Biyoloji', type: 'AYT' },
    { id: 'AYT_Edebiyat', name: 'AYT Türk Dili ve Edebiyatı', type: 'AYT' },
    { id: 'AYT_Tarih', name: 'AYT Tarih', type: 'AYT' },
    { id: 'AYT_Cografya', name: 'AYT Coğrafya', type: 'AYT' }
  ];

  // AYT Matematik konuları ve yıllık dağılımları
  const aytMatematikTopics = [
    {
      name: 'Temel Kavramlar',
      years: { 2018: 3, 2019: 5, 2020: 7, 2021: 4, 2022: 6, 2023: 5, 2024: 8, 2025: 7 },
      total: 45
    },
    {
      name: 'Üstel Fonksiyon, Logaritma Fonksiyonu',
      years: { 2018: 2, 2019: 3, 2020: 4, 2021: 3, 2022: 4, 2023: 3, 2024: 5, 2025: 4 },
      total: 28
    },
    {
      name: 'Yönlü Açılar, Trigonometrik Fonksiyonlar',
      years: { 2018: 1, 2019: 3, 2020: 3, 2021: 2, 2022: 3, 2023: 2, 2024: 4, 2025: 3 },
      total: 21
    },
    {
      name: 'Anlık Değişim Oranı ve Türev, Türevin Uygulamaları',
      years: { 2018: 3, 2019: 4, 2020: 0, 2021: 4, 2022: 3, 2023: 4, 2024: 2, 2025: 3 },
      total: 23
    },
    {
      name: 'Belirsiz İntegral, Belirli İntegral ve Uygulamaları',
      years: { 2018: 3, 2019: 4, 2020: 0, 2021: 3, 2022: 4, 2023: 3, 2024: 2, 2025: 4 },
      total: 23
    },
    {
      name: 'Polinom Kavramı ve Polinomlarda İşlemler, Polinomların Çapanlara Ayrılması',
      years: { 2018: 1, 2019: 2, 2020: 2, 2021: 2, 2022: 1, 2023: 2, 2024: 3, 2025: 2 },
      total: 15
    },
    {
      name: 'Kümelerde Temel Kavramlar, Kümelerde İşlemler',
      years: { 2018: 0, 2019: 2, 2020: 2, 2021: 1, 2022: 2, 2023: 1, 2024: 2, 2025: 1 },
      total: 11
    },
    {
      name: 'Fonksiyon Kavramı ve Gösterimi, İki Fonksiyonun Bileşkesi ve Bir Fonksiyonun Tersi',
      years: { 2018: 1, 2019: 1, 2020: 2, 2021: 2, 2022: 1, 2023: 2, 2024: 1, 2025: 2 },
      total: 12
    },
    {
      name: 'İkinci Dereceden Fonksiyon ve Grafikleri',
      years: { 2018: 1, 2019: 2, 2020: 1, 2021: 1, 2022: 2, 2023: 1, 2024: 2, 2025: 1 },
      total: 11
    },
    {
      name: 'Gerçek Sayı Dizileri',
      years: { 2018: 1, 2019: 1, 2020: 2, 2021: 1, 2022: 1, 2023: 2, 2024: 1, 2025: 2 },
      total: 11
    },
    {
      name: 'Limit ve Süreklilik',
      years: { 2018: 2, 2019: 2, 2020: 0, 2021: 2, 2022: 1, 2023: 2, 2024: 1, 2025: 2 },
      total: 12
    },
    {
      name: 'Önermeler ve Bileşik Önermeler, Niceleyiciler, Tanım, Aksiyom, Teorem ve İspat Yöntemleri',
      years: { 2018: 2, 2019: 1, 2020: 0, 2021: 1, 2022: 1, 2023: 1, 2024: 0, 2025: 1 },
      total: 7
    },
    {
      name: 'İkinci Dereceden Denklemler, Karmaşık Sayılar, Denklem ve Eşitsizlik Sistemleri',
      years: { 2018: 2, 2019: 0, 2020: 1, 2021: 1, 2022: 0, 2023: 1, 2024: 1, 2025: 0 },
      total: 6
    },
    {
      name: 'Permütasyon, Kombinasyon',
      years: { 2018: 1, 2019: 1, 2020: 1, 2021: 1, 2022: 1, 2023: 1, 2024: 1, 2025: 1 },
      total: 8
    },
    {
      name: 'Olasılık',
      years: { 2018: 1, 2019: 1, 2020: 1, 2021: 1, 2022: 1, 2023: 1, 2024: 1, 2025: 1 },
      total: 8
    },
    {
      name: 'Toplam-Fark ve İki Kat Açı Formüller',
      years: { 2018: 1, 2019: 0, 2020: 1, 2021: 0, 2022: 1, 2023: 0, 2024: 1, 2025: 0 },
      total: 4
    },
    {
      name: 'Binom',
      years: { 2018: 0, 2019: 0, 2020: 1, 2021: 0, 2022: 0, 2023: 1, 2024: 0, 2025: 1 },
      total: 3
    },
    {
      name: 'Trigonometrik Denklemler',
      years: { 2018: 1, 2019: 0, 2020: 0, 2021: 0, 2022: 1, 2023: 0, 2024: 0, 2025: 1 },
      total: 3
    },
    {
      name: 'Fonksiyonlar ile İlgili Uygulamalar, Fonksiyon Dönüşümleri',
      years: { 2018: 0, 2019: 0, 2020: 0, 2021: 1, 2022: 0, 2023: 1, 2024: 0, 2025: 0 },
      total: 2
    },
    {
      name: 'Kosinüs Teoremi, Sinüs Teoremi, Ters Trigonometrik Fonksiyonlar',
      years: { 2018: 0, 2019: 0, 2020: 0, 2021: 0, 2022: 1, 2023: 0, 2024: 1, 2025: 0 },
      total: 2
    }
  ];

  const getCurrentTopics = () => {
    if (selectedSubject === 'AYT_Matematik') {
      return aytMatematikTopics;
    }
    // Diğer dersler için örnek veri
    return [
      {
        name: 'Örnek Konu 1',
        years: { 2018: 2, 2019: 3, 2020: 4, 2021: 3, 2022: 4, 2023: 3, 2024: 5, 2025: 4 },
        total: 28
      },
      {
        name: 'Örnek Konu 2',
        years: { 2018: 1, 2019: 2, 2020: 3, 2021: 2, 2022: 3, 2023: 2, 2024: 4, 2025: 3 },
        total: 20
      }
    ];
  };

  const currentTopics = getCurrentTopics();
  const filteredTopics = currentTopics.filter(topic =>
    topic.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTopics = filteredTopics.length;
  const totalQuestions = filteredTopics.reduce((sum, topic) => {
    return sum + selectedYears.reduce((yearSum, year) => {
      return yearSum + (hasAccess || !premiumYears.includes(year) ? (topic.years[year] || 0) : 0);
    }, 0);
  }, 0);

  const handleYearToggle = (year: number) => {
    if (premiumYears.includes(year) && !hasAccess) {
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
    <div id="exam-topics" className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            TYT-AYT Çıkmış Konular Analizi
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            2018-2025 yılları arasında TYT ve AYT sınavlarından hangi konulardan kaç soru çıktığını detaylı olarak 
            inceleyin. Sınav stratejinizi bu verilere göre planlayın.
          </p>
        </div>

        {/* Premium Warning */}
        {!hasAccess && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <Lock className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <h3 className="font-semibold text-yellow-800">Ücretsiz Önizleme</h3>
                <p className="text-yellow-700 text-sm">
                  Şu anda sadece 2018-2020 yılları görüntüleniyor. Tüm yılları (2018-2025) görmek için premium pakete 
                  geçin.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          {/* Controls */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Subject Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="h-4 w-4 inline mr-1" />
                Ders Seçimi
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="h-4 w-4 inline mr-1" />
                Konu Ara
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Konu adı yazın..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="h-4 w-4 inline mr-1" />
                Yıl Filtresi 🔒
              </label>
              <div className="flex flex-wrap gap-2">
                {years.map(year => {
                  const isPremium = premiumYears.includes(year);
                  const isSelected = selectedYears.includes(year);
                  const canSelect = hasAccess || !isPremium;
                  
                  return (
                    <button
                      key={year}
                      onClick={() => handleYearToggle(year)}
                      disabled={!canSelect}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        isSelected && canSelect
                          ? 'bg-blue-600 text-white'
                          : canSelect
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {year}
                      {isPremium && !hasAccess && <Lock className="h-3 w-3 inline ml-1" />}
                    </button>
                  );
                })}
              </div>
              {!hasAccess && (
                <p className="text-xs text-yellow-600 mt-1">
                  2021-2025 yılları premium kullanıcılar için
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="text-center bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{totalTopics}</div>
              <div className="text-sm text-blue-800">Toplam Konu</div>
            </div>
            <div className="text-center bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{totalQuestions}</div>
              <div className="text-sm text-green-800">Toplam Soru</div>
            </div>
            <div className="text-center bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{selectedYears.length}</div>
              <div className="text-sm text-purple-800">Seçili Yıl</div>
            </div>
          </div>

          {/* Topics Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                {subjects.find(s => s.id === selectedSubject)?.name} Konuları
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Konu</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Toplam Soru</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Yıllık Dağılım</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTopics.map((topic, index) => {
                    const visibleTotal = selectedYears.reduce((sum, year) => {
                      return sum + (hasAccess || !premiumYears.includes(year) ? (topic.years[year] || 0) : 0);
                    }, 0);

                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 font-medium">
                          {topic.name}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center font-bold text-blue-600">
                          {visibleTotal}
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            {selectedYears.map(year => {
                              const count = topic.years[year] || 0;
                              const isPremium = premiumYears.includes(year);
                              const canShow = hasAccess || !isPremium;
                              
                              return (
                                <div
                                  key={year}
                                  className={`px-2 py-1 rounded text-xs font-medium ${
                                    canShow
                                      ? count > 0
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-600'
                                      : 'bg-gray-100 text-gray-400'
                                  }`}
                                >
                                  {year.toString().slice(-2)}:{canShow ? count : '?'}
                                  {isPremium && !hasAccess && <Lock className="h-3 w-3 inline ml-1" />}
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredTopics.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Arama kriterlerinize uygun konu bulunamadı.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Topic Selection Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Konu Seçim
            </h3>
          </div>

          <div className="text-center py-12 text-gray-500">
            <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">Grafik görmek için bir konu seçin</p>
            <p className="text-sm">Tablodaki konulardan birine tıklayarak detaylı grafik görüntüleyebilirsiniz.</p>
          </div>
        </div>

        {/* Premium CTA */}
        {!hasAccess && (
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <div className="bg-yellow-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Premium Özellikleri</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              2021-2025 yıllarının tüm verilerine erişin. Güncel sınav trendlerini kaçırmayın!
            </p>
            <button
              onClick={onUpgrade}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Premium'a Geç
            </button>
          </div>
        )}
      </div>
    </div>
  );
}