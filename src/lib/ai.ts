// AI Analysis Service
// Bu dosya yapay zeka analizleri için gerekli fonksiyonları içerir

interface ExamAnalysis {
  weaknesses: string[];
  strengths: string[];
  recommendations: string[];
  studyPlan: StudyPlanItem[];
  trends: TrendAnalysis[];
  emptyAnswerWarnings: string[];
}

interface StudyPlanItem {
  subject: string;
  topic: string;
  priority: 'high' | 'medium' | 'low';
  estimatedHours: number;
  description: string;
}

interface TrendAnalysis {
  subject: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  change: number;
  message: string;
}

interface TopicPerformance {
  topic: string;
  subject: string;
  successRate: number;
  totalQuestions: number;
  correctAnswers: number;
}

// Gelişmiş AI Analysis - Son 5 denemeyi analiz eder
export const analyzeExamResults = async (examResults: any[]): Promise<ExamAnalysis> => {
  const analysis: ExamAnalysis = {
    weaknesses: [],
    strengths: [],
    recommendations: [],
    studyPlan: [],
    trends: [],
    emptyAnswerWarnings: []
  };

  if (examResults.length === 0) {
    return analysis;
  }

  // Son 5 denemeyi al ve tarihe göre sırala
  const recentExams = examResults
    .sort((a, b) => new Date(b.exam_date).getTime() - new Date(a.exam_date).getTime())
    .slice(0, 5);

  // Trend analizi yap
  const trends = analyzeTrends(recentExams);
  analysis.trends = trends;

  // Boş bırakma analizi
  const emptyAnswerAnalysis = analyzeEmptyAnswers(recentExams);
  analysis.emptyAnswerWarnings = emptyAnswerAnalysis;

  // Genel performans analizi
  const subjectAverages = calculateDetailedSubjectAverages(recentExams);
  
  // Zayıflıkları tespit et (son 3 denemede düşüş veya düşük performans)
  Object.entries(subjectAverages).forEach(([subject, data]: [string, any]) => {
    if (data.average < 8) { // 8 netten az
      analysis.weaknesses.push(`${subject}: Ortalama ${data.average.toFixed(1)} net - Temel konularda eksiklik`);
      analysis.studyPlan.push({
        subject,
        topic: 'Temel Konular',
        priority: 'high',
        estimatedHours: 15,
        description: `${subject} temel konularını güçlendirin. Günlük 2 saat çalışma öneriyoruz.`
      });
    } else if (data.trend === 'decreasing') {
      analysis.weaknesses.push(`${subject}: Son denemelerinizde düşüş var (${data.change.toFixed(1)} net azalma)`);
      analysis.recommendations.push(`${subject} konusunda son performansınızda düşüş görülüyor. Bu alana odaklanın.`);
    }
  });

  // Güçlü yönleri tespit et
  Object.entries(subjectAverages).forEach(([subject, data]: [string, any]) => {
    if (data.average > 15) { // 15 netten fazla
      analysis.strengths.push(`${subject}: Güçlü performans (Ortalama ${data.average.toFixed(1)} net)`);
      if (data.trend === 'increasing') {
        analysis.recommendations.push(`${subject} konusunda harika bir yükseliş var! Bu motivasyonu koruyun.`);
      }
    }
  });

  // Genel öneriler
  if (recentExams.length >= 3) {
    const overallTrend = calculateOverallTrend(recentExams);
    if (overallTrend > 5) {
      analysis.recommendations.push('Genel performansınız yükselişte! Bu çalışma temposunu koruyun.');
    } else if (overallTrend < -5) {
      analysis.recommendations.push('Son denemelerinizde genel bir düşüş var. Çalışma programınızı gözden geçirin.');
      analysis.studyPlan.push({
        subject: 'Genel',
        topic: 'Çalışma Planı',
        priority: 'high',
        estimatedHours: 20,
        description: 'Çalışma programınızı yeniden düzenleyin. Zayıf olduğunuz konulara daha fazla zaman ayırın.'
      });
    }
  }

  return analysis;
};

// Trend analizi - son 5 denemeye bakar
const analyzeTrends = (exams: any[]): TrendAnalysis[] => {
  if (exams.length < 3) return [];

  const trends: TrendAnalysis[] = [];
  const subjects = ['Türkçe', 'Matematik', 'Fen', 'Sosyal'];

  subjects.forEach(subject => {
    const nets = exams.map(exam => getSubjectNet(exam, subject)).filter(net => net !== null);
    
    if (nets.length >= 3) {
      const recent = nets.slice(0, 3); // Son 3 deneme
      const older = nets.slice(3); // Önceki denemeler
      
      const recentAvg = recent.reduce((sum, net) => sum + net, 0) / recent.length;
      const olderAvg = older.length > 0 ? older.reduce((sum, net) => sum + net, 0) / older.length : recentAvg;
      
      const change = recentAvg - olderAvg;
      
      let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
      let message = '';
      
      if (change > 1) {
        trend = 'increasing';
        message = `${subject} konusunda son denemelerinizde ${change.toFixed(1)} net artış var! 📈`;
      } else if (change < -1) {
        trend = 'decreasing';
        message = `${subject} konusunda son denemelerinizde ${Math.abs(change).toFixed(1)} net düşüş var. ⚠️`;
      } else {
        message = `${subject} konusunda performansınız stabil.`;
      }
      
      trends.push({
        subject,
        trend,
        change,
        message
      });
    }
  });

  return trends;
};

// Boş bırakma analizi
const analyzeEmptyAnswers = (exams: any[]): string[] => {
  const warnings: string[] = [];
  
  exams.forEach(exam => {
    if (exam.exam_details) {
      const details = JSON.parse(exam.exam_details);
      const subjects = ['Türkçe', 'Matematik', 'Fen', 'Sosyal'];
      
      subjects.forEach(subject => {
        const { correct, wrong, total } = getSubjectStats(details, subject, exam.exam_type);
        const empty = total - correct - wrong;
        
        if (empty > total * 0.3) { // %30'dan fazla boş
          warnings.push(`${subject}: ${empty} soru boş bırakılmış (${((empty/total)*100).toFixed(0)}%). Bu konularda eksikleriniz olabilir.`);
        }
      });
    }
  });

  return [...new Set(warnings)]; // Tekrarları kaldır
};

// Detaylı konu analizi
const getSubjectStats = (details: any, subject: string, examType: string) => {
  let correct = 0, wrong = 0, total = 0;
  
  if (examType === 'TYT' || examType === 'AYT') {
    switch (subject) {
      case 'Türkçe':
        correct = parseInt(details.tyt_turkce_dogru || 0);
        wrong = parseInt(details.tyt_turkce_yanlis || 0);
        total = 40;
        break;
      case 'Matematik':
        if (examType === 'AYT' && details.ayt_matematik_dogru) {
          correct = parseInt(details.ayt_matematik_dogru || 0);
          wrong = parseInt(details.ayt_matematik_yanlis || 0);
          total = 40;
        } else {
          correct = parseInt(details.tyt_matematik_dogru || 0);
          wrong = parseInt(details.tyt_matematik_yanlis || 0);
          total = 40;
        }
        break;
      case 'Fen':
        if (examType === 'AYT') {
          const fizik_d = parseInt(details.ayt_fizik_dogru || 0);
          const fizik_y = parseInt(details.ayt_fizik_yanlis || 0);
          const kimya_d = parseInt(details.ayt_kimya_dogru || 0);
          const kimya_y = parseInt(details.ayt_kimya_yanlis || 0);
          const biyoloji_d = parseInt(details.ayt_biyoloji_dogru || 0);
          const biyoloji_y = parseInt(details.ayt_biyoloji_yanlis || 0);
          correct = fizik_d + kimya_d + biyoloji_d;
          wrong = fizik_y + kimya_y + biyoloji_y;
          total = 40;
        } else {
          correct = parseInt(details.tyt_fen_dogru || 0);
          wrong = parseInt(details.tyt_fen_yanlis || 0);
          total = 20;
        }
        break;
      case 'Sosyal':
        correct = parseInt(details.tyt_sosyal_dogru || 0);
        wrong = parseInt(details.tyt_sosyal_yanlis || 0);
        total = 20;
        break;
    }
  } else if (examType === 'LGS') {
    switch (subject) {
      case 'Türkçe':
        correct = parseInt(details.lgs_turkce_dogru || 0);
        wrong = parseInt(details.lgs_turkce_yanlis || 0);
        total = 20;
        break;
      case 'Matematik':
        correct = parseInt(details.lgs_matematik_dogru || 0);
        wrong = parseInt(details.lgs_matematik_yanlis || 0);
        total = 20;
        break;
      case 'Fen':
        correct = parseInt(details.lgs_fen_dogru || 0);
        wrong = parseInt(details.lgs_fen_yanlis || 0);
        total = 20;
        break;
    }
  }
  
  return { correct, wrong, total };
};

// Konu bazında net hesaplama
const getSubjectNet = (exam: any, subject: string): number | null => {
  if (!exam.exam_details) return null;
  
  const details = JSON.parse(exam.exam_details);
  const { correct, wrong } = getSubjectStats(details, subject, exam.exam_type);
  
  return Math.max(0, correct - (wrong / 4));
};

export const generateMotivationalMessage = (studentData: any): string => {
  const messages = [
    'Bugün dün yapamadığın bir şeyi yapabilirsin! 💪',
    'Her çalıştığın dakika seni hedefe bir adım daha yaklaştırıyor! 🎯',
    'Başarı, küçük çabaların günlük tekrarıdır. Devam et! ⭐',
    'Sen yapabilirsin! Her zorluk, seni daha güçlü yapıyor. 🚀',
    'Bugün kendine yatırım yap, yarın kendine teşekkür et! 📚',
    'Hayallerinin peşinden koşmaya devam et! 🌟',
    'Her yeni gün, yeni bir fırsat demektir! 🌅',
    'Azim ve kararlılık her kapıyı açar! 🔑',
    'Başarı yolunda her adım değerlidir! 👣',
    'Kendine inan, çünkü sen eşsizsin! ✨'
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};

// Helper functions
const calculateDetailedSubjectAverages = (examResults: any[]): Record<string, any> => {
  const subjects = ['Türkçe', 'Matematik', 'Fen', 'Sosyal'];
  const averages: Record<string, any> = {};
  
  subjects.forEach(subject => {
    const nets = examResults.map(exam => getSubjectNet(exam, subject)).filter(net => net !== null);
    
    if (nets.length > 0) {
      const average = nets.reduce((sum, net) => sum + net, 0) / nets.length;
      
      // Trend hesaplama
      let trend = 'stable';
      let change = 0;
      
      if (nets.length >= 3) {
        const recent = nets.slice(0, 2).reduce((sum, net) => sum + net, 0) / 2;
        const older = nets.slice(2).reduce((sum, net) => sum + net, 0) / (nets.length - 2);
        change = recent - older;
        
        if (change > 0.5) trend = 'increasing';
        else if (change < -0.5) trend = 'decreasing';
      }
      
      averages[subject] = { average, trend, change };
    }
  });
  
  return averages;
};

const calculateOverallTrend = (examResults: any[]): number => {
  if (examResults.length < 2) return 0;
  
  const scores = examResults.map(exam => exam.total_score || 0);
  const recent = scores.slice(0, 2).reduce((sum, score) => sum + score, 0) / 2;
  const older = scores.slice(2).reduce((sum, score) => sum + score, 0) / (scores.length - 2);
  
  return recent - older;
};

export const detectTopicWeaknesses = (topicScores: TopicPerformance[]): string[] => {
  const weaknesses: string[] = [];
  
  topicScores.forEach(topic => {
    if (topic.successRate < 50) {
      weaknesses.push(`${topic.subject} - ${topic.topic}: %${topic.successRate.toFixed(0)} başarı`);
    }
  });
  
  return weaknesses;
};

export const generateStudyRecommendations = (weaknesses: string[]): string[] => {
  const recommendations: string[] = [];
  
  weaknesses.forEach(weakness => {
    if (weakness.includes('Matematik')) {
      recommendations.push('Matematik için günlük 1 saat problem çözümü yapın');
    } else if (weakness.includes('Fen')) {
      recommendations.push('Fen konularında kavramsal öğrenmeye odaklanın');
    } else if (weakness.includes('Türkçe')) {
      recommendations.push('Türkçe için günlük okuma alışkanlığı edinin');
    }
  });
  
  return recommendations;
};