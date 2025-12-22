'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/useAuthStore';

const Navbar = () => {
  const route = useRouter();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const signOut = useAuthStore((s) => s.signOut);

  const handleAuthType = (authType: 'sign-in' | 'sign-up') => {
    route.push(`/${authType}`);
  };

  const handleSignOut = async () => {
    await signOut();
    route.push('/');
  };

  return (
    <header className='animate-slide-down fixed top-0 left-0 right-0 z-50'>
      <nav className='mx-auto max-w-7xl px-6 py-4'>
        <div className='flex items-center justify-between backdrop-blur-md bg-surface/60 border border-border rounded-xl px-6 py-3'>
          <Link
            href='/'
            className='flex items-center gap-3 group cursor-pointer'
          >
            <div className='relative'>
              <div className='w-3 h-3 rounded-full bg-primary status-online' />
              <div className='absolute inset-0 w-3 h-3 rounded-full bg-accent blur-sm' />
            </div>
            <span className='text-xl font-bold tracking-tight'>UpSite</span>
          </Link>

          {!isAuthenticated ? (
            <>
              <div className='flex items-center gap-3'>
                <Button
                  variant='ghost'
                  className='text-sm font-semibold hidden sm:flex bg-primary text-primary-foreground hover:bg-primary/60 cursor-pointer rounded-lg'
                  onClick={() => handleAuthType('sign-in')}
                >
                  Sign In
                </Button>
                <Button
                  className='text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/60 rounded-lg px-5 cursor-pointer'
                  onClick={() => handleAuthType('sign-up')}
                >
                  Get Started
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className='flex items-center gap-3'>
                <Button
                  variant='ghost'
                  className='text-sm font-semibold hidden sm:flex text-primary-foreground bg-primary hover:bg-primary/60 cursor-pointer rounded-lg'
                  onClick={() => route.push('/dashboard')}
                >
                  Dashboard
                </Button>
                <Button
                  className='text-sm font-semibold bg-destructive text-primary hover:bg-destructive/60 rounded-lg px-5 cursor-pointer'
                  onClick={handleSignOut}
                >
                  Sign out
                </Button>
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
