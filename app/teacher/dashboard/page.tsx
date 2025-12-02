"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import {
  FiPlus,
  FiEdit,
  FiCheckSquare,
  FiMenu,
} from "react-icons/fi";
import { FaBook, FaPencilAlt, FaClipboardList, FaTasks } from "react-icons/fa";

const StatCard = ({
  title,
  value,
  icon,
  color,
  progress,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  progress?: number;
}) => (
  <div className={`${color} p-4 sm:p-6 rounded-2xl text-white`}>
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-sm sm:text-lg font-semibold">{title}</h3>
        <p className="text-2xl sm:text-4xl font-bold">{value}</p>
      </div>
      {progress ? (
        <div className="relative hidden sm:block">
          <svg className="w-14 h-14 sm:w-16 sm:h-16">
            <circle
              className="text-white opacity-20"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              r="24"
              cx="28"
              cy="28"
            />
            <circle
              className="text-white"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              r="24"
              cx="28"
              cy="28"
              strokeDasharray={2 * Math.PI * 24}
              strokeDashoffset={2 * Math.PI * 24 * (1 - progress / 100)}
              strokeLinecap="round"
              transform="rotate(-90 28 28)"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-bold">
            {progress}%
          </span>
        </div>
      ) : (
        <div className="text-2xl sm:text-4xl opacity-80">{icon}</div>
      )}
    </div>
    {progress && (
      <div className="sm:hidden mt-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white/20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-bold">{progress}%</span>
        </div>
      </div>
    )}
  </div>
);

const AssignedBookItem = ({
  title,
  subject,
  chapters,
  questions,
  status,
}: {
  title: string;
  subject: string;
  chapters: number;
  questions: number;
  status: string;
}) => (
  <div className="bg-white p-3 sm:p-4 rounded-2xl border border-gray-200">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-800 truncate">{title}</h4>
        <p className="text-sm text-gray-500">{subject}</p>
        <div className="flex items-center flex-wrap gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-600">
          <span className="flex items-center">
            <FaBook className="mr-1 sm:mr-2 flex-shrink-0" />
            {chapters} Chapters
          </span>
          <span className="flex items-center">
            <FaPencilAlt className="mr-1 sm:mr-2 flex-shrink-0" />
            {questions} Questions
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
        <button
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${status === "Active" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}
        >
          {status}
        </button>
        <button className="text-gray-400 hover:text-gray-600 p-2 touch-manipulation">
          <FiEdit size={18} />
        </button>
      </div>
    </div>
  </div>
);

const TodoItem = ({
  task,
  date,
  color,
}: {
  task: string;
  date: string;
  color: string;
}) => (
  <div
    className="bg-white p-3 sm:p-4 rounded-2xl border-l-4"
    style={{ borderColor: color }}
  >
    <div className="flex items-start sm:items-center justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm sm:text-base">{task}</p>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">{date}</p>
      </div>
      <button className="text-blue-600 bg-blue-100 rounded-full p-2 flex-shrink-0 touch-manipulation">
        <FiCheckSquare size={18} />
      </button>
    </div>
  </div>
);

export default function TeacherDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar userRole="Teacher" currentPage="dashboard" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full lg:ml-[256px]">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 touch-manipulation"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FiMenu size={24} />
            </button>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
              Teacher Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 ml-auto sm:ml-0">
            <div className="text-right">
              <p className="font-semibold text-gray-800 text-sm sm:text-base">Afra</p>
              <p className="text-xs sm:text-sm text-gray-500">Teacher</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 rounded-full flex-shrink-0"></div>
          </div>
        </header>

        <section className="bg-[#FFDBBB] p-4 sm:p-6 rounded-2xl mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-900">
            Welcome back, Afra!
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Here is an overview of your quiz activities.
          </p>
        </section>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <StatCard
            title="Assigned Books"
            value="3"
            icon={<FaBook />}
            color="bg-[#FF7A50]"
          />
          <StatCard
            title="Total Questions"
            value="151"
            icon={<FaPencilAlt />}
            color="bg-[#FF7A50]"
          />
          <StatCard
            title="Quizzes Created"
            value="28"
            icon={<FaClipboardList />}
            color="bg-[#FF7A50]"
          />
          <StatCard
            title="Chapters Done"
            value="22"
            icon={<FaTasks />}
            color="bg-[#FF7A50]"
            progress={73}
          />
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          <div className="xl:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                Assigned Books
              </h3>
              <button className="text-blue-600 bg-blue-100 rounded-full p-2 touch-manipulation hover:bg-blue-200 transition-colors">
                <FiPlus size={18} />
              </button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <AssignedBookItem
                title="Science Explorer"
                subject="Science"
                chapters={3}
                questions={63}
                status="Active"
              />
              <AssignedBookItem
                title="Math Understood"
                subject="Mathematics"
                chapters={5}
                questions={67}
                status="Active"
              />
              <AssignedBookItem
                title="Spirit School"
                subject="English"
                chapters={2}
                questions={21}
                status="Completed"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">To-Do List</h3>
              <button className="text-orange-600 bg-orange-100 rounded-full p-2 touch-manipulation hover:bg-orange-200 transition-colors">
                <FiPlus size={18} />
              </button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <TodoItem
                task="Add Questions for Science Explorer Chapter 2"
                date="January 5, 2025"
                color="#FF7A50"
              />
              <TodoItem
                task="Review Math Essential Chapter 1 Content"
                date="January 10, 2025"
                color="#FFC107"
              />
              <TodoItem
                task="Create Quiz for English Skills Builder"
                date="January 12, 2025"
                color="#4CAF50"
              />
              <TodoItem
                task="Check Student List for Social Sciences"
                date="January 12, 2025"
                color="#2196F3"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
