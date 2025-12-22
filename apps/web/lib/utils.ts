import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getStatusColor = (status?: string) => {
  switch (status) {
    case 'Up':
      return 'bg-accent';
    case 'Down':
      return 'bg-destructive';
    default:
      return 'bg-muted-foreground';
  }
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};