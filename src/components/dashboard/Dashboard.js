import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCourses } from '../../contexts/CoursesContext';
import Header from '../layout/Header';

const Dashboard = () => {
  const { user } = useAuth();
  const { getTotalCreditHours, getEnrolledCoursesDetails } = useCourses();

  const totalCreditHours = getTotalCreditHours();
  const enrolledCourses = getEnrolledCoursesDetails();

  const stats = [
    { 
      name: 'Enrolled Courses', 
      value: enrolledCourses.length.toString(), 
      change: '+2 this semester', 
      changeType: 'positive' 
    },
    { 
      name: 'Credit Hours', 
      value: totalCreditHours.toString(), 
      change: `${25 - totalCreditHours} remaining`, 
      changeType: totalCreditHours >= 18 ? 'positive' : 'negative' 
    },
    { 
      name: 'Pending Tasks', 
      value: '5', 
      change: '-1.39%', 
      changeType: 'negative' 
    },
    { 
      name: 'Average Grade', 
      value: '85%', 
      change: '+10.18%', 
      changeType: 'positive' 
    },
  ];

  const recentCourses = enrolledCourses.slice(0, 4).map(course => ({
    id: course.id,
    name: course.title,
    progress: Math.floor(Math.random() * 40) + 60, // Random progress for demo
    lastAccessed: `${Math.floor(Math.random() * 5) + 1} ${Math.random() > 0.5 ? 'hours' : 'days'} ago`,
    instructor: course.teacher
  }));

  const upcomingAssignments = [
    { 
      id: 1, 
      title: 'React Project Submission', 
      course: enrolledCourses.find(c => c.code.includes('CS')) ? enrolledCourses.find(c => c.code.includes('CS')).title : 'Introduction to React', 
      dueDate: 'Tomorrow', 
      priority: 'high',
      points: 100
    },
    { 
      id: 2, 
      title: 'JavaScript Quiz', 
      course: 'Advanced JavaScript', 
      dueDate: 'In 3 days', 
      priority: 'medium',
      points: 50
    },
    { 
      id: 3, 
      title: 'Database Schema Design', 
      course: 'Database Design', 
      dueDate: 'Next week', 
      priority: 'low',
      points: 75
    },
  ];

  const announcements = [
    {
      id: 1,
      title: 'Course Registration Reminder',
      message: `You currently have ${totalCreditHours} credit hours. ${totalCreditHours < 18 ? 'You need more courses to meet the minimum requirement.' : totalCreditHours > 25 ? 'You have exceeded the maximum credit hours.' : 'You are within the required credit hour range.'}`,
      date: '2 hours ago',
      type: totalCreditHours < 18 || totalCreditHours > 25 ? 'warning' : 'success'
    },
    {
      id: 2,
      title: 'New Course Available',
      message: 'Check out the new "Advanced React Patterns" course now available in the catalog.',
      date: '1 day ago',
      type: 'success'
    },
    {
      id: 3,
      title: 'Assignment Deadline Reminder',
      message: 'Don\'t forget about your React project submission due tomorrow!',
      date: '2 days ago',
      type: 'warning'
    }
  ];

  const getCreditHourStatus = () => {
    if (totalCreditHours < 18) {
      return { status: 'warning', message: `Need ${18 - totalCreditHours} more credit hours` };
    } else if (totalCreditHours > 25) {
      return { status: 'error', message: `${totalCreditHours - 25} hours over limit` };
    } else {
      return { status: 'success', message: 'Credit hours in range' };
    }
  };

  const creditStatus = getCreditHourStatus();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {user?.name}! Here's your learning overview for today.
            </p>
          </div>

          {/* Credit Hours Alert */}
          {(totalCreditHours < 18 || totalCreditHours > 25) && (
            <div className={`mb-6 p-4 rounded-lg border ${
              totalCreditHours < 18 
                ? 'bg-yellow-50 border-yellow-200 text-yellow-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-lg">⚠️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">
                    {totalCreditHours < 18 ? 'Credit Hours Below Minimum' : 'Credit Hours Exceed Maximum'}
                  </h3>
                  <p className="text-sm mt-1">
                    {totalCreditHours < 18 
                      ? `You need to enroll in ${18 - totalCreditHours} more credit hours to meet the minimum requirement.`
                      : `You have ${totalCreditHours - 25} credit hours over the maximum limit. Please drop some courses.`
                    }
                  </p>
                  <a 
                    href="/courses" 
                    className="text-sm font-medium underline hover:no-underline mt-1 inline-block"
                  >
                    Go to Course Catalog →
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((item) => (
              <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 truncate">{item.name}</p>
                      <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm">
                      <span className={`font-medium ${
                        item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.change}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Courses */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    {enrolledCourses.length > 0 ? 'Your Enrolled Courses' : 'Recent Courses'}
                  </h3>
                </div>
                <div className="p-6">
                  {enrolledCourses.length > 0 ? (
                    <div className="space-y-6">
                      {recentCourses.map((course) => (
                        <div key={course.id} className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium text-gray-900">{course.name}</p>
                              <span className="text-xs text-gray-500">{course.progress}% complete</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">
                              Instructor: {course.instructor} • Last accessed {course.lastAccessed}
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 text-4xl mb-4">📚</div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No Enrolled Courses</h4>
                      <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
                      <a 
                        href="/courses"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Browse Courses
                      </a>
                    </div>
                  )}
                  {enrolledCourses.length > 0 && (
                    <div className="mt-6">
                      <a 
                        href="/courses"
                        className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium block"
                      >
                        View All Courses →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Announcements */}
            <div>
              <div className="bg-white shadow rounded-lg mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Announcements</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className="border-l-4 border-blue-400 pl-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {announcement.title}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {announcement.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {announcement.date}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Assignments */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Upcoming Assignments</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingAssignments.map((assignment) => (
                    <div key={assignment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-900">{assignment.title}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          assignment.priority === 'high' ? 'bg-red-100 text-red-800' :
                          assignment.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {assignment.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{assignment.course}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Due: {assignment.dueDate}</span>
                        <span className="text-xs font-medium text-gray-900">{assignment.points} pts</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <button className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    View All Assignments →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;