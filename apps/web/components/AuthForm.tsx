'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from './ui/spinner';
import { AuthInput, AuthInputType } from '@/validator/user.validator';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/useAuthStore';

interface AuthFormProps {
  type: 'sign-in' | 'sign-up';
}

const AuthForm = ({ type }: AuthFormProps) => {
  const route = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const isSignUp = type === 'sign-up';

  const form = useForm<AuthInputType>({
    resolver: zodResolver(AuthInput),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (data: AuthInputType) => {
    setIsLoading(true);

    try {
      const endpoint = isSignUp ? 'sign-up' : 'sign-in';

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${endpoint}`,
        {
          email: data.email,
          password: data.password,
        },
        {
          withCredentials: true,
        }
      );

      if (isSignUp) {
        toast.success('User signed up successfully!');
        route.push('/sign-in');
      } else {
        toast.success(
          'User signed in successfully! Redirecting to Dashboard...'
        );
        useAuthStore.setState({ isAuthenticated: true });
        route.push('/dashboard');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Auth error:',
          error.response?.data?.message || error.message
        );
        toast.error('Authentication error!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center px-6 py-12'>
      <div className='w-full max-w-md'>
        <div className='animate-fade-up bg-card border border-border rounded-2xl p-8'>
          <div className='text-center mb-8'>
            <h1 className='text-2xl font-bold tracking-tight mb-2'>
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className='text-muted-foreground text-sm'>
              {isSignUp
                ? 'Start monitoring your sites in seconds'
                : 'Sign in to access your dashboard'}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='johndoe@gmail.com'
                {...register('email')}
              />
              {errors.email && (
                <p className='text-destructive text-xs'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='••••••••'
                {...register('password')}
              />
              {errors.password && (
                <p className='text-destructive text-xs'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type='submit'
              className='w-full h-11 bg-primary text-primary-foreground hover:bg-primary/60 rounded-lg font-semibold'
              disabled={isLoading}
            >
              {isLoading ? (
                <span className='flex items-center gap-2'>
                  <Spinner />
                  {isSignUp ? 'Creating account...' : 'Signing in...'}
                </span>
              ) : isSignUp ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <p className='text-center text-sm text-muted-foreground mt-6'>
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <Link
                  href='/sign-in'
                  className='text-accent hover:underline font-medium'
                >
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Don&apos;t have an account?{' '}
                <Link
                  href='/sign-up'
                  className='text-accent hover:underline font-medium'
                >
                  Sign up
                </Link>
              </>
            )}
          </p>
        </div>

        <p className='text-center text-xs text-muted-foreground mt-6'>
          All uptime alerts and notifications will be sent to this email address
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
