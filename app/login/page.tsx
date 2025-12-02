'use client';

import { useState, useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import Head from 'next/head';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/firebase';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const cardRef = useRef(null);
  const iconRef = useRef(null);

  useLayoutEffect(() => {
    gsap.from(cardRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
    });

    gsap.from(iconRef.current, {
      scale: 0,
      duration: 0.6,
      delay: 0.3,
      ease: 'back.out(1.7)',
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Assuming role is stored in a custom claim or user profile
      // You may need to adjust this based on how roles are managed in your Firebase setup
      const idTokenResult = await user.getIdTokenResult();
      const userRole = idTokenResult.claims.role || role; // Fallback to selected role if no claim

      // Redirect based on role
      if (userRole === 'Admin') {
        router.push('/admin/dashboard');
      } else if (userRole === 'Teacher') {
        router.push('/teacher/dashboard');
      } else if (userRole === 'Student') {
        router.push('/student/dashboard');
      } else if (userRole === 'School Admin') {
        router.push('/school-admin/dashboard');
      } else if (userRole === 'Moderator') {
        router.push('/moderator/dashboard');
      } else if (userRole === 'Content Creator') {
        router.push('/content-creator/dashboard');
      } else {
        throw new Error('Invalid role');
      }
    } catch (err) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <link rel="preload" href="/login-bg.svg" as="image" />
      </Head>

      {/* Navbar */}
      <nav className="w-full bg-[#002147] text-white shadow-md fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          {/* Logo only */}
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="w-20 h-10 sm:w-25 sm:h-12 object-contain" />
          </div>

          {/* Navigation Links */}
          <div className="space-x-4 sm:space-x-6 text-xs sm:text-sm font-medium hidden md:flex">
            <Link href="/" className="hover:text-gray-300 transition">Home</Link>
            <Link href="#features" className="hover:text-gray-300 transition">Features</Link>
            <Link href="/login" className="hover:text-gray-300 transition">Login</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 pt-20 sm:pt-24 overflow-hidden">
        {/* Background Illustration */}
        <div className="absolute inset-0 -z-10 bg-[url('/login-bg.svg')] bg-cover bg-center opacity-10 animate-fadeIn"></div>

        {/* Login Card */}
        <div className="w-full max-w-sm sm:max-w-md" ref={cardRef}>
          <div
            className="bg-white backdrop-blur-md rounded-xl shadow-xl p-6 sm:p-8 border border-slate-200"
            style={{ willChange: 'opacity, transform', transform: 'translateZ(0)' }}
          >
            <div className="text-center mb-6">
              <div ref={iconRef} className="flex justify-center mb-3">
                <img src="/icon.png" alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold text-[#002147]">Welcome Back</h1>
              <p className="text-sm sm:text-base text-[#4b5563] mt-1">Log in to access your dashboard</p>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center mb-4 p-3 bg-red-50 rounded-md">{error}</div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5 text-sm">
              <div>
                <label htmlFor="email" className="block text-[#002147] mb-2 font-medium">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full min-h-[44px] px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#002147] focus:outline-none transition text-base"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-[#002147] mb-2 font-medium">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full min-h-[44px] px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#002147] focus:outline-none transition text-base"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-[#002147] mb-2 font-medium">Role</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full min-h-[44px] px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#002147] focus:outline-none bg-white transition text-base appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10"
                >
                  <option value="Admin">Admin (OUP)</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Student">Student</option>
                  <option value="School Admin">School Admin</option>
                  <option value="Moderator">Moderator / Content Manager</option>
                  <option value="Content Creator">Content Creator</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full min-h-[44px] bg-[#002147] hover:bg-[#1e3a8a] active:bg-[#001a3a] disabled:bg-gray-400 text-white py-3 rounded-md transition flex items-center justify-center shadow-md font-medium text-base"
              >
                {isLoading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin mr-2 text-lg"></i>
                    Logging in...
                  </>
                ) : (
                  <>
                    <i className="ri-login-circle-line mr-2 text-lg"></i>
                    Login
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 text-center text-sm text-[#4b5563]">
              {/* Demo login: use any email and password */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}