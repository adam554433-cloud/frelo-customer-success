'use client';

import { useInboxStore } from '@/lib/store';
import { Channel, Message } from '@/lib/types';
import {
  getInitials,
  getChannelColor,
  getStatusColor,
  getPriorityColor,
  getChannelLabel,
} from '@/lib/utils';
import { channelIconMap } from './ChannelIcons';
import {
  Mail,
  Tag,
  User,
  Clock,
  ChevronDown,
  Inbox,
} from 'lucide-react';
import clsx from 'clsx';
import ReplyComposer from './ReplyComposer';

function MessageBubble({ message }: { message: Message }) {
  const isAgent = message.sender === 'agent';

  return (
    <div className={clsx('flex gap-3 mb-4', isAgent ? 'flex-row-reverse' : '')}>
      <div
        className={clsx(
          'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0',
          isAgent
            ? 'bg-teal text-white'
            : 'bg-surface-hover text-cream-dim'
        )}
      >
        {getInitials(message.senderName)}
      </div>

      <div className={clsx('max-w-[70%]', isAgent ? 'items-end' : '')}>
        <div className="flex items-center gap-2 mb-1">
          <span className={clsx('text-xs font-medium', isAgent ? 'text-teal' : 'text-cream-dim')}>
            {message.senderName}
          </span>
          <span className="text-xs text-text-muted">
            {message.timestamp.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        <div
          className={clsx(
            'rounded-xl px-4 py-3 text-sm leading-relaxed',
            isAgent
              ? 'bg-teal-deep/30 text-cream-light rounded-tr-sm'
              : 'bg-surface text-cream border border-border rounded-tl-sm',
            message.isAiDraft && 'border border-dashed border-gold/50'
          )}
        >
          {message.isAiDraft && (
            <span className="text-[10px] text-gold font-medium uppercase tracking-wider block mb-1">
              AI Draft
            </span>
          )}
          {message.content}
        </div>
      </div>
    </div>
  );
}

export default function ConversationView() {
  const conversation = useInboxStore((s) => s.getSelectedConversation());
  const updateStatus = useInboxStore((s) => s.updateConversationStatus);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <Inbox className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-cream-dim mb-1">
            Select a conversation
          </h3>
          <p className="text-sm text-text-muted">
            Choose a conversation from the inbox to start helping customers
          </p>
        </div>
      </div>
    );
  }

  const ChannelIcon = channelIconMap[conversation.channel];

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gold text-chocolate flex items-center justify-center font-semibold text-sm">
              {getInitials(conversation.customer.name)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-cream-light">
                  {conversation.customer.name}
                </h2>
                <ChannelIcon
                  className={clsx('w-4 h-4', getChannelColor(conversation.channel))}
                />
                <span className="text-xs text-text-muted">
                  via {getChannelLabel(conversation.channel)}
                </span>
              </div>
              <p className="text-sm text-text-secondary">{conversation.subject}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Priority */}
            <span
              className={clsx(
                'text-xs font-medium capitalize',
                getPriorityColor(conversation.priority)
              )}
            >
              {conversation.priority}
            </span>

            {/* Status dropdown */}
            <div className="relative group">
              <button
                className={clsx(
                  'text-xs px-3 py-1.5 rounded-md font-medium flex items-center gap-1',
                  getStatusColor(conversation.status)
                )}
              >
                {conversation.status}
                <ChevronDown className="w-3 h-3" />
              </button>
              <div className="absolute right-0 top-full mt-1 bg-surface border border-border rounded-lg shadow-xl py-1 hidden group-hover:block z-10 min-w-[120px]">
                {(['open', 'pending', 'resolved'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(conversation.id, status)}
                    className="w-full text-left px-3 py-1.5 text-xs text-cream-dim hover:bg-surface-hover capitalize"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tags & Meta */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1.5">
            <User className="w-3 h-3 text-text-muted" />
            <span className="text-xs text-text-secondary">
              {conversation.assignedTo === 'a1'
                ? 'Noa Cohen'
                : conversation.assignedTo === 'a2'
                ? 'Yael Levi'
                : 'Amit Ben-David'}
            </span>
          </div>
          <span className="text-text-muted">|</span>
          <div className="flex items-center gap-1.5">
            <Mail className="w-3 h-3 text-text-muted" />
            <span className="text-xs text-text-secondary">
              {conversation.customer.email}
            </span>
          </div>
          <span className="text-text-muted">|</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Tag className="w-3 h-3 text-text-muted" />
            {conversation.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 bg-surface-hover text-cream-dim rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-3xl mx-auto">
          {/* Timeline marker */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <div className="flex items-center gap-1.5 text-text-muted">
              <Clock className="w-3 h-3" />
              <span className="text-xs">
                {conversation.messages[0]?.timestamp.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex-1 h-px bg-border" />
          </div>

          {conversation.messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </div>
      </div>

      {/* Reply Composer */}
      <ReplyComposer />
    </div>
  );
}
