"use client";

import { useState } from 'react';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.657-3.356-11.303-8H6.306C9.656 39.663 16.318 44 24 44z
"></path>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.24 44 30.022 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
  </svg>
);

const LoginForm = ({ onSwitchToSignup }: { onSwitchToSignup: () => void }) => (
  <div className="w-full">
    <div className="text-center mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-1">Welcome Back</h2>
      <p className="text-xs text-gray-600">Please sign in to your account</p>
    </div>
    
    <button className="w-full flex items-center justify-center gap-2 py-2.5 px-3 border-2 border-gray-200 rounded-none bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md group">
      <GoogleIcon />
      <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900">Continue with Google</span>
    </button>
    
    <div className="my-4 flex items-center">
      <div className="flex-grow border-t border-gray-200"></div>
      <span className="mx-3 text-[11px] font-medium text-gray-500 bg-white px-2">or sign in with email</span>
      <div className="flex-grow border-t border-gray-200"></div>
    </div>
    
    <form className="space-y-3">
      <div className="space-y-2">
        <label className="text-[11px] font-medium text-gray-700">Email Address</label>
        <input 
          type="email" 
          placeholder="Enter your email" 
          required 
          className="w-full px-3 py-2.5 border border-gray-200 rounded-none bg-white focus:outline-none focus:ring-2 focus:ring-[#c99362]/20 focus:border-[#c99362] transition-all duration-200 placeholder-gray-400" 
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-[11px] font-medium text-gray-700">Password</label>
        <input 
          type="password" 
          placeholder="Enter your password" 
          required 
          className="w-full px-3 py-2.5 border border-gray-200 rounded-none bg-white focus:outline-none focus:ring-2 focus:ring-[#c99362]/20 focus:border-[#c99362] transition-all duration-200 placeholder-gray-400" 
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input 
            type="checkbox" 
            id="remember-me" 
            className="h-4 w-4 text-[#c99362] focus:ring-[#c99362] border-gray-300 rounded-none" 
          />
          <label htmlFor="remember-me" className="text-[11px] font-medium text-gray-600">Remember me</label>
        </div>
        <a href="#" className="text-[11px] font-semibold text-[#c99362] hover:text-[#b58252] transition-colors">
          Forgot password?
        </a>
      </div>
      
      <button 
        type="submit" 
        className="w-full py-2.5 px-3 bg-gradient-to-r from-[#c99362] to-[#b58252] text-white text-xs font-semibold rounded-none hover:from-[#b58252] hover:to-[#a67041] transform hover:scale-[1.01] transition-all duration-200 shadow-md hover:shadow-lg"
      >
        Sign In
      </button>
    </form>
    
    <div className="mt-4 text-center">
      <span className="text-[11px] text-gray-600">Don't have an account? </span>
      <button 
        onClick={onSwitchToSignup} 
        className="text-[11px] font-semibold text-[#c99362] hover:text-[#b58252] transition-colors hover:underline"
      >
        Create Account
      </button>
    </div>
  </div>
);

const SignupForm = ({ onSwitchToLogin }: { onSwitchToLogin: () => void }) => (
  <div className="w-full">
    <div className="text-center mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-1">Create Account</h2>
      <p className="text-xs text-gray-600">Join us and start your luxury journey</p>
    </div>
    
    <button className="w-full flex items-center justify-center gap-2 py-2.5 px-3 border-2 border-gray-200 rounded-none bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md group">
      <GoogleIcon />
      <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900">Continue with Google</span>
    </button>
    
    <div className="my-4 flex items-center">
      <div className="flex-grow border-t border-gray-200"></div>
      <span className="mx-3 text-[11px] font-medium text-gray-500 bg-white px-2">or create with email</span>
      <div className="flex-grow border-t border-gray-200"></div>
    </div>
    
    <form className="space-y-3">
      <div className="space-y-2">
        <label className="text-[11px] font-medium text-gray-700">Full Name</label>
        <input 
          type="text" 
          placeholder="Enter your full name" 
          required 
          className="w-full px-3 py-2.5 border border-gray-200 rounded-none bg-white focus:outline-none focus:ring-2 focus:ring-[#c99362]/20 focus:border-[#c99362] transition-all duration-200 placeholder-gray-400" 
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">Email Address</label>
        <input 
          type="email" 
          placeholder="Enter your email" 
          required 
          className="w-full px-3 py-2.5 border border-gray-200 rounded-none bg-white focus:outline-none focus:ring-2 focus:ring-[#c99362]/20 focus:border-[#c99362] transition-all duration-200 placeholder-gray-400" 
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">Password</label>
        <input 
          type="password" 
          placeholder="Create a strong password" 
          required 
          className="w-full px-3 py-2.5 border border-gray-200 rounded-none bg-white focus:outline-none focus:ring-2 focus:ring-[#c99362]/20 focus:border-[#c99362] transition-all duration-200 placeholder-gray-400" 
        />
      </div>
      
      <div className="flex items-start gap-3">
        <input 
          type="checkbox" 
          id="terms" 
          required
          className="h-4 w-4 text-[#c99362] focus:ring-[#c99362] border-gray-300 rounded-none mt-0.5" 
        />
        <label htmlFor="terms" className="text-[11px] text-gray-600">
          I agree to the <a href="#" className="text-[#c99362] hover:text-[#b58252] font-medium">Terms of Service</a> and <a href="#" className="text-[#c99362] hover:text-[#b58252] font-medium">Privacy Policy</a>
        </label>
      </div>
      
      <button 
        type="submit" 
        className="w-full py-2.5 px-3 bg-gradient-to-r from-[#c99362] to-[#b58252] text-white text-xs font-semibold rounded-none hover:from-[#b58252] hover:to-[#a67041] transform hover:scale-[1.01] transition-all duration-200 shadow-md hover:shadow-lg"
      >
        Create Account
      </button>
    </form>
    
    <div className="mt-4 text-center">
      <span className="text-[11px] text-gray-600">Already have an account? </span>
      <button 
        onClick={onSwitchToLogin} 
        className="text-[11px] font-semibold text-[#c99362] hover:text-[#b58252] transition-colors hover:underline"
      >
        Sign In
      </button>
    </div>
  </div>
);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLoginView, setIsLoginView] = useState(true);

  if (!isOpen) return null;

  const handleSwitchToLogin = () => {
    setIsLoginView(true);
  };

  const handleSwitchToSignup = () => {
    setIsLoginView(false);
  };

  return (
    <div className="fixed inset-0 bg-black/20 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="w-full max-w-xl bg-white/40 rounded-none border border-gray-200 shadow-xl flex overflow-hidden transform transition-all duration-300" onClick={(e) => e.stopPropagation()}>
        {/* Left Panel (Image) */}
        <div className="hidden md:hidden relative">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="relative h-full flex flex-col justify-center items-center text-white p-8 text-center">
            <div className="mb-5">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 mx-auto backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2">LuxeTanger</h1>
              <p className="text-sm opacity-90">Your gateway to luxury living</p>
            </div>
            <div className="space-y-2.5 text-center max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full opacity-75"></div>
                <p className="text-[11px] opacity-90">Premium apartment rentals</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full opacity-75"></div>
                <p className="text-[11px] opacity-90">Luxury amenities included</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full opacity-75"></div>
                <p className="text-[11px] opacity-90">24/7 concierge service</p>
              </div>
            </div>
          </div>
        </div>
        {/* Right Panel (Form) */}
        <div
          className="w-full md:w-full p-4 md:p-5 relative bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: 'url("https://yourluxuryhometanger.com/wp-content/uploads/2025/01/P1075349-1536x862.jpeg")' }}
        >
          <div className="absolute inset-0 bg-white/20"></div>
           <button onClick={onClose} className="absolute z-10 top-6 right-6 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:rotate-90 p-2 hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <div className="relative z-10 h-full flex flex-col justify-center max-w-[17rem] w-full mx-auto">
            {isLoginView ? (
              <LoginForm onSwitchToSignup={handleSwitchToSignup} />
            ) : (
              <SignupForm onSwitchToLogin={handleSwitchToLogin} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
