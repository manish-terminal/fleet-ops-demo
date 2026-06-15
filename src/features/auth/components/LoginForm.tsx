import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '@/utils/validators';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { AlertCircle, KeyRound, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';

export function LoginForm() {
  const { login, isLoggingIn } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await login(values);
      success('Welcome back!', `Logged in as ${response.data.user.name}`);
      if (response.data.user.role === 'driver') {
        navigate('/driver');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      error('Authentication failed', err.message || 'Invalid credentials');
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-8 shadow-2xl border-slate-800/80 w-full space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-100">Sign In</h2>
        <p className="text-sm text-slate-400">Enter your credentials to access your dashboard</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="e.g. admin@fleetops.demo"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Password
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              {...register('password')}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          className="w-full py-3"
          isLoading={isLoggingIn}
        >
          Sign In
        </Button>
      </form>

      {/* Demo credentials guide */}
      <div className="pt-4 border-t border-slate-800/80 text-center space-y-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Demo Credentials</p>
        <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-mono">
          <div className="bg-slate-950/50 p-1.5 rounded border border-slate-900">
            <p className="text-slate-500">Admin</p>
            <p className="truncate">admin@fleetops.demo</p>
          </div>
          <div className="bg-slate-950/50 p-1.5 rounded border border-slate-900">
            <p className="text-slate-500">Manager</p>
            <p className="truncate">manager@fleetops.demo</p>
          </div>
          <div className="bg-slate-950/50 p-1.5 rounded border border-slate-900">
            <p className="text-slate-500">Staff</p>
            <p className="truncate">staff@fleetops.demo</p>
          </div>
          <div className="bg-slate-950/50 p-1.5 rounded border border-slate-900">
            <p className="text-slate-500">Driver</p>
            <p className="truncate">driver@fleetops.demo</p>
          </div>
        </div>
        <p className="text-[10px] text-slate-500">Password for all users: <span className="font-mono text-slate-400">demo1234</span></p>
      </div>
    </div>
  );
}
export default LoginForm;
