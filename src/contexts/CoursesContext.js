import React, { createContext, useContext, useState, useEffect } from 'react';

const CoursesContext = createContext();

export const useCourses = () => {
  const context = useContext(CoursesContext);
  if (!context) {
    throw new Error('useCourses must be used within a CoursesProvider');
  }
  return context;
};

// Sample courses data
const availableCourses = [
  {
    id: 1,
    code: 'CS101',
    title: 'Introduction to Computer Science',
    description: 'Basic concepts of programming, algorithms, and data structures. Perfect for beginners.',
    teacher: 'Dr. Sarah Johnson',
    creditHours: 3,
    semester: 'Fall 2024',
    prerequisites: [],
    schedule: 'Mon, Wed, Fri - 9:00 AM',
    location: 'Room 201, CS Building',
    capacity: 30,
    enrolled: 15,
    category: 'Computer Science',
    difficulty: 'Beginner'
  },
  {
    id: 2,
    code: 'CS201',
    title: 'Data Structures and Algorithms',
    description: 'Advanced data structures, algorithm analysis, and problem-solving techniques.',
    teacher: 'Prof. Michael Chen',
    creditHours: 4,
    semester: 'Fall 2024',
    prerequisites: ['CS101'],
    schedule: 'Tue, Thu - 2:00 PM',
    location: 'Room 305, CS Building',
    capacity: 25,
    enrolled: 18,
    category: 'Computer Science',
    difficulty: 'Intermediate'
  },
  {
    id: 3,
    code: 'MATH201',
    title: 'Calculus II',
    description: 'Integration techniques, infinite series, and applications of calculus.',
    teacher: 'Dr. Emily Rodriguez',
    creditHours: 4,
    semester: 'Fall 2024',
    prerequisites: ['MATH101'],
    schedule: 'Mon, Wed, Fri - 11:00 AM',
    location: 'Room 102, Math Building',
    capacity: 40,
    enrolled: 32,
    category: 'Mathematics',
    difficulty: 'Intermediate'
  },
  {
    id: 4,
    code: 'ENG101',
    title: 'English Composition',
    description: 'Academic writing, research methods, and critical thinking skills.',
    teacher: 'Prof. David Thompson',
    creditHours: 3,
    semester: 'Fall 2024',
    prerequisites: [],
    schedule: 'Tue, Thu - 10:00 AM',
    location: 'Room 150, Liberal Arts',
    capacity: 25,
    enrolled: 20,
    category: 'English',
    difficulty: 'Beginner'
  },
  {
    id: 5,
    code: 'CS301',
    title: 'Database Systems',
    description: 'Database design, SQL, normalization, and database management systems.',
    teacher: 'Dr. Lisa Wang',
    creditHours: 3,
    semester: 'Fall 2024',
    prerequisites: ['CS201'],
    schedule: 'Mon, Wed - 1:00 PM',
    location: 'Room 210, CS Building',
    capacity: 20,
    enrolled: 12,
    category: 'Computer Science',
    difficulty: 'Advanced'
  },
  {
    id: 6,
    code: 'PHYS101',
    title: 'General Physics I',
    description: 'Mechanics, thermodynamics, and wave motion with laboratory component.',
    teacher: 'Dr. Robert Kim',
    creditHours: 4,
    semester: 'Fall 2024',
    prerequisites: ['MATH101'],
    schedule: 'Mon, Wed, Fri - 8:00 AM',
    location: 'Room 301, Physics Building',
    capacity: 30,
    enrolled: 25,
    category: 'Physics',
    difficulty: 'Intermediate'
  },
  {
    id: 7,
    code: 'BUS101',
    title: 'Introduction to Business',
    description: 'Fundamentals of business operations, management, and economics.',
    teacher: 'Prof. Jennifer Adams',
    creditHours: 3,
    semester: 'Fall 2024',
    prerequisites: [],
    schedule: 'Tue, Thu - 9:00 AM',
    location: 'Room 120, Business Building',
    capacity: 35,
    enrolled: 28,
    category: 'Business',
    difficulty: 'Beginner'
  },
  {
    id: 8,
    code: 'CS401',
    title: 'Software Engineering',
    description: 'Software development lifecycle, project management, and team collaboration.',
    teacher: 'Dr. Alex Martinez',
    creditHours: 4,
    semester: 'Fall 2024',
    prerequisites: ['CS301'],
    schedule: 'Mon, Wed - 3:00 PM',
    location: 'Room 405, CS Building',
    capacity: 15,
    enrolled: 10,
    category: 'Computer Science',
    difficulty: 'Advanced'
  }
];

export const CoursesProvider = ({ children }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load enrolled courses from localStorage
    const savedCourses = localStorage.getItem('enrolledCourses');
    if (savedCourses) {
      setEnrolledCourses(JSON.parse(savedCourses));
    }
    setLoading(false);
  }, []);

  // Save to localStorage whenever enrolled courses change
  useEffect(() => {
    localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
  }, [enrolledCourses]);

  const getTotalCreditHours = () => {
    return enrolledCourses.reduce((total, courseId) => {
      const course = availableCourses.find(c => c.id === courseId);
      return total + (course ? course.creditHours : 0);
    }, 0);
  };

  const isEnrolled = (courseId) => {
    return enrolledCourses.includes(courseId);
  };

  const canEnrollIntoCourse = (courseId) => {
    const course = availableCourses.find(c => c.id === courseId);
    if (!course) return { canEnroll: false, reason: 'Course not found' };

    if (isEnrolled(courseId)) {
      return { canEnroll: false, reason: 'Already enrolled' };
    }

    const currentCreditHours = getTotalCreditHours();
    const newTotal = currentCreditHours + course.creditHours;

    if (newTotal > 25) {
      return { 
        canEnroll: false, 
        reason: `Would exceed maximum credit hours (${newTotal}/25)` 
      };
    }

    // Check if course is full
    if (course.enrolled >= course.capacity) {
      return { canEnroll: false, reason: 'Course is full' };
    }

    // Check prerequisites (simplified - assumes user has all prerequisites)
    // In a real app, you'd check against user's completed courses
    return { canEnroll: true, reason: '' };
  };

  const canDropCourse = (courseId) => {
    if (!isEnrolled(courseId)) {
      return { canDrop: false, reason: 'Not enrolled in this course' };
    }

    const course = availableCourses.find(c => c.id === courseId);
    const currentCreditHours = getTotalCreditHours();
    const newTotal = currentCreditHours - course.creditHours;

    if (newTotal < 18) {
      return { 
        canDrop: false, 
        reason: `Would be below minimum credit hours (${newTotal}/18)` 
      };
    }

    return { canDrop: true, reason: '' };
  };

  const enrollInCourse = (courseId) => {
    const { canEnroll, reason } = canEnrollIntoCourse(courseId);
    
    if (canEnroll) {
      setEnrolledCourses(prev => [...prev, courseId]);
      return { success: true, message: 'Successfully enrolled in course!' };
    } else {
      return { success: false, message: reason };
    }
  };

  const dropCourse = (courseId) => {
    const { canDrop, reason } = canDropCourse(courseId);
    
    if (canDrop) {
      setEnrolledCourses(prev => prev.filter(id => id !== courseId));
      return { success: true, message: 'Successfully dropped course!' };
    } else {
      return { success: false, message: reason };
    }
  };

  const getEnrolledCoursesDetails = () => {
    return enrolledCourses.map(courseId => 
      availableCourses.find(course => course.id === courseId)
    ).filter(Boolean);
  };

  const value = {
    availableCourses,
    enrolledCourses,
    loading,
    getTotalCreditHours,
    isEnrolled,
    canEnrollIntoCourse,
    canDropCourse,
    enrollInCourse,
    dropCourse,
    getEnrolledCoursesDetails
  };

  return (
    <CoursesContext.Provider value={value}>
      {children}
    </CoursesContext.Provider>
  );
};