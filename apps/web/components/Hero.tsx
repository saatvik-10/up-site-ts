'use client';

import { Activity, MailCheckIcon } from 'lucide-react';
import { Button } from './ui/button';
import { ArrowRight, Server } from 'lucide-react';
import Footer from './Footer';
import { useRouter } from 'next/navigation';

const Hero = () => {
  const route = useRouter();

  return (
    <div className='relative min-h-screen'>
      <section className='relative pt-40 pb-20 px-6'>
        <div className='max-w-5xl mx-auto text-center relative'>
          <h1 className='animate-fade-up delay-100 text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] mb-6'>
            Know when your
            <br />
            <span className='text-primary glow-text'>site goes down</span>
          </h1>

          <p className='animate-fade-up delay-200 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed'>
            Real-time uptime monitoring for websites.
            <br />
            Get instant alerts the moment something breaks.
          </p>

          <div className='animate-fade-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4'>
            <Button
              onClick={() => route.push('/dashboard')}
              size='lg'
              className='text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 group cursor-pointer'
            >
              Start Monitoring Free
              <ArrowRight className='ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform' />
            </Button>
          </div>
        </div>
      </section>

      <section className='animate-fade-up delay-400 relative px-6 pb-24'>
        <div className='max-w-5xl mx-auto'>
          <div className='rounded-2xl overflow-hidden bg-card border border-border'>
            <div className='flex items-center justify-between px-5 py-4 bg-surface border-b border-border'>
              <div className='flex items-center gap-3'>
                <div className='w-5 h-5 text-primary'>
                  <Activity size={20} className='text-primay' />
                </div>
                <span className='font-semibold'>Dashboard</span>
              </div>
              <span className='text-xs font-mono text-muted-foreground'>
                Last check: 4s ago
              </span>
            </div>

            <div className='p-5 space-y-4'>
              {[
                {
                  name: 'xyz.com',
                  status: 'up',
                  latency: '45ms',
                  uptime: '99.98%',
                },
                {
                  name: 'yourapp.com',
                  status: 'up',
                  latency: '123ms',
                  uptime: '100%',
                },
                {
                  name: 'hello.xyz.com',
                  status: 'unknown',
                  latency: '18ms',
                  uptime: '-',
                },
                {
                  name: 'staging.yourapp.com',
                  status: 'down',
                  latency: '-',
                  uptime: '97.2%',
                },
              ].map((site) => (
                <div
                  key={site.name}
                  className='flex items-center justify-between p-4 rounded-lg bg-surface/50 border border-border'
                >
                  <div className='flex items-center gap-3'>
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        site.status === 'up'
                          ? 'bg-accent'
                          : site.status === 'unknown'
                            ? 'bg-muted-foreground'
                            : 'bg-destructive'
                      }`}
                    />
                    <span className='font-mono text-sm'>{site.name}</span>
                  </div>
                  <div className='flex items-center gap-6 text-sm'>
                    <span className='text-muted-foreground font-mono hidden md:block'>
                      {site.uptime}
                    </span>
                    <span
                      className={`font-mono hidden md:block ${
                        site.status === 'up'
                          ? 'text-accent'
                          : site.status === 'unknown'
                            ? 'text-muted-foreground'
                            : 'text-destructive'
                      }`}
                    >
                      {site.latency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id='features' className='relative px-6 py-24'>
        <div className='max-w-5xl mx-auto'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight mb-16 text-center'>
            How it works
          </h2>

          <div className='grid md:grid-cols-3 gap-8'>
            <div className='relative'>
              <div className='text-6xl font-bold text-primary/20 mb-4'>01</div>
              <h3 className='text-xl font-semibold mb-3'>Add your endpoints</h3>
              <p className='text-muted-foreground leading-relaxed'>
                Enter the URLs you want to monitor. Websites, APIs, webhooks —
                anything with an HTTP endpoint.
              </p>
            </div>

            <div className='relative'>
              <div className='text-6xl font-bold text-primary/20 mb-4'>02</div>
              <h3 className='text-xl font-semibold mb-3'>We ping every 180s</h3>
              <p className='text-muted-foreground leading-relaxed'>
                Our distributed workers check your sites from multiple regions.
                Response times and status codes are logged.
              </p>
            </div>

            <div className='relative'>
              <div className='text-6xl font-bold text-primary/20 mb-4'>03</div>
              <h3 className='text-xl font-semibold mb-3'>
                Get alerted instantly
              </h3>
              <p className='text-muted-foreground leading-relaxed'>
                When something goes wrong, you know immediately via Email.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className='relative px-6 py-24 bg-surface/30'>
        <div className='max-w-5xl mx-auto'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold tracking-tight mb-4'>
              Built for reliability
            </h2>
            <p className='text-muted-foreground max-w-xl mx-auto'>
              Distributed architecture with Redis Streams, multi-region workers,
              and real-time event processing.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 items-center'>
            <div className='text-center p-6 rounded-xl bg-card border border-border'>
              <div className='w-14 h-14 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-4'>
                <Server className='w-7 h-7 text-primary' />
              </div>
              <h4 className='font-semibold mb-2'>Producer</h4>
              <p className='text-sm text-muted-foreground'>
                Schedules health checks and pushes jobs to the queue
              </p>
            </div>

            <div className='flex items-center justify-center rotate-90 md:rotate-0'>
              <div className='w-8 md:w-full h-px bg-accent relative'>
                <div className='absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-accent rotate-45' />
              </div>
            </div>

            <div className='text-center p-6 rounded-xl bg-card border border-border'>
              <div className='w-14 h-14 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-4'>
                <Activity size={28} className='text-primary' />
              </div>
              <h4 className='font-semibold mb-2'>Consumer</h4>
              <p className='text-sm text-muted-foreground'>
                Processes checks and records response metrics
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className='relative px-6 py-24'>
        <div className='max-w-3xl mx-auto'>
          <div className='flex flex-col items-center gap-4'>
            <h2 className='text-3xl md:text-6xl font-bold tracking-tight'>
              Alerts that matter
            </h2>
            <p className='text-muted-foreground'>
              No noise. Just actionable notifications when things break.
            </p>
            <MailCheckIcon className='size-15' />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Hero;
