import React from 'react';

const Footer = () => {
  return (
    <footer className='border-t border-border px-6 py-12'>
      <div className='max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6'>
        <div className='flex items-center gap-3'>
          <div className='w-2.5 h-2.5 rounded-full bg-primary status-online' />
          <span className='text-lg font-bold tracking-tight'>
            Up<span className='text-primary'>Site</span>
          </span>
        </div>
        <div className='text-sm text-muted-foreground font-mono'>
          &copy; {new Date().getFullYear()} UpSite. Ship with confidence.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
