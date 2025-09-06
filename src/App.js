import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CoursesProvider } from './contexts/CoursesContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './components/dashboard/Dashboard';
import Courses from './components/courses/Courses';
import Assignment from './components/assignments/Assignment';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CoursesProvider>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/courses" element={
                <ProtectedRoute>
                  <Courses />
                </ProtectedRoute>
              } />
              
              {/* Future Protected Routes - Add these as you build more features */}
              <Route path="/assignments" element={
                <ProtectedRoute>
                  <Assignment />
                </ProtectedRoute>
              } />
              
              <Route path="/grades" element={
                <ProtectedRoute>
                  <div className="p-8">
                    <h1 className="text-2xl font-bold">Grades Page</h1>
                    <p>Coming soon...</p>
                  </div>
                </ProtectedRoute>
              } />
              
              {/* Default Route */}
              <Route path="/" element={<Navigate to="/dashboard" />} />
              
              {/* 404 Route */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600 mb-4">Page not found</p>
                    <button 
                      onClick={() => window.location.href = '/dashboard'}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              } />
            </Routes>
          </div>
        </CoursesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;