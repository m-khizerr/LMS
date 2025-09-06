import React, { useState } from 'react';
import { useCourses } from '../../contexts/CoursesContext';

const CourseCard = ({ course }) => {
  const { 
    isEnrolled, 
    canEnrollIntoCourse, 
    canDropCourse, 
    enrollInCourse, 
    dropCourse 
  } = useCourses();
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const enrolled = isEnrolled(course.id);
  const enrollCheck = canEnrollIntoCourse(course.id);
  const dropCheck = canDropCourse(course.id);

  const handleEnroll = async () => {
    setLoading(true);
    setMessage('');
    
    const result = enrollInCourse(course.id);
    setMessage(result.message);
    
    setTimeout(() => {
      setMessage('');
      setLoading(false);
    }, 3000);
  };

  const handleDrop = async () => {
    setLoading(true);
    setMessage('');
    
    const result = dropCourse(course.id);
    setMessage(result.message);
    
    setTimeout(() => {
      setMessage('');
      setLoading(false);
    }, 3000);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Computer Science': return 'bg-blue-100 text-blue-800';
      case 'Mathematics': return 'bg-purple-100 text-purple-800';
      case 'Physics': return 'bg-indigo-100 text-indigo-800';
      case 'English': return 'bg-pink-100 text-pink-800';
      case 'Business': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden ${
      enrolled ? 'ring-2 ring-green-500' : ''
    }`}>
      {/* Course Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {course.code} - {course.title}
            </h3>
            <p className="text-sm text-gray-600">
              Instructor: {course.teacher}
            </p>
          </div>
          {enrolled && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Enrolled
            </span>
          )}
        </div>

        {/* Course Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(course.category)}`}>
            {course.category}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
            {course.difficulty}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {course.creditHours} Credits
          </span>
        </div>

        {/* Course Description */}
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Course Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium w-20">Schedule:</span>
            <span>{course.schedule}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium w-20">Location:</span>
            <span>{course.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium w-20">Capacity:</span>
            <span>{course.enrolled}/{course.capacity} students</span>
          </div>
          {course.prerequisites.length > 0 && (
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium w-20">Prerequisites:</span>
              <span>{course.prerequisites.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Enrollment Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Enrollment Status</span>
            <span>{Math.round((course.enrolled / course.capacity) * 100)}% Full</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                course.enrolled >= course.capacity ? 'bg-red-500' : 
                course.enrolled / course.capacity > 0.8 ? 'bg-yellow-500' : 
                'bg-green-500'
              }`}
              style={{ width: `${(course.enrolled / course.capacity) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-4 p-3 rounded-md text-sm ${
            message.includes('Successfully') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {enrolled ? (
            <button
              onClick={handleDrop}
              disabled={loading || !dropCheck.canDrop}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                !dropCheck.canDrop
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
              title={!dropCheck.canDrop ? dropCheck.reason : ''}
            >
              {loading ? 'Processing...' : 'Drop Course'}
            </button>
          ) : (
            <button
              onClick={handleEnroll}
              disabled={loading || !enrollCheck.canEnroll}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                !enrollCheck.canEnroll
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
              title={!enrollCheck.canEnroll ? enrollCheck.reason : ''}
            >
              {loading ? 'Processing...' : 'Enroll'}
            </button>
          )}
          
          <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-600 hover:border-indigo-800 rounded-md transition-colors duration-200">
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;