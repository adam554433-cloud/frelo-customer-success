'use client';

import { agents } from '@/lib/mock-data';
import { Headset, Bell, Settings, Users } from 'lucide-react';
import clsx from 'clsx';

export default function TopBar() {
  return (
    <div className="h-14 border-b border-border bg-forest flex items-center justify-between px-5">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
          <Headset className="w-4.5 h-4.5 text-chocolate" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-cream-light tracking-wide">
            frelo
          </h1>
          <span className="text-[10px] text-teal font-medium uppercase tracking-widest">
            Customer Success
          </span>
        </div>
      </div>

      {/* Center - Team status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-xs text-text-secondary">Team:</span>
        </div>
        <div className="flex items-center gap-3">
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-center gap-1.5">
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-surface-hover text-cream-dim flex items-center justify-center text-[10px] font-semibold">
                  {agent.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div
                  className={clsx(
                    'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-forest',
                    agent.status === 'online' ? 'bg-success' :
                    agent.status === 'away' ? 'bg-warning' : 'bg-text-muted'
                  )}
                />
              </div>
              <span className="text-xs text-text-secondary hidden lg:block">
                {agent.name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-text-muted">
                ({agent.activeTickets})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg text-text-secondary hover:text-cream-light hover:bg-surface-hover transition-colors">
          <Bell className="w-4.5 h-4.5" />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>
        <button className="p-2 rounded-lg text-text-secondary hover:text-cream-light hover:bg-surface-hover transition-colors">
          <Settings className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
}
