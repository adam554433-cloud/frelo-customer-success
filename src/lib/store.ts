import { create } from 'zustand';
import { Conversation, Channel, TicketStatus, Message } from './types';
import { conversations as mockConversations } from './mock-data';

interface InboxFilters {
  channel: Channel | 'all';
  status: TicketStatus | 'all';
  search: string;
}

interface InboxStore {
  conversations: Conversation[];
  selectedConversationId: string | null;
  filters: InboxFilters;
  aiDraft: string;
  isGeneratingDraft: boolean;
  sidebarCollapsed: boolean;

  // Actions
  selectConversation: (id: string) => void;
  setFilter: (filter: Partial<InboxFilters>) => void;
  setAiDraft: (draft: string) => void;
  setIsGeneratingDraft: (generating: boolean) => void;
  toggleSidebar: () => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateConversationStatus: (conversationId: string, status: TicketStatus) => void;
  getFilteredConversations: () => Conversation[];
  getSelectedConversation: () => Conversation | undefined;
}

export const useInboxStore = create<InboxStore>((set, get) => ({
  conversations: mockConversations,
  selectedConversationId: null,
  filters: { channel: 'all', status: 'all', search: '' },
  aiDraft: '',
  isGeneratingDraft: false,
  sidebarCollapsed: false,

  selectConversation: (id) => set({ selectedConversationId: id, aiDraft: '' }),

  setFilter: (filter) =>
    set((state) => ({ filters: { ...state.filters, ...filter } })),

  setAiDraft: (draft) => set({ aiDraft: draft }),

  setIsGeneratingDraft: (generating) => set({ isGeneratingDraft: generating }),

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  addMessage: (conversationId, message) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: [...c.messages, message],
              lastMessage: message.content,
              lastMessageTime: message.timestamp,
              unread: false,
            }
          : c
      ),
    })),

  updateConversationStatus: (conversationId, status) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, status } : c
      ),
    })),

  getFilteredConversations: () => {
    const { conversations, filters } = get();
    return conversations
      .filter((c) => {
        if (filters.channel !== 'all' && c.channel !== filters.channel) return false;
        if (filters.status !== 'all' && c.status !== filters.status) return false;
        if (filters.search) {
          const q = filters.search.toLowerCase();
          return (
            c.customer.name.toLowerCase().includes(q) ||
            c.subject.toLowerCase().includes(q) ||
            c.lastMessage.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
  },

  getSelectedConversation: () => {
    const { conversations, selectedConversationId } = get();
    return conversations.find((c) => c.id === selectedConversationId);
  },
}));
