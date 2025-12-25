'use client';

import { useAuthStore } from '@/lib/useAuthStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useEffect, useState, useCallback } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import Link from 'next/link';
import WebsiteModal from '@/components/WebsiteModal';
import { ChevronRight, Globe, Plus } from 'lucide-react';
import { cn, getStatusColor } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Website } from '../types';

const Page = () => {
  const route = useRouter();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [websites, setWebsites] = useState<Website[]>([]);
  const [loadingWebsites, setLoadingWebsites] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    upCount: 0,
    downCount: 0,
    unknownCount: 0,
  });

  const fetchWebsites = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/websites`,
        { withCredentials: true }
      );
      const fetchedWebsites = res.data;
      setWebsites(fetchedWebsites);

      const up = fetchedWebsites.filter(
        (w: Website) => w.ticks?.[0]?.status === 'Up'
      ).length;
      const down = fetchedWebsites.filter(
        (w: Website) => w.ticks?.[0]?.status === 'Down'
      ).length;
      setStats({
        upCount: up,
        downCount: down,
        unknownCount: fetchedWebsites.length - up - down,
      });
    } catch {
      toast.error('Failed to fetch websites');
    } finally {
      setLoadingWebsites(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error('Sign in to access the dashboard!');
      route.push('/sign-in');
    }
  }, [isAuthenticated, isLoading, route]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWebsites();
    }
  }, [isAuthenticated, fetchWebsites]);

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'Up':
        return 'Up';
      case 'Down':
        return 'Down';
      default:
        return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Spinner className='h-24 w-24' />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className='min-h-screen pt-28 pb-12 px-6'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex items-center justify-between mb-10'>
          <div>
            <h1 className='text-4xl font-bold mb-2'>Dashboard</h1>
            <p className='text-muted-foreground'>
              Monitor your websites in real-time
            </p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className='bg-accent text-black hover:bg-accent/60 font-semibold px-6 cursor-pointer'
          >
            <Plus size={5} />
            Add Website
          </Button>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div className='bg-card border border-border rounded-xl p-5'>
            <p className='text-muted-foreground text-sm mb-1'>Total Monitors</p>
            <p className='text-3xl font-bold'>{websites.length}</p>
          </div>
          <div className='bg-card border border-border rounded-xl p-5'>
            <div className='flex items-center gap-2 mb-1'>
              <div className='w-2 h-2 rounded-full bg-accent animate-pulse' />
              <p className='text-muted-foreground text-sm'>Operational</p>
            </div>
            <p className='text-3xl font-bold text-accent'>{stats.upCount}</p>
          </div>
          <div className='bg-card border border-border rounded-xl p-5'>
            <div className='flex items-center gap-2 mb-1'>
              <div className='w-2 h-2 rounded-full bg-destructive animate-pulse' />
              <p className='text-muted-foreground text-sm'>Down</p>
            </div>
            <p className='text-3xl font-bold text-destructive'>
              {stats.downCount}
            </p>
          </div>
          <div className='bg-card border border-border rounded-xl p-5'>
            <div className='flex items-center gap-2 mb-1'>
              <div className='w-2 h-2 rounded-full bg-muted-foreground' />
              <p className='text-muted-foreground text-sm'>Unknown</p>
            </div>
            <p className='text-3xl font-bold text-muted-foreground'>
              {stats.unknownCount}
            </p>
          </div>
        </div>

        <div className='flex justify-center mx-auto my-6 w-1/3'>
          <Separator />
        </div>

        {loadingWebsites ? (
          <div className='flex justify-center py-20'>
            <Spinner className='h-12 w-12' />
          </div>
        ) : websites.length === 0 ? (
          <div className='flex flex-col justify-center gap-y-1 items-center py-20 border border-dashed border-muted-foreground rounded-xl'>
            <Globe className='h-16 w-16 text-muted-foreground' />
            <h3 className='text-xl font-semibold mb-2'>No websites yet</h3>
            <p className='text-muted-foreground mb-6'>
              Add your first website to start monitoring
            </p>
            <Button
              onClick={() => setShowModal(true)}
              className='bg-accent text-black hover:bg-accent/60 font-semibold cursor-pointer'
            >
              Add Your First Website
            </Button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {websites.map((website) => {
              const latestTick = website.ticks?.[0];
              const status = latestTick?.status;

              return (
                <Link
                  key={website.id}
                  href={`/website/${website.id}`}
                  className={cn(
                    'group bg-card border border-border rounded-xl p-5 transition-all duration-300',
                    website.ticks?.[0]?.status === 'Up'
                      ? 'hover:border-accent/50 hover:shadow-[0_0_20px_rgba(0,255,159,0.1)]'
                      : website.ticks?.[0]?.status === 'Down'
                        ? 'hover:border-destructive/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.1)]'
                        : 'hover:border-muted-foreground/50 hover:shadow-[0_0_20px_rgba(107,114,128,0.1)]'
                  )}
                >
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                      <div
                        className={`w-3 h-3 rounded-full ${getStatusColor(status)} ${status === 'Up' || status === 'Down' ? 'animate-pulse' : ''}`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          status === 'Up'
                            ? 'text-accent'
                            : status === 'Down'
                              ? 'text-destructive'
                              : 'text-muted-foreground'
                        }`}
                      >
                        {getStatusText(status)}
                      </span>
                    </div>
                    <ChevronRight className='w-5 h-5' />
                  </div>

                  <h3 className='font-mono text-sm text-foreground truncate mb-2'>
                    {website.url}
                  </h3>

                  <div className='flex items-center justify-between text-xs text-muted-foreground'>
                    <span>
                      Added {new Date(website.time_added).toLocaleDateString()}
                    </span>
                    {latestTick?.response_time_ms && (
                      <span className='font-mono'>
                        {latestTick.response_time_ms}ms
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <WebsiteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchWebsites}
      />
    </div>
  );
};

export default Page;
