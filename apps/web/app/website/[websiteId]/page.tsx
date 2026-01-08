'use client';

import { useAuthStore } from '@/lib/useAuthStore';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { useEffect, useState, useCallback } from 'react';
import { Spinner } from '@/components/ui/spinner';
import axios from 'axios';
import Link from 'next/link';
import { ArrowLeft, Globe, Clock, Activity } from 'lucide-react';
import { cn, formatDate, getStatusColor } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Website, WebsiteTick } from '@/app/types';

const StatusBar = ({ ticks }: { ticks: WebsiteTick[] }) => {
  const maxBars = 10;
  const displayTicks = [...ticks].reverse().slice(-maxBars);
  const emptySlots = maxBars - displayTicks.length;

  const getBarColor = (status: string) => {
    switch (status) {
      case 'Up':
        return 'bg-accent';
      case 'Down':
        return 'bg-destructive';
      default:
        return 'bg-muted-foreground';
    }
  };

  const formatTooltip = (tick: WebsiteTick) => {
    const date = new Date(tick.created_at).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${tick.status} • ${tick.response_time_ms}ms • ${date}`;
  };

  return (
    <div className='flex items-center gap-0.5 lg:gap-1.5 md:gap-1.5'>
      {Array.from({ length: emptySlots }).map((_, i) => (
        <div
          key={`empty-${i}`}
          className='w-2 lg:w-7 md:w-7 h-2 rounded-[2px] bg-muted-foreground/30'
          title='Pending'
        />
      ))}
      {displayTicks.map((tick) => (
        <div
          key={tick.id}
          className={cn(
            'w-2 lg:w-7 md:w-7 h-2 rounded-[2px] transition-all hover:h-5 cursor-pointer',
            getBarColor(tick.status)
          )}
          title={formatTooltip(tick)}
        />
      ))}
    </div>
  );
};

const WebsitePage = () => {
  const router = useRouter();
  const params = useParams();
  const websiteId = params.websiteId as string;

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [website, setWebsite] = useState<Website | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWebsite = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/website/${websiteId}`,
        { withCredentials: true }
      );
      setWebsite(res.data.website);
    } catch {
      toast.error('Failed to fetch website');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [websiteId, router]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error('Sign in to view website details!');
      router.push('/sign-in');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWebsite();
      const interval = setInterval(fetchWebsite, 3.5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchWebsite]);

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'Up':
        return 'text-accent';
      case 'Down':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  if (isLoading || loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Spinner className='h-24 w-24' />
      </div>
    );
  }

  if (!isAuthenticated || !website) {
    return null;
  }

  const latestTick = website.ticks?.[0];
  const upCount =
    website.ticks?.filter((t: WebsiteTick) => t.status === 'Up').length ?? 0;
  const downCount =
    website.ticks?.filter((t: WebsiteTick) => t.status === 'Down').length ?? 0;
  const avgResponseTime =
    website.ticks && website.ticks.length > 0
      ? Math.round(
          website.ticks.reduce(
            (acc: number, t: WebsiteTick) => acc + t.response_time_ms,
            0
          ) / website.ticks.length
        )
      : 0;

  return (
    <div className='min-h-screen pt-28 pb-12 px-6'>
      <div className='max-w-5xl mx-auto'>
        <div className='mb-8'>
          <Link
            href='/dashboard'
            className='inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6'
          >
            <ArrowLeft size={18} />
            <span>Back to Dashboard</span>
          </Link>

          <div className='flex items-start justify-between'>
            <div className='flex items-center gap-4'>
              <div
                className={cn(
                  'w-4 h-4 rounded-full',
                  getStatusColor(latestTick?.status || 'Unknown'),
                  latestTick?.status === 'Up' || latestTick?.status === 'Down'
                    ? 'animate-pulse'
                    : ''
                )}
              />
              <div>
                <h1 className='text-2xl font-bold font-mono break-all'>
                  {website.url}
                </h1>
                <p className='text-muted-foreground text-sm mt-1'>
                  Added {new Date(website.time_added).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
          <div className='bg-card border border-border rounded-xl p-5'>
            <div className='flex items-center gap-2 text-muted-foreground mb-2'>
              <Activity size={16} />
              <span className='text-sm'>Total Checks</span>
            </div>
            <p className='text-2xl font-bold'>{website?.ticks?.length}</p>
          </div>
          <div className='bg-card border border-border rounded-xl p-5'>
            <div className='flex items-center gap-2 text-muted-foreground mb-2'>
              <Globe size={16} />
              <span className='text-sm'>Uptime</span>
            </div>
            <p className='text-2xl font-bold text-accent'>
              {(website?.ticks?.length ?? 0) > 0
                ? ((upCount / (website?.ticks?.length ?? 1)) * 100).toFixed(1)
                : 0}
              %
            </p>
          </div>
          <div className='bg-card border border-border rounded-xl p-5'>
            <div className='flex items-center gap-2 text-muted-foreground mb-2'>
              <Clock size={16} />
              <span className='text-sm'>Avg Response</span>
            </div>
            <p className='text-2xl font-bold font-mono'>{avgResponseTime}ms</p>
          </div>
          <div className='bg-card border border-border rounded-xl p-5'>
            <div className='flex items-center gap-2 text-muted-foreground mb-2'>
              <Activity size={16} />
              <span className='text-sm'>Incidents</span>
            </div>
            <p className='text-2xl font-bold text-destructive'>{downCount}</p>
          </div>
        </div>

        <Separator className='my-8' />

        {latestTick && (
          <div className='bg-card border border-border rounded-xl p-5'>
            <h3 className='text-sm text-muted-foreground mb-3'>Latest Check</h3>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-3'>
                  <div
                    className={cn(
                      'w-3 h-3 rounded-full',
                      getStatusColor(latestTick.status),
                      'animate-pulse'
                    )}
                  />
                  <span
                    className={cn(
                      'font-medium',
                      getStatusTextColor(latestTick.status)
                    )}
                  >
                    {latestTick.status}
                  </span>
                </div>
                <StatusBar ticks={website.ticks ?? []} />
              </div>
              <div className='flex items-center gap-2 md:gap-4'>
                <span className='font-mono lg:text-base md:text-base text-xs hidden md:block lg:block'>
                  {latestTick.response_time_ms}ms
                </span>
                <span className='text-muted-foreground lg:text-sm md:text-sm text-xs'>
                  {formatDate(latestTick.created_at)}
                </span>
              </div>
            </div>
          </div>
        )}

        <Separator className='my-8' />

        {website.alerts && website.alerts.length > 0 && (
          <div className='bg-card border border-border rounded-xl p-5'>
            <h3 className='text-sm text-muted-foreground mb-4'>
              Alert History ({website.alerts.length})
            </h3>
            <div className='space-y-3'>
              {website.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className='flex items-center justify-between p-3 bg-background rounded-lg border border-border'
                >
                  <div className='flex items-center gap-3'>
                    <div
                      className={cn(
                        'w-2.5 h-2.5 rounded-full',
                        getStatusColor(alert.status)
                      )}
                    />
                    <span
                      className={cn(
                        'font-medium',
                        getStatusTextColor(alert.status)
                      )}
                    >
                      {alert.status === 'Down'
                        ? 'Website Down'
                        : 'Website Recovered'}
                    </span>
                  </div>
                  <span className='text-muted-foreground text-sm'>
                    {formatDate(alert.time_added)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsitePage;
