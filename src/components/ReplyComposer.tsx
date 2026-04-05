'use client';

import { useState } from 'react';
import { useInboxStore } from '@/lib/store';
import { Message } from '@/lib/types';
import { Send, Sparkles, RotateCcw, Check, Loader2 } from 'lucide-react';
import clsx from 'clsx';

// Simulated AI draft generation (will be replaced with real API later)
function generateAiDraft(customerMessage: string, customerName: string): string {
  const firstName = customerName.split(' ')[0];
  const lower = customerMessage.toLowerCase();

  if (lower.includes('order') && (lower.includes('received') || lower.includes('tracking') || lower.includes('shipping'))) {
    return `Hi ${firstName}!

Thank you for reaching out, and I'm sorry to hear your order hasn't arrived yet. I completely understand how frustrating that must be.

I've looked into order #FR-20487 and I can see the package has been in transit. Let me contact our shipping partner right away to get an updated status for you.

In the meantime, rest assured — we'll make sure you get your frelo. If for any reason the package is lost, we'll send a replacement immediately.

I'll follow up with you within the next few hours with an update. Thank you for your patience!

Warmly,
frelo team`;
  }

  if (lower.includes('vegan') || lower.includes('plant-based') || lower.includes('dairy') || lower.includes('milk')) {
    return `Hi ${firstName}!

Great question — yes, frelo is 100% vegan! Every ingredient is plant-based:

- Real cocoa powder (no milk chocolate)
- Coconut oil for the rich, fudgy texture
- Creavitalis\u00AE creatine monohydrate (synthetically produced, not animal-derived)
- Chicory root fiber (prebiotic inulin)
- Himalayan pink salt

No dairy, no whey, no animal products of any kind. We know how important this is, and we'd never cut corners on it.

You can feel completely confident adding frelo to your daily routine.

Let me know if you have any other questions!

Warmly,
frelo team`;
  }

  if (lower.includes('subscription') || lower.includes('bi-weekly') || lower.includes('monthly')) {
    return `Hi ${firstName}!

That's wonderful to hear — sounds like frelo has become a family favorite! We love that.

I'd be happy to help you adjust your subscription. Currently we offer monthly deliveries, but I can absolutely set you up with a bi-weekly shipment so you never run out.

Here's what I can do:
- Switch you to every-2-weeks delivery
- You'll get your next pouch in just 2 weeks from your last order

Would you like me to go ahead and make that change? And would one pouch every two weeks be enough, or would you like to bump it up to two pouches per month?

Warmly,
frelo team`;
  }

  if (lower.includes('collab') || lower.includes('influencer') || lower.includes('creator') || lower.includes('followers')) {
    return `Hi ${firstName}!

Thank you so much for reaching out — and we're thrilled you love frelo! It means a lot coming from someone in the wellness space.

We'd love to explore a collaboration with you. We're always looking for authentic voices who genuinely connect with what frelo is about — real food, daily ritual, and feeling your best.

I'm going to connect you with our partnerships team who can discuss the details. Could you share:
- Your TikTok handle so we can check out your content
- What kind of collaboration you had in mind (review, series, etc.)

We'll get back to you within 24 hours!

Warmly,
frelo team`;
  }

  if (lower.includes('flavor') || lower.includes('flavour')) {
    return `Hi ${firstName}!

So glad you got to try frelo — welcome to the family!

Right now, we have our signature Dark Chocolate flavor available. It's rich, fudgy, and packed with 5g creatine + 6g prebiotic fiber. We're working on new flavors (including Cinnamon and Vanilla), but they're not quite ready yet.

As for shipping — could you share your full address? We currently ship within the US, but we're exploring international options and I'd love to check if we can get frelo to you.

You can order directly at tryfrelo.com!

Warmly,
frelo team`;
  }

  if (lower.includes('allerg') || lower.includes('nut') || lower.includes('allergen')) {
    return `Hi ${firstName}!

Thank you for asking — allergen safety is incredibly important, and we want to make sure you have all the information you need.

Here's what's in frelo:
- Cocoa powder
- Coconut oil (you're right — coconut is classified as a fruit, not a tree nut by the FDA)
- Creavitalis\u00AE creatine monohydrate
- Chicory root fiber (inulin)
- Himalayan pink salt

frelo does NOT contain tree nuts, peanuts, dairy, soy, or gluten.

However, I want to be fully transparent: I'd recommend checking with our production team about our facility's allergen protocols. Let me look into this for you and get back to you with specific information about our manufacturing environment.

I'll follow up shortly with those details!

Warmly,
frelo team`;
  }

  return `Hi ${firstName}!

Thank you for reaching out to us. I appreciate you getting in touch.

I'd love to help you with this. Let me look into it and get back to you with a complete answer.

In the meantime, if you have any other questions about frelo, don't hesitate to ask!

Warmly,
frelo team`;
}

export default function ReplyComposer() {
  const conversation = useInboxStore((s) => s.getSelectedConversation());
  const addMessage = useInboxStore((s) => s.addMessage);
  const aiDraft = useInboxStore((s) => s.aiDraft);
  const setAiDraft = useInboxStore((s) => s.setAiDraft);
  const isGenerating = useInboxStore((s) => s.isGeneratingDraft);
  const setIsGenerating = useInboxStore((s) => s.setIsGeneratingDraft);
  const [replyText, setReplyText] = useState('');

  if (!conversation) return null;

  const handleGenerateDraft = async () => {
    setIsGenerating(true);

    // Get the last customer message
    const lastCustomerMsg = [...conversation.messages]
      .reverse()
      .find((m) => m.sender === 'customer');

    if (!lastCustomerMsg) {
      setIsGenerating(false);
      return;
    }

    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const draft = generateAiDraft(
      lastCustomerMsg.content,
      conversation.customer.name
    );
    setAiDraft(draft);
    setReplyText(draft);
    setIsGenerating(false);
  };

  const handleSend = () => {
    if (!replyText.trim()) return;

    const newMessage: Message = {
      id: `m-${Date.now()}`,
      conversationId: conversation.id,
      sender: 'agent',
      senderName: 'Noa Cohen',
      content: replyText,
      timestamp: new Date(),
      channel: conversation.channel,
      isAiDraft: !!aiDraft && replyText === aiDraft,
    };

    addMessage(conversation.id, newMessage);
    setReplyText('');
    setAiDraft('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSend();
    }
  };

  return (
    <div className="border-t border-border px-6 py-4 bg-surface/50">
      <div className="max-w-3xl mx-auto">
        {/* AI Draft banner */}
        {aiDraft && replyText === aiDraft && (
          <div className="flex items-center gap-2 mb-2 px-2">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs text-gold font-medium">
              AI Draft — review and edit before sending
            </span>
          </div>
        )}

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your reply..."
            rows={4}
            className={clsx(
              'w-full bg-surface border rounded-xl px-4 py-3 text-sm text-cream-light placeholder:text-text-muted resize-none focus:outline-none transition-colors',
              aiDraft && replyText === aiDraft
                ? 'border-gold/40 focus:border-gold/60'
                : 'border-border focus:border-teal/50'
            )}
          />
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            {/* AI Generate button */}
            <button
              onClick={handleGenerateDraft}
              disabled={isGenerating}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                isGenerating
                  ? 'bg-surface text-text-muted cursor-not-allowed'
                  : 'bg-gold/15 text-gold hover:bg-gold/25 border border-gold/30'
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  AI Draft
                </>
              )}
            </button>

            {/* Regenerate */}
            {aiDraft && (
              <button
                onClick={handleGenerateDraft}
                disabled={isGenerating}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-text-secondary hover:text-cream-dim hover:bg-surface-hover transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Regenerate
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted">
              {replyText.length > 0 && `${replyText.length} chars`}
              {replyText.length > 0 && ' · '}
              Cmd+Enter to send
            </span>
            <button
              onClick={handleSend}
              disabled={!replyText.trim()}
              className={clsx(
                'flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all',
                replyText.trim()
                  ? 'bg-teal text-white hover:bg-teal-deep'
                  : 'bg-surface text-text-muted cursor-not-allowed'
              )}
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
