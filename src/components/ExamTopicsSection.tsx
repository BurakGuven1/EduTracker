import React, { useState } from 'react';
import { BookOpen, Lock, Star, TrendingUp, BarChart3, Users, Award, Target } from 'lucide-react';

interface ExamTopicsSectionProps {
  user?: any;
  hasClassViewerSession?: boolean;
  onUpgrade: () => void;
}

export default function ExamTopicsSection({ user, hasClassViewerSession = false, onUpgrade }: ExamTopicsSectionProps) {
  const [selectedExam, setSelectedExam] = useState<'TYT' | 'AYT'>('TYT');

  // TYT Konular ve Çıkma Oranları (2018-2025)
  const tytTopics = [
    { subject: 'Türkçe', topics: [
      { name: 'Anlam Bilgisi', percentage: 85, questions: 8 },
      { name: 'Paragraf', percentage: 92, questions: 6 },
      { name: 'Dil Bilgisi', percentage: 78, questions: 5 },
      { name: 'Sözcük Türleri', percentage: 88, questions: 4 },
      { name: 'Cümle Bilgisi', percentage: 82, questions: 3 }
    ]},
    { subject: 'Matematik', topics: [
      { name: 'Fonksiyonlar', percentage: 95, questions: 8 },
      { name: 'Polinomlar', percentage: 88, questions: 6 },
      { name: 'Üslü ve Köklü Sayılar', percentage: 90, questions: 5 },
      { name: 'Faktöriyel', percentage: 75, questions: 4 },
      { name: 'Permütasyon-Kombinasyon', percentage: 85, questions: 3 }
    ]},
    { subject: 'Fen', topics: [
      { name: 'Hareket', percentage: 92, questions: 4 },
      { name: 'Kuvvet ve Hareket', percentage: 88, questions: 3 },
      { name: 'Enerji', percentage: 85, questions: 3 },
      { name: 'Isı ve Sıcaklık', percentage: 78, questions: 2 },
      { name: 'Elektrik', percentage: 82, questions: 2 }
    ]},
    { subject: 'Sosyal', topics: [
      { name: 'Atatürk İlkeleri', percentage: 95, questions: 5 },
      { name: 'Türk Tarihi', percentage: 88, questions: 4 },
      { name: 'Coğrafya', percentage: 85, questions: 3 },
      { name: 'Vatandaşlık', percentage: 80, questions: 2 },
      { name: 'Felsefe', percentage: 75, questions: 2 }
    ]}
  ];

  // AYT Konular ve Çıkma Oranları
  const aytTopics = [
    { subject: 'Matematik', topics: [
      { name: 'Limit ve Süreklilik', percentage: 95, questions: 8 },
      { name: 'Türev', percentage: 92, questions: 7 },
      { name: 'İntegral', percentage: 88, questions: 6 },
      { name: 'Logaritma', percentage: 85, questions: 4 },
      { name: 'Trigonometri', percentage: 90, questions: 5 }
    ]},
    { subject: 'Fizik', topics: [
      { name: 'Elektrik ve Manyetizma', percentage: 92, questions: 4 },
      { name: 'Dalgalar', percentage: 88, questions: 3 },
      { name: 'Modern Fizik', percentage: 85, questions: 2 },
      { name: 'Optik', percentage: 82, questions: 2 },
      { name: 'Termodinamik', percentage: 78, questions: 2 }
    ]},
    { subject: 'Kimya', topics: [
      { name: 'Organik Kimya', percentage: 95, questions: 5 },
      { name: 'Asit-Baz', percentage: 90, questions: 3 },
      { name: 'Elektrokimya', percentage: 85, questions: 2 },
      { name: 'Kimyasal Denge', percentage: 88, questions: 2 },
      { name: 'Çözeltiler', percentage: 82, questions: 1 }
    ]},
    { subject: 'Biyoloji', topics: [
      { name: 'Genetik', percentage: 95, questions: 4 },
      { name: 'Ekoloji', percentage: 88, questions: 3 },
      { name: 'Bitki Biyolojisi', percentage: 85, questions: 2 },
      { name: 'İnsan Fizyolojisi', percentage: 90, questions: 3 },
      { name: 'Hücre', percentage: 82, questions: 1 }
    ]}
  ];

  const currentTopics = selectedExam === 'TYT' ? tytTopics : aytTopics;
  const hasAccess = user || hasClassViewerSession;

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 bg-red-100';
    if (percentage >= 80) return 'text-orange-600 bg-orange-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getPriorityText = (percentage: number) => {
    if (percentage >= 90) return 'Çok Yüksek';
    if (percentage >= 80) return 'Yüksek';
    if (percentage >= 70) return 'Orta';
    return 'Düşük';
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
            <h3 className="text-2xl font-bold text-blue-600 mb-2">
              {selectedExam === 'TYT' ? '7' : '8'} Yıl
            </h3>
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
            <h3 className="text-2xl font-bold text-purple-600 mb-2">
              %{Math.round(currentTopics.reduce((sum, subject) => 
                sum + subject.topics.reduce((topicSum, topic) => topicSum + topic.percentage, 0), 0
              ) / currentTopics.reduce((sum, subject) => sum + subject.topics.length, 0))}
            </h3>
            <p className="text-gray-600">Ortalama Çıkma Oranı</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="bg-orange-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Award className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-orange-600 mb-2">
              {currentTopics.reduce((sum, subject) => 
                sum + subject.topics.filter(topic => topic.percentage >= 90).length, 0
              )}
            </h3>
            <p className="text-gray-600">Kritik Konu</p>
          </div>
        </div>

        {/* Topics Analysis */}
        <div className="space-y-8">
          {currentTopics.map((subject, subjectIndex) => (
            <div key={subjectIndex} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className={`p-6 ${
                selectedExam === 'TYT' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-purple-500 to-purple-600'
              } text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{subject.subject}</h3>
                    <p className="text-blue-100">
                      {subject.topics.length} konu analizi • 
                      Toplam {subject.topics.reduce((sum, topic) => sum + topic.questions, 0)} soru
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">
                      %{Math.round(subject.topics.reduce((sum, topic) => sum + topic.percentage, 0) / subject.topics.length)}
                    </div>
                    <div className="text-sm text-blue-100">Ortalama Çıkma</div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {hasAccess ? (
                  <div className="space-y-4">
                    {subject.topics.map((topic, topicIndex) => (
                      <div key={topicIndex} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-semibold text-gray-900">{topic.name}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPercentageColor(topic.percentage)}`}>
                              {getPriorityText(topic.percentage)} Öncelik
                            </span>
                          </div>
                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                            <span>Çıkma Oranı: %{topic.percentage}</span>
                            <span>•</span>
                            <span>Ortalama {topic.questions} soru</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                topic.percentage >= 90 ? 'bg-red-500' :
                                topic.percentage >= 80 ? 'bg-orange-500' :
                                topic.percentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${topic.percentage}%` }}
                            ></div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">{topic.percentage}%</div>
                            <div className="text-xs text-gray-500">{topic.questions} soru</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Lock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Detaylı Konu Analizi
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      {subject.subject} konularının detaylı çıkma oranlarını ve soru dağılımlarını görmek için 
                      giriş yapın veya premium pakete geçin.
                    </p>
                    <button
                      onClick={onUpgrade}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Premium'a Geç
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        {hasAccess && (
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
        )}

        {/* Legend */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-4">Öncelik Seviyeleri</h4>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <div>
                <div className="font-medium text-red-600">Çok Yüksek (%90+)</div>
                <div className="text-xs text-gray-500">Mutlaka çalışılması gereken konular</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <div>
                <div className="font-medium text-orange-600">Yüksek (%80-89)</div>
                <div className="text-xs text-gray-500">Öncelikli çalışma konuları</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <div>
                <div className="font-medium text-yellow-600">Orta (%70-79)</div>
                <div className="text-xs text-gray-500">Orta öncelikli konular</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <div>
                <div className="font-medium text-green-600">Düşük (%70-)</div>
                <div className="text-xs text-gray-500">Düşük öncelikli konular</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}