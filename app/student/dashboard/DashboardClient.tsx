'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  subject: string;
  class: string;
  score: number;
  totalMarks: number;
  percentage: number;
  completedAt: string;
}

interface UpcomingQuiz {
  id: string;
  title: string;
  subject: string;
  class: string;
  timeLimitMinutes: number;
  totalQuestions: number;
  schedule: { startAt: string; endAt: string };
}

interface Stats {
  averageScore: number;
  quizzesAttempted: number;
  pendingQuizzes: number;
  lastQuizScore: number;
}

interface Props {
  initialQuizHistory: QuizAttempt[];
  initialUpcomingQuizzes: UpcomingQuiz[];
  initialStats: Stats;
}

function AnimatedCounter({ value, suffix = '', duration = 1.5 }: { value: number; suffix?: string; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startValue = 0;
    const endValue = value;
    const startTime = Date.now();
    const durationMs = duration * 1000;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.round(startValue + (endValue - startValue) * easeOutQuart);
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{displayValue}{suffix}</span>;
}

export default function DashboardClient({ initialQuizHistory, initialUpcomingQuizzes, initialStats }: Props) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const quizHistory = initialQuizHistory;
  const upcomingQuizzes = initialUpcomingQuizzes;
  const stats = initialStats;

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const formatDate = (timestamp: string) => {
    if (!timestamp) return 'Not scheduled';
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'Not scheduled';
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Not scheduled';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return '';
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
      return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
    } catch {
      return '';
    }
  };

  const recentScores = quizHistory.slice(0, 3);

  const AnimatedCircularProgress = ({ percentage, size = 60, delay = 0 }: { percentage: number; size?: number; delay?: number }) => {
    const [animatedPercentage, setAnimatedPercentage] = useState(0);
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (animatedPercentage / 100) * circumference;

    useEffect(() => {
      const timer = setTimeout(() => {
        const duration = 1500;
        const startTime = Date.now();
        
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          setAnimatedPercentage(Math.round(percentage * easeOut));
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        requestAnimationFrame(animate);
      }, delay);

      return () => clearTimeout(timer);
    }, [percentage, delay]);

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="6"
            fill="none"
            className="opacity-30"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#fbbf24"
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-100 drop-shadow-lg"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-purple-700">{animatedPercentage}%</span>
        </div>
      </div>
    );
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-600';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreGradient = (percentage: number) => {
    if (percentage >= 80) return 'from-green-500 to-emerald-600';
    if (percentage >= 60) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-rose-600';
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-fadeInScale {
          animation: fadeInScale 0.5s ease-out forwards;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.4s ease-out forwards;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .stat-card {
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.15),
            transparent
          );
          transition: left 0.5s;
        }

        .stat-card:hover::before {
          animation: shimmer 0.8s ease-in-out;
        }
      `}</style>

      <Sidebar userRole="Student" currentPage="dashboard" open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-64 p-4 lg:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 animate-fadeInUp" style={{ animationDelay: '0ms' }}>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <i className="ri-menu-line text-2xl"></i>
            </button>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-700">Student Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm text-gray-700 font-medium hidden sm:block">Student</span>
            <div className="min-w-[44px] min-h-[44px] w-11 h-11 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 font-bold animate-pulse-slow">
              S
            </div>
          </div>
        </div>

        <div 
          className="bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group hover:shadow-2xl transition-shadow duration-300 animate-fadeInUp"
          style={{ animationDelay: '100ms' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <h2 className="text-2xl font-bold mb-2 relative z-10">Welcome back!</h2>
          <p className="text-purple-100 relative z-10">Ready to challenge yourself with a new quiz today?</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            className="stat-card bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group animate-fadeInScale"
            style={{ animationDelay: '200ms' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold mb-1">
                  {isLoaded ? <AnimatedCounter value={stats.averageScore} suffix="%" duration={1.5} /> : '0%'}
                </h3>
                <p className="text-sm text-purple-100">Average Score</p>
              </div>
              <div className="transform group-hover:scale-110 transition-transform duration-300">
                <AnimatedCircularProgress percentage={stats.averageScore} size={64} delay={500} />
              </div>
            </div>
          </div>

          <div 
            className="stat-card bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden animate-fadeInScale"
            style={{ animationDelay: '300ms' }}
          >
            <div className="flex items-center justify-between relative z-10">
              <div>
                <h3 className="text-3xl font-bold mb-1">
                  {isLoaded ? <AnimatedCounter value={stats.quizzesAttempted} duration={1.2} /> : '0'}
                </h3>
                <p className="text-sm text-purple-100">Quizzes Attempted</p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <i className="ri-file-list-3-line text-2xl"></i>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          </div>

          <div 
            className="stat-card bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden animate-fadeInScale"
            style={{ animationDelay: '400ms' }}
          >
            <div className="flex items-center justify-between relative z-10">
              <div>
                <h3 className="text-3xl font-bold mb-1">
                  {isLoaded ? <AnimatedCounter value={stats.pendingQuizzes} duration={1} /> : '0'}
                </h3>
                <p className="text-sm text-purple-100">Upcoming Quizzes</p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <i className="ri-calendar-line text-2xl animate-bounce-slow"></i>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          </div>

          <div 
            className="stat-card bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group animate-fadeInScale"
            style={{ animationDelay: '500ms' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold mb-1">
                  {isLoaded ? <AnimatedCounter value={stats.lastQuizScore} suffix="%" duration={1.5} /> : '0%'}
                </h3>
                <p className="text-sm text-purple-100">Last Quiz Score</p>
              </div>
              <div className="transform group-hover:scale-110 transition-transform duration-300">
                <AnimatedCircularProgress percentage={stats.lastQuizScore} size={64} delay={700} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div 
            className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fadeInUp"
            style={{ animationDelay: '600ms' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">Upcoming Quizzes</h3>
              <button 
                onClick={() => router.push('/student/assigned')}
                className="min-w-[44px] min-h-[44px] text-purple-600 text-sm font-medium hover:text-purple-700 px-3 hover:bg-purple-50 rounded-lg transition-colors"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {upcomingQuizzes.length > 0 ? (
                upcomingQuizzes.slice(0, 3).map((quiz, index) => (
                  <div
                    key={quiz.id}
                    className="border-l-4 border-purple-500 bg-gray-50 rounded-lg p-4 flex items-center justify-between hover:bg-purple-50 hover:border-purple-600 transition-all duration-300 group animate-slideInLeft"
                    style={{ animationDelay: `${700 + index * 100}ms` }}
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1 group-hover:text-purple-700 transition-colors">{quiz.title}</h4>
                      <p className="text-sm text-purple-600 mb-2">{quiz.subject} - Class {quiz.class}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <i className="ri-time-line"></i>
                          <span>{quiz.timeLimitMinutes} Minutes</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <i className="ri-edit-line"></i>
                          <span>{quiz.totalQuestions} Questions</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Starts: {formatDate(quiz.schedule?.startAt)}
                      </p>
                    </div>
                    <button 
                      onClick={() => router.push(`/student/attempt?id=${quiz.id}`)}
                      className="ml-4 min-w-[44px] min-h-[44px] px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 hover:scale-105 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                    >
                      Start
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center animate-pulse-slow">
                    <i className="ri-calendar-line text-3xl text-purple-400"></i>
                  </div>
                  <p className="font-medium">No upcoming quizzes scheduled</p>
                  <button 
                    onClick={() => router.push('/student/assigned')}
                    className="mt-4 text-purple-600 hover:text-purple-700 font-medium hover:underline transition-all"
                  >
                    View Available Quizzes
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div 
              className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fadeInUp"
              style={{ animationDelay: '700ms' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Recent Scores</h3>
                <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                  <i className="ri-trophy-line text-purple-600"></i>
                </div>
              </div>
              <div className="space-y-3">
                {recentScores.length > 0 ? (
                  recentScores.map((attempt, index) => (
                    <div 
                      key={attempt.id} 
                      className="bg-white rounded-lg p-3 hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer group animate-slideInLeft"
                      style={{ animationDelay: `${800 + index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-800 text-sm truncate flex-1 mr-2 group-hover:text-purple-700 transition-colors">
                          {attempt.quizTitle || attempt.subject || 'Quiz'}
                        </h4>
                        <div className={`px-3 py-1 bg-gradient-to-r ${getScoreGradient(attempt.percentage)} text-white rounded-full text-sm font-bold shadow-sm group-hover:shadow-md transition-shadow`}>
                          {Math.round(attempt.percentage)}%
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">{getTimeAgo(attempt.completedAt)}</p>
                        <p className="text-xs text-gray-600">{attempt.score}/{attempt.totalMarks} marks</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">No quizzes attempted yet</p>
                  </div>
                )}
              </div>
            </div>

            <div 
              className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fadeInUp"
              style={{ animationDelay: '800ms' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Quick Stats</h3>
                <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center">
                  <i className="ri-bar-chart-line text-yellow-600"></i>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3 flex items-center justify-between hover:shadow-md transition-all duration-300 group cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i className="ri-medal-line text-green-600"></i>
                    </div>
                    <span className="text-sm text-gray-600">Best Score</span>
                  </div>
                  <span className="font-bold text-green-600">
                    {quizHistory.length > 0 
                      ? `${Math.round(Math.max(...quizHistory.map(q => q.percentage)))}%`
                      : '-'
                    }
                  </span>
                </div>
                <div className="bg-white rounded-lg p-3 flex items-center justify-between hover:shadow-md transition-all duration-300 group cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i className="ri-coins-line text-purple-600"></i>
                    </div>
                    <span className="text-sm text-gray-600">Total Marks</span>
                  </div>
                  <span className="font-bold text-purple-600">
                    {isLoaded ? <AnimatedCounter value={quizHistory.reduce((sum, q) => sum + (q.score || 0), 0)} duration={2} /> : '0'}
                  </span>
                </div>
                <div className="bg-white rounded-lg p-3 flex items-center justify-between hover:shadow-md transition-all duration-300 group cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i className="ri-arrow-up-line text-blue-600"></i>
                    </div>
                    <span className="text-sm text-gray-600">Improvement</span>
                  </div>
                  <span className="font-bold text-blue-600">
                    {quizHistory.length >= 2
                      ? `${Math.round(quizHistory[0].percentage - quizHistory[quizHistory.length - 1].percentage)}%`
                      : '-'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div 
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fadeInUp"
          style={{ animationDelay: '900ms' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Quiz History</h3>
              <p className="text-sm text-gray-600">Review your past quiz performances</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <i className="ri-history-line text-purple-600 text-lg"></i>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-purple-50 to-purple-100 text-gray-700 text-sm">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Quiz</th>
                  <th className="px-4 py-3 text-left font-semibold">Subject</th>
                  <th className="px-4 py-3 text-left font-semibold">Score</th>
                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizHistory.slice(0, 10).map((attempt, index) => (
                  <tr 
                    key={attempt.id} 
                    className="border-t text-sm text-gray-800 hover:bg-purple-50 transition-colors duration-200 animate-slideInLeft"
                    style={{ animationDelay: `${1000 + index * 50}ms` }}
                  >
                    <td className="px-4 py-3 font-medium">{attempt.quizTitle || 'Quiz'}</td>
                    <td className="px-4 py-3 text-gray-600">{attempt.subject || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 bg-gradient-to-r ${getScoreGradient(attempt.percentage)} text-white rounded-full font-semibold shadow-sm`}>
                        {attempt.score}/{attempt.totalMarks} ({Math.round(attempt.percentage)}%)
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(attempt.completedAt)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => router.push(`/student/attempt?id=${attempt.quizId}`)}
                        className="min-w-[44px] min-h-[44px] text-purple-600 hover:text-purple-800 font-medium hover:bg-purple-100 px-3 py-1 rounded-lg transition-all duration-200"
                      >
                        Retake
                      </button>
                    </td>
                  </tr>
                ))}
                {quizHistory.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center animate-pulse-slow">
                        <i className="ri-file-list-3-line text-3xl text-purple-400"></i>
                      </div>
                      <p className="font-medium">No quiz history available yet.</p>
                      <p className="text-sm mt-1">Complete a quiz to see your progress here!</p>
                      <button 
                        onClick={() => router.push('/student/assigned')}
                        className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg hover:scale-105"
                      >
                        Take a Quiz
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
