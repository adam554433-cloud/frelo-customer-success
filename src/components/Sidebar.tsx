'use client';

import { useInboxStore } from '@/lib/store';
import { Channel } from '@/lib/types';
import {
  formatTime,
  getInitials,
  getChannelColor,
  getStatusColor,
  getPriorityColor,
} from '@/lib/utils';
import { channelIconMap } from './ChannelIcons';
import {
  Search,
  AlertCircle,
  Circle,
} from 'lucide-react';
import clsx from 'clsx';

const channelFilters: { value: Channel | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'email', label: 'Email' },
  { value: 'instagram', label: 'IG' },
  { value: 'facebook', label: 'FB' },
  { value: 'tiktok', label: 'TT' },
  { value: 'whatsapp', label: 'WA' },
];

export default function Sidebar() {
  const {
    selectedConversationId,
    selectConversation,
    filters,
    setFilter,
    getFilteredConversations,
  } = useInboxStore();

  const conversations = getFilteredConversations();
  const allConversations = useInboxStore((s) => s.conversations);

  const openCount = allConversations.filter((c) => c.status === 'open').length;
  const unreadCount = allConversations.filter((c) => c.unread).length;

  return (
    <div className="w-[380px] min-w-[380px] border-r border-border bg-background flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-cream-light">Inbox</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-teal text-white px-2 py-0.5 rounded-full font-medium">
              {openCount} open
            </span>
            {unreadCount > 0 && (
              <span className="text-xs bg-gold text-chocolate px-2 py-0.5 rounded-full font-medium">
                {unreadCount} new
              </span>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={filters.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            className="w-full bg-surface border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-cream-light placeholder:text-text-muted focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>

        {/* Channel filters */}
        <div className="flex gap-1">
          {channelFilters.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter({ channel: value })}
              className={clsx(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                filters.channel === value
                  ? 'bg-gold text-chocolate'
                  : 'bg-surface text-text-secondary hover:bg-surface-hover'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-text-muted text-sm">
            No conversations found
          </div>
        ) : (
          conversations.map((conv) => {
            const ChannelIcon = channelIconMap[conv.channel];
            const isSelected = selectedConversationId === conv.id;

            return (
              <button
                key={conv.id}
                onClick={() => selectConversation(conv.id)}
                className={clsx(
                  'w-full text-left p-4 border-b border-border transition-colors',
                  isSelected
                    ? 'bg-surface-active border-l-2 border-l-gold'
                    : 'hover:bg-surface-hover border-l-2 border-l-transparent'
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={clsx(
                        'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold',
                        conv.unread
                          ? 'bg-gold text-chocolate'
                          : 'bg-surface-hover text-cream-dim'
                      )}
                    >
                      {getInitials(conv.customer.name)}
                    </div>
                    <div
                      className={clsx(
                        'absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center bg-background',
                        getChannelColor(conv.channel)
                      )}
                    >
                      <ChannelIcon className="w-2.5 h-2.5" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span
                        className={clsx(
                          'text-sm truncate',
                          conv.unread
                            ? 'font-semibold text-cream-light'
                            : 'font-medium text-cream-dim'
                        )}
                      >
                        {conv.customer.name}
                      </span>
                      <span className="text-xs text-text-muted flex-shrink-0 ml-2">
                        {formatTime(conv.lastMessageTime)}
                      </span>
                    </div>

                    <p className="text-xs text-text-secondary truncate mb-1.5">
                      {conv.subject}
                    </p>

                    <p
                      className={clsx(
                        'text-xs truncate',
                        conv.unread ? 'text-cream-dim' : 'text-text-muted'
                      )}
                    >
                      {conv.lastMessage}
                    </p>

                    {/* Tags row */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <span
                        className={clsx(
                          'text-[10px] px-1.5 py-0.5 rounded font-medium',
                          getStatusColor(conv.status)
                        )}
                      >
                        {conv.status}
                      </span>
                      {(conv.priority === 'urgent' || conv.priority === 'high') && (
                        <AlertCircle
                          className={clsx('w-3 h-3', getPriorityColor(conv.priority))}
                        />
                      )}
                      {conv.unread && (
                        <Circle className="w-2 h-2 fill-gold text-gold ml-auto" />
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Status filter tabs */}
      <div className="border-t border-border p-2 flex gap-1">
        {(['all', 'open', 'pending', 'resolved'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter({ status })}
            className={clsx(
              'flex-1 py-1.5 rounded text-xs font-medium transition-colors capitalize',
              filters.status === status
                ? 'bg-surface-active text-gold'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
}
