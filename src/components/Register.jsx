import React, { useState } from "react";
import { Eye, EyeOff, User, Lock, MessageSquare, CheckCircle, XCircle, Loader2, UserPlus, Users, Zap, Shield } from "lucide-react";

function Register({ onRegister, switchToLogin }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Password validation rules
  const passwordRules = [
    { rule: /.{8,}/, message: "At least 8 characters" },
    { rule: /[A-Z]/, message: "One uppercase letter" },
    { rule: /[a-z]/, message: "One lowercase letter" },
    { rule: /\d/, message: "One number" },
    { rule: /[!@#$%^&*(),.?":{}|<>]/, message: "One special character" }
  ];

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (formData.username.length > 20) {
      newErrors.username = "Username must be less than 20 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const failedRules = passwordRules.filter(rule => !rule.rule.test(formData.password));
      if (failedRules.length > 0) {
        newErrors.password = "Password doesn't meet requirements";
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setRegistrationSuccess(true);
      
      // Auto-switch to login after 2 seconds
      setTimeout(() => {
        switchToLogin();
      }, 2000);

    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ general: "Registration failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-slate-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
          <div className="w-full max-w-md">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
                <p className="text-slate-300 mb-6">
                  Your account has been created successfully. Redirecting to login...
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                  <span className="text-sm text-slate-400">Redirecting...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left Panel - Brand/Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20">
          <div className="max-w-lg">
            {/* Logo */}
            <div className="flex items-center mb-8">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mr-4">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Talksy</h1>
            </div>

            {/* Hero Text */}
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Talk to thousands of people already using Talksy
            </h2>
            <p className="text-xl text-slate-300 mb-12 leading-relaxed">
              Create your account in seconds and start collaborating with your team instantly.
            </p>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-lg">
                  <UserPlus className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Quick Setup</h3>
                  <p className="text-slate-400 text-sm">Get started in less than 2 minutes</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-500/20 rounded-lg">
                  <Users className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Team Collaboration</h3>
                  <p className="text-slate-400 text-sm">Invite unlimited team members</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10 bg-green-500/20 rounded-lg">
                  <Shield className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Secure by Default</h3>
                  <p className="text-slate-400 text-sm">Your data is protected with enterprise-grade security</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Register Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 lg:px-16">
          <div className="w-full max-w-md">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10">
              {/* Mobile Logo */}
              <div className="lg:hidden text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">ChatPro</h1>
              </div>

              {/* Form Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                <p className="text-slate-300">Join the conversation and start chatting</p>
              </div>

              {/* Form */}
              <div className="space-y-6">
                {/* General Error */}
                {errors.general && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                    <span className="text-sm text-red-400">{errors.general}</span>
                  </div>
                )}

                {/* Username Field */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.username ? 'border-red-500/50 bg-red-500/10' : 'hover:border-white/30'
                      }`}
                      placeholder="Enter your username"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-400">{errors.username}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.password ? 'border-red-500/50 bg-red-500/10' : 'hover:border-white/30'
                      }`}
                      placeholder="Enter your password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-300 transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-400 hover:text-slate-300 transition-colors" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                  )}
                </div>

                {/* Password Requirements */}
                {formData.password && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-slate-300 mb-3">Password Requirements:</h4>
                    <div className="space-y-2">
                      {passwordRules.map((rule, index) => {
                        const isValid = rule.rule.test(formData.password);
                        return (
                          <div key={index} className="flex items-center space-x-2">
                            {isValid ? (
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-400" />
                            )}
                            <span className={`text-sm ${isValid ? 'text-green-400' : 'text-red-400'}`}>
                              {rule.message}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.confirmPassword ? 'border-red-500/50 bg-red-500/10' : 'hover:border-white/30'
                      }`}
                      placeholder="Confirm your password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-300 transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-400 hover:text-slate-300 transition-colors" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>

              {/* Switch to Login */}
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-300">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={switchToLogin}
                    className="font-medium text-blue-400 hover:text-blue-300 focus:outline-none focus:underline transition-colors duration-200"
                    disabled={isLoading}
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-slate-500">
                © 2025 Talksy. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;