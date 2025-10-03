import React, { useState } from 'react';
import { BookOpen, Lock, Star, TrendingUp, BarChart3, Users, Award, Target } from 'lucide-react';

interface ExamTopicsSectionProps {
  user?: any;
  hasClassViewerSession?: boolean;
  onUpgrade: () => void;
}

export default function ExamTopicsSection({ user, hasClassViewerSession = false, onUpgrade }: ExamTopicsSectionProps) {
  const [selectedExam, setSelectedExam] = useState<'TYT' | 'AYT'>('TYT');

  const hasAccess = user || hasClassViewerSession;

  // Yıllara göre çıkmış konular verisi
  const examYears = [
    { year: 2018, isPremium: false },
    { year: 2019, isPremium: false },
    { year: 2020, isPremium: false },
    { year: 2021, isPremium: true },
    { year: 2022, isPremium: true },
    { year: 2023, isPremium: true },
    { year: 2024, isPremium: true },
    { year: 2025, isPremium: true }
  ];

  // TYT Konular ve yıllık çıkma durumları
  const tytTopics = [
    { 
      subject: 'Türkçe', 
      topics: [
        { 
          name: 'Anlam Bilgisi', 
          years: {
            2018: { appeared: true, questions: 8 },
            2019: { appeared: true, questions: 7 },
            2020: { appeared: true, questions: 9 },
            2021: { appeared: true, questions: 8 },
            2022: { appeared: true, questions: 8 },
            2023: { appeared: true, questions: 7 },
            2024: { appeared: true, questions: 9 },
            2025: { appeared: true, questions: 8 }
          }
        },
        { 
          name: 'Paragraf', 
          years: {
            2018: { appeared: true, questions: 6 },
            2019: { appeared: true, questions: 6 },
            2020: { appeared: true, questions: 5 },
            2021: { appeared: true, questions: 7 },
            2022: { appeared: true, questions: 6 },
            2023: { appeared: true, questions: 6 },
            2024: { appeared: true, questions: 6 },
            2025: { appeared: true, questions: 6 }
          }
        },
        { 
          name: 'Dil Bilgisi', 
          years: {
            2018: { appeared: true, questions: 5 },
            2019: { appeared: false, questions: 0 },
            2020: { appeared: true, questions: 4 },
            2021: { appeared: true, questions: 6 },
            2022: { appeared: true, questions: 5 },
            2023: { appeared: true, questions: 5 },
            2024: { appeared: false, questions: 0 },
            2025: { appeared: true, questions: 5 }
          }
        }
      ]
    },
    { 
      subject: 'Matematik', 
      topics: [
        { 
          name: 'Fonksiyonlar', 
          years: {
            2018: { appeared: true, questions: 8 },
            2019: { appeared: true, questions: 9 },
            2020: { appeared: true, questions: 7 },
            2021: { appeared: true, questions: 8 },
            2022: { appeared: true, questions: 8 },
            2023: { appeared: true, questions: 9 },
            2024: { appeared: true, questions: 8 },
            2025: { appeared: true, questions: 8 }
          }
        },
        { 
          name: 'Polinomlar', 
          years: {
            2018: { appeared: true, questions: 6 },
            2019: { appeared: true, questions: 5 },
            2020: { appeared: true, questions: 6 },
            2021: { appeared: true, questions: 7 },
            2022: { appeared: true, questions: 6 },
            2023: { appeared: false, questions: 0 },
            2024: { appeared: true, questions: 6 },
            2025: { appeared: true, questions: 6 }
          }
        }
      ]
    }
  ];

  // AYT Konular
  const aytTopics = [
    { 
      subject: 'Matematik', 
      topics: [
        { 
          name: 'Limit ve Süreklilik', 
          years: {
            2018: { appeared: true, questions: 8 },
            2019: { appeared: true, questions: 7 },
            2020: { appeared: true, questions: 8 },
            2021: { appeared: true, questions: 9 },
            2022: { appeared: true, questions: 8 },
            2023: { appeared: true, questions: 8 },
            2024: { appeared: true, questions: 7 },
            2025: { appeared: true, questions: 8 }
          }
        },
        { 
          name: 'Türev', 
          years: {
            2018: { appeared: true, questions: 7 },
            2019: { appeared: true, questions: 8 },
            2020: { appeared: true, questions: 6 },
            2021: { appeared: true, questions: 7 },
            2022: { appeared: true, questions: 7 },
            2023: { appeared: true, questions: 8 },
            2024: { appeared: true, questions: 7 },
            2025: { appeared: true, questions: 7 }
          }
        }
      ]
    },
    { 
      subject: 'Fizik', 
      topics: [
        { 
          name: 'Elektrik ve Manyetizma', 
          years: {
            2018: { appeared: true, questions: 4 },
            2019: { appeared: true, questions: 3 },
            2020: { appeared: true, questions: 4 },
            2021: { appeared: true, questions: 4 },
            2022: { appeared: true, questions: 4 },
            2023: { appeared: true, questions: 3 },
            2024: { appeared: true, questions: 4 },
            2025: { appeared: true, questions: 4 }
          }
        }
      ]
    }
  ];

  const currentTopics = selectedExam === 'TYT' ? tytTopics : aytTopics;

  const calculateAppearanceRate = (years: any) => {
    const totalYears = Object.keys(years).length;
    const appearedYears = Object.values(years).filter((year: any) => year.appeared).length;
    return Math.round((appearedYears / totalYears) * 100);
  };

  const getAppearanceColor = (appeared: boolean) => {
    return appeared ? 'bg-green-500' : 'bg-red-500';
  };

  return (
    <div id="exam-topics" className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            TYT-AYT Çıkmış Konular Analizi
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            2018-2025 yılları arasındaki tüm TYT ve AYT sınavlarından çıkan konuların 
            detaylı analizi. Hangi konulara odaklanmanız gerektiğini öğrenin.
          </p>
        </div>

        {/* Exam Type Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-lg shadow-sm border">
            <button
              onClick={() => setSelectedExam('TYT')}
              className={`px-6 py-3 rounded-md font-semibold transition-all ${
                selectedExam === 'TYT'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              TYT (Temel Yeterlilik Testi)
            </button>
            <button
              onClick={() => setSelectedExam('AYT')}
              className={`px-6 py-3 rounded-md font-semibold transition-all ${
                selectedExam === 'AYT'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              AYT (Alan Yeterlilik Testi)
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-blue-600 mb-2">8 Yıl</h3>
            <p className="text-gray-600">Analiz Edilen Dönem</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">
              {currentTopics.reduce((sum, subject) => sum + subject.topics.length, 0)}
            </h3>
            <p className="text-gray-600">Analiz Edilen Konu</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="bg-purple-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-purple-600 mb-2">%92</h3>
            <p className="text-gray-600">Ortalama Çıkma Oranı</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="bg-orange-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Award className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-orange-600 mb-2">
              {hasAccess ? '12' : '?'}
            </h3>
            <p className="text-gray-600">Kritik Konu</p>
          </div>
        </div>

        {/* Year Legend */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h3 className="text-lg font-semibold mb-4 text-center">Yıllara Göre Çıkma Durumu</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {examYears.map((yearData) => (
              <div key={yearData.year} className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                  yearData.isPremium 
                    ? (hasAccess ? 'bg-blue-600' : 'bg-gray-400') 
                    : 'bg-green-600'
                }`}>
                  {yearData.year.toString().slice(-2)}
                </div>
                <span className="text-sm font-medium">{yearData.year}</span>
                {yearData.isPremium && !hasAccess && (
                  <Lock className="h-4 w-4 text-gray-400" />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Çıktı</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Çıkmadı</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              <span>Premium</span>
            </div>
          </div>
        </div>

        {/* Topics Analysis */}
        <div className="space-y-8">
          {currentTopics.map((subject, subjectIndex) => (
            <div key={subjectIndex} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className={`p-6 ${
                selectedExam === 'TYT' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-purple-500 to-purple-600'
              } text-white`}>
                <h3 className="text-2xl font-bold mb-2">{subject.subject}</h3>
                <p className="text-blue-100">
                  {subject.topics.length} konu analizi • 2018-2025 dönemi
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {subject.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">{topic.name}</h4>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            %{calculateAppearanceRate(topic.years)}
                          </div>
                          <div className="text-sm text-gray-500">Çıkma Oranı</div>
                        </div>
                      </div>

                      {/* Year by year breakdown */}
                      <div className="grid grid-cols-8 gap-2">
                        {examYears.map((yearData) => {
                          const yearInfo = topic.years[yearData.year];
                          const isLocked = yearData.isPremium && !hasAccess;
                          
                          return (
                            <div key={yearData.year} className="text-center">
                              <div className="text-xs font-medium text-gray-600 mb-1">
                                {yearData.year}
                              </div>
                              <div className={`w-full h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold relative ${
                                isLocked 
                                  ? 'bg-gray-300' 
                                  : getAppearanceColor(yearInfo.appeared)
                              }`}>
                                {isLocked ? (
                                  <Lock className="h-3 w-3" />
                                ) : (
                                  yearInfo.appeared ? yearInfo.questions : '0'
                                )}
                              </div>
                              {!isLocked && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {yearInfo.appeared ? `${yearInfo.questions} soru` : 'Çıkmadı'}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {!hasAccess && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Lock className="h-5 w-5 text-yellow-600 mr-2" />
                              <span className="text-yellow-800 text-sm font-medium">
                                2021-2025 verileri premium üyelere özeldir
                              </span>
                            </div>
                            <button
                              onClick={onUpgrade}
                              className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                            >
                              Premium'a Geç
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Kişiselleştirilmiş Çalışma Planı</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Bu analiz verilerini kullanarak size özel çalışma planı oluşturun. 
            Yüksek çıkma oranına sahip konulara öncelik verin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Çalışma Planı Oluştur
            </button>
            <button className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors border-2 border-blue-500">
              Deneme Sonuçlarımı Analiz Et
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}