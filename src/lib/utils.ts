import { Channel } from './types';

export function getChannelIcon(channel: Channel): string {
  const icons: Record<Channel, string> = {
    email: 'Mail',
    instagram: 'Instagram',
    facebook: 'Facebook',
    tiktok: 'Music2',
    whatsapp: 'MessageCircle',
  };
  return icons[channel];
}

export function getChannelLabel(channel: Channel): string {
  const labels: Record<Channel, string> = {
    email: 'Email',
    instagram: 'Instagram',
    facebook: 'Facebook',
    tiktok: 'TikTok',
    whatsapp: 'WhatsApp',
  };
  return labels[channel];
}

export function getChannelColor(channel: Channel): string {
  const colors: Record<Channel, string> = {
    email: 'text-gold',
    instagram: 'text-pink-400',
    facebook: 'text-blue-400',
    tiktok: 'text-cream',
    whatsapp: 'text-green-400',
  };
  return colors[channel];
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    open: 'bg-teal text-white',
    pending: 'bg-warning text-chocolate',
    resolved: 'bg-surface text-text-secondary',
  };
  return colors[status] || 'bg-surface text-text-secondary';
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    urgent: 'text-danger',
    high: 'text-warning',
    medium: 'text-gold',
    low: 'text-text-secondary',
  };
  return colors[priority] || 'text-text-secondary';
}

export function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
