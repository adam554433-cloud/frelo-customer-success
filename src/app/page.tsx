'use client';

import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import ConversationView from '@/components/ConversationView';

export default function Home() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <ConversationView />
      </div>
    </div>
  );
}
