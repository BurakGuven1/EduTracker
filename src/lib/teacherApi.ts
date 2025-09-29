import { supabase } from './supabase';
import { Teacher, Class, ClassStudent, ClassPayment, PACKAGE_OPTIONS } from '../types/teacher';

// Teacher Authentication
export const registerTeacher = async (teacherData: {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  school_name?: string;
}) => {
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(teacherData.email)) {
    throw new Error('Geçersiz email formatı');
  }

  // Validate password strength
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(teacherData.password)) {
    throw new Error('Şifre en az 8 karakter, 1 büyük harf ve 1 rakam içermelidir');
  }

  // Validate phone number (10 digits)
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(teacherData.phone.replace(/\D/g, ''))) {
    throw new Error('Telefon numarası 10 haneli olmalıdır');
  }

  // Check if email already exists
  const { data: existingTeacher } = await supabase
    .from('teachers')
    .select('id')
    .eq('email', teacherData.email)
    .maybeSingle();

  if (existingTeacher) {
    throw new Error('Bu email adresi zaten kullanılıyor');
  }

  // Check if phone already exists
  const { data: existingPhone } = await supabase
    .from('teachers')
    .select('id')
    .eq('phone', teacherData.phone)
    .maybeSingle();

  if (existingPhone) {
    throw new Error('Bu telefon numarası zaten kullanılıyor');
  }

  // Create teacher record
  const { data, error } = await supabase
    .from('teachers')
    .insert([{
      email: teacherData.email,
      password_hash: teacherData.password, // In production, hash this properly
      full_name: teacherData.full_name,
      phone: teacherData.phone,
      school_name: teacherData.school_name,
      email_confirmed: false, // Will be true after email verification
      email_confirmation_token: generateConfirmationToken()
    }])
    .select()
    .single();

  if (error) throw error;

  // TODO: Send email confirmation
  await sendEmailConfirmation(teacherData.email, generateConfirmationToken());

  return { data, error: null };
};

export const loginTeacher = async (email: string, password: string) => {
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('email', email)
    .eq('password_hash', password)
    .single();

  if (error || !data) {
    throw new Error('Email veya şifre hatalı');
  }

  if (!data.email_confirmed) {
    throw new Error('Email adresinizi doğrulamanız gerekiyor. Kayıt sırasında gönderilen doğrulama linkine tıklayın.');
  }

  return { data, error: null };
};

// Email confirmation
export const confirmTeacherEmail = async (token: string) => {
  const { data, error } = await supabase
    .from('teachers')
    .update({ 
      email_confirmed: true,
      email_confirmation_token: null 
    })
    .eq('email_confirmation_token', token)
    .select()
    .single();

  if (error || !data) {
    throw new Error('Geçersiz veya süresi dolmuş doğrulama linki');
  }

  return { data, error: null };
};

// Resend confirmation email
export const resendConfirmationEmail = async (email: string) => {
  const { data: teacher } = await supabase
    .from('teachers')
    .select('id, email_confirmed, email_confirmation_token')
    .eq('email', email)
    .single();

  if (!teacher) {
    throw new Error('Bu email adresi ile kayıtlı öğretmen bulunamadı');
  }

  if (teacher.email_confirmed) {
    throw new Error('Email adresiniz zaten doğrulanmış');
  }

  // Generate new token if needed
  const newToken = teacher.email_confirmation_token || generateConfirmationToken();
  
  if (!teacher.email_confirmation_token) {
    await supabase
      .from('teachers')
      .update({ email_confirmation_token: newToken })
      .eq('id', teacher.id);
  }

  // TODO: Send email confirmation
  // await sendEmailConfirmation(email, newToken);
  
  return { success: true };
};

// Mock email sending function (replace with real email service)
const sendEmailConfirmation = async (email: string, token: string) => {
  // This would integrate with a real email service like SendGrid, AWS SES, etc.
  const confirmationUrl = `${window.location.origin}/confirm-email?token=${token}`;
  
  console.log(`
    📧 EMAIL CONFIRMATION
    To: ${email}
    Subject: EduTracker - Email Adresinizi Doğrulayın
    
    Merhaba,
    
    EduTracker öğretmen hesabınızı aktifleştirmek için aşağıdaki linke tıklayın:
    ${confirmationUrl}
    
    Bu link 24 saat geçerlidir.
    
    Teşekkürler,
    EduTracker Ekibi
  `);
  
  // For demo purposes, show an alert
  alert(`Demo: Email doğrulama linki konsola yazdırıldı. Gerçek uygulamada ${email} adresine gönderilecek.`);
};

// Class Management
export const createClass = async (classData: {
  teacher_id: string;
  class_name: string;
  description?: string;
  student_capacity: number;
  package_type: 'monthly' | '3_months' | '9_months';
}) => {
  // Validate teacher email confirmation
  const { data: teacher } = await supabase
    .from('teachers')
    .select('email_confirmed')
    .eq('id', classData.teacher_id)
    .single();

  if (!teacher?.email_confirmed) {
    throw new Error('Email adresinizi doğrulamanız gerekiyor');
  }

  // Validate class name
  if (classData.class_name.length < 3 || classData.class_name.length > 50) {
    throw new Error('Sınıf adı 3-50 karakter arasında olmalıdır');
  }

  // Validate capacity
  if (classData.student_capacity < 5 || classData.student_capacity > 40) {
    throw new Error('Sınıf kapasitesi 5-40 öğrenci arasında olmalıdır');
  }

  // Check if class name is unique for this teacher
  const { data: existingClass } = await supabase
    .from('classes')
    .select('id')
    .eq('teacher_id', classData.teacher_id)
    .eq('class_name', classData.class_name)
    .single();

  if (existingClass) {
    throw new Error('Bu sınıf adını zaten kullanıyorsunuz');
  }

  // Calculate pricing
  const packageOption = PACKAGE_OPTIONS.find(p => p.type === classData.package_type);
  if (!packageOption) {
    throw new Error('Geçersiz paket tipi');
  }

  const pricePerStudent = packageOption.price_per_student;
  const totalPrice = pricePerStudent * classData.student_capacity * packageOption.duration_months;

  // Create class
  const { data, error } = await supabase
    .from('classes')
    .insert([{
      ...classData,
      price_per_student: pricePerStudent,
      total_price: totalPrice,
      status: 'pending_payment'
    }])
    .select()
    .single();

  if (error) throw error;

  return { data, error: null };
};

export const getTeacherClasses = async (teacherId: string) => {
  const { data, error } = await supabase
    .from('classes')
    .select(`
      *,
      class_students (
        *,
        students (
          *,
          profiles (*)
        )
      )
    `)
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false });

  return { data, error };
};

export const joinClassWithCode = async (studentId: string, inviteCode: string) => {
  // Find class by invite code
  const { data: classData, error: classError } = await supabase
    .from('classes')
    .select('*')
    .eq('invite_code', inviteCode.toUpperCase())
    .single();

  if (classError || !classData) {
    throw new Error('Geçersiz davet kodu');
  }

  // Check if class is active
  if (classData.status !== 'active') {
    throw new Error('Sınıf aktif değil. Ödeme tamamlanmamış olabilir.');
  }

  // Check capacity
  if (classData.current_students >= classData.student_capacity) {
    throw new Error('Sınıf kapasitesi dolu');
  }

  // Check if student already in this class
  const { data: existingMembership } = await supabase
    .from('class_students')
    .select('id')
    .eq('class_id', classData.id)
    .eq('student_id', studentId)
    .single();

  if (existingMembership) {
    throw new Error('Bu sınıfa zaten katıldınız');
  }

  // Check student's class count (max 3)
  const { data: studentClasses } = await supabase
    .from('class_students')
    .select('id')
    .eq('student_id', studentId)
    .eq('status', 'active');

  if (studentClasses && studentClasses.length >= 3) {
    throw new Error('Maksimum 3 sınıfa katılabilirsiniz');
  }

  // Join class
  const { data, error } = await supabase
    .from('class_students')
    .insert([{
      class_id: classData.id,
      student_id: studentId,
      status: 'active'
    }])
    .select()
    .single();

  if (error) throw error;

  return { data: { ...data, class: classData }, error: null };
};

export const getStudentClasses = async (studentId: string) => {
  const { data, error } = await supabase
    .from('class_students')
    .select(`
      *,
      classes (
        *,
        teachers (
          full_name,
          school_name
        )
      )
    `)
    .eq('student_id', studentId)
    .eq('status', 'active');

  return { data, error };
};

export const leaveClass = async (studentId: string, classId: string) => {
  // Check if student joined less than 24 hours ago
  const { data: membership } = await supabase
    .from('class_students')
    .select('joined_at')
    .eq('student_id', studentId)
    .eq('class_id', classId)
    .single();

  if (membership) {
    const joinedAt = new Date(membership.joined_at);
    const now = new Date();
    const hoursDiff = (now.getTime() - joinedAt.getTime()) / (1000 * 60 * 60);

    if (hoursDiff < 24) {
      throw new Error('Sınıfa katıldıktan sonra 24 saat içinde ayrılamazsınız');
    }
  }

  const { data, error } = await supabase
    .from('class_students')
    .update({ status: 'left' })
    .eq('student_id', studentId)
    .eq('class_id', classId)
    .select()
    .single();

  return { data, error };
};

// Utility functions
const generateConfirmationToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const calculateClassPrice = (studentCount: number, packageType: 'monthly' | '3_months' | '9_months') => {
  const packageOption = PACKAGE_OPTIONS.find(p => p.type === packageType);
  if (!packageOption) return 0;

  const monthlyPrice = packageOption.price_per_student * studentCount;
  const totalPrice = monthlyPrice * packageOption.duration_months;
  const originalPrice = 40 * studentCount * packageOption.duration_months;
  const savings = originalPrice - totalPrice;

  return {
    monthlyPrice,
    totalPrice,
    originalPrice,
    savings,
    pricePerStudent: packageOption.price_per_student,
    duration: packageOption.duration_months
  };
};