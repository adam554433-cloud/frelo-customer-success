export type Channel = 'email' | 'instagram' | 'facebook' | 'tiktok' | 'whatsapp';
export type TicketStatus = 'open' | 'pending' | 'resolved';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  channels: Channel[];
  tags: string[];
}

export interface Message {
  id: string;
  conversationId: string;
  sender: 'customer' | 'agent';
  senderName: string;
  content: string;
  timestamp: Date;
  channel: Channel;
  isAiDraft?: boolean;
}

export interface Conversation {
  id: string;
  customer: Customer;
  channel: Channel;
  status: TicketStatus;
  priority: Priority;
  subject: string;
  lastMessage: string;
  lastMessageTime: Date;
  assignedTo: string;
  messages: Message[];
  unread: boolean;
  tags: string[];
}

export interface Agent {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'offline';
  activeTickets: number;
}
