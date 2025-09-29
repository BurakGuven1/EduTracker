import React, { useState, useMemo } from 'react';
import { Search, BarChart3, BookOpen, TrendingUp, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data structure - you can replace this with your full dataset
const examData = {
  "Biyoloji": {
    "Hücre": { "2025": 1, "2024": 1, "2023": 1, "2022": 1, "2021": 1, "2020": 1, "2019": 1, "2018": 2 },
    "Canlıların Temel Bileşenleri": { "2025": 2, "2024": 2, "2023": 2, "2022": 2, "2021": 2, "2020": 2, "2019": 2, "2018": 1 },
    "Hücre Bölünmeleri": { "2025": 1, "2024": 1, "2023": 1, "2022": 1, "2021": 1, "2020": 1, "2019": 1, "2018": 1 },
    "Kalıtım": { "2025": 2, "2024": 2, "2023": 2, "2022": 2, "2021": 2, "2020": 2, "2019": 2, "2018": 2 },
    "Ekoloji": { "2025": 1, "2024": 1, "2023": 1, "2022": 1, "2021": 1, "2020": 1, "2019": 1, "2018": 1 }
  },
  "Matematik": {
    "Temel Kavramlar": { "2025": 6, "2024": 3, "2023": 6, "2022": 4, "2021": 3, "2020": 7, "2019": 5, "2018": 3 },
    "Fonksiyonlar": { "2025": 4, "2024": 5, "2023": 4, "2022": 5, "2021": 4, "2020": 3, "2019": 4, "2018": 5 },
    "Polinomlar": { "2025": 3, "2024": 2, "2023": 3, "2022": 2, "2021": 3, "2020": 2, "2019": 3, "2018": 2 },
    "Logaritma": { "2025": 2, "2024": 3, "2023": 2, "2022": 3, "2021": 2, "2020": 3, "2019": 2, "2018": 3 },
    "Trigonometri": { "2025": 3, "2024": 2, "2023": 3, "2022": 2, "2021": 3, "2020": 2, "2019": 3, "2018": 2 }
  },
  "Fizik": {
    "Hareket": { "2025": 2, "2024": 3, "2023": 2, "2022": 3, "2021": 2, "2020": 3, "2019": 2, "2018": 3 },
    "Kuvvet ve Hareket": { "2025": 3, "2024": 2, "2023": 3, "2022": 2, "2021": 3, "2020": 2, "2019": 3, "2018": 2 },
    "Enerji": { "2025": 2, "2024": 2, "2023": 2, "2022": 2, "2021": 2, "2020": 2, "2019": 2, "2018": 2 },
    "Elektrik": { "2025": 3, "2024": 3, "2023": 3, "2022": 3, "2021": 3, "2020": 3, "2019": 3, "2018": 3 },
    "Manyetizma": { "2025": 2, "2024": 2, "2023": 2, "2022": 2, "2021": 2, "2020": 2, "2019": 2, "2018": 2 }
  },
  "Kimya": {
    "Atom ve Periyodik Sistem": { "2025": 2, "2024": 3, "2023": 2, "2022": 3, "2021": 2, "2020": 3, "2019": 2, "2018": 3 },
    "Kimyasal Bağlar": { "2025": 2, "2024": 2, "2023": 2, "2022": 2, "2021": 2, "2020": 2, "2019": 2, "2018": 2 },
    "Asit-Baz": { "2025": 3, "2024": 2, "2023": 3, "2022": 2, "2021": 3, "2020": 2, "2019": 3, "2018": 2 },
    "Organik Kimya": { "2025": 3, "2024": 3, "2023": 3, "2022": 3, "2021": 3, "2020": 3, "2019": 3, "2018": 3 },
    "Elektrokimya": { "2025": 2, "2024": 2, "2023": 2, "2022": 2, "2021": 2, "2020": 2, "2019": 2, "2018": 2 }
  },
  "Edebiyat": {
    "Divan Edebiyatı": { "2025": 3, "2024": 4, "2023": 3, "2022": 4, "2021": 3, "2020": 4, "2019": 3, "2018": 4 },
    "Tanzimat Edebiyatı": { "2025": 4, "2024": 3, "2023": 4, "2022": 3, "2021": 4, "2020": 3, "2019": 4, "2018": 3 },
    "Servet-i Fünun": { "2025": 3, "2024": 3, "2023": 3, "2022": 3, "2021": 3, "2020": 3, "2019": 3, "2018": 3 },
    "Milli Edebiyat": { "2025": 4, "2024": 4, "2023": 4, "2022": 4, "2021": 4, "2020": 4, "2019": 4, "2018": 4 },
    "Cumhuriyet Dönemi": { "2025": 5, "2024": 5, "2023": 5, "2022": 5, "2021": 5, "2020": 5, "2019": 5, "2018": 5 }
  }
};

const years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];

export default function ExamTopicsSection() {
  const [selectedSubject, setSelectedSubject] = useState('Matematik');
  const [selectedYears, setSelectedYears] = useState(years);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const subjects = Object.keys(examData);

  const filteredTopics = useMemo(() => {
    const subjectData = examData[selectedSubject as keyof typeof examData];
    if (!subjectData) return [];

    return Object.entries(subjectData)
      .filter(([topic]) => 
        topic.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map(([topic, yearData]) => ({
        topic,
        yearData,
        total: selectedYears.reduce((sum, year) => sum + (yearData[year] || 0), 0)
      }))
      .sort((a, b) => b.total - a.total);
  }, [selectedSubject, searchTerm, selectedYears]);

  const chartData = useMemo(() => {
    if (!selectedTopic) return [];
    
    const subjectData = examData[selectedSubject as keyof typeof examData];
    const topicData = subjectData[selectedTopic as keyof typeof subjectData];
    
    if (!topicData) return [];

    return selectedYears.map(year => ({
      year,
      questions: topicData[year] || 0
    }));
  }, [selectedTopic, selectedSubject, selectedYears]);

  const handleYearToggle = (year: string) => {
    setSelectedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year].sort()
    );
  };

  const getTotalQuestions = () => {
    return filteredTopics.reduce((sum, topic) => sum + topic.total, 0);
  };

  return (
    <div id="exam-topics" className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            TYT-AYT Çıkmış Konular Analizi
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            2018-2025 yılları arasında TYT ve AYT sınavlarında hangi konulardan kaç soru çıktığını 
            detaylı olarak inceleyin. Sınav stratejinizi bu verilere göre planlayın.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Controls */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Subject Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="inline h-4 w-4 mr-1" />
                Ders Seçimi
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setSelectedTopic(null);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="inline h-4 w-4 mr-1" />
                Konu Ara
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Konu adı yazın..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline h-4 w-4 mr-1" />
                Yıl Filtresi
              </label>
              <div className="flex flex-wrap gap-2">
                {years.map(year => (
                  <button
                    key={year}
                    onClick={() => handleYearToggle(year)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedYears.includes(year)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredTopics.length}</div>
              <div className="text-blue-800 text-sm">Toplam Konu</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{getTotalQuestions()}</div>
              <div className="text-green-800 text-sm">Toplam Soru</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{selectedYears.length}</div>
              <div className="text-purple-800 text-sm">Seçili Yıl</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Topics Table */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                {selectedSubject} Konuları
              </h3>
              
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Konu
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Toplam Soru
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Yıllık Dağılım
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTopics.map(({ topic, yearData, total }) => (
                        <tr
                          key={topic}
                          onClick={() => setSelectedTopic(topic)}
                          className={`cursor-pointer hover:bg-blue-50 transition-colors ${
                            selectedTopic === topic ? 'bg-blue-100' : ''
                          }`}
                        >
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {topic}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {total}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1 justify-center">
                              {selectedYears.map(year => {
                                const count = yearData[year] || 0;
                                return (
                                  <span
                                    key={year}
                                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                                      count > 0
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-500'
                                    }`}
                                  >
                                    {year.slice(-2)}:{count}
                                  </span>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                {selectedTopic ? `${selectedTopic} - Yıllık Dağılım` : 'Konu Seçin'}
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-4 h-80">
                {selectedTopic && chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} soru`, 'Soru Sayısı']}
                        labelFormatter={(label) => `Yıl: ${label}`}
                      />
                      <Bar dataKey="questions" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Grafik görmek için bir konu seçin</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Nasıl Kullanılır?</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• <strong>Ders seçin:</strong> Analiz etmek istediğiniz dersi seçin</li>
              <li>• <strong>Yıl filtreleyin:</strong> Hangi yılları dahil etmek istediğinizi seçin</li>
              <li>• <strong>Konu arayın:</strong> Belirli bir konuyu bulmak için arama kutusunu kullanın</li>
              <li>• <strong>Detay görün:</strong> Tablodaki bir konuya tıklayarak yıllık dağılım grafiğini görün</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}