import { useState, useEffect } from 'react';
import { getStudentData, getExamResults, getHomeworks, getAIRecommendations } from '../lib/supabase';
import { getStudentClasses } from '../lib/teacherApi';

export const useStudentData = (userId: string | undefined) => {
  const [studentData, setStudentData] = useState<any>(null);
  const [examResults, setExamResults] = useState<any[]>([]);
  const [homeworks, setHomeworks] = useState<any[]>([]);
  const [aiRecommendations, setAIRecommendations] = useState<any[]>([]);
  const [studentClasses, setStudentClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudentData = async () => {
    console.log('useStudentData - userId:', userId);
    if (!userId) {
      console.log('No userId provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching student data for userId:', userId);
      // Get student profile
      const { data: student } = await getStudentData(userId);
      console.log('Student data received:', student);
      setStudentData(student);

      if (student) {
        // Get exam results
        const { data: exams } = await getExamResults(student.id);
        console.log('Exam results:', exams);
        setExamResults(exams || []);

        // Get homeworks
        const { data: homeworkList } = await getHomeworks(student.id);
        console.log('Homeworks:', homeworkList);
        setHomeworks(homeworkList || []);

        // Get AI recommendations
        const { data: recommendations } = await getAIRecommendations(student.id);
        console.log('AI recommendations:', recommendations);
        setAIRecommendations(recommendations || []);

        // Get student classes
        const { data: classes } = await getStudentClasses(student.id);
        console.log('Student classes:', classes);
        setStudentClasses(classes || []);
      } else {
        console.log('No student data found');
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      console.log('Student data fetch completed');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [userId]);

  return {
    studentData,
    examResults,
    homeworks,
    aiRecommendations,
    studentClasses,
    loading,
    refetch: fetchStudentData
  };
};