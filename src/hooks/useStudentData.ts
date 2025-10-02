import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  getStudentData, 
  getExamResults, 
  getHomeworks, 
  getAIRecommendations,
  getClassAssignmentsForStudent,
  getClassAnnouncementsForStudent,
  getClassExamResultsForStudent
} from '../lib/supabase';
import { getStudentClasses } from '../lib/teacherApi';

export const useStudentData = (userId: string | undefined) => {
  const [studentData, setStudentData] = useState<any>(null);
  const [examResults, setExamResults] = useState<any[]>([]);
  const [homeworks, setHomeworks] = useState<any[]>([]);
  const [aiRecommendations, setAIRecommendations] = useState<any[]>([]);
  const [studentClasses, setStudentClasses] = useState<any[]>([]);
  const [classAssignments, setClassAssignments] = useState<any[]>([]);
  const [classAnnouncements, setClassAnnouncements] = useState<any[]>([]);
  const [classExamResults, setClassExamResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudentData = useCallback(async () => {
    console.log('useStudentData - userId:', userId);
    if (!userId) {
      console.log('No userId provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching student data for userId:', userId);
      
      // Tüm verileri paralel olarak çek
      const [
        { data: student },
        { data: exams },
        { data: homeworkList },
        { data: recommendations },
        { data: classes },
        { data: assignments },
        { data: announcements },
        { data: examResults }
      ] = await Promise.all([
        getStudentData(userId),
        getExamResults(userId),
        getHomeworks(userId),
        getAIRecommendations(userId),
        getStudentClasses(userId),
        getClassAssignmentsForStudent(userId),
        getClassAnnouncementsForStudent(userId),
        getClassExamResultsForStudent(userId)
      ]);

      console.log('All data fetched:', {
        student,
        exams: exams?.length,
        homeworkList: homeworkList?.length,
        recommendations: recommendations?.length,
        classes: classes?.length,
        assignments: assignments?.length,
        announcements: announcements?.length,
        examResults: examResults?.length
      });

      setStudentData(student);
      setExamResults(exams || []);
      setHomeworks(homeworkList || []);
      setAIRecommendations(recommendations || []);
      setStudentClasses(classes || []);
      setClassAssignments(assignments || []);
      setClassAnnouncements(announcements || []);
      setClassExamResults(examResults || []);

    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      console.log('Student data fetch completed');
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  // Memoize the returned data to prevent unnecessary re-renders
  const memoizedData = useMemo(() => ({
    studentData,
    examResults,
    homeworks,
    aiRecommendations,
    studentClasses,
    classAssignments,
    classAnnouncements,
    classExamResults,
    loading,
    refetch: fetchStudentData
  }), [
    studentData,
    examResults,
    homeworks,
    aiRecommendations,
    studentClasses,
    classAssignments,
    classAnnouncements,
    classExamResults,
    loading,
    fetchStudentData
  ]);

  return memoizedData;
};