/*
  # Fix RLS Policies to Prevent Infinite Recursion

  1. Policy Updates
    - Simplify classes RLS policies to avoid circular references
    - Simplify class_students RLS policies to avoid deep joins
    - Remove complex subqueries that cause recursion

  2. Security
    - Maintain security while avoiding recursion
    - Use simpler policy conditions
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Teachers can manage own classes" ON classes;
DROP POLICY IF EXISTS "Students can view classes they joined" ON classes;
DROP POLICY IF EXISTS "Teachers can manage class students" ON class_students;
DROP POLICY IF EXISTS "Students can view own class memberships" ON class_students;

-- Create simplified policies for classes table
CREATE POLICY "Teachers can manage own classes"
  ON classes
  FOR ALL
  TO public
  USING (teacher_id = uid())
  WITH CHECK (teacher_id = uid());

CREATE POLICY "Public can view active classes"
  ON classes
  FOR SELECT
  TO public
  USING (status = 'active');

-- Create simplified policies for class_students table
CREATE POLICY "Teachers can manage class students"
  ON class_students
  FOR ALL
  TO public
  USING (
    class_id IN (
      SELECT id FROM classes WHERE teacher_id = uid()
    )
  );

CREATE POLICY "Students can view own memberships"
  ON class_students
  FOR SELECT
  TO public
  USING (
    student_id IN (
      SELECT id FROM students WHERE user_id = uid()
    )
  );

CREATE POLICY "Students can join classes"
  ON class_students
  FOR INSERT
  TO public
  WITH CHECK (
    student_id IN (
      SELECT id FROM students WHERE user_id = uid()
    )
  );