'use client';

import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  quizzesTaken: number;
  streak: number;
  badges: string[];
}

export default function LeaderboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'weekly' | 'monthly' | 'alltime'>('weekly');
  
  const currentStudentName = 'Jane Doe';

  const leaderboardData: LeaderboardEntry[] = [
    {
      rank: 1,
      name: 'Alex Thompson',
      avatar: 'AT',
      score: 2850,
      quizzesTaken: 32,
      streak: 15,
      badges: ['🏆', '⭐', '🔥']
    },
    {
      rank: 2,
      name: 'Sarah Chen',
      avatar: 'SC',
      score: 2720,
      quizzesTaken: 28,
      streak: 12,
      badges: ['⭐', '🔥']
    },
    {
      rank: 3,
      name: 'Michael Rodriguez',
      avatar: 'MR',
      score: 2680,
      quizzesTaken: 30,
      streak: 10,
      badges: ['⭐', '🎯']
    },
    {
      rank: 4,
      name: 'Emma Wilson',
      avatar: 'EW',
      score: 2540,
      quizzesTaken: 25,
      streak: 8,
      badges: ['🎯']
    },
    {
      rank: 5,
      name: 'Jane Doe',
      avatar: 'JD',
      score: 2420,
      quizzesTaken: 24,
      streak: 7,
      badges: ['🎯', '📚']
    },
    {
      rank: 6,
      name: 'David Kim',
      avatar: 'DK',
      score: 2380,
      quizzesTaken: 23,
      streak: 6,
      badges: ['📚']
    },
    {
      rank: 7,
      name: 'Olivia Martinez',
      avatar: 'OM',
      score: 2290,
      quizzesTaken: 22,
      streak: 5,
      badges: ['📚']
    },
    {
      rank: 8,
      name: 'James Brown',
      avatar: 'JB',
      score: 2150,
      quizzesTaken: 20,
      streak: 4,
      badges: []
    },
    {
      rank: 9,
      name: 'Sophia Lee',
      avatar: 'SL',
      score: 2080,
      quizzesTaken: 19,
      streak: 3,
      badges: []
    },
    {
      rank: 10,
      name: 'Ryan Patel',
      avatar: 'RP',
      score: 1950,
      quizzesTaken: 18,
      streak: 2,
      badges: []
    }
  ];

  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600'; // Gold
    if (rank === 2) return 'from-gray-300 to-gray-500'; // Silver
    if (rank === 3) return 'from-orange-400 to-orange-600'; // Bronze
    return 'from-purple-400 to-purple-600';
  };

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar userRole="Student" currentPage="leaderboard" open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <i className="ri-menu-line text-2xl"></i>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-purple-700">Leaderboard</h1>
            <p className="text-sm text-gray-600">See where you rank among your peers!</p>
          </div>
        </div>

        {/* Time Filter Tabs */}
        <div className="bg-white rounded-xl p-2 shadow-lg inline-flex space-x-2">
          <button
            onClick={() => setTimeFilter('weekly')}
            className={`min-w-[44px] min-h-[44px] px-6 py-2 rounded-lg font-medium transition ${
              timeFilter === 'weekly'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeFilter('monthly')}
            className={`min-w-[44px] min-h-[44px] px-6 py-2 rounded-lg font-medium transition ${
              timeFilter === 'monthly'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeFilter('alltime')}
            className={`min-w-[44px] min-h-[44px] px-6 py-2 rounded-lg font-medium transition ${
              timeFilter === 'alltime'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Time
          </button>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
          {/* 2nd Place */}
          <div className="flex flex-col items-center pt-8">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getMedalColor(2)} flex items-center justify-center text-white font-bold text-xl shadow-lg mb-3`}>
              {leaderboardData[1].avatar}
            </div>
            <div className="text-3xl mb-2">🥈</div>
            <h3 className="font-bold text-gray-800 text-center">{leaderboardData[1].name}</h3>
            <p className="text-purple-600 font-bold text-xl">{leaderboardData[1].score}</p>
            <div className="flex space-x-1 mt-2">
              {leaderboardData[1].badges.map((badge, idx) => (
                <span key={idx} className="text-lg">{badge}</span>
              ))}
            </div>
            <div className="mt-4 bg-gradient-to-br from-gray-300 to-gray-500 rounded-t-xl px-8 py-6 text-white font-bold text-center">
              #2
            </div>
          </div>

          {/* 1st Place (Higher) */}
          <div className="flex flex-col items-center">
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getMedalColor(1)} flex items-center justify-center text-white font-bold text-2xl shadow-2xl mb-3 ring-4 ring-yellow-300`}>
              {leaderboardData[0].avatar}
            </div>
            <div className="text-4xl mb-2">👑</div>
            <h3 className="font-bold text-gray-800 text-center">{leaderboardData[0].name}</h3>
            <p className="text-purple-600 font-bold text-2xl">{leaderboardData[0].score}</p>
            <div className="flex space-x-1 mt-2">
              {leaderboardData[0].badges.map((badge, idx) => (
                <span key={idx} className="text-xl">{badge}</span>
              ))}
            </div>
            <div className="mt-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-t-xl px-8 py-8 text-white font-bold text-center shadow-lg">
              #1
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center pt-8">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getMedalColor(3)} flex items-center justify-center text-white font-bold text-xl shadow-lg mb-3`}>
              {leaderboardData[2].avatar}
            </div>
            <div className="text-3xl mb-2">🥉</div>
            <h3 className="font-bold text-gray-800 text-center">{leaderboardData[2].name}</h3>
            <p className="text-purple-600 font-bold text-xl">{leaderboardData[2].score}</p>
            <div className="flex space-x-1 mt-2">
              {leaderboardData[2].badges.map((badge, idx) => (
                <span key={idx} className="text-lg">{badge}</span>
              ))}
            </div>
            <div className="mt-4 bg-gradient-to-br from-orange-400 to-orange-600 rounded-t-xl px-8 py-6 text-white font-bold text-center">
              #3
            </div>
          </div>
        </div>

        {/* Full Rankings List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Full Rankings</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {leaderboardData.map((entry) => (
              <div
                key={entry.rank}
                className={`px-6 py-4 flex items-center justify-between transition hover:bg-gray-50 ${
                  entry.name === currentStudentName
                    ? 'bg-purple-50 border-l-4 border-purple-600'
                    : ''
                }`}
              >
                <div className="flex items-center space-x-4 flex-1">
                  {/* Rank */}
                  <div
                    className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg ${
                      entry.rank <= 3
                        ? `bg-gradient-to-br ${getMedalColor(entry.rank)} text-white shadow-md`
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {entry.rank <= 3 ? getMedalIcon(entry.rank) : entry.rank}
                  </div>

                  {/* Avatar */}
                  <div
                    className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-full flex items-center justify-center font-bold text-white ${
                      entry.name === currentStudentName
                        ? 'bg-purple-600'
                        : 'bg-gray-600'
                    }`}
                  >
                    {entry.avatar}
                  </div>

                  {/* Name and Stats */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-gray-800">
                        {entry.name}
                        {entry.name === currentStudentName && (
                          <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                            You
                          </span>
                        )}
                      </h3>
                      <div className="flex space-x-1">
                        {entry.badges.map((badge, idx) => (
                          <span key={idx} className="text-sm">{badge}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center space-x-1">
                        <i className="ri-file-list-line"></i>
                        <span>{entry.quizzesTaken} quizzes</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <i className="ri-fire-line text-orange-500"></i>
                        <span>{entry.streak} day streak</span>
                      </span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">{entry.score}</p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Legend */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 shadow-lg">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <span>🏆</span>
            <span>Achievement Badges</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="text-xs font-semibold text-gray-700">Champion</p>
                <p className="text-xs text-gray-500">Top performer</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="text-xs font-semibold text-gray-700">Star Student</p>
                <p className="text-xs text-gray-500">High scores</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="text-xs font-semibold text-gray-700">On Fire</p>
                <p className="text-xs text-gray-500">10+ day streak</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="text-xs font-semibold text-gray-700">Accuracy</p>
                <p className="text-xs text-gray-500">90%+ correct</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📚</span>
              <div>
                <p className="text-xs font-semibold text-gray-700">Bookworm</p>
                <p className="text-xs text-gray-500">20+ quizzes</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
