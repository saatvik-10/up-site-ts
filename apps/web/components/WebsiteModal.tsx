'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import axios from 'axios';
import { X } from 'lucide-react';

interface WebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const WebsiteModal = ({ isOpen, onClose, onSuccess }: WebsiteModalProps) => {
  const [newUrl, setNewUrl] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    setAdding(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/website`,
        { url: newUrl },
        { withCredentials: true }
      );
      toast.success('Website added successfully!');
      setNewUrl('');
      onClose();
      onSuccess();
    } catch {
      toast.error('Failed to add website');
    } finally {
      setAdding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='absolute inset-0 bg-black/60 backdrop-blur-sm'
        onClick={onClose}
      />
      <div className='relative bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-bold'>Add Website</h2>
          <Button
            variant={'ghost'}
            onClick={onClose}
            className='text-muted-foreground hover:text-primary hover:bg-transparent transition-colors cursor-pointer'
          >
            <X size={32} />
          </Button>
        </div>

        <form onSubmit={handleAddWebsite}>
          <div className='mb-6'>
            <label htmlFor='url' className='block text-sm font-medium mb-2'>
              Website URL
            </label>
            <input
              id='url'
              type='url'
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder='https://example.com'
              className='w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ff9f]/50 focus:border-[#00ff9f] font-mono text-sm transition-all'
              required
            />
            <p className='text-xs text-muted-foreground mt-2'>
              Enter the full URL including https://
            </p>
          </div>

          <div className='flex gap-3'>
            <Button
              type='button'
              onClick={onClose}
              className='flex-1 cursor-pointer bg-transparent hover:bg-primary/40 border text-primary'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={adding}
              className='flex-1 bg-accent text-black hover:bg-accent/60 font-semibold cursor-pointer'
            >
              {adding ? <Spinner className='h-5 w-5' /> : 'Start Monitoring'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WebsiteModal;
