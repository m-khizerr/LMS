import React, { useState } from 'react';
import { useCourses } from '../../contexts/CoursesContext';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../layout/Header';
import CourseCard from './CourseCard';

const Courses = () => {
  const { availableCourses, getTotalCreditHours, getEnrolledCoursesDetails, loading } = useCourses();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showEnrolledOnly, setShowEnrolledOnly] = useState(false);

  const totalCreditHours = getTotalCreditHours();
  const enrolledCoursesDetails = getEnrolledCoursesDetails();

  // Get unique categories and difficulties for filters
  const categories = [...new Set(availableCourses.map(course => course.category))];
  const difficulties = [...new Set(availableCourses.map(course => course.difficulty))];

  // Filter courses based on search and filters
  const filteredCourses = availableCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || course.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === '' || course.difficulty === selectedDifficulty;
    const matchesEnrollmentFilter = !showEnrolledOnly || enrolledCoursesDetails.some(enrolled => enrolled.id === course.id);

    return matchesSearch && matchesCategory && matchesDifficulty && matchesEnrollmentFilter;
  });

  const getCreditHourStatus = () => {
    if (totalCreditHours < 18) {
      return {
        status: 'warning',
        message: `You need ${18 - totalCreditHours} more credit hours to meet the minimum requirement.`,
        color: 'text-yellow-600 bg-yellow-50 border-yellow-200'
      };
    } else if (totalCreditHours > 25) {
      return {
        status: 'error',
        message: `You have exceeded the maximum credit hours by ${totalCreditHours - 25}.`,
        color: 'text-red-600 bg-red-50 border-red-200'
      };
    } else {
      return {
        status: 'success',
        message: `You have ${totalCreditHours} credit hours. You can take ${25 - totalCreditHours} more.`,
        color: 'text-green-600 bg-green-50 border-green-200'
      };
    }
  };

  const creditHourStatus = getCreditHourStatus();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Catalog</h1>
            <p className="text-gray-600">
              Browse and enroll in courses for Fall 2024 semester.
            </p>
          </div>

          {/* Credit Hours Status */}
          <div className={`mb-6 p-4 rounded-lg border ${creditHourStatus.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Credit Hours Status</h3>
                <p className="text-sm mt-1">{creditHourStatus.message}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{totalCreditHours}</div>
                <div className="text-sm text-gray-600">/ 25 max hours</div>
              </div>
            </div>
            
            {/* Credit Hours Progress Bar */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    totalCreditHours < 18 ? 'bg-yellow-500' :
                    totalCreditHours > 25 ? 'bg-red-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((totalCreditHours / 25) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Min: 18</span>
                <span>Current: {totalCreditHours}</span>
                <span>Max: 25</span>
              </div>
            </div>
          </div>

          {/* Enrolled Courses Summary */}
          {enrolledCoursesDetails.length > 0 && (
            <div className="mb-6 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Your Enrolled Courses ({enrolledCoursesDetails.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {enrolledCoursesDetails.map(course => (
                  <div key={course.id} className="border border-green-200 rounded-lg p-3 bg-green-50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm text-gray-900">{course.code}</h4>
                      <span className="text-xs text-green-600 font-medium">{course.creditHours} credits</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{course.title}</p>
                    <p className="text-xs text-gray-600">{course.teacher}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="mb-6 bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Courses
                </label>
                <input
                  type="text"
                  placeholder="Search by title, code, or instructor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  <option value="">All Levels</option>
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>

              {/* Enrolled Only Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  View Options
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showEnrolledOnly}
                    onChange={(e) => setShowEnrolledOnly(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enrolled courses only</span>
                </label>
              </div>
            </div>

            {/* Results Summary */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {filteredCourses.length} of {availableCourses.length} courses
                {searchTerm && ` for "${searchTerm}"`}
                {selectedCategory && ` in ${selectedCategory}`}
                {selectedDifficulty && ` at ${selectedDifficulty} level`}
              </p>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {/* No Results Message */}
          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or browse all available courses.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedDifficulty('');
                  setShowEnrolledOnly(false);
                }}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Courses;