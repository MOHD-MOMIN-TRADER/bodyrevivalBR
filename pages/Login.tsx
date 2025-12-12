
import React, { useState } from 'react';
import { useShop } from '../store/ShopContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User, Loader2, ShieldCheck, CheckCircle2, AlertCircle, Upload, KeyRound } from 'lucide-react';

const Login = () => {
  const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  const { login, signup, resetPassword } = useShop();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const toggleMode = (mode: 'login' | 'signup') => {
      setView(mode);
      setError('');
      setIsSuccess(false);
      setResetSent(false);
      // Don't clear email so user can switch easily
      setPassword('');
      setConfirmPassword('');
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setPhotoFile(e.target.files[0]);
      }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      if (!email.trim()) {
          setError('Email address is required.');
          return;
      }
      if (!validateEmail(email)) {
          setError('Please enter a valid email address.');
          return;
      }
      
      setIsLoading(true);
      try {
          await resetPassword(email);
          setResetSent(true);
      } catch (err: any) {
          setError(err.message || 'Failed to send reset email.');
      } finally {
          setIsLoading(false);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Common Validation
    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // Signup Specific Validation
    if (view === 'signup') {
        if (!name.trim()) {
            setError('Full Name is required.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
    }

    setIsLoading(true);

    try {
        if (view === 'login') {
            await login(email, password);
        } else {
            await signup(email, password, name, photoFile || undefined);
        }

        setIsSuccess(true);
        // Delay redirect to show success state
        setTimeout(() => {
            navigate(from, { replace: true });
        }, 1000);

    } catch (err: any) {
        console.error("Auth Error:", err);
        // Map Firebase Error Codes to User Friendly Messages
        if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
            setError("Incorrect Email or Password. If you haven't registered yet, please switch to 'Register Now'.");
        } else if (err.code === 'auth/email-already-in-use') {
            setError("User already exists. Please Sign In.");
        } else if (err.code === 'auth/network-request-failed') {
            setError("Network connection failed. Please check your internet.");
        } else if (err.code === 'auth/too-many-requests') {
             setError("Too many failed attempts. Please reset your password or try again later.");
        } else {
            setError(err.message || "Authentication failed. Please try again.");
        }
    } finally {
        setIsLoading(false);
    }
  };

  // Render Forgot Password Success View
  if (view === 'forgot' && resetSent) {
      return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden py-12">
            <div className="w-full max-w-md bg-stone-900/50 backdrop-blur-xl p-8 rounded-3xl border border-stone-800 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative z-10 text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 neon-text">Check your email</h2>
                <p className="text-stone-400 mb-8">
                    We sent you a password change link to <br/>
                    <span className="text-white font-bold">{email}</span>
                </p>
                <button 
                    onClick={() => toggleMode('login')}
                    className="w-full bg-stone-800 text-white font-bold py-3 rounded-xl hover:bg-stone-700 transition border border-stone-700"
                >
                    Sign In
                </button>
            </div>
        </div>
      );
  }

  // Render Forgot Password Form
  if (view === 'forgot') {
      return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden py-12">
             <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px]" />
             
             <div className="w-full max-w-md bg-stone-900/50 backdrop-blur-xl p-8 rounded-3xl border border-stone-800 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative z-10">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center border border-stone-700 shadow-inner">
                            <KeyRound className="w-8 h-8 text-orange-500" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2 neon-text">Reset Password</h1>
                    <p className="text-stone-400">Enter your email to receive a recovery link.</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-3 text-red-400 text-sm">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500 group-focus-within:text-orange-500 transition" />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if(error) setError('');
                                }}
                                className="w-full bg-stone-950 border border-stone-800 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
                                placeholder="athlete@example.com"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-4 bg-orange-600 text-white font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:bg-orange-500 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Get Reset Link'}
                    </button>
                    
                    <button 
                        type="button"
                        onClick={() => toggleMode('login')}
                        className="w-full mt-2 text-stone-400 font-medium py-3 rounded-xl hover:text-white transition"
                    >
                        Back to Sign In
                    </button>
                </form>
             </div>
        </div>
      );
  }

  // Render Login / Signup Form
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden py-12">
        {/* Background Effects */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-[100px]" />

        <div className="w-full max-w-md bg-stone-900/50 backdrop-blur-xl p-8 rounded-3xl border border-stone-800 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative z-10">
            <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center border border-stone-700 shadow-inner overflow-hidden">
                        {photoFile ? (
                            <img src={URL.createObjectURL(photoFile)} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-8 h-8 text-orange-500" />
                        )}
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2 neon-text">
                    {view === 'login' ? "Welcome Back to Body Revival BR" : "Join Body Revival"}
                </h1>
                <p className="text-stone-400">
                    {view === 'login' ? "Enter the elite circle." : "Create your athlete profile."}
                </p>
            </div>

            {isSuccess ? (
                <div className="py-12 flex flex-col items-center animate-in fade-in zoom-in">
                    <CheckCircle2 className="w-20 h-20 text-green-500 mb-4 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
                    <h2 className="text-xl font-bold text-white">Authenticated</h2>
                    <p className="text-stone-500">Redirecting...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-3 text-red-400 text-sm animate-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <div className="flex flex-col items-start">
                                <span>{error}</span>
                                {error.includes("User already exists") && (
                                    <button 
                                        type="button" 
                                        onClick={() => toggleMode('login')}
                                        className="text-orange-500 underline mt-1 font-bold"
                                    >
                                        Click here to Sign In
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {view === 'signup' && (
                        <>
                            <div className="space-y-2 animate-in slide-in-from-left duration-300">
                                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Profile Photo</label>
                                <div className="relative group">
                                    <label className="flex items-center gap-3 w-full bg-stone-950 border border-stone-800 text-stone-400 px-4 py-3 rounded-xl cursor-pointer hover:border-orange-500 hover:text-white transition">
                                        <Upload className="w-5 h-5" />
                                        <span className="text-sm truncate">{photoFile ? photoFile.name : "Upload Photo"}</span>
                                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                    </label>
                                </div>
                            </div>
                            <div className="space-y-2 animate-in slide-in-from-left duration-300 delay-75">
                                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500 group-focus-within:text-orange-500 transition" />
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-stone-950 border border-stone-800 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
                                        placeholder="John Doe"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500 group-focus-within:text-orange-500 transition" />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if(error) setError('');
                                }}
                                className="w-full bg-stone-950 border border-stone-800 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
                                placeholder="athlete@example.com"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Password</label>
                            {view === 'login' && (
                                <button 
                                    type="button"
                                    onClick={() => setView('forgot')}
                                    className="text-xs text-orange-500 font-bold hover:underline"
                                >
                                    Forgot password?
                                </button>
                            )}
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500 group-focus-within:text-orange-500 transition" />
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if(error) setError('');
                                }}
                                className="w-full bg-stone-950 border border-stone-800 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
                                placeholder="••••••••"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {view === 'signup' && (
                        <div className="space-y-2 animate-in slide-in-from-left duration-300 delay-100">
                            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Repeat Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500 group-focus-within:text-orange-500 transition" />
                                <input 
                                    type="password" 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-stone-950 border border-stone-800 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    )}

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:shadow-[0_0_30px_rgba(234,88,12,0.6)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" /> {view === 'login' ? 'Signing In...' : 'Creating Account...'}
                            </>
                        ) : (
                            <>
                                {view === 'login' ? 'Sign In' : 'Register Now'} <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                    
                    <div className="flex items-center justify-center gap-2 text-[10px] text-stone-600 uppercase tracking-widest mt-6">
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                        <span>Secured by Firebase Auth</span>
                    </div>
                </form>
            )}

            {!isSuccess && (
                <div className="mt-8 text-center border-t border-stone-800 pt-6">
                    <p className="text-stone-500 text-sm">
                        {view === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                        <button 
                            onClick={() => toggleMode(view === 'login' ? 'signup' : 'login')} 
                            className="text-orange-500 font-bold hover:underline focus:outline-none"
                        >
                            {view === 'login' ? "Join the Revolution" : "Login Here"}
                        </button>
                    </p>
                </div>
            )}
        </div>
    </div>
  );
};

export default Login;
