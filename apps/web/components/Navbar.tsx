import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <header className='animate-slide-down fixed top-0 left-0 right-0 z-50'>
      <nav className='mx-auto max-w-7xl px-6 py-4'>
        <div className='flex items-center justify-between backdrop-blur-md bg-surface/60 border border-border rounded-full px-6 py-3'>
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

          <div className='flex items-center gap-3'>
            <Button
              variant='ghost'
              className='text-sm font-medium hidden sm:flex hover:bg-primary/60 cursor-pointer'
            >
              Sign In
            </Button>
            <Button className='text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/60 rounded-full px-5 cursor-pointer'>
              Get Started
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
