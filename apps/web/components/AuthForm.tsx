'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from './ui/spinner';

interface AuthFormProps {
  type: 'sign-in' | 'sign-up';
}

const AuthForm = ({ type }: AuthFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    password: '',
  });

  const isSignUp = type === 'sign-up';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('Form submitted:', formData);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
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

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                name='name'
                type='text'
                placeholder='John Doe'
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='password'>Password</Label>
              </div>
              <Input
                id='password'
                name='password'
                type='password'
                placeholder='••••••••'
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />
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

        {/* Terms */}
        <p className='text-center text-xs text-muted-foreground mt-6'>
          By continuing, you agree to our{' '}
          <Link href='/terms' className='hover:underline'>
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href='/privacy' className='hover:underline'>
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
